/**
 * Core Web Vitals Monitoring Composable
 * Tracks LCP, FID, CLS, and other performance metrics
 */

import { onMounted, onUnmounted, ref } from 'vue'

interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
}

interface CoreWebVitalsMetrics {
  lcp: PerformanceMetric | null // Largest Contentful Paint
  fid: PerformanceMetric | null // First Input Delay (legacy)
  inp: PerformanceMetric | null // Interaction to Next Paint (new)
  cls: PerformanceMetric | null // Cumulative Layout Shift
  fcp: PerformanceMetric | null // First Contentful Paint
  ttfb: PerformanceMetric | null // Time to First Byte
  tti: PerformanceMetric | null // Time to Interactive
  tbt: PerformanceMetric | null // Total Blocking Time
}

const metrics = ref<CoreWebVitalsMetrics>({
  lcp: null,
  fid: null,
  inp: null,
  cls: null,
  fcp: null,
  ttfb: null,
  tti: null,
  tbt: null
})

// Rating thresholds based on Google's recommendations
const getRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
  const thresholds: Record<string, [number, number]> = {
    lcp: [2500, 4000], // ms
    fid: [100, 300], // ms
    inp: [200, 500], // ms
    cls: [0.1, 0.25], // score
    fcp: [1800, 3000], // ms
    ttfb: [800, 1800], // ms
    tti: [3800, 7300], // ms
    tbt: [200, 600] // ms
  }

  const [good, poor] = thresholds[name] || [0, 0]

  if (value <= good) return 'good'
  if (value <= poor) return 'needs-improvement'
  return 'poor'
}

const createPerformanceObserver = (
  entryType: string,
  callback: (entry: any) => void
): PerformanceObserver | null => {
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        callback(entry)
      }
    })
    observer.observe({ entryTypes: [entryType] })
    return observer
  } catch (e) {
    console.warn(`PerformanceObserver for ${entryType} not supported`)
    return null
  }
}

export function useCoreWebVitals() {
  let observers: PerformanceObserver[] = []

  onMounted(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return
    }

    // Largest Contentful Paint (LCP)
    const lcpObserver = createPerformanceObserver('largest-contentful-paint', (entry) => {
      const value = entry.startTime
      metrics.value.lcp = {
        name: 'LCP',
        value,
        rating: getRating('lcp', value),
        timestamp: Date.now()
      }
    })
    if (lcpObserver) observers.push(lcpObserver)

    // First Input Delay (FID) - legacy metric
    const fidObserver = createPerformanceObserver('first-input', (entry) => {
      const value = entry.processingStart - entry.startTime
      metrics.value.fid = {
        name: 'FID',
        value,
        rating: getRating('fid', value),
        timestamp: Date.now()
      }
    })
    if (fidObserver) observers.push(fidObserver)

    // Cumulative Layout Shift (CLS)
    let clsValue = 0
    const clsObserver = createPerformanceObserver('layout-shift', (entry) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value
        metrics.value.cls = {
          name: 'CLS',
          value: clsValue,
          rating: getRating('cls', clsValue),
          timestamp: Date.now()
        }
      }
    })
    if (clsObserver) observers.push(clsObserver)

    // First Contentful Paint (FCP)
    const paintObserver = createPerformanceObserver('paint', (entry) => {
      if (entry.name === 'first-contentful-paint') {
        const value = entry.startTime
        metrics.value.fcp = {
          name: 'FCP',
          value,
          rating: getRating('fcp', value),
          timestamp: Date.now()
        }
      }
    })
    if (paintObserver) observers.push(paintObserver)

    // Time to First Byte (TTFB)
    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
    if (navigationEntries.length > 0) {
      const entry = navigationEntries[0]
      const value = entry.responseStart - entry.requestStart
      metrics.value.ttfb = {
        name: 'TTFB',
        value,
        rating: getRating('ttfb', value),
        timestamp: Date.now()
      }
    }

    // Interaction to Next Paint (INP) - new metric replacing FID
    const inpObserver = createPerformanceObserver('event', (entry) => {
      // Only process if it's a meaningful interaction
      if (entry.interactionId && entry.processingEnd && entry.startTime) {
        const value = entry.processingEnd - entry.startTime
        metrics.value.inp = {
          name: 'INP',
          value,
          rating: getRating('inp', value),
          timestamp: Date.now()
        }
      }
    })
    if (inpObserver) observers.push(inpObserver)
  })

  onUnmounted(() => {
    observers.forEach((observer) => observer.disconnect())
    observers = []
  })

  // Function to log metrics (useful for debugging)
  const logMetrics = () => {
    console.group('Core Web Vitals')
    Object.entries(metrics.value).forEach(([key, metric]) => {
      if (metric) {
        console.log(`${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`)
      }
    })
    console.groupEnd()
  }

  // Function to send metrics to analytics
  const sendToAnalytics = (endpoint: string = '/api/analytics/vitals') => {
    if (typeof navigator === 'undefined' || !navigator.sendBeacon) {
      return
    }

    const data = Object.entries(metrics.value)
      .filter(([, metric]) => metric !== null)
      .map(([key, metric]) => ({
        name: metric!.name,
        value: metric!.value,
        rating: metric!.rating,
        timestamp: metric!.timestamp
      }))

    if (data.length > 0) {
      const blob = new Blob([JSON.stringify({ metrics: data })], { type: 'application/json' })
      navigator.sendBeacon(endpoint, blob)
    }
  }

  return {
    metrics,
    logMetrics,
    sendToAnalytics
  }
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string, options: Record<string, string> = {}) {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as

  Object.entries(options).forEach(([key, value]) => {
    link.setAttribute(key, value)
  })

  document.head.appendChild(link)
}

/**
 * Prefetch resources for next navigation
 */
export function prefetchResource(href: string) {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = href
  document.head.appendChild(link)
}

/**
 * Report custom performance marks
 */
export function markPerformance(name: string) {
  if (typeof performance !== 'undefined') {
    performance.mark(name)
  }
}

/**
 * Measure performance between two marks
 */
export function measurePerformance(name: string, startMark: string, endMark?: string) {
  if (typeof performance !== 'undefined') {
    try {
      if (endMark) {
        performance.measure(name, startMark, endMark)
      } else {
        performance.measure(name, startMark)
      }
      const measures = performance.getEntriesByName(name, 'measure')
      const measure = measures[measures.length - 1]
      return measure ? measure.duration : null
    } catch (e) {
      console.warn('Failed to measure performance:', e)
      return null
    }
  }
  return null
}
