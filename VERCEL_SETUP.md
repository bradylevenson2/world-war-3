# Vercel Deployment Guide for World War 3 Update

## Quick Setup

1. **Go to Vercel**: https://vercel.com
2. **Import from Git**: Connect your GitHub repository `bradylevenson2/world-war-3`
3. **Configure Project**:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## Environment Variables

Add these to your Vercel project settings:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_SQUARE_APPLICATION_ID=your_square_application_id_here
VITE_SQUARE_ACCESS_TOKEN=your_square_access_token_here
VITE_SQUARE_ENVIRONMENT=production
VITE_PERPLEXITY_API_KEY=your_perplexity_api_key_here
```

## Advantages of Vercel

- ✅ Automatic deployments on Git push
- ✅ No Node.js version conflicts
- ✅ Built-in environment variable management
- ✅ Great performance and CDN
- ✅ Easy custom domain setup

## Note

You can still use Firebase for:
- Authentication (Firebase Auth)
- Database (Firestore)
- Backend services

Just use Vercel for hosting the frontend!

## Deploy Steps

1. Push your code to GitHub (already done)
2. Import project to Vercel
3. Add environment variables
4. Deploy automatically!
