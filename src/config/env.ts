// Environment variables configuration
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
    applicationId: import.meta.env.VITE_SQUARE_APPLICATION_ID,
    accessToken: import.meta.env.VITE_SQUARE_ACCESS_TOKEN,
    environment: import.meta.env.VITE_SQUARE_ENVIRONMENT || 'production',
  },
  perplexity: {
    apiKey: import.meta.env.VITE_PERPLEXITY_API_KEY,
  },
};
