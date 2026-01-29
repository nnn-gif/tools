<script setup lang="ts">
import { ref } from 'vue'

const sourceCode = ref(`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Example {
    uint256 public value;

    function setValue(uint256 _value) public {
        value = _value;
    }
}
`)

const compilerVersion = ref('0.8.26')
const opcodes = ref('')
const bytecode = ref('')
const error = ref('')
const isCompiling = ref(false)
const isCompilerLoading = ref(false)
const compilerLoaded = ref(false)

// We'll cache the compiler wrapper
let solcWrapper: any = null

const versions = ['0.8.26', '0.8.25', '0.8.24', '0.8.20', '0.8.0', '0.7.6', '0.6.12', '0.5.17']

// Helper to load script
const loadScript = (url: string) => {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${url}"]`)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = url
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script ${url}`))
    document.head.appendChild(script)
  })
}

// Minimal wrapper to bridge emscripten solc to JS
// Based on standard solc-js wrapper logic
const wrapSolc = (Module: any) => {
  const compileJSON = Module.cwrap('solidity_compile', 'string', ['string', 'number', 'number'])
  return (input: any) => {
    const inputStr = JSON.stringify(input)
    // The second and third arguments are for callbacks (not used here)
    const outputStr = compileJSON(inputStr, 0, 0)
    return JSON.parse(outputStr)
  }
}

const loadCompiler = async () => {
  if (compilerLoaded.value && (window as any).Module) return

  isCompilerLoading.value = true
  error.value = ''

  try {
    // Determine URL - using binaries.soliditylang.org
    // We need the full build for 'solidity_compile' usually.
    // list.json has exact filenames, but usually these shortcuts work or we hardcode a few common ones.
    // For stability, let's use a specific one for the default.
    // 0.8.26
    let url = 'https://binaries.soliditylang.org/bin/soljson-v0.8.26+commit.8a97fa7a.js'

    // Very basic mapping for demo
    if (compilerVersion.value === '0.8.25')
      url = 'https://binaries.soliditylang.org/bin/soljson-v0.8.25+commit.b61c2a91.js'
    if (compilerVersion.value === '0.8.24')
      url = 'https://binaries.soliditylang.org/bin/soljson-v0.8.24+commit.e11b9ed9.js'

    // If user picks one without a known mapping, we might fail or need a lookup list.
    // For now, let's stick to the default or matching the selection if we update the map.
    // Fallback logic could be fetching list.json first, but let's keep it simple.

    // Force default if detailed mapping missing for now
    if (!url.includes(compilerVersion.value)) {
      // Try to find a way, or just warn
      // console.warn('Exact version mapping not implemented for this demo, using default')
    }

    await loadScript(url)

    // Wait for Module to be ready if it's async
    const Module = (window as any).Module
    if (!Module) throw new Error('Compiler module not found')

    solcWrapper = wrapSolc(Module)
    compilerLoaded.value = true
  } catch (err: any) {
    error.value = 'Failed to load compiler: ' + err.message
  } finally {
    isCompilerLoading.value = false
  }
}

const compile = async () => {
  if (!compilerLoaded.value) {
    await loadCompiler()
  }

  if (!solcWrapper) return

  isCompiling.value = true
  error.value = ''
  opcodes.value = ''
  bytecode.value = ''

  // Give UI a moment to update
  setTimeout(() => {
    try {
      const input = {
        language: 'Solidity',
        sources: {
          'contract.sol': {
            content: sourceCode.value
          }
        },
        settings: {
          outputSelection: {
            '*': {
              '*': ['evm.bytecode.opcodes', 'evm.bytecode.object']
            }
          }
        }
      }

      const output = solcWrapper(input)

      if (output.errors) {
        // Filter out warnings or show them differently?
        const errors = output.errors.filter((e: any) => e.severity === 'error')
        if (errors.length > 0) {
          throw new Error(errors.map((e: any) => e.formattedMessage).join('\n'))
        }
      }

      // Extract result
      const contractFile = output.contracts['contract.sol']
      if (contractFile) {
        // Just take the first contract found
        const contractName = Object.keys(contractFile)[0] as string
        const contract = contractFile[contractName]
        if (contract && contract.evm && contract.evm.bytecode) {
          opcodes.value = contract.evm.bytecode.opcodes
          bytecode.value = contract.evm.bytecode.object
        }
      } else {
        error.value = 'No contracts found in compilation.'
      }
    } catch (err: any) {
      error.value = err.message
    } finally {
      isCompiling.value = false
    }
  }, 100)
}
</script>

<template>
  <div class="h-full flex flex-col p-6 gap-6 overflow-y-auto bg-muted/30">
    <div class="prose dark:prose-invert max-w-none">
      <h1>Solidity to Opcodes</h1>
      <p class="text-slate-600 dark:text-slate-400">
        Compile Solidity code explicitly to view its EVM Opcodes and Bytecode.
        <br />
        <span class="text-xs text-muted-foreground"
          >Compiles in your browser using solc-js. First load may take a few seconds.</span
        >
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px] lg:h-auto flex-1">
      <!-- Input Section -->
      <div class="flex flex-col gap-4 min-h-0">
        <div
          class="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 flex flex-col h-full overflow-hidden"
        >
          <div
            class="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50"
          >
            <h2 class="font-semibold text-slate-900 dark:text-white">Solidity Source</h2>
            <div class="flex items-center gap-2">
              <!-- Version Selector (Simplified) -->
              <select
                v-model="compilerVersion"
                class="text-xs p-1 rounded border dark:bg-slate-800 dark:border-slate-700"
              >
                <option v-for="v in versions" :key="v" :value="v">{{ v }}</option>
              </select>
            </div>
          </div>

          <div class="flex-1 relative">
            <textarea
              v-model="sourceCode"
              class="absolute inset-0 w-full h-full p-4 font-mono text-sm bg-transparent resize-none focus:outline-none dark:text-slate-300"
              placeholder="// Enter Solidity Code..."
              spellcheck="false"
            ></textarea>
          </div>

          <div
            class="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50"
          >
            <button
              @click="compile"
              :disabled="isCompiling || isCompilerLoading"
              class="w-full inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isCompiling || isCompilerLoading" class="flex items-center gap-2">
                <span
                  class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                ></span>
                {{ isCompilerLoading ? 'Loading Compiler...' : 'Compiling...' }}
              </span>
              <span v-else>Compile & View Opcodes</span>
            </button>
            <div
              v-if="error"
              class="mt-3 text-red-600 text-xs font-mono bg-red-50 dark:bg-red-900/10 p-2 rounded whitespace-pre-wrap max-h-32 overflow-auto"
            >
              {{ error }}
            </div>
          </div>
        </div>
      </div>

      <!-- Output Section -->
      <div class="flex flex-col gap-4 min-h-0">
        <div
          class="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 flex flex-col h-full overflow-hidden"
        >
          <div
            class="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50"
          >
            <h2 class="font-semibold text-slate-900 dark:text-white">EVM Opcodes</h2>
          </div>

          <div class="flex-1 overflow-auto p-4 bg-slate-50 dark:bg-black/20">
            <div
              v-if="opcodes"
              class="font-mono text-xs leading-relaxed break-words text-slate-700 dark:text-slate-300 whitespace-pre-wrap"
            >
              {{ opcodes }}
            </div>
            <div
              v-else
              class="h-full flex flex-col items-center justify-center text-slate-400 text-sm italic"
            >
              {{ isCompiling ? 'Generating Opcodes...' : 'Compile source to see opcodes.' }}
            </div>
          </div>

          <!-- Bytecode Preview (Bottom) -->
          <div
            v-if="bytecode"
            class="h-32 border-t border-slate-200 dark:border-slate-700 p-4 overflow-auto bg-white dark:bg-slate-800"
          >
            <div class="text-[10px] uppercase font-bold text-slate-500 mb-1">Raw Bytecode</div>
            <div
              class="font-mono text-[10px] break-all text-slate-600 dark:text-slate-400 select-all"
            >
              {{ bytecode }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
