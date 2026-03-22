/**
 * Newsletter Subscription Endpoint - Generic Implementation
 * 
 * This serverless function handles email subscriptions and can be configured
 * to work with multiple email services (Resend, ConvertKit, Mailchimp, etc.)
 * or store emails directly in a database.
 * 
 * Deploy this to Vercel, Netlify, or any serverless platform.
 * 
 * Environment Variables:
 * - EMAIL_SERVICE: 'resend' | 'convertkit' | 'mailchimp' | 'database' (default: 'resend')
 * - RESEND_API_KEY: Resend API key
 * - CONVERTKIT_API_KEY: ConvertKit API key
 * - CONVERTKIT_FORM_ID: ConvertKit form ID
 * - MAILCHIMP_API_KEY: Mailchimp API key
 * - MAILCHIMP_LIST_ID: Mailchimp audience ID
 * - DATABASE_URL: Database connection URL (if using database storage)
 */

interface SubscribeRequest {
  email: string
  source: 'homepage' | 'pricing' | 'blog' | 'footer'
  timestamp: string
  metadata?: {
    url?: string
    referrer?: string
    userAgent?: string
    [key: string]: string | undefined
  }
}

interface SubscribeResponse {
  success: boolean
  message: string
  id?: string
}

export default async function handler(
  request: Request
): Promise<Response> {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, message: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const body: SubscribeRequest = await request.json()
    const { email, source, metadata } = body

    // Validate email
    if (!email || !isValidEmail(email)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Please provide a valid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Determine which email service to use
    const emailService = process.env.EMAIL_SERVICE || 'resend'
    
    let result: SubscribeResponse

    switch (emailService) {
      case 'resend':
        result = await subscribeWithResend(email, source, metadata)
        break
      case 'convertkit':
        result = await subscribeWithConvertKit(email, source, metadata)
        break
      case 'mailchimp':
        result = await subscribeWithMailchimp(email, source, metadata)
        break
      case 'database':
        result = await subscribeWithDatabase(email, source, metadata)
        break
      default:
        // Default to logging for development
        console.log('Newsletter signup (dev mode):', { email, source, metadata, timestamp: new Date().toISOString() })
        result = { success: true, message: 'Thanks for subscribing!' }
    }

    return new Response(
      JSON.stringify(result),
      { 
        status: result.success ? 200 : 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Subscription error:', error)
    return new Response(
      JSON.stringify({ success: false, message: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Resend Integration
async function subscribeWithResend(
  email: string,
  source: string,
  metadata?: Record<string, string | undefined>
): Promise<SubscribeResponse> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return { success: false, message: 'Email service not configured' }
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID
  
  try {
    const response = await fetch(`https://api.resend.com/audiences/${audienceId ? audienceId + '/' : ''}contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        audience_id: audienceId,
        custom_fields: {
          source,
          signup_url: metadata?.url || '',
          signup_date: new Date().toISOString(),
        }
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      if (response.status === 422) {
        return { success: true, message: 'You\'re already subscribed!' }
      }
      return { success: false, message: 'Failed to subscribe' }
    }

    const result = await response.json()
    return { success: true, message: 'Thanks for subscribing!', id: result.id }
  } catch (error) {
    console.error('Resend error:', error)
    return { success: false, message: 'Email service error' }
  }
}

// ConvertKit Integration
async function subscribeWithConvertKit(
  email: string,
  source: string,
  metadata?: Record<string, string | undefined>
): Promise<SubscribeResponse> {
  const apiKey = process.env.CONVERTKIT_API_KEY
  const formId = process.env.CONVERTKIT_FORM_ID

  if (!apiKey || !formId) {
    return { success: false, message: 'Email service not configured' }
  }

  try {
    const response = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        email,
        tags: [source],
        fields: {
          signup_url: metadata?.url || '',
        }
      }),
    })

    if (!response.ok) {
      return { success: false, message: 'Failed to subscribe' }
    }

    const result = await response.json()
    return { success: true, message: 'Thanks for subscribing!', id: result.subscription?.id }
  } catch (error) {
    console.error('ConvertKit error:', error)
    return { success: false, message: 'Email service error' }
  }
}

// Mailchimp Integration
async function subscribeWithMailchimp(
  email: string,
  source: string,
  metadata?: Record<string, string | undefined>
): Promise<SubscribeResponse> {
  const apiKey = process.env.MAILCHIMP_API_KEY
  const listId = process.env.MAILCHIMP_LIST_ID

  if (!apiKey || !listId) {
    return { success: false, message: 'Email service not configured' }
  }

  // Extract data center from API key
  const dataCenter = apiKey.split('-')[1]
  const subscriberHash = Buffer.from(email.toLowerCase()).toString('base64')

  try {
    const response = await fetch(
      `https://${dataCenter}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${Buffer.from(`any:${apiKey}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          tags: [source],
          merge_fields: {
            SOURCE: source,
          }
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      if (error.title === 'Member Exists') {
        return { success: true, message: 'You\'re already subscribed!' }
      }
      return { success: false, message: 'Failed to subscribe' }
    }

    const result = await response.json()
    return { success: true, message: 'Thanks for subscribing!', id: result.id }
  } catch (error) {
    console.error('Mailchimp error:', error)
    return { success: false, message: 'Email service error' }
  }
}

// Database Integration (PostgreSQL example)
async function subscribeWithDatabase(
  email: string,
  source: string,
  metadata?: Record<string, string | undefined>
): Promise<SubscribeResponse> {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    return { success: false, message: 'Database not configured' }
  }

  // This is a placeholder - implement actual database logic
  // You could use libraries like pg, mysql2, or Prisma
  console.log('Database subscription:', { email, source, metadata })
  
  return { success: true, message: 'Thanks for subscribing!' }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
