<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

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

// Worker reference
let worker: Worker | null = null

const versions = ['0.8.26', '0.8.25', '0.8.24', '0.8.20', '0.8.0', '0.7.6', '0.6.12', '0.5.17']

// Worker Code as a String
const workerCode = `
self.onmessage = async function(e) {
  const { action, payload } = e.data;

  if (action === 'load') {
    try {
      if (self.solcWrapper) {
        self.postMessage({ action: 'loaded' });
        return;
      }

      // Emscripten Module Setup
      var Module = {
        print: function() {},
        printErr: function() {},
        // If the script uses start function or similar
        onRuntimeInitialized: function() {} 
      };
      self.Module = Module;

      importScripts(payload.url);

      // Handle Factory Pattern
      if (typeof self.Module === 'function') {
        self.Module = await self.Module();
      }

      // Wait for runtime if needed (though factory usually returns ready instance)
      // Verify cwrap
      if (!self.Module.cwrap) {
         // Some very old versions might behave differently, but 0.5+ usually have cwrap or we need 'solc' wrapper
         throw new Error('Module.cwrap missing. Compiler binary incompatible.');
      }

      const compileJSON = self.Module.cwrap('solidity_compile', 'string', ['string', 'number', 'number']);
      
      self.solcWrapper = function(input) {
         const inputStr = JSON.stringify(input);
         const outputStr = compileJSON(inputStr, 0, 0);
         return JSON.parse(outputStr);
      };

      self.postMessage({ action: 'loaded' });
    } catch (err) {
      self.postMessage({ action: 'error', error: err.message || err.toString() });
    }
  } 
  
  else if (action === 'compile') {
    try {
      if (!self.solcWrapper) throw new Error('Compiler not loaded');
      const output = self.solcWrapper(payload.input);
      self.postMessage({ action: 'compiled', output });
    } catch (err) {
      self.postMessage({ action: 'error', error: err.message || err.toString() });
    }
  }
};
`

const initWorker = () => {
  if (worker) return worker
  const blob = new Blob([workerCode], { type: 'application/javascript' })
  worker = new Worker(URL.createObjectURL(blob))

  worker.onmessage = (e) => {
    const { action, output, error: err } = e.data

    if (action === 'loaded') {
      compilerLoaded.value = true
      isCompilerLoading.value = false
      // If we were waiting to compile, check if we should trigger it?
      // For now, simpler to let user click again or handle purely via UI state.
    } else if (action === 'compiled') {
      isCompiling.value = false
      processOutput(output)
    } else if (action === 'error') {
      isCompilerLoading.value = false
      isCompiling.value = false
      error.value = err
    }
  }
  return worker
}

const loadCompiler = async () => {
  if (compilerLoaded.value && worker) return

  isCompilerLoading.value = true
  error.value = ''

  const w = initWorker()

  // URL Mapping
  let url = 'https://binaries.soliditylang.org/bin/soljson-v0.8.26+commit.8a97fa7a.js'
  if (compilerVersion.value === '0.8.25')
    url = 'https://binaries.soliditylang.org/bin/soljson-v0.8.25+commit.b61c2a91.js'
  if (compilerVersion.value === '0.8.24')
    url = 'https://binaries.soliditylang.org/bin/soljson-v0.8.24+commit.e11b9ed9.js'
  if (compilerVersion.value === '0.8.20')
    url = 'https://binaries.soliditylang.org/bin/soljson-v0.8.20+commit.a1b79de6.js'
  if (compilerVersion.value === '0.8.0')
    url = 'https://binaries.soliditylang.org/bin/soljson-v0.8.0+commit.c7dfd78e.js'
  if (compilerVersion.value === '0.7.6')
    url = 'https://binaries.soliditylang.org/bin/soljson-v0.7.6+commit.7338295f.js'
  if (compilerVersion.value === '0.6.12')
    url = 'https://binaries.soliditylang.org/bin/soljson-v0.6.12+commit.27d51765.js'
  if (compilerVersion.value === '0.5.17')
    url = 'https://binaries.soliditylang.org/bin/soljson-v0.5.17+commit.d19bba13.js'

  w.postMessage({ action: 'load', payload: { url } })
}

const processOutput = (output: any) => {
  if (output.errors) {
    const criticalErrors = output.errors.filter((e: any) => e.severity === 'error')
    if (criticalErrors.length > 0) {
      error.value = criticalErrors.map((e: any) => e.formattedMessage).join('\n')
      // Clear previous success data if failed
      opcodes.value = ''
      bytecode.value = ''
      return
    }
  }

  const contractFile = output.contracts['contract.sol']
  if (contractFile) {
    const contractName = Object.keys(contractFile)[0] as string
    const contract = contractFile[contractName]
    if (contract && contract.evm && contract.evm.bytecode) {
      // Format opcodes: replace spaces with newlines for better readability
      const rawOpcodes = contract.evm.bytecode.opcodes || ''
      // Typically solc returns opcodes as "PUSH1 0x80 PUSH1 0x40 MSTORE..."
      // We want to format this nicely.
      // Simple split by space, but some PUSH instructions have data.
      // Solc opcode output is usually space separated. PUSH data is also space separated from PUSH opcode.
      // e.g. "PUSH1 0x80" -> "PUSH1\n0x80" if we just replace space.
      // Better: Keep instruction + operand on same line?

      // Let's just create a more structured view.
      // Replace generic spaces with newlines for now, simpler than full parsing which requires opcode table.
      // If we want instruction + operand on one line, we need to know which ops take args.
      // For now, let's just break lines.

      // Attempt to group PUSHx + value:
      // This is heuristic: if a token starts with 0x, append it to previous line instead of new one
      const tokens = rawOpcodes.split(' ')
      let formatted = ''
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]
        if (token.startsWith('0x') && i > 0) {
          // Append to previous line
          formatted += ' ' + token
        } else {
          // Start new line (except first)
          if (formatted !== '') formatted += '\n'
          formatted += token
        }
      }
      opcodes.value = formatted
      bytecode.value = contract.evm.bytecode.object
    }
  } else {
    error.value = 'No contracts compiled.'
  }
}

const compile = async () => {
  if (!compilerLoaded.value) {
    loadCompiler()
    return
  }

  isCompiling.value = true
  error.value = ''
  opcodes.value = ''
  bytecode.value = ''

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

  if (worker) {
    worker.postMessage({ action: 'compile', payload: { input } })
  }
}

const resetWorker = () => {
  if (worker) {
    worker.terminate()
  }
  worker = null
  compilerLoaded.value = false
}

onUnmounted(() => {
  if (worker) {
    worker.terminate()
  }
})
</script>

<template>
  <div class="h-full flex flex-col p-6 gap-6 overflow-y-auto bg-muted/30">
    <div class="prose dark:prose-invert max-w-none">
      <h1>Solidity to Opcodes</h1>
      <p class="text-slate-600 dark:text-slate-400">
        Compile Solidity code explicitly to view its EVM Opcodes and Bytecode.
        <br />
        <span class="text-xs text-muted-foreground"
          >Compiles in a Web Worker to keep the UI responsive. First load may take a few
          seconds.</span
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
              <!-- Version Selector -->
              <select
                v-model="compilerVersion"
                @change="resetWorker"
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
