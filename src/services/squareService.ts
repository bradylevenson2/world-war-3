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
      'Email notifications',
      'Mobile access',
      'No ads',
      'Cancel anytime'
    ]
  }
];

export interface SquarePaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  error?: string;
}

export class SquareService {
  private static instance: SquareService;
  
  public static getInstance(): SquareService {
    if (!SquareService.instance) {
      SquareService.instance = new SquareService();
    }
    return SquareService.instance;
  }

  async createPayment(planId: string, userEmail: string): Promise<SquarePaymentResult> {
    try {
      const plan = subscriptionPlans.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Plan not found');
      }

      // In a real implementation, this would call your backend API
      // which would then call Square's API to create a payment
      
      console.log('Creating Square payment for:', { 
        planId, 
        userEmail, 
        plan,
        amount: plan.price * 100, // Square uses cents
        currency: plan.currency
      });
      
      // For now, we'll simulate the response
      const mockResponse: SquarePaymentResult = {
        success: true,
        paymentId: `PAY_${Date.now()}`,
        orderId: `ORDER_${Date.now()}`
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return mockResponse;
    } catch (error) {
      console.error('Error creating Square payment:', error);
      return {
        success: false,
        error: 'Failed to create payment'
      };
    }
  }

  async handlePaymentSuccess(paymentId: string): Promise<boolean> {
    try {
      // In a real implementation, this would verify the payment with Square
      // and update your database with the subscription details
      
      console.log('Square payment successful:', paymentId);
      
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      console.error('Error handling Square payment success:', error);
      return false;
    }
  }

  getApplicationId(): string {
    return config.square.applicationId || '';
  }

  getAccessToken(): string {
    return config.square.accessToken || '';
  }

  getEnvironment(): string {
    return config.square.environment || 'production';
  }
}

export const squareService = SquareService.getInstance();
