import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { config } from './env';

const firebaseConfig = {
  apiKey: config.firebase.apiKey || "demo-api-key",
  authDomain: config.firebase.authDomain || "demo-project.firebaseapp.com",
  projectId: config.firebase.projectId || "demo-project-id",
  storageBucket: config.firebase.storageBucket || "demo-project.appspot.com",
  messagingSenderId: config.firebase.messagingSenderId || "123456789",
  appId: config.firebase.appId || "demo-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

export default app;
