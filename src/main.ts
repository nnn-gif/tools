import './polyfill'

import { ViteSSG } from 'vite-ssg'
import './style.css'
import App from './App.vue'
import { routes } from './router'

export const createApp = ViteSSG(App, { routes, base: '/tools/' }, ({ router }) => {
  router.afterEach((to) => {
    if (typeof document === 'undefined') return

    // 1. Update Title
    const title = to.meta.title as string
    if (title) {
      document.title = `${title} | Formatho`
    }

    // 2. Update Description
    const description = to.meta.description as string
    let metaDescription = document.querySelector('meta[name="description"]')
    if (description) {
      if (!metaDescription) {
        metaDescription = document.createElement('meta')
        metaDescription.setAttribute('name', 'description')
        document.head.appendChild(metaDescription)
      }
      metaDescription.setAttribute('content', description)
    } else if (!metaDescription && to.path === '/') {
      // If no description and it's home, maybe keep default?
      // But usually home has meta set in routes.
    }

    // 3. Update Canonical
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }

    const baseUrl = 'https://formatho.com/tools'
    let cleanPath = to.path
    if (cleanPath.endsWith('/') && cleanPath.length > 1) {
      cleanPath = cleanPath.slice(0, -1)
    }
    const finalUrl = `${baseUrl}${cleanPath}`
    canonical.setAttribute('href', finalUrl)

    // 4. Update OG URL
    const ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl) {
      ogUrl.setAttribute('content', finalUrl)
    }
  })
})
