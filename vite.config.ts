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
        manualChunks(id) {
          // Don't chunk during SSR build
          if (id.includes('node_modules')) {
            // Split large vendor dependencies
            if (id.includes('crypto') || id.includes('bcrypt') || id.includes('bip39') || id.includes('@noble/hashes')) {
              return 'crypto-vendor'
            }
            if (id.includes('@solana') || id.includes('viem') || id.includes('@polkadot')) {
              return 'blockchain-vendor'
            }
            if (id.includes('docx') || id.includes('jspdf') || id.includes('html2pdf')) {
              return 'document-vendor'
            }
            if (id.includes('highlight') || id.includes('marked') || id.includes('sql-formatter') || id.includes('gpt-tokenizer')) {
              return 'code-vendor'
            }
            if (id.includes('radix-vue') || id.includes('lucide') || id.includes('aos')) {
              return 'ui-vendor'
            }
            if (id.includes('chart.js') || id.includes('vue-chartjs')) {
              return 'chart-vendor'
            }
            if (id.includes('bpmn')) {
              return 'bpmn-vendor'
            }
          }
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
