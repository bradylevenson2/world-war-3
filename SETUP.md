# Setup Instructions for World War 3 Intelligence Hub

## 🚀 Quick Start Guide

Your World War 3 Intelligence Hub is now ready for configuration and deployment!

### 1. Environment Configuration

Create a `.env` file in the project root and configure the following:

```bash
# Copy from .env.example
cp .env.example .env
```

Then fill in your actual API keys:

#### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project called "worldwar3-intel" (or similar)
3. Enable Authentication with Email/Password
4. Create a Firestore database
5. Get your config from Project Settings > General > Your apps
6. Fill in the Firebase values in `.env`

#### Square Setup
1. Go to [Square Developer](https://developer.squareup.com/)
2. Create a new application in your developer dashboard
3. Get your Application ID and Access Token from the app details
4. Choose your environment (sandbox for testing, production for live)
5. Fill in `VITE_SQUARE_APPLICATION_ID`, `VITE_SQUARE_ACCESS_TOKEN`, and `VITE_SQUARE_ENVIRONMENT`
6. Square handles subscription billing automatically

#### Perplexity AI Setup
1. Go to [Perplexity AI](https://www.perplexity.ai/)
2. Create an account and get an API key from their developer portal
3. Fill in `VITE_PERPLEXITY_API_KEY`
4. This enables real-time news generation and analysis

### 2. Development Server

The app is already running on: **http://localhost:5174**

### 3. Test the Application

1. **Sign Up Flow**: Create a new account
2. **Payment Flow**: Test subscription selection
3. **Dashboard**: View the intelligence briefings
4. **Countdown Timer**: Watch the next update countdown

### 4. Firebase Functions (Optional)

For automated hourly updates, create Firebase Functions:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize functions
firebase init functions

# Deploy functions
firebase deploy --only functions
```

### 5. Deployment Options

#### Option A: Vercel (Recommended)
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

#### Option B: Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables
4. Set up continuous deployment

#### Option C: Firebase Hosting
```bash
firebase init hosting
firebase deploy --only hosting
```

### 6. Mobile App Development

To convert to mobile apps:

#### React Native Setup
```bash
# Install Expo CLI
npm install -g @expo/cli

# Create new Expo project
npx create-expo-app worldwar3-mobile

# Copy components and adapt for React Native
```

#### Key Changes for Mobile:
- Replace `react-router-dom` with React Navigation
- Use React Native Firebase
- Implement push notifications
- Adapt styling for mobile screens
- Use platform-specific payment systems (Apple Pay, Google Pay)

### 7. Production Checklist

- [ ] Configure real Firebase project
- [ ] Set up Stripe products and webhooks
- [ ] Configure domain (worldwar3update.com)
- [ ] Set up SSL certificate
- [ ] Configure email templates
- [ ] Set up monitoring and analytics
- [ ] Test payment flows thoroughly
- [ ] Configure backup systems
- [ ] Set up automated deployments

### 8. Next Steps

1. **Content Strategy**: Plan your news update schedule
2. **Marketing**: Set up social media automation
3. **Analytics**: Implement user tracking
4. **Support**: Set up customer support system
5. **Legal**: Add terms of service and privacy policy

## 🎯 Key Features Implemented

✅ **Authentication System** - Firebase Auth with email/password  
✅ **Payment Integration** - Square subscription management  
✅ **Responsive Design** - Mobile-first brown theme  
✅ **Real-time Updates** - Countdown timer and news display  
✅ **News Integration** - Perplexity AI content generation  
✅ **Paywall System** - Preview content for non-subscribers  
✅ **Security** - Environment variable protection  

## 🔧 Technical Details

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom brown theme
- **AI Integration**: Perplexity AI for real-time news analysis
- **Payment Processing**: Square for secure subscriptions
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Build Tool**: Vite with hot reload
- **Deployment**: Ready for Vercel/Netlify/Firebase

Your World War 3 Intelligence Hub is now ready to go live! 🚀
