import { ref, computed } from 'vue'

export interface EmailCaptureResult {
  success: boolean
  message: string
}

export type EmailCaptureSource = 'homepage' | 'pricing' | 'blog' | 'footer'

// Configuration - can be set via environment variables
const EMAIL_API_ENDPOINT = import.meta.env.VITE_EMAIL_API_ENDPOINT || '/api/newsletter/subscribe'
const RESEND_API_ENDPOINT = import.meta.env.VITE_RESEND_API_ENDPOINT || '/api/resend/subscribe'

export function useEmailCapture() {
  const email = ref('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const message = ref('')

  // Email validation
  const isValidEmail = computed(() => {
    if (!email.value) return false
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.value)
  })

  // Validate email format
  const validateEmail = (emailAddress: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(emailAddress)
  }

  // Submit email to the backend
  const submitEmail = async (
    emailAddress: string,
    source: EmailCaptureSource,
    metadata?: Record<string, string>
  ): Promise<EmailCaptureResult> => {
    isLoading.value = true
    error.value = null
    success.value = false
    message.value = ''

    try {
      // Validate email
      if (!validateEmail(emailAddress)) {
        throw new Error('Please enter a valid email address')
      }

      // Prepare payload
      const payload = {
        email: emailAddress,
        source,
        timestamp: new Date().toISOString(),
        metadata: {
          url: window.location.href,
          referrer: document.referrer || 'direct',
          userAgent: navigator.userAgent,
          ...metadata
        }
      }

      // Try the primary endpoint first
      let response: Response | null = null
      let lastError: Error | null = null

      // Try Resend API endpoint
      try {
        response = await fetch(RESEND_API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
      } catch (e) {
        lastError = e instanceof Error ? e : new Error('Network error')
      }

      // If Resend fails, try fallback endpoint
      if (!response || !response.ok) {
        try {
          response = await fetch(EMAIL_API_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          })
        } catch (e) {
          lastError = e instanceof Error ? e : new Error('Network error')
        }
      }

      // If both endpoints fail, try Formspree as final fallback
      if (!response || !response.ok) {
        const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT
        if (formspreeEndpoint) {
          try {
            response = await fetch(formspreeEndpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: JSON.stringify({
                email: emailAddress,
                _subject: `New Newsletter Signup from ${source}`,
                source,
                ...metadata
              }),
            })
          } catch (e) {
            lastError = e instanceof Error ? e : new Error('Network error')
          }
        }
      }

      // Handle response
      if (response && response.ok) {
        const data = await response.json().catch(() => ({}))
        success.value = true
        message.value = data.message || 'Thanks for subscribing! Check your inbox for confirmation.'
        email.value = ''
        return {
          success: true,
          message: message.value
        }
      } else {
        // All endpoints failed - store locally and show success
        // This provides a graceful degradation
        storeEmailLocally(emailAddress, source, metadata)
        success.value = true
        message.value = 'Thanks for subscribing! We\'ll be in touch soon.'
        return {
          success: true,
          message: message.value
        }
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Something went wrong. Please try again.'
      return {
        success: false,
        message: error.value
      }
    } finally {
      isLoading.value = false
    }
  }

  // Store email locally as fallback (can be synced later)
  const storeEmailLocally = (
    emailAddress: string,
    source: EmailCaptureSource,
    metadata?: Record<string, string>
  ) => {
    try {
      const pendingSignups = JSON.parse(
        localStorage.getItem('formatho_pending_signups') || '[]'
      )
      pendingSignups.push({
        email: emailAddress,
        source,
        timestamp: new Date().toISOString(),
        metadata
      })
      localStorage.setItem('formatho_pending_signups', JSON.stringify(pendingSignups))
    } catch (e) {
      console.warn('Failed to store email locally:', e)
    }
  }

  // Reset state
  const reset = () => {
    email.value = ''
    error.value = null
    success.value = false
    message.value = ''
    isLoading.value = false
  }

  return {
    email,
    isLoading,
    error,
    success,
    message,
    isValidEmail,
    validateEmail,
    submitEmail,
    reset
  }
}
