import React, { useEffect, useRef, useState } from 'react';
import { config } from '../config/env';

interface SquarePaymentFormProps {
  onPaymentSuccess: (token: string) => void;
  onPaymentError: (error: string) => void;
  loading: boolean;
}

export const SquarePaymentForm: React.FC<SquarePaymentFormProps> = ({
  onPaymentSuccess,
  onPaymentError,
  loading
}) => {  const cardRef = useRef<HTMLDivElement>(null);
  const [card, setCard] = useState<any>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (initialized) return;

    const initializeSquare = async () => {
      if (!window.Square) {
        onPaymentError('Square payment system not loaded');
        return;
      }

      if (!config.square.applicationId) {
        onPaymentError('Square configuration missing');
        return;
      }

      try {
        // Clear any existing card container content
        const container = document.getElementById('card-container');
        if (container) {
          container.innerHTML = '';
        }

        // Location ID is optional for many Square implementations
        const payments = window.Square.payments(config.square.applicationId);
        const cardInstance = await payments.card();
        
        if (cardRef.current && !initialized) {
          await cardInstance.attach('#card-container');
          setCard(cardInstance);
          setInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing Square:', error);
        onPaymentError('Failed to initialize payment form');
      }
    };

    initializeSquare();

    // Cleanup function
    return () => {
      if (card) {
        try {
          card.destroy();
        } catch (error) {
          console.error('Error destroying card:', error);
        }
      }
    };
  }, []); // Empty dependency array to run only once

  const handlePayment = async () => {
    if (!card) {
      onPaymentError('Payment form not ready');
      return;
    }

    setPaymentLoading(true);

    try {
      const tokenResult = await card.tokenize();
      
      if (tokenResult.status === 'OK' && tokenResult.token) {
        onPaymentSuccess(tokenResult.token);
      } else {
        const errorMessage = tokenResult.errors?.[0]?.message || 'Payment failed';
        onPaymentError(errorMessage);
      }
    } catch (error) {
      console.error('Payment error:', error);
      onPaymentError('Payment processing failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        id="card-container" 
        ref={cardRef}
        className="border rounded-lg p-4"
        style={{ borderColor: 'var(--border-color)', minHeight: '100px' }}
      />
      
      <button
        onClick={handlePayment}
        disabled={loading || paymentLoading || !card}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {paymentLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing Payment...
          </div>
        ) : (
          'Complete Payment - $1.49'
        )}
      </button>
    </div>
  );
};
