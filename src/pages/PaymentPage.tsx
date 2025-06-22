import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { Check, ArrowLeft } from 'lucide-react';
import { subscriptionPlans } from '../services/squareService';
import { SquarePaymentForm } from '../components/SquarePaymentForm';
import { config } from '../config/env';
import toast from 'react-hot-toast';

export const PaymentPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const { currentUser } = useAuth();
  const { setSubscriptionActive } = useSubscription();
  const navigate = useNavigate();

  const userEmail = currentUser?.email || email;
  const handlePaymentSuccess = async (token: string) => {
    if (!userEmail) {
      toast.error('Please enter your email address');
      return;
    }    setLoading(true);
    
    try {
      // Simulate payment processing (replace with real backend call)
      console.log('Processing payment with token:', token);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Set subscription as active
      setSubscriptionActive();
      
      toast.success('Payment complete! Welcome to World War 3 Update.');
      
      if (currentUser) {
        navigate('/dashboard');
      } else {
        toast.success('Please sign up to access your subscription.');
        navigate('/signup');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center mb-8 text-sm transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </button>        {/* Header */}        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            SUBSCRIBE TO WORLD WAR 3 UPDATE
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            GET UNLIMITED ACCESS TO CRITICAL GLOBAL SECURITY UPDATES FOR JUST $1.49/YEAR
          </p>
        </div>

        {/* Simple Pricing */}
        <div className="max-w-md mx-auto mb-12">
          <div className="card text-center">
            <div className="mb-6">
              <div className="text-4xl font-bold mb-2" style={{ color: 'var(--primary-brown)' }}>
                $1.49
              </div>
              <div className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                12 Month Access
              </div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Just $0.12 per month
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {subscriptionPlans[0].features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Check className="h-4 w-4 mr-3 flex-shrink-0" style={{ color: '#16A34A' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                </div>
              ))}
            </div>

            {/* Email Input for Non-authenticated Users */}
            {!currentUser && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"                  style={{ 
                    borderColor: 'var(--border-color)',
                    backgroundColor: 'var(--card-background)',
                    color: 'var(--text-primary)'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary-brown)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                />
              </div>            )}            {/* Square Payment Form */}
            {config.square.applicationId ? (
              <SquarePaymentForm
                key="square-payment-form" 
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                loading={loading}
              />
            ) : (
              /* Test Payment Button for Development */
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Development Mode:</strong> Square credentials not configured. Using test payment.
                  </p>
                </div>
                <button
                  onClick={() => handlePaymentSuccess('test_token_12345')}
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing Test Payment...
                    </div>
                  ) : (
                    'Test Payment - $1.49 (Development)'
                  )}
                </button>
              </div>
            )}

            <div className="mt-4 text-center">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Secure payment via Square
              </p>
            </div>

            {!currentUser && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Already have an account?{' '}
                  <button
                    onClick={() => navigate('/login')}
                    className="text-sm font-medium underline"
                    style={{ color: 'var(--primary-brown)' }}
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
