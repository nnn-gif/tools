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

  // Also remove any duplicate schemas without ID (from static HTML)
  // This prevents duplicates when static and dynamic schemas exist
  const allScripts = document.querySelectorAll('script[type="application/ld+json"]')
  allScripts.forEach((script) => {
    if (!script.id && script.textContent) {
      try {
        const parsed = JSON.parse(script.textContent)
        const newParsed = jsonLd as { '@type'?: string }
        // If same type and no ID, remove it (likely a duplicate)
        if (parsed['@type'] === newParsed['@type'] && parsed['@type'] === 'BreadcrumbList') {
          script.remove()
        }
      } catch {
        // Ignore parse errors
      }
    }
  })

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

function getBreadcrumbSchema(path: string, routeMeta?: RouteMeta) {
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
    // Use route meta title if available (for last segment), otherwise format the segment
    const isLastSegment = index === pathSegments.length - 1
    const name =
      isLastSegment && routeMeta?.title
        ? routeMeta.title.replace(` - ${siteName}`, '').trim()
        : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')

    breadcrumbs.push({
      '@type': 'ListItem',
      position: index + 2,
      name,
      item: `${domain}${currentPath}`
    })
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    name: 'Breadcrumb Navigation',
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
      // Use route.path, fallback to window.location.pathname for initial load
      const currentPath = route.path || window.location.pathname

      // Breadcrumb schema for all routes (always update with route meta for better names)
      injectJSONLD('schema-breadcrumb', getBreadcrumbSchema(currentPath, meta))

      // SoftwareApplication schema for tool pages
      if (meta && meta.title && meta.description && currentPath !== '/') {
        injectJSONLD('schema-software', getSoftwareApplicationSchema(meta, currentPath))
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

  // Also inject breadcrumb immediately on mount using window.location as fallback
  // This ensures breadcrumb is available even before Vue Router initializes
  // This is important for SEO crawlers that might not wait for JavaScript
  if (typeof window !== 'undefined') {
    const initialPath = window.location.pathname
    // Always inject breadcrumb immediately based on current URL
    // The watch will update it with proper meta when router is ready
    injectJSONLD('schema-breadcrumb', getBreadcrumbSchema(initialPath))
  }
}
