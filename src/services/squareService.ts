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
    interval: 'year',    features: [
      '12 months full access',
      'Hourly global updates',
      'Mobile access',
      'No ads'
    ]
  }
];

export interface SquarePaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  error?: string;
}

interface PaymentData {
  sourceId: string | undefined;
  amountMoney: {
    amount: string;
    currency: string;
  };
  buyerEmailAddress: string;
  note: string;
  userId: string;
  verificationToken?: string;
}

export class SquareService {
  private static instance: SquareService;
  
  public static getInstance(): SquareService {
    if (!SquareService.instance) {
      SquareService.instance = new SquareService();
    }
    return SquareService.instance;
  }  async createPayment(planId: string, userEmail: string, userId?: string): Promise<SquarePaymentResult> {
    try {
      const plan = subscriptionPlans.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Plan not found');
      }

      // Check if Square Web Payments SDK is loaded
      if (!window.Square) {
        throw new Error('Square Web Payments SDK not loaded');
      }

      const payments = window.Square.payments(config.square.applicationId);
      
      const card = await payments.card();
      await card.attach('#card-container');      // Buyer verification is optional and may not be available in all Square SDK versions
      // For now, we'll proceed without it as it's not required for basic payments
      const tokenResult = await card.tokenize();
      if (tokenResult.status === 'OK') {
        // Send token to your backend for processing
        const paymentData: PaymentData = {
          sourceId: tokenResult.token,
          amountMoney: {
            amount: (plan.price * 100).toString(), // Convert to cents as string
            currency: plan.currency
          },
          buyerEmailAddress: userEmail,
          note: `World War 3 Update - ${plan.name}`,
          userId: userId || userEmail // Use actual Firebase UID if available
        };

        const response = await fetch('/api/payments/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentData),
        });

        const result = await response.json();
        
        if (result.success) {
          return {
            success: true,
            paymentId: result.paymentId,
            orderId: result.orderId
          };
        } else {
          throw new Error(result.error || 'Payment processing failed');
        }
      } else {
        const errors = tokenResult.errors || [];
        const errorMessage = errors.length > 0 ? errors[0].message : 'Card tokenization failed';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating Square payment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create payment'
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

  // Access token is now server-side only for security
  // Client-side only needs applicationId for Square Web SDK
  getEnvironment(): string {
    return config.square.environment || 'production';
  }
}

export const squareService = SquareService.getInstance();
