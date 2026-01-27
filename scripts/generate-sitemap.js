/* eslint-env node */
import { writeFileSync } from 'fs'
import { resolve } from 'path'

const routes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/json-yaml', priority: '0.8', changefreq: 'monthly' },
  { path: '/json-csv', priority: '0.8', changefreq: 'monthly' },
  { path: '/diff', priority: '0.8', changefreq: 'monthly' },
  { path: '/base64', priority: '0.8', changefreq: 'monthly' },
  { path: '/jwt', priority: '0.8', changefreq: 'monthly' },
  { path: '/sql', priority: '0.8', changefreq: 'monthly' },
  { path: '/uuid', priority: '0.8', changefreq: 'monthly' },
  { path: '/lorem', priority: '0.8', changefreq: 'monthly' },
  { path: '/image', priority: '0.8', changefreq: 'monthly' },
  { path: '/json-lint', priority: '0.8', changefreq: 'monthly' },
  { path: '/yaml-lint', priority: '0.8', changefreq: 'monthly' },
  { path: '/bpmn', priority: '0.9', changefreq: 'monthly' },
  { path: '/markdown', priority: '0.9', changefreq: 'monthly' },
  { path: '/evm-converter', priority: '0.8', changefreq: 'monthly' },
  { path: '/keccak256', priority: '0.8', changefreq: 'monthly' },
  { path: '/address-checksum', priority: '0.8', changefreq: 'monthly' },
  { path: '/multi-chain-keys', priority: '0.8', changefreq: 'monthly' },
  { path: '/address-from-key', priority: '0.8', changefreq: 'monthly' }
]

const domain = 'https://formatho.com/tools'
const currentDate = new Date().toISOString().split('T')[0]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${domain}${route.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

const outputPath = resolve(process.cwd(), 'public/sitemap.xml')
writeFileSync(outputPath, sitemap, 'utf-8')

console.log(`✅ Sitemap generated successfully at ${outputPath}`)
console.log(`   Generated ${routes.length} URLs with date: ${currentDate}`)
