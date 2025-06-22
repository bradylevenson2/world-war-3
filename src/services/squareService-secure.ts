import axios from 'axios';
import { config } from '../config/env';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'annual_plan',
    name: '12 Month Access',
    price: 1.49,
    currency: 'USD',
    interval: 'year',
    features: [
      '12 months full access',
      'Hourly global updates',
      'Critical security alerts',
      'Expert intelligence analysis',
      'Mobile access',
      'Threat assessment reports'
    ]
  }
];

class SquareService {
  async initializeSquarePayments() {
    if (!window.Square) {
      throw new Error('Square payments not loaded');
    }

    // Only use the APPLICATION_ID on client side (safe)
    const payments = window.Square.payments(config.square.applicationId);
    return payments;
  }

  async processPayment(planId: string, userId: string, userEmail: string, cardToken: string) {
    try {
      // Call our secure API endpoint for payment processing
      const response = await axios.post('/api/payments/process', {
        planId,
        userId,
        userEmail,
        cardToken
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data;

    } catch (error: any) {
      console.error('Payment processing error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Payment processing failed');
    }
  }

  async createPaymentForm(containerId: string) {
    try {
      const payments = await this.initializeSquarePayments();
      const card = await payments.card();
      await card.attach(`#${containerId}`);
      return card;
    } catch (error) {
      console.error('Error creating payment form:', error);
      throw error;
    }
  }

  async tokenizeCard(card: any) {
    try {
      const tokenResult = await card.tokenize();
      if (tokenResult.status === 'OK') {
        return tokenResult.token;
      } else {
        throw new Error(tokenResult.errors?.[0]?.message || 'Tokenization failed');
      }
    } catch (error) {
      console.error('Error tokenizing card:', error);
      throw error;
    }
  }

  getPlan(planId: string): SubscriptionPlan | undefined {
    return subscriptionPlans.find(plan => plan.id === planId);
  }

  getAllPlans(): SubscriptionPlan[] {
    return subscriptionPlans;
  }
}

export const squareService = new SquareService();
