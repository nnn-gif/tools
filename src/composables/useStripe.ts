import { ref } from 'vue'
import { loadStripe, type Stripe } from '@stripe/stripe-js'

// Stripe publishable key - should be in environment variables
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'

// Price IDs - should be in environment variables
const PRICE_IDS = {
  pro_monthly: import.meta.env.VITE_STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',
  pro_yearly: import.meta.env.VITE_STRIPE_PRO_YEARLY_PRICE_ID || 'price_pro_yearly',
  enterprise_monthly: import.meta.env.VITE_STRIPE_ENTERPRISE_MONTHLY_PRICE_ID || 'price_enterprise_monthly',
  enterprise_yearly: import.meta.env.VITE_STRIPE_ENTERPRISE_YEARLY_PRICE_ID || 'price_enterprise_yearly',
}

export function useStripe() {
  const stripe = ref<Stripe | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Initialize Stripe
  const initializeStripe = async () => {
    if (stripe.value) return stripe.value

    try {
      stripe.value = await loadStripe(STRIPE_PUBLISHABLE_KEY)
      return stripe.value
    } catch (e) {
      error.value = 'Failed to initialize Stripe'
      console.error('Stripe initialization error:', e)
      return null
    }
  }

  // Create checkout session
  const createCheckoutSession = async (
    plan: 'pro' | 'enterprise',
    billingCycle: 'monthly' | 'yearly'
  ) => {
    isLoading.value = true
    error.value = null

    try {
      const stripeInstance = await initializeStripe()
      if (!stripeInstance) {
        throw new Error('Stripe not initialized')
      }

      // Get the price ID based on plan and billing cycle
      const priceId = plan === 'pro'
        ? (billingCycle === 'monthly' ? PRICE_IDS.pro_monthly : PRICE_IDS.pro_yearly)
        : (billingCycle === 'monthly' ? PRICE_IDS.enterprise_monthly : PRICE_IDS.enterprise_yearly)

      // Call backend to create checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          plan,
          billingCycle,
          successUrl: `${window.location.origin}/pricing?success=true`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create checkout session')
      }

      const { sessionId } = await response.json()

      // Redirect to Stripe Checkout
      const { error: stripeError } = await stripeInstance.redirectToCheckout({ sessionId })

      if (stripeError) {
        throw new Error(stripeError.message)
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred'
      console.error('Checkout error:', e)
    } finally {
      isLoading.value = false
    }
  }

  // Create customer portal session
  const createPortalSession = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: `${window.location.origin}/account`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create portal session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred'
      console.error('Portal error:', e)
    } finally {
      isLoading.value = false
    }
  }

  return {
    stripe,
    isLoading,
    error,
    initializeStripe,
    createCheckoutSession,
    createPortalSession,
  }
}
