import { watch } from 'vue'
import { useRoute } from 'vue-router'

const domain = 'https://formatho.com'
const siteName = 'Formatho'

interface RouteMeta {
  title: string
  description: string
  keywords?: string
}

function injectJSONLD(id: string, jsonLd: object) {
  // Remove existing script with same id
  const existing = document.getElementById(id)
  if (existing) {
    existing.remove()
  }

  // Create new script tag
  const script = document.createElement('script')
  script.id = id
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(jsonLd, null, 0)
  document.head.appendChild(script)
}

function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: domain,
    logo: `${domain}/logo.png`,
    description:
      'Privacy-first developer tools that run 100% client-side. All processing happens in your browser.',
    sameAs: ['https://twitter.com/heyformatho', 'https://github.com/nnn-gif/tools'],
    slogan: 'Privacy-First Developer Tools'
  }
}

function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: domain,
    description:
      'Privacy-first developer tools that run 100% client-side. Convert JSON to YAML, format SQL, decode JWT, compress images, and more.',
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${domain}/logo.png`
      }
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${domain}/?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }
}

function getBreadcrumbSchema(path: string) {
  const pathSegments = path.split('/').filter(Boolean)
  const breadcrumbs = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: domain
    }
  ]

  let currentPath = ''
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    breadcrumbs.push({
      '@type': 'ListItem',
      position: index + 2,
      name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      item: `${domain}${currentPath}`
    })
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs
  }
}

function getSoftwareApplicationSchema(meta: RouteMeta, path: string) {
  const toolName = meta.title.replace(` - ${siteName}`, '').trim()

  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: toolName,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    url: `${domain}${path}`,
    description: meta.description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    featureList: [
      '100% client-side processing',
      'Privacy-first',
      'No data collection',
      'Free to use'
    ],
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '1.0'
  }
}

export function useStructuredData() {
  const route = useRoute()

  // Wait for DOM to be ready before injecting
  const injectSchemas = () => {
    // Only inject if not already present (static schemas in index.html handle homepage)
    if (!document.getElementById('schema-organization')) {
      injectJSONLD('schema-organization', getOrganizationSchema())
    }
    if (!document.getElementById('schema-website')) {
      injectJSONLD('schema-website', getWebSiteSchema())
    }
  }

  // Inject base schemas immediately
  if (document.head) {
    injectSchemas()
  } else {
    // Wait for head to be available
    const observer = new MutationObserver(() => {
      if (document.head) {
        injectSchemas()
        observer.disconnect()
      }
    })
    observer.observe(document.documentElement, { childList: true })
  }

  watch(
    () => route.path,
    () => {
      const meta = route.meta as unknown as RouteMeta | undefined

      // Breadcrumb schema for all routes (always update)
      injectJSONLD('schema-breadcrumb', getBreadcrumbSchema(route.path))

      // SoftwareApplication schema for tool pages
      if (meta && meta.title && meta.description && route.path !== '/') {
        injectJSONLD('schema-software', getSoftwareApplicationSchema(meta, route.path))
      } else {
        // Remove software schema if not on a tool page
        const existing = document.getElementById('schema-software')
        if (existing) {
          existing.remove()
        }
      }
    },
    { immediate: true }
  )
}
