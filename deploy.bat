@echo off
REM World War 3 App Deployment Script for Windows
echo 🚀 Deploying World War 3 Intelligence App...

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Firebase CLI not found. Please install it first:
    echo npm install -g firebase-tools
    exit /b 1
)

REM Check if logged in to Firebase
firebase projects:list >nul 2>&1
if errorlevel 1 (
    echo ❌ Not logged in to Firebase. Please run:
    echo firebase login
    exit /b 1
)

REM Check environment variables
if not exist ".env" (
    echo ❌ .env file not found. Please create one based on .env.example
    exit /b 1
)

echo 📦 Building the application...
npm run build

if errorlevel 1 (
    echo ❌ Build failed. Please fix build errors before deploying.
    exit /b 1
)

echo 🔥 Deploying to Firebase...
firebase deploy

if errorlevel 0 (
    echo ✅ Deployment successful!
    echo 🌐 Your app is now live!
) else (
    echo ❌ Deployment failed. Please check the error messages above.
    exit /b 1
)
