# Firebase Service Account Setup for Vercel

## The Core Issue
Your Square payments aren't saving to Firestore because the Firebase Admin SDK can't authenticate in Vercel's serverless environment.

## Solution: Service Account Key

### Step 1: Generate Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `world-war-3-update`
3. Click the ⚙️ gear icon → Project Settings
4. Go to "Service accounts" tab
5. Click "Generate new private key"
6. Download the JSON file

### Step 2: Add to Vercel Environment Variables

1. Open the downloaded JSON file
2. Copy the ENTIRE contents (it should start with `{` and end with `}`)
3. Go to [Vercel Dashboard](https://vercel.com/dashboard)
4. Select your project
5. Go to Settings → Environment Variables
6. Add a new variable:
   - **Name**: `FIREBASE_SERVICE_ACCOUNT_KEY`
   - **Value**: Paste the entire JSON content
   - **Environment**: Production, Preview, Development

### Step 3: Test Firebase Connection

After adding the service account key, test it by visiting:
`https://your-domain.vercel.app/api/test/firebase`

This will tell you if Firebase is working.

## Alternative: Simplified Environment Setup

If the JSON approach doesn't work, you can also set individual environment variables from the service account JSON:

```
FIREBASE_PROJECT_ID=world-war-3-update
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@world-war-3-update.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----
```

## Expected Result

Once this is set up correctly:
1. ✅ Firebase test endpoint should return success
2. ✅ Square payments should save to Firestore
3. ✅ Subscriptions should be created properly

## Troubleshooting

If you still have issues:
1. Check Vercel function logs for detailed errors
2. Ensure the service account has "Firebase Admin SDK Service Agent" role
3. Make sure the JSON is properly formatted (no extra quotes or escaping)

The key insight: Vercel serverless functions need explicit Firebase credentials, not the default authentication that works locally.
