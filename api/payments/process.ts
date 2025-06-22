import type { VercelRequest, VercelResponse } from '@vercel/node';

interface PaymentRequest {
  planId: string;
  userId: string;
  userEmail: string;
  cardToken: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'annual_plan',
    name: '12 Month Access',
    price: 1.49,
    currency: 'USD',
    interval: 'year'
  }
];

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { planId, userId, userEmail, cardToken } = req.body as PaymentRequest;

    // Validate required fields
    if (!planId || !userId || !userEmail || !cardToken) {
      return res.status(400).json({ 
        error: 'Missing required fields: planId, userId, userEmail, cardToken' 
      });
    }

    // Find the subscription plan
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan) {
      return res.status(400).json({ error: 'Invalid subscription plan' });
    }

    // Get Square credentials from environment
    const squareApplicationId = process.env.SQUARE_APPLICATION_ID;
    const squareAccessToken = process.env.SQUARE_ACCESS_TOKEN;
    const squareEnvironment = process.env.SQUARE_ENVIRONMENT || 'production';

    if (!squareApplicationId || !squareAccessToken) {
      return res.status(500).json({ error: 'Payment service not configured' });
    }

    // Import Square SDK (we'll need to install this)
    const { Client, Environment } = require('squareup');

    const client = new Client({
      accessToken: squareAccessToken,
      environment: squareEnvironment === 'sandbox' ? Environment.Sandbox : Environment.Production
    });

    const paymentsApi = client.paymentsApi;

    // Create payment request
    const paymentRequest = {
      sourceId: cardToken,
      amountMoney: {
        amount: Math.round(plan.price * 100), // Convert to cents
        currency: plan.currency
      },
      idempotencyKey: `${userId}-${planId}-${Date.now()}`, // Unique key
      note: `World War 3 Update - ${plan.name}`,
      buyerEmailAddress: userEmail
    };

    // Process payment
    const { result, statusCode } = await paymentsApi.createPayment(paymentRequest);

    if (statusCode === 200 && result.payment) {
      res.status(200).json({
        success: true,
        paymentId: result.payment.id,
        status: result.payment.status,
        plan: plan
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment failed',
        details: result.errors || 'Unknown error'
      });
    }

  } catch (error: any) {
    console.error('Payment processing error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Payment processing failed',
      details: error.message
    });
  }
}
