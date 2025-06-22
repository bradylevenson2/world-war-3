import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'world-war-3-update'
      });
    } else {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'world-war-3-update'
      });
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

export default async function handler(req, res) {
  try {
    const db = admin.firestore();
    
    // Test writing to Firestore
    const testDoc = {
      message: 'Firebase test successful',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      testId: Date.now()
    };
    
    const docRef = await db.collection('test').add(testDoc);
    
    res.status(200).json({
      success: true,
      message: 'Firebase connection working',
      documentId: docRef.id,
      projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'world-war-3-update'
    });
    
  } catch (error) {
    console.error('Firebase test error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.stack
    });
  }
}
