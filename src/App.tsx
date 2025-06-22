import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { PaymentPage } from './pages/PaymentPage';
import { DashboardPage } from './pages/DashboardPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

// Public Route Component (redirect if logged in to specific routes)
const PublicRoute: React.FC<{ children: React.ReactNode; redirectToDashboard?: boolean }> = ({ 
  children, 
  redirectToDashboard = false 
}) => {
  const { currentUser } = useAuth();
  if (currentUser && redirectToDashboard) {
    return <Navigate to="/dashboard" />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <HomePage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/login" 
              element={
                <PublicRoute redirectToDashboard={true}>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicRoute redirectToDashboard={true}>
                  <SignupPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/payment" 
              element={
                <PublicRoute>
                  <PaymentPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'white',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
              },
              success: {
                iconTheme: {
                  primary: 'var(--primary-brown)',
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: '#dc2626',
                  secondary: 'white',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
