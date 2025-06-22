import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { firestoreService } from '../services/firestoreService';

interface SubscriptionContextType {
  hasActiveSubscription: boolean;
  subscriptionStatus: 'none' | 'active' | 'expired';
  setSubscriptionActive: () => void;
  loading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType>({} as SubscriptionContextType);

export const useSubscription = () => {
  return useContext(SubscriptionContext);
};

interface SubscriptionProviderProps {
  children: React.ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'none' | 'active' | 'expired'>('none');
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!currentUser) {
        setHasActiveSubscription(false);
        setSubscriptionStatus('none');
        setLoading(false);
        return;
      }

      try {
        // Check Firestore for subscription status
        const isActive = await firestoreService.isSubscriptionActive(currentUser.uid);
        const subscription = await firestoreService.getSubscription(currentUser.uid);
        
        setHasActiveSubscription(isActive);
        
        if (!subscription) {
          setSubscriptionStatus('none');
        } else if (isActive) {
          setSubscriptionStatus('active');
        } else {
          setSubscriptionStatus('expired');
        }
      } catch (error) {
        console.error('Error checking subscription status:', error);
        // Fallback to localStorage if Firestore fails
        const subscriptionData = localStorage.getItem(`subscription_${currentUser.uid}`);
        
        if (subscriptionData) {
          const data = JSON.parse(subscriptionData);
          const isActive = new Date(data.expiresAt) > new Date();
          setHasActiveSubscription(isActive);
          setSubscriptionStatus(isActive ? 'active' : 'expired');
        } else {
          setHasActiveSubscription(false);
          setSubscriptionStatus('none');
        }
      }
      
      setLoading(false);
    };

    checkSubscriptionStatus();
  }, [currentUser]);

  const setSubscriptionActive = async () => {
    if (currentUser) {
      try {
        // Try to create subscription in Firestore
        const success = await firestoreService.createSubscription(
          currentUser, 
          'annual_plan', 
          `payment_${Date.now()}`
        );
        
        if (success) {
          setHasActiveSubscription(true);
          setSubscriptionStatus('active');
        } else {
          throw new Error('Failed to create subscription in Firestore');
        }
      } catch (error) {
        console.error('Error creating subscription:', error);
        // Fallback to localStorage
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        
        const subscriptionData = {
          userId: currentUser.uid,
          plan: 'annual',
          startDate: new Date().toISOString(),
          expiresAt: expirationDate.toISOString(),
          status: 'active'
        };
        
        localStorage.setItem(`subscription_${currentUser.uid}`, JSON.stringify(subscriptionData));
        setHasActiveSubscription(true);
        setSubscriptionStatus('active');
      }
    }
  };

  const value = {
    hasActiveSubscription,
    subscriptionStatus,
    setSubscriptionActive,
    loading
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
