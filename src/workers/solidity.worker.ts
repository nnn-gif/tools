/// <reference lib="webworker" />
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Common } from '@ethereumjs/common'
import { EVM } from '@ethereumjs/evm'

// Constants
// We need to define the global Module for Emscripten Solc
declare global {
  interface Window {
    Module: any
    solcWrapper: any
  }
}
const self = globalThis as any
import { Buffer } from 'buffer'
self.Buffer = Buffer

// Solc Loading Logic
self.onmessage = async function (e: MessageEvent) {
  const { action, payload } = e.data

  if (action === 'load') {
    try {
      if (self.solcWrapper) {
        self.postMessage({ action: 'loaded' })
        return
      }

      // Emscripten Module Setup
      const Module: any = {
        print: function () {},
        printErr: function () {},
        onRuntimeInitialized: function () {}
      }
      self.Module = Module

      // Load script via fetch/eval because generic importScripts() is not supported in Module Workers
      const response = await fetch(payload.url)
      const scriptContent = await response.text()

      // Execute script in global scope (indirect eval)
      // soljson will look for 'Module' on global scope and populate it
      ;(0, eval)(scriptContent)

      // Handle Factory Pattern
      if (typeof self.Module === 'function') {
        self.Module = await self.Module()
      }

      // Verify
      if (!self.Module.cwrap) {
        throw new Error('Module.cwrap missing. Compiler binary incompatible.')
      }

      const compileJSON = self.Module.cwrap('solidity_compile', 'string', [
        'string',
        'number',
        'number'
      ])

      self.solcWrapper = function (input: any) {
        const inputStr = JSON.stringify(input)
        const outputStr = compileJSON(inputStr, 0, 0)
        return JSON.parse(outputStr)
      }

      self.postMessage({ action: 'loaded' })
    } catch (err: any) {
      self.postMessage({ action: 'error', error: err.message || err.toString() })
    }
  } else if (action === 'compile') {
    try {
      if (!self.solcWrapper) throw new Error('Compiler not loaded')
      const output = self.solcWrapper(payload.input)

      // If compilation succeeded, try to simulate execution to get trace
      let trace = null
      if (output.contracts) {
        // Dig for the bytecode
        // Try to find *any* compiled contract
        for (const file in output.contracts) {
          for (const contract in output.contracts[file]) {
            const match = output.contracts[file][contract]
            if (match.evm && match.evm.bytecode && match.evm.bytecode.object) {
              trace = await simulateExecution(match.evm.bytecode.object)
              if (trace) break
            }
          }
          if (trace) break
        }
      }

      self.postMessage({ action: 'compiled', output, trace })
    } catch (err: any) {
      self.postMessage({ action: 'error', error: err.message || err.toString() })
    }
  }
}

async function simulateExecution(bytecode: string) {
  try {
    if (!bytecode || bytecode === '0x') return null

    // Ensure Buffer is available
    if (typeof Buffer === 'undefined') {
      throw new Error('Buffer is not defined')
    }

    const common = new Common({ chain: 1 as any, hardfork: 'cancun' })
    const evm = new EVM({ common })

    const bytecodeBuffer = Buffer.from(bytecode.replace(/^0x/, ''), 'hex')

    const steps: any[] = []

    evm.events.on('step', (data: any) => {
      steps.push({
        pc: data.pc,
        opcode: data.opcode.name,
        stack: data.stack.map((x: any) => x.toString(16)),
        memory: Buffer.from(data.memory).toString('hex'),
        depth: data.depth
      })
    })

    await evm.runCode({
      code: bytecodeBuffer,
      gasLimit: BigInt(10000000)
    })

    const traceByPc: Record<number, any> = {}
    for (const step of steps) {
      // We want the state *before* execution? Or after?
      // "step" event is emitted *before* the opcode is executed.
      // So traceByPc[pc] = state *before* instruction runs.
      if (!traceByPc[step.pc]) {
        traceByPc[step.pc] = step
      }
    }

    return traceByPc
  } catch (e: any) {
    // Send error back to main thread for debugging
    self.postMessage({
      action: 'error',
      error: 'Simulation Failed: ' + (e.message || e.toString())
    })
    return null
  }
}
