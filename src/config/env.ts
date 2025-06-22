// Environment variables configuration - ONLY CLIENT-SAFE VARIABLES
export const config = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  },
  square: {
    // Only include APPLICATION_ID (safe for client-side)
    // ACCESS_TOKEN is now server-side only
    applicationId: import.meta.env.VITE_SQUARE_APPLICATION_ID,
    environment: import.meta.env.VITE_SQUARE_ENVIRONMENT || 'production',
  },
  // Perplexity API key is now server-side only
};
