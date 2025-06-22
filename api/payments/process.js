import { Client, Environment } from 'squareup';
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    // Try to use service account key first (for Vercel)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'world-war-3-update'
      });
    } else {
      // Fallback to application default (for local development)
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'world-war-3-update'
      });
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    throw new Error('Firebase Admin SDK initialization failed');
  }
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sourceId, amountMoney, buyerEmailAddress, note, userId, verificationToken } = req.body;

    // Validate required environment variables
    const squareAccessToken = process.env.SQUARE_ACCESS_TOKEN;
    const squareLocationId = process.env.SQUARE_LOCATION_ID;
    const squareEnvironment = process.env.SQUARE_ENVIRONMENT || 'sandbox';
    
    if (!squareAccessToken) {
      console.error('Square access token not configured');
      return res.status(500).json({ error: 'Payment configuration error' });
    }

    if (!squareLocationId) {
      console.error('Square location ID not configured');
      return res.status(500).json({ error: 'Payment configuration error' });
    }

    // Validate required request fields
    if (!sourceId || !amountMoney || !buyerEmailAddress || !userId) {
      return res.status(400).json({ error: 'Missing required payment fields' });
    }

    // Initialize Square client with proper environment
    const client = new Client({
      accessToken: squareAccessToken,
      environment: squareEnvironment === 'production' ? Environment.Production : Environment.Sandbox
    });

    const { paymentsApi } = client;

    // Create payment request with location ID (required for Square)
    const paymentRequest = {
      sourceId,
      idempotencyKey: `ww3-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      locationId: squareLocationId,
      amountMoney,
      buyerEmailAddress,
      note,
      autocomplete: true
    };

    // Add verification token if provided (recommended for security)
    if (verificationToken) {
      paymentRequest.verificationToken = verificationToken;
    }    // Process payment with Square
    console.log('Processing payment:', {
      amount: amountMoney.amount,
      currency: amountMoney.currency,
      userId: userId,
      email: buyerEmailAddress
    });

    const paymentResponse = await paymentsApi.createPayment(paymentRequest);

    if (paymentResponse.result.payment) {
      const payment = paymentResponse.result.payment;
      console.log('Payment successful:', payment.id, 'Status:', payment.status);
      
      // Save payment to Firestore
      const paymentData = {
        paymentId: payment.id,
        userId: userId,
        amount: amountMoney.amount,
        currency: amountMoney.currency,
        status: payment.status,
        buyerEmail: buyerEmailAddress,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        locationId: squareLocationId,
        environment: squareEnvironment,
        receiptUrl: payment.receiptUrl || null,
        orderId: payment.orderId || null,
        squarePaymentData: {
          id: payment.id,
          status: payment.status,
          receiptUrl: payment.receiptUrl,
          orderId: payment.orderId,
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt
        }
      };

      console.log('Saving payment to Firestore:', paymentData.paymentId);
      await db.collection('payments').doc(payment.id).set(paymentData);
      console.log('Payment saved to Firestore successfully');

      // Create/update subscription for completed payments
      if (payment.status === 'COMPLETED') {
        const subscriptionData = {
          userId: userId,
          plan: 'annual_plan',
          status: 'active',
          startDate: admin.firestore.FieldValue.serverTimestamp(),
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          paymentId: payment.id,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        console.log('Creating subscription for user:', userId);
        await db.collection('subscriptions').doc(userId).set(subscriptionData);
        console.log('Subscription created successfully');
      }      
      return res.status(200).json({
        success: true,
        paymentId: payment.id,
        orderId: payment.orderId,
        status: payment.status,
        receiptUrl: payment.receiptUrl
      });
    } else {
      console.error('Payment failed - no payment object in response:', paymentResponse.result);
      return res.status(400).json({ 
        error: 'Payment failed',
        details: paymentResponse.result.errors || []
      });
    }

  } catch (error) {
    console.error('Payment processing error:', error);
    
    // Handle Square API errors specifically
    if (error.name === 'ApiError' && error.errors) {
      console.error('Square API errors:', error.errors);
      return res.status(400).json({ 
        error: 'Payment failed',
        details: error.errors 
      });
    }
    
    return res.status(500).json({ 
      error: 'Payment processing failed',
      details: error.message 
    });
  }
}
