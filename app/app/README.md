# Dataverse Geolocation Router

A lightweight Next.js application that detects user location via IP geolocation and automatically redirects to the appropriate Systeme.io funnel.

## Features

- **Automatic Geolocation**: Detects user's country from IP address
- **Smart Routing**: Routes US traffic to US funnel, Nigeria traffic to NG funnel
- **Fallback Redirect**: Default funnel for all other countries
- **Fast & Lightweight**: ~3KB gzipped, runs on Vercel edge
- **Zero Backend**: Uses Vercel's built-in geolocation headers
- **Environment Configuration**: Easy to customize funnel URLs

## Quick Start

### Local Development

```bash
cd app
npm install
npm run dev
```

Visit `http://localhost:3000` and click "Start Application" or go directly to `http://localhost:3000/apply`

### Environment Variables

Edit `.env.local`:

```env
NEXT_PUBLIC_US_FUNNEL_URL=https://courses.systeme.io/us-funnel
NEXT_PUBLIC_NG_FUNNEL_URL=https://courses.systeme.io/ng-funnel
NEXT_PUBLIC_DEFAULT_FUNNEL_URL=https://courses.systeme.io/default-funnel
```

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from the app directory
cd app
vercel
```

Then set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_US_FUNNEL_URL`
- `NEXT_PUBLIC_NG_FUNNEL_URL`
- `NEXT_PUBLIC_DEFAULT_FUNNEL_URL`

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
cd app
netlify deploy --prod
```

## How It Works

1. User visits `dataverse.ai/apply` (or clicks button on home page)
2. Browser redirects to `/api/redirect`
3. Server reads geolocation from Vercel headers:
   - `x-vercel-ip-country-code` (e.g., "US", "NG")
4. Router determines target funnel URL
5. User is redirected (302) to the appropriate Systeme.io funnel

### Routing Logic

| Country | Redirect Target |
|---------|-----------------|
| US, PR, VI, GU, AS, MP | `NEXT_PUBLIC_US_FUNNEL_URL` |
| NG | `NEXT_PUBLIC_NG_FUNNEL_URL` |
| All others | `NEXT_PUBLIC_DEFAULT_FUNNEL_URL` |

## File Structure

```
app/
├── pages/
│   ├── api/
│   │   └── redirect.ts          # Main redirect endpoint
│   ├── index.tsx                # Landing page
│   ├── apply.tsx                # Redirect trigger
│   ├── _app.tsx                 # App wrapper
│   └── _document.tsx            # HTML document
├── lib/
│   └── geolocation.ts           # Geolocation utilities
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── next.config.js
├── vercel.json
├── .env.local                   # Environment variables
└── README.md
```

## API Reference

### GET `/api/redirect`

Automatically detects user location and redirects to appropriate funnel.

**Query Parameters:**
- `redirect_url` (optional): Override default redirect URL

**Response:**
- 302 Redirect to funnel URL

## Testing

### Local Testing with Different Countries

Vercel headers won't work locally. To test with specific countries:

1. Edit `.env.local` to use test URLs
2. Or use Vercel preview deployment
3. Or deploy to production and test from different countries

### Test URLs

- **US**: Access from US IP or use VPN
- **Nigeria**: Access from NG IP or use VPN  
- **Others**: Access from any other country

## Troubleshooting

### Getting redirected to default funnel?
- Check that `x-vercel-ip-country-code` header is present (only on Vercel)
- Verify environment variables are set correctly
- Check browser console and server logs

### Testing locally?
- Use a VPN service to test different countries
- Or deploy to Vercel and test with actual IPs

### Funnel URL not loading?
- Verify Systeme.io URLs are correct
- Check that funnel is published and not in draft
- Review browser console for CORS issues

## Production Checklist

- [ ] Set correct Systeme.io funnel URLs in Vercel environment
- [ ] Test with users from US and Nigeria
- [ ] Monitor redirect logs
- [ ] Set up analytics to track funnel performance
- [ ] Configure custom domain (e.g., `dataverse.ai/apply`)

## License

MIT
