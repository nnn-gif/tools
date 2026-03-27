import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    nodePolyfills({
      include: ['buffer', 'process', 'stream', 'util'],
      globals: {
        Buffer: true,
        global: true,
        process: true
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  base: '/tools/',
  ssr: {
    noExternal: ['@headlessui/vue']
  },
  build: {
    // Core Web Vitals Optimization - Code Splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Split large vendor dependencies
          'vue-vendor': ['vue', 'vue-router'],
          'crypto-vendor': ['crypto-js', 'bcryptjs', 'bip39', '@noble/hashes'],
          'blockchain-vendor': ['@solana/web3.js', 'viem', '@polkadot/keyring'],
          'document-vendor': ['docx', 'jspdf', 'html2pdf.js'],
          'code-vendor': ['highlight.js', 'marked', 'sql-formatter', 'gpt-tokenizer'],
          'ui-vendor': ['radix-vue', 'lucide-vue-next', 'aos'],
          'chart-vendor': ['chart.js', 'vue-chartjs'],
          'bpmn-vendor': ['bpmn-js']
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['vue', 'vue-router', 'crypto-js'],
    exclude: ['@polkadot/keyring', '@polkadot/util-crypto']
  }
})
