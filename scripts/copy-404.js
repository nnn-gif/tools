/* eslint-env node */
import { copyFileSync } from 'fs'
import { resolve } from 'path'

// Copy the processed index.html to 404.html after Vite build
// This ensures 404.html has the correct asset paths for production
const distIndexPath = resolve(process.cwd(), 'dist/index.html')
const dist404Path = resolve(process.cwd(), 'dist/404.html')

try {
  copyFileSync(distIndexPath, dist404Path)
  console.log('✅ Copied index.html to 404.html')
} catch (error) {
  console.error('❌ Error copying index.html to 404.html:', error.message)
  process.exit(1)
}
