# Secure Deployment Guide - World War 3 Update

## 🔒 Security Architecture

This app now uses a **secure architecture** that keeps sensitive API keys server-side while allowing safe client-side operations.

### Client-Side (Safe to expose)
- Firebase configuration
- Square Application ID  
- UI components and logic

### Server-Side (Secure API endpoints)
- Perplexity API key
- Square Access Token
- Payment processing logic

## 🚀 Deployment Steps

### 1. **Client-Side Environment Variables (Vercel)**
Add these to your Vercel project settings → Environment Variables:

```bash
# Safe client-side variables
VITE_FIREBASE_API_KEY=AIzaSyC_xSSYxTL6d7RefOKIyFCQeOIThK2krCA
VITE_FIREBASE_AUTH_DOMAIN=world-war-3-update.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=world-war-3-update
VITE_FIREBASE_STORAGE_BUCKET=world-war-3-update.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=617523843487
VITE_FIREBASE_APP_ID=1:617523843487:web:2728496d2b927faa15edaa
VITE_SQUARE_APPLICATION_ID=sq0idp-ZyRAQ_NcnDmhlnjZGkVVCw
VITE_SQUARE_ENVIRONMENT=production
```

### 2. **Server-Side Environment Variables (Vercel)**
Add these **WITHOUT** the `VITE_` prefix:

```bash
# Secure server-side variables
PERPLEXITY_API_KEY=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
SQUARE_ACCESS_TOKEN=EAAAl3bTJ1n3JC4oS8N86fU0AeBJdvjaj3K6wEtkkZYWqzOUrbMhKIPc1epJnLsd
SQUARE_APPLICATION_ID=sq0idp-ZyRAQ_NcnDmhlnjZGkVVCw
SQUARE_ENVIRONMENT=production
```

### 3. **Update Code References**
To use the secure services, update your imports:

```typescript
// Replace old imports
// import { newsService } from '../services/newsService';
// import { squareService } from '../services/squareService';

// With secure imports
import { newsService } from '../services/newsService-secure';
import { squareService } from '../services/squareService-secure';
```

## 🔧 API Endpoints

### `/api/news/generate`
- **Method**: POST
- **Purpose**: Generate news updates using Perplexity AI
- **Security**: API key stored server-side

### `/api/payments/process`  
- **Method**: POST
- **Body**: `{ planId, userId, userEmail, cardToken }`
- **Purpose**: Process payments using Square
- **Security**: Access token stored server-side

## ✅ Security Benefits

1. **🔒 API Keys Protected**: Sensitive keys never exposed to browser
2. **🛡️ Server-Side Validation**: Payment and news requests validated server-side  
3. **🔐 Token Security**: Payment tokens processed securely
4. **📱 Client Safety**: Only safe configuration exposed to client

## 🚨 Important Notes

- Never add `VITE_` prefix to sensitive variables
- Server-side variables are only accessible in `/api` routes
- Client can only call your API endpoints, not external APIs directly
- This architecture scales well and follows security best practices

## 🔄 Migration Steps

1. Add environment variables to Vercel (both client and server)
2. Update imports to use `-secure` services  
3. Deploy and test
4. Remove old insecure service files once confirmed working
