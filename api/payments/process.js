import { Client, Environment } from 'squareup';
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'world-war-3-update'
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sourceId, amountMoney, buyerEmailAddress, note, userId } = req.body;

    const squareAccessToken = process.env.SQUARE_ACCESS_TOKEN;
    
    if (!squareAccessToken) {
      return res.status(500).json({ error: 'Square access token not configured' });
    }

    // Initialize Square client
    const client = new Client({
      accessToken: squareAccessToken,
      environment: Environment.Production // or Environment.Sandbox for testing
    });

    const { paymentsApi } = client;

    // Create payment request
    const paymentRequest = {
      sourceId,
      idempotencyKey: `${Date.now()}-${Math.random()}`,
      amountMoney,
      buyerEmailAddress,
      note,
      autocomplete: true
    };

    // Process payment with Square
    const paymentResponse = await paymentsApi.createPayment(paymentRequest);

    if (paymentResponse.result.payment) {
      const payment = paymentResponse.result.payment;
      
      // Save payment to Firestore
      const paymentData = {
        paymentId: payment.id,
        userId: userId,
        amount: amountMoney.amount,
        currency: amountMoney.currency,
        status: payment.status,
        buyerEmail: buyerEmailAddress,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        squarePaymentData: payment
      };

      await db.collection('payments').doc(payment.id).set(paymentData);

      // Create/update subscription
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

        await db.collection('subscriptions').doc(userId).set(subscriptionData);
      }
      
      return res.status(200).json({
        success: true,
        paymentId: payment.id,
        orderId: payment.orderId,
        status: payment.status
      });
    } else {
      return res.status(400).json({ 
        error: 'Payment failed',
        details: paymentResponse.result.errors || []
      });
    }

  } catch (error) {
    console.error('Payment processing error:', error);
    return res.status(500).json({ 
      error: 'Payment processing failed',
      details: error.message 
    });
  }
}
