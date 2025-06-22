import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CountdownTimer } from '../components/CountdownTimer';
import { NewsUpdateDisplay } from '../components/NewsUpdateDisplay';
import { Globe, LogIn, UserPlus, RefreshCw } from 'lucide-react';
import { type NewsUpdate, newsService } from '../services/newsService';
import toast from 'react-hot-toast';

export const HomePage: React.FC = () => {  const [newsUpdate, setNewsUpdate] = useState<NewsUpdate | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [nextUpdateTime, setNextUpdateTime] = useState<number>(0);
  const navigate = useNavigate();  const fetchLatestUpdate = async (showToast = false) => {
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
                onClick={() => navigate('/login')}
                className="btn-secondary text-sm py-2 px-4"
                title="Sign In"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </button>
              
              <button
                onClick={() => navigate('/signup')}
                className="btn-primary text-sm py-2 px-4"
                title="Sign Up"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
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
          {/* Left Column - News Update with Paywall */}
          <div className="lg:col-span-2">
            <div className="mb-6">              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  LATEST WORLD WAR 3 UPDATE
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--primary-brown)' }}></div>
                  <span className="text-sm font-medium" style={{ color: 'var(--primary-brown)' }}>LIVE</span>
                </div>
              </div>
              
              <NewsUpdateDisplay 
                newsUpdate={newsUpdate} 
                loading={loading}
              />
            </div>
          </div>          {/* Right Column - Status Only */}
          <div className="space-y-6">            
            {/* Current Status */}
            <div className="card">              <div className="flex items-center mb-4">
                <Globe className="h-6 w-6 mr-2" style={{ color: 'var(--primary-brown)' }} />
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  GLOBAL STATUS
                </h3>
              </div>
                <div className="text-center">
                <div className="text-2xl font-semibold mb-2" style={{ color: 'var(--primary-brown)' }}>
                  {newsUpdate?.urgencyLevel === 'critical' ? 'CRITICAL' :
                   newsUpdate?.urgencyLevel === 'high' ? 'HIGH ALERT' :
                   newsUpdate?.urgencyLevel === 'medium' ? 'ALERT' : 'STABLE'}
                </div>
                <div className="w-full rounded-full h-2 mb-4" style={{ backgroundColor: 'var(--border-color)' }}>
                  <div className="h-2 rounded-full" style={{ 
                    backgroundColor: newsUpdate?.urgencyLevel === 'critical' ? '#dc2626' :
                                   newsUpdate?.urgencyLevel === 'high' ? '#ea580c' :
                                   newsUpdate?.urgencyLevel === 'medium' ? '#d97706' : 'var(--primary-brown)', 
                    width: newsUpdate?.urgencyLevel === 'critical' ? '90%' :
                           newsUpdate?.urgencyLevel === 'high' ? '75%' :
                           newsUpdate?.urgencyLevel === 'medium' ? '60%' : '40%'
                  }}></div>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  BASED ON CURRENT GLOBAL DEVELOPMENTS
                </p>
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
