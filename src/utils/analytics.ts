// Analytics utilities for tracking user behavior and conversion funnel

// Track page view
export function trackPageView(pageName: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', 'page_view', {
      page_name: pageName,
      timestamp: new Date().toISOString()
    })
  }
  console.log(`[Analytics] Page view: ${pageName}`)
}

// Track conversion event (e.g., pricing page view, CTA click, checkout start)
export function trackConversion(
  eventName: 'pricing_view' | 'cta_click' | 'checkout_start' | 'checkout_complete',
  metadata?: Record<string, any>
) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', eventName, {
      ...metadata,
      timestamp: new Date().toISOString()
    })
  }
  console.log(`[Analytics] Conversion: ${eventName}`, metadata)
}

// Track pricing page view
export function trackPricingPageView(tier?: 'free' | 'pro' | 'enterprise') {
  trackPageView('pricing_page')
  if (tier) {
    trackConversion('pricing_view', { tier })
  }
}

// Track subscribe button click
export function trackSubscribeClick(plan: 'pro' | 'enterprise', billing: 'monthly' | 'yearly') {
  trackConversion('cta_click', {
    plan,
    billing,
    button: 'subscribe'
  })
}

// Track checkout started
export function trackCheckoutStart(plan: string, billingCycle: string) {
  trackConversion('checkout_start', {
    plan,
    billing_cycle: billingCycle,
    price_id: getPriceIdForPlan(plan, billingCycle)
  })
}

// Track checkout completed
export function trackCheckoutComplete(sessionId: string, plan: string) {
  trackConversion('checkout_complete', {
    session_id: sessionId,
    plan,
    timestamp: new Date().toISOString()
  })
}

// Get price ID for plan
function getPriceIdForPlan(plan: string, billingCycle: string): string {
  const priceIds: Record<string, string> = {
    pro_monthly: import.meta.env.VITE_STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',
    pro_yearly: import.meta.env.VITE_STRIPE_PRO_YEARLY_PRICE_ID || 'price_pro_yearly',
    enterprise_monthly: import.meta.env.VITE_STRIPE_ENTERPRISE_MONTHLY_PRICE_ID || 'price_enterprise_monthly',
    enterprise_yearly: import.meta.env.VITE_STRIPE_ENTERPRISE_YEARLY_PRICE_ID || 'price_enterprise_yearly'
  }

  return priceIds[`${plan}_${billingCycle}` as string] || 'price_unknown'
}
