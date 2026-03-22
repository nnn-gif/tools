/**
 * Analytics composable for tracking conversion funnel events
 * Uses Google Analytics 4 (GA4) via gtag.js
 */

// GA4 Measurement ID
const GA_MEASUREMENT_ID = 'G-ZJ1GXW78TW'

// Declare gtag function type
declare global {
  interface Window {
    gtag: (
      command: string,
      actionOrId: string,
      params?: Record<string, unknown>
    ) => void
    dataLayer: unknown[]
  }
}

// Funnel stages for tracking
export type FunnelStage =
  | 'page_view'
  | 'pricing_view'
  | 'plan_selected'
  | 'billing_cycle_changed'
  | 'checkout_initiated'
  | 'checkout_success'
  | 'checkout_canceled'
  | 'checkout_error'

// Plan types
export type PlanType = 'free' | 'pro' | 'enterprise'

// Billing cycles
export type BillingCycle = 'monthly' | 'yearly'

// Event parameters interface
interface EventParams {
  [key: string]: string | number | boolean | undefined
}

/**
 * Check if gtag is available
 */
function isGtagAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function'
}

/**
 * Track a custom event in GA4
 */
function trackEvent(eventName: string, params?: EventParams): void {
  if (!isGtagAvailable()) {
    console.debug('[Analytics] gtag not available, skipping event:', eventName)
    return
  }

  try {
    window.gtag('event', eventName, params)
    console.debug('[Analytics] Event tracked:', eventName, params)
  } catch (error) {
    console.error('[Analytics] Error tracking event:', eventName, error)
  }
}

/**
 * Track page view (manual override if needed)
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  trackEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  })
}

/**
 * Track pricing page view
 */
export function trackPricingView(): void {
  trackEvent('pricing_page_view', {
    page_category: 'conversion',
    funnel_stage: 'pricing_view',
  })
}

/**
 * Track when a user selects a plan
 */
export function trackPlanSelected(plan: PlanType): void {
  trackEvent('plan_selected', {
    plan_type: plan,
    page_category: 'conversion',
    funnel_stage: 'plan_selected',
    value: plan === 'pro' ? 19 : plan === 'enterprise' ? 99 : 0,
    currency: 'USD',
  })
}

/**
 * Track billing cycle change
 */
export function trackBillingCycleChanged(cycle: BillingCycle): void {
  trackEvent('billing_cycle_changed', {
    billing_cycle: cycle,
    page_category: 'conversion',
    funnel_stage: 'billing_cycle_changed',
  })
}

/**
 * Track checkout initiation
 */
export function trackCheckoutInitiated(
  plan: PlanType,
  cycle: BillingCycle,
  price: number
): void {
  trackEvent('begin_checkout', {
    items: [
      {
        item_id: `formatho_${plan}_${cycle}`,
        item_name: `Formatho ${plan.charAt(0).toUpperCase() + plan.slice(1)}`,
        item_category: 'subscription',
        item_variant: cycle,
        price: price,
        quantity: 1,
      },
    ],
    value: price,
    currency: 'USD',
    plan_type: plan,
    billing_cycle: cycle,
    page_category: 'conversion',
    funnel_stage: 'checkout_initiated',
  })
}

/**
 * Track successful checkout/subscription
 */
export function trackCheckoutSuccess(
  plan: PlanType,
  cycle: BillingCycle,
  price: number,
  customerId?: string
): void {
  trackEvent('purchase', {
    transaction_id: customerId || `txn_${Date.now()}`,
    value: price,
    currency: 'USD',
    items: [
      {
        item_id: `formatho_${plan}_${cycle}`,
        item_name: `Formatho ${plan.charAt(0).toUpperCase() + plan.slice(1)}`,
        item_category: 'subscription',
        item_variant: cycle,
        price: price,
        quantity: 1,
      },
    ],
    plan_type: plan,
    billing_cycle: cycle,
    page_category: 'conversion',
    funnel_stage: 'checkout_success',
  })
}

/**
 * Track checkout cancellation
 */
export function trackCheckoutCanceled(
  plan: PlanType,
  cycle: BillingCycle
): void {
  trackEvent('checkout_canceled', {
    plan_type: plan,
    billing_cycle: cycle,
    page_category: 'conversion',
    funnel_stage: 'checkout_canceled',
  })
}

/**
 * Track checkout error
 */
export function trackCheckoutError(
  plan: PlanType,
  cycle: BillingCycle,
  errorMessage: string
): void {
  trackEvent('checkout_error', {
    plan_type: plan,
    billing_cycle: cycle,
    error_message: errorMessage,
    page_category: 'conversion',
    funnel_stage: 'checkout_error',
  })
}

/**
 * Track tool usage (for engagement metrics)
 */
export function trackToolUsage(toolName: string, category?: string): void {
  trackEvent('tool_usage', {
    tool_name: toolName,
    tool_category: category || 'general',
  })
}

/**
 * Track search query
 */
export function trackSearch(query: string, resultsCount?: number): void {
  trackEvent('search', {
    search_term: query,
    results_count: resultsCount,
  })
}

/**
 * Track contact form submission
 */
export function trackContactFormSubmitted(plan?: PlanType): void {
  trackEvent('generate_lead', {
    plan_interest: plan || 'unknown',
    page_category: 'conversion',
  })
}

/**
 * Main composable export
 */
export function useAnalytics() {
  return {
    // Page tracking
    trackPageView,
    trackPricingView,

    // Funnel tracking
    trackPlanSelected,
    trackBillingCycleChanged,
    trackCheckoutInitiated,
    trackCheckoutSuccess,
    trackCheckoutCanceled,
    trackCheckoutError,

    // Engagement tracking
    trackToolUsage,
    trackSearch,
    trackContactFormSubmitted,
  }
}

/**
 * Conversion funnel stages in order
 * Used for funnel visualization in GA4
 */
export const CONVERSION_FUNNEL: FunnelStage[] = [
  'page_view',
  'pricing_view',
  'plan_selected',
  'checkout_initiated',
  'checkout_success',
]

/**
 * Calculate conversion rate between stages
 */
export function calculateConversionRate(
  fromStage: number,
  toStage: number,
  fromCount: number,
  toCount: number
): number {
  if (fromCount === 0) return 0
  return Math.round((toCount / fromCount) * 100)
}
