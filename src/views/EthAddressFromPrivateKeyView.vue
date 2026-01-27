<script setup lang="ts">
import { ref } from 'vue'
import { privateKeyToAccount } from 'viem/accounts'
import { secp256k1 } from '@noble/curves/secp256k1'
import { Buffer } from 'buffer'

// Polyfill Buffer for browser environment
if (typeof window !== 'undefined' && !window.Buffer) {
  window.Buffer = Buffer
}

const privateKey = ref('')
const address = ref('')
const publicKey = ref('')
const error = ref('')

const calculateAddress = () => {
  try {
    error.value = ''
    let pk = privateKey.value.trim()

    // Ensure 0x prefix
    if (!pk.startsWith('0x')) {
      pk = '0x' + pk
    }

    // Basic validation
    if (pk.length !== 66) {
      // 0x + 64 hex chars
      throw new Error('Invalid private key length. Must be 32 bytes (64 hex characters).')
    }

    // Use viem to get account from private key
    // @ts-ignore - viem types can be strict about 0x strings
    const account = privateKeyToAccount(pk)
    address.value = account.address

    // deriving public key manually to show it (viem account object handles signing but doesn't always expose pubkey directly in all versions clearly, stick to noble/curves for explicit extraction if needed, but let's see)
    // Actually, constructing it from the private key string is safer to match exactly what we want to show.
    const privKeyBytes = Buffer.from(pk.slice(2), 'hex')
    const pubKeyBytes = secp256k1.getPublicKey(privKeyBytes, false) // uncompressed
    publicKey.value = Buffer.from(pubKeyBytes).toString('hex')
  } catch (err: any) {
    console.error(err)
    error.value = err.message || 'Invalid Private Key'
    address.value = ''
    publicKey.value = ''
  }
}
</script>

<template>
  <div class="h-full flex flex-col p-6 gap-6 overflow-y-auto bg-muted/30">
    <div class="prose dark:prose-invert max-w-none">
      <h1>Ethereum Address from Private Key</h1>
      <p class="text-slate-600 dark:text-slate-400">
        Enter a raw private key to derive its corresponding Ethereum address and public key.
        <br />
        <strong class="text-amber-600 dark:text-amber-400">Security Warning:</strong> This tool runs
        entirely in your browser. However, you should never paste a private key controlling real
        assets into any website. Use this only for testing or development keys.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Input Section -->
      <div
        class="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-700 h-fit"
      >
        <h2 class="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Input</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Private Key (Hex)
            </label>
            <div class="relative">
              <input
                v-model="privateKey"
                type="text"
                class="w-full font-mono rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
                placeholder="0x..."
                @input="error = ''"
              />
            </div>
            <p class="text-xs text-slate-500 mt-1">Supports 32-byte hex strings.</p>
          </div>

          <button
            @click="calculateAddress"
            class="w-full inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:cursor-pointer transition-colors"
          >
            Calculate Address
          </button>

          <div
            v-if="error"
            class="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-md border border-red-200 dark:border-red-800"
          >
            {{ error }}
          </div>
        </div>
      </div>

      <!-- Output Section -->
      <div
        class="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-700 h-fit"
      >
        <h2 class="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Output</h2>

        <div v-if="address" class="space-y-6">
          <div>
            <label class="block text-xs uppercase font-bold text-slate-500 mb-1">
              Ethereum Address
            </label>
            <div
              class="font-mono text-lg break-all bg-slate-50 dark:bg-black/30 p-3 rounded border border-slate-200 dark:border-slate-700 select-all text-slate-900 dark:text-slate-100"
            >
              {{ address }}
            </div>
          </div>

          <div>
            <label class="block text-xs uppercase font-bold text-slate-500 mb-1">
              Public Key (Uncompressed)
            </label>
            <div
              class="font-mono text-xs break-all bg-slate-50 dark:bg-black/30 p-3 rounded border border-slate-200 dark:border-slate-700 select-all text-slate-600 dark:text-slate-400"
            >
              {{ publicKey }}
            </div>
          </div>

          <div class="prose prose-sm dark:prose-invert">
            <p>
              <strong>Validation:</strong> The address is the last 20 bytes of the Keccak-256 hash
              of the public key.
            </p>
          </div>
        </div>

        <div
          v-else
          class="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500 text-sm italic"
        >
          Enter a valid private key to see the result.
        </div>
      </div>
    </div>
  </div>
</template>
