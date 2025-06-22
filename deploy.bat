@echo off
REM World War 3 App Deployment Script for Windows
echo 🚀 Deploying World War 3 Intelligence App...

REM Check Node.js version
node --version | findstr /R "v20\|v21\|v22" >nul
if errorlevel 1 (
    echo ⚠️  Warning: Node.js version may be incompatible with Firebase CLI
    echo    Current version: 
    node --version
    echo    Required: Node.js >=20.0.0
    echo.
    echo 💡 Solutions:
    echo    1. Upgrade Node.js to version 20+
    echo    2. Use Docker with Node.js 20
    echo    3. Use GitHub Actions for deployment
    echo    4. Use Firebase Web Console manual upload
    echo.
    pause
)

REM Check if Firebase CLI is installed and working
firebase --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Firebase CLI not working or incompatible. 
    echo 📖 See deploy-solution.md for alternative deployment methods.
    pause
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

echo 🔥 Attempting Firebase deployment...
firebase deploy

if errorlevel 0 (
    echo ✅ Deployment successful!
    echo 🌐 Your app is now live!
) else (
    echo ❌ Deployment failed. 
    echo 📖 Check deploy-solution.md for alternative deployment methods.
    exit /b 1
)
