/// <reference lib="webworker" />
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Common, Chain, Hardfork } from '@ethereumjs/common'
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

    const common = new Common({ chain: Chain.Mainnet as any, hardfork: Hardfork.Cancun })
    // EVM will create default state manager internally
    const evm = new EVM({ common })

    const bytecodeBuffer = Buffer.from(bytecode.replace(/^0x/, ''), 'hex')

    const steps: any[] = []

    evm.events.on('step', (data: any) => {
      // Capture state at this step
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
      gasLimit: BigInt(3000000) // Sufficient gas
    })

    // Map steps by PC for O(1) lookup
    // Use the *first* time a PC is hit to keep it simple for now
    const traceByPc: Record<number, any> = {}
    for (const step of steps) {
      if (!traceByPc[step.pc]) {
        traceByPc[step.pc] = step
      }
    }

    return traceByPc
  } catch (e) {
    console.error('Simulation failed', e)
    return null
  }
}
