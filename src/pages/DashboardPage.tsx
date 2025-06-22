import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CountdownTimer } from '../components/CountdownTimer';
import { NewsUpdateDisplay } from '../components/NewsUpdateDisplay';
import { LogOut, Settings, RefreshCw, Globe } from 'lucide-react';
import { type NewsUpdate, newsService } from '../services/newsService';
import toast from 'react-hot-toast';

export const DashboardPage: React.FC = () => {  const [newsUpdate, setNewsUpdate] = useState<NewsUpdate | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [nextUpdateTime, setNextUpdateTime] = useState<number>(0);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const fetchLatestUpdate = async (showToast = false) => {
    try {
      setRefreshing(true);
      
      // Clear old content immediately when fetching new content
      setNewsUpdate(null);
      
      // Fetch real news update using Perplexity API
      const update = await newsService.generateNewsUpdate();
      setNewsUpdate(update);
      
      // Set next update time to the next hour
      const now = new Date();
      const nextHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0);
      setNextUpdateTime(nextHour.getTime());
      
      if (showToast) {
        toast.success('Latest update retrieved');
      }
    } catch (error) {
      console.error('Error fetching update:', error);
      // Keep newsUpdate as null if fetch fails - no fallback content
      setNewsUpdate(null);
      if (showToast) {
        toast.error('Failed to retrieve latest update');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    fetchLatestUpdate();
    
    // Set up automatic hourly fetching
    const checkForUpdate = () => {
      const now = new Date();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      
      // Trigger update at the top of each hour (0 minutes, 0 seconds)
      if (minutes === 0 && seconds === 0) {
        console.log('Automatic hourly update triggered');
        fetchLatestUpdate(true);
      }
    };
    
    // Check every second for the exact moment to update
    const intervalId = setInterval(checkForUpdate, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const handleRefresh = () => {
    fetchLatestUpdate(true);
  };
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header className="bg-white border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">          <div className="flex items-center justify-between h-16">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gray-800">WORLD WAR 3 UPDATE</h1>
              <p className="text-sm text-gray-600">STAY INFORMED WITH REGULAR UPDATES</p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 transition-colors disabled:opacity-50"
                style={{ color: 'var(--text-secondary)' }}
                title="Refresh Update"
              >
                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={() => navigate('/settings')}
                className="p-2 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </button>
              
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {currentUser?.email}
              </div>
              
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm py-2 px-4"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Countdown Timer at top */}        <div className="max-w-md mx-auto mb-8">
          <CountdownTimer nextUpdateTime={nextUpdateTime} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - News Update */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Latest Update
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--primary-brown)' }}></div>
                  <span className="text-sm font-medium" style={{ color: 'var(--primary-brown)' }}>LIVE</span>
                </div>
              </div>
              
              <NewsUpdateDisplay 
                newsUpdate={newsUpdate} 
                loading={loading}
              />            </div>
          </div>

          {/* Right Column - Status */}
          <div className="space-y-6">            
            {/* Current Status */}
            <div className="card">
              <div className="flex items-center mb-4">
                <Globe className="h-6 w-6 mr-2" style={{ color: 'var(--primary-brown)' }} />
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Current Status
                </h3>
              </div>
                <div className="text-center">
                <div className="text-2xl font-semibold mb-2" style={{ color: 'var(--primary-brown)' }}>
                  Alert
                </div>
                <div className="w-full rounded-full h-2 mb-4" style={{ backgroundColor: 'var(--border-color)' }}>
                  <div className="h-2 rounded-full" style={{ 
                    backgroundColor: 'var(--primary-brown)', 
                    width: '60%' 
                  }}></div>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Based on current global developments
                </p>
              </div>
            </div>

            {/* Service Status */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Service Status
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>News Feed</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-600 text-sm">Active</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Connection</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-600 text-sm">Secure</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Data Sync</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-600 text-sm">Updated</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Notifications</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-600 text-sm">Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <p className="text-xs italic" style={{ color: 'var(--text-secondary)' }}>
            The above story is meant to be informational but is not a substitute for lawful orders. If you need to talk to someone about the current political climate contact your local governing authorities.
          </p>
        </div>
      </main>
    </div>
  );
};
