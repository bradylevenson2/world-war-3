# Vercel Environment Variables Setup

## CRITICAL: Required Environment Variables for Production

You MUST configure these environment variables in your Vercel dashboard for the app to work properly:

### 1. Go to Vercel Dashboard
- Visit https://vercel.com/dashboard
- Select your project: `worldwar3-app`
- Go to Settings → Environment Variables

### 2. Add these SERVER-SIDE variables (for API routes):

```bash
# Firebase Admin SDK (CRITICAL for saving payments)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"world-war-3-update",...FULL_JSON_HERE...}

# Square Payment Processing (REQUIRED)
SQUARE_ACCESS_TOKEN=EAAAl3bTJ1n3JC4oS8N86fU0AeBJdvjaj3K6wEtkkZYWqzOUrbMhKIPc1epJnLsd
SQUARE_APPLICATION_ID=sq0idp-ZyRAQ_NcnDmhlnjZGkVVCw
SQUARE_LOCATION_ID=YOUR_ACTUAL_LOCATION_ID
SQUARE_ENVIRONMENT=production

# Perplexity AI (REQUIRED)
PERPLEXITY_API_KEY=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

# Firebase Project ID (for server-side admin SDK)
VITE_FIREBASE_PROJECT_ID=world-war-3-update
```

### 3. Client-side variables (already in build)
These are automatically included in the build from your .env file because they have the `VITE_` prefix:
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_SQUARE_APPLICATION_ID
- VITE_SQUARE_ENVIRONMENT

## IMPORTANT: Get Your Square Location ID

1. Log into your Square Developer Dashboard: https://developer.squareup.com/apps
2. Select your application
3. Go to "Locations" tab
4. Copy your Location ID (it should look like: `LH2G5EZ11BQCD`)
5. Replace `YOUR_ACTUAL_LOCATION_ID` in the environment variables above

## Deployment Steps

1. Set all environment variables in Vercel
2. Get your correct Square Location ID
3. Deploy the latest code:

```bash
git add .
git commit -m "Fixed payment processing with location ID and secure env vars"
git push origin main
```

4. Verify deployment in Vercel logs
5. Test payment flow in production

## Testing Payment Processing

After deployment, test the payment flow:
1. Go to your production site
2. Try to make a payment
3. Check Vercel Function logs for any errors
4. Verify payment appears in your Square Dashboard
5. Verify payment and subscription records are created in Firestore

## Common Issues

1. **"Payment configuration error"** = Missing SQUARE_ACCESS_TOKEN or SQUARE_LOCATION_ID
2. **"locationId is required"** = Missing or incorrect SQUARE_LOCATION_ID
3. **Payments not saving to Firestore** = Check function logs for database errors
4. **API configuration error** = Missing PERPLEXITY_API_KEY

## Security Notes

- Never commit actual API keys to git
- Server-side variables (without VITE_ prefix) are only available to API routes
- Client-side variables (with VITE_ prefix) are included in the browser bundle
- Production and sandbox require different access tokens and location IDs
