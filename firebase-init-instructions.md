# Firebase Project Setup Instructions

Since there's no `.firebaserc` file, you'll need to initialize your Firebase project connection.

## Step 1: Initialize Firebase Project

```bash
# If using Docker (recommended due to Node.js version issue):
docker build -t worldwar3-app .
docker run -it --name worldwar3-deploy -v ${PWD}:/app worldwar3-app sh

# Inside container or if you have compatible Node.js version:
firebase login
firebase init

# Select:
# - Hosting: Configure files for Firebase Hosting
# - Firestore: Configure security rules and indexes files for Firestore
# - Choose your existing Firebase project or create new one
# - Public directory: dist
# - Single-page app: Yes
# - Automatic builds and deploys with GitHub: No (or Yes if you want)
```

## Step 2: Deploy

```bash
# Build first
npm run build

# Deploy
firebase deploy
```

## Alternative: Manual Deployment

1. Go to Firebase Console (https://console.firebase.google.com)
2. Select your project
3. Go to Hosting section
4. Upload the `dist` folder manually

## Environment Variables Needed

Make sure your `.env` file contains all required Firebase configuration values from your Firebase project settings.
