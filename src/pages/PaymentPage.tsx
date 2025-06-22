import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Check, CreditCard, ArrowLeft } from 'lucide-react';
import { subscriptionPlans, squareService } from '../services/squareService';
import toast from 'react-hot-toast';

export const PaymentPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const userEmail = currentUser?.email || email;

  const handleSubscribe = async () => {
    if (!userEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    
    try {
      const result = await squareService.createPayment('annual_plan', userEmail);
      
      if (result.success) {
        toast.success('Payment complete! Welcome to World War 3 Update.');
        if (currentUser) {
          navigate('/dashboard');
        } else {
          toast.success('Please sign up to access your subscription.');
          navigate('/signup');
        }
      } else {
        toast.error(result.error || 'Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
        </button>

        {/* Header */}        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/logo.svg" 
              alt="World War 3 Update Logo" 
              className="h-6 w-6 mr-3" 
              style={{ filter: 'none' }}
            />
          </div>
          <h1 className="text-3xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Subscribe to World War 3 Updates
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Get unlimited access to critical global security updates for just $1.49/year
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
              </div>
            )}

            <button
              onClick={handleSubscribe}
              disabled={loading || (!currentUser && !email)}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Get 12 Month Access
                </div>
              )}
            </button>

            <div className="mt-4 text-center">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Secure payment via Square • Cancel anytime • 30-day money-back guarantee
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
