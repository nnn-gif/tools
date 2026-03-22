# Email Capture API

This folder contains serverless functions for handling newsletter subscriptions.

## Endpoints

- `POST /api/resend/subscribe` - Resend-specific endpoint
- `POST /api/newsletter/subscribe` - Generic multi-service endpoint

## Supported Email Services

The generic endpoint supports:
- **Resend** (recommended) - Modern email API
- **ConvertKit** - Creator-focused email marketing
- **Mailchimp** - Popular email marketing platform
- **Database** - Direct database storage (custom implementation required)

## Environment Variables

### Required

```env
# Choose your email service
EMAIL_SERVICE=resend  # 'resend' | 'convertkit' | 'mailchimp' | 'database'
```

### Resend Configuration

```env
RESEND_API_KEY=re_xxxxxx
RESEND_AUDIENCE_ID=xxxxxx  # Optional: Your Resend audience ID
```

Get these from [Resend Dashboard](https://resend.com/api-keys)

### ConvertKit Configuration

```env
CONVERTKIT_API_KEY=xxxxxx
CONVERTKIT_FORM_ID=xxxxxx
```

Get these from [ConvertKit Account Settings](https://app.convertkit.com/account_settings)

### Mailchimp Configuration

```env
MAILCHIMP_API_KEY=xxxxxx-us1
MAILCHIMP_LIST_ID=xxxxxx
```

Get these from [Mailchimp Account](https://mailchimp.com/help/about-api-keys/)

### Database Configuration

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

## Deployment

### Vercel

1. Push the `api/` folder to your repository
2. Set environment variables in Vercel dashboard
3. Deploy - Vercel automatically detects and deploys the functions

### Netlify

1. Create `netlify.toml` in your project root:

```toml
[functions]
  directory = "api"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

2. Set environment variables in Netlify dashboard
3. Deploy - Netlify automatically detects and deploys the functions

## Local Development

### Using Vercel CLI

```bash
npm i -g vercel
vercel dev
```

### Using Netlify CLI

```bash
npm i -g netlify-cli
netlify dev
```

## Request Format

```json
POST /api/resend/subscribe
Content-Type: application/json

{
  "email": "user@example.com",
  "source": "homepage",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "metadata": {
    "url": "https://formatho.com",
    "referrer": "https://google.com",
    "userAgent": "Mozilla/5.0..."
  }
}
```

## Response Format

### Success

```json
{
  "success": true,
  "message": "Thanks for subscribing!",
  "id": "contact_123"
}
```

### Error

```json
{
  "success": false,
  "message": "Please provide a valid email address"
}
```

## Frontend Integration

The frontend is already set up to call these endpoints. Configure the endpoint URLs in your `.env`:

```env
VITE_RESEND_API_ENDPOINT=/api/resend/subscribe
VITE_EMAIL_API_ENDPOINT=/api/newsletter/subscribe
```

For production, these can be full URLs:

```env
VITE_RESEND_API_ENDPOINT=https://api.formatho.com/api/resend/subscribe
```

## Fallback Option: Formspree

If you don't want to deploy serverless functions, you can use Formspree as a fallback:

1. Create a free account at [Formspree](https://formspree.io)
2. Create a new form
3. Add the endpoint to your `.env`:

```env
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
```

The email capture component will automatically fall back to Formspree if the primary endpoints fail.
