import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Persistent Global Counter for "Total Users This Month"
 * 
 * Uses CountAPI.xyz for persistent storage:
 * - Counter persists across page reloads
 * - Same value for all visitors
 * - Auto-increments via scheduled job or on first visit of the day
 */

// Counter namespace and key for CountAPI
const COUNTER_NAMESPACE = 'formatho.com'
const COUNTER_KEY = 'monthly-users'

// API endpoint
const API_URL = `https://api.countapi.xyz/hit/${COUNTER_NAMESPACE}/${COUNTER_KEY}`
const GET_URL = `https://api.countapi.xyz/get/${COUNTER_NAMESPACE}/${COUNTER_KEY}`

// Fallback initial value if API fails
const INITIAL_VALUE = 13847

// Refresh interval (60 seconds as per requirements)
const REFRESH_INTERVAL = 60000

export function useMonthlyCounter() {
  const monthlyVisitors = ref(INITIAL_VALUE)
  const isLoading = ref(true)
  const error = ref<string | null>(null)
  let refreshInterval: number | undefined

  /**
   * Fetch current counter value from API
   */
  const fetchCounter = async () => {
    try {
      const response = await fetch(GET_URL)
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`)
      }
      const data = await response.json()
      
      if (data.value !== undefined) {
        monthlyVisitors.value = data.value
        error.value = null
      }
    } catch (err) {
      console.warn('Failed to fetch monthly counter, using fallback:', err)
      // Keep the current value (either initial or last known)
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Initialize counter if it doesn't exist
   * This sets up the counter with our initial value
   */
  const initializeCounter = async () => {
    try {
      // Try to create the counter with initial value
      const response = await fetch(
        `https://api.countapi.xyz/create?namespace=${COUNTER_NAMESPACE}&key=${COUNTER_KEY}&value=${INITIAL_VALUE}&enable_reset=1`
      )
      if (response.ok) {
        console.log('Monthly counter initialized successfully')
      }
    } catch (err) {
      // Counter might already exist, that's fine
      console.log('Counter may already exist:', err)
    }
  }

  onMounted(async () => {
    // First, try to initialize (won't hurt if already exists)
    await initializeCounter()
    
    // Fetch current value
    await fetchCounter()
    
    // Set up periodic refresh (every 60 seconds)
    refreshInterval = window.setInterval(fetchCounter, REFRESH_INTERVAL)
  })

  onUnmounted(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
    }
  })

  return {
    monthlyVisitors,
    isLoading,
    error,
    refresh: fetchCounter
  }
}

/**
 * Get the API URL for manual incrementing (for scheduled jobs)
 */
export function getCounterApiUrls() {
  return {
    get: GET_URL,
    hit: API_URL, // Increments by 1
    set: `https://api.countapi.xyz/set/${COUNTER_NAMESPACE}/${COUNTER_KEY}`, // Set specific value
    info: `https://api.countapi.xyz/info/${COUNTER_NAMESPACE}/${COUNTER_KEY}`
  }
}
