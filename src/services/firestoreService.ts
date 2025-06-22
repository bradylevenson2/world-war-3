import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { User } from 'firebase/auth';

export interface UserSubscription {
  userId: string;
  plan: string;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  startDate: Timestamp;
  expiresAt: Timestamp;
  paymentId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PaymentRecord {
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentId: string;
  subscriptionId?: string;
  timestamp: Timestamp;
}

class FirestoreService {
  private static instance: FirestoreService;

  static getInstance(): FirestoreService {
    if (!FirestoreService.instance) {
      FirestoreService.instance = new FirestoreService();
    }
    return FirestoreService.instance;
  }

  // Subscription Management
  async getSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const subscriptionRef = doc(db, 'subscriptions', userId);
      const subscriptionSnap = await getDoc(subscriptionRef);
      
      if (subscriptionSnap.exists()) {
        return subscriptionSnap.data() as UserSubscription;
      }
      return null;
    } catch (error) {
      console.error('Error getting subscription:', error);
      return null;
    }
  }

  async createSubscription(
    user: User, 
    plan: string, 
    paymentId: string
  ): Promise<boolean> {
    try {
      const now = Timestamp.now();
      const expirationDate = new Date();
      expirationDate.setFullYear(expirationDate.getFullYear() + 1); // 1 year from now
      
      const subscription: UserSubscription = {
        userId: user.uid,
        plan,
        status: 'active',
        startDate: now,
        expiresAt: Timestamp.fromDate(expirationDate),
        paymentId,
        createdAt: now,
        updatedAt: now
      };

      const subscriptionRef = doc(db, 'subscriptions', user.uid);
      await setDoc(subscriptionRef, subscription);
      
      return true;
    } catch (error) {
      console.error('Error creating subscription:', error);
      return false;
    }
  }

  async updateSubscriptionStatus(
    userId: string, 
    status: UserSubscription['status']
  ): Promise<boolean> {
    try {
      const subscriptionRef = doc(db, 'subscriptions', userId);
      await updateDoc(subscriptionRef, {
        status,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating subscription status:', error);
      return false;
    }
  }

  async isSubscriptionActive(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getSubscription(userId);
      if (!subscription) return false;
      
      const now = new Date();
      const expiresAt = subscription.expiresAt.toDate();
      
      return subscription.status === 'active' && expiresAt > now;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  }

  // Payment Management
  async createPaymentRecord(
    userId: string,
    amount: number,
    currency: string,
    paymentId: string,
    status: PaymentRecord['status'] = 'pending'
  ): Promise<boolean> {
    try {
      const payment: PaymentRecord = {
        userId,
        amount,
        currency,
        status,
        paymentId,
        timestamp: Timestamp.now()
      };

      const paymentRef = doc(db, 'payments', paymentId);
      await setDoc(paymentRef, payment);
      
      return true;
    } catch (error) {
      console.error('Error creating payment record:', error);
      return false;
    }
  }

  async updatePaymentStatus(
    paymentId: string, 
    status: PaymentRecord['status'],
    subscriptionId?: string
  ): Promise<boolean> {
    try {
      const paymentRef = doc(db, 'payments', paymentId);
      const updateData: any = { status };
      
      if (subscriptionId) {
        updateData.subscriptionId = subscriptionId;
      }
      
      await updateDoc(paymentRef, updateData);
      return true;
    } catch (error) {
      console.error('Error updating payment status:', error);
      return false;
    }
  }

  // User Profile Management
  async createUserProfile(user: User): Promise<boolean> {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        subscriptionStatus: 'none'
      };

      await setDoc(userRef, userProfile, { merge: true });
      return true;
    } catch (error) {
      console.error('Error creating user profile:', error);
      return false;
    }
  }

  async updateLastLogin(userId: string): Promise<boolean> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        lastLogin: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating last login:', error);
      return false;
    }
  }
}

export const firestoreService = FirestoreService.getInstance();
