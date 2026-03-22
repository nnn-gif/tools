/**
 * Newsletter Subscription Endpoint - Resend Integration
 * 
 * This serverless function handles email subscriptions via Resend API.
 * Deploy this to Vercel, Netlify, or any serverless platform.
 * 
 * Environment Variables Required:
 * - RESEND_API_KEY: Your Resend API key
 * - RESEND_AUDIENCE_ID: Your Resend audience/list ID (optional)
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

    // Get Resend API key from environment
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured')
      return new Response(
        JSON.stringify({ success: false, message: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Add contact to Resend
    const audienceId = process.env.RESEND_AUDIENCE_ID
    const response = await fetch('https://api.resend.com/audiences/' + (audienceId ? `${audienceId}/contacts` : 'contacts'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        first_name: undefined,
        last_name: undefined,
        unsubscribed: false,
        audience_id: audienceId,
        // Custom fields for tracking
        ...(metadata && {
          custom_fields: {
            source,
            signup_url: metadata.url || '',
            referrer: metadata.referrer || '',
            signup_date: new Date().toISOString(),
          }
        })
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      // Check if it's a duplicate contact error (Resend returns 422)
      if (response.status === 422 || errorData.name === 'validation_error') {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'You\'re already subscribed! Thanks for your interest.' 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.error('Resend API error:', errorData)
      return new Response(
        JSON.stringify({ success: false, message: 'Failed to subscribe. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const result = await response.json()
    
    // Log successful subscription (for analytics)
    console.log('New subscriber:', { 
      email, 
      source, 
      timestamp: new Date().toISOString(),
      id: result.id 
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Thanks for subscribing! Check your inbox for confirmation.',
        id: result.id 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Subscription error:', error)
    return new Response(
      JSON.stringify({ success: false, message: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
