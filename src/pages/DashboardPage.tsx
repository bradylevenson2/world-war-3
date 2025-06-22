import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CountdownTimer } from '../components/CountdownTimer';
import { NewsUpdateDisplay } from '../components/NewsUpdateDisplay';
import { LogOut, Settings, RefreshCw, Globe } from 'lucide-react';
import { type NewsUpdate, newsService } from '../services/newsService';
import toast from 'react-hot-toast';

export const DashboardPage: React.FC = () => {
  const [newsUpdate, setNewsUpdate] = useState<NewsUpdate | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const fetchLatestUpdate = async (showToast = false) => {
    try {
      setRefreshing(true);
      
      // Fetch real news update using Perplexity API
      const update = await newsService.generateNewsUpdate();
      setNewsUpdate(update);
      
      if (showToast) {
        toast.success('Latest update retrieved');
      }
    } catch (error) {
      console.error('Error fetching update:', error);
      toast.error('Failed to retrieve latest update');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLatestUpdate();
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">            <div className="flex items-center space-x-3">
              <img 
                src="/logo.svg" 
                alt="Logo" 
                className="h-8 w-8 flex-shrink-0"
              />
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-gray-800">World War 3 Update</h1>
                <p className="text-sm text-gray-600">Stay informed with regular updates</p>
              </div>
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
        {/* Countdown Timer at top */}
        <div className="max-w-md mx-auto mb-8">
          <CountdownTimer />
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
              />
            </div>

            {/* Historical Updates */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Previous Updates
              </h3>
              <div className="space-y-3">
                {[
                  { time: '2 hours ago', title: 'Diplomatic discussions continue in neutral territories', level: 'low' },
                  { time: '4 hours ago', title: 'International organizations call for peaceful resolution', level: 'medium' },
                  { time: '6 hours ago', title: 'Economic markets show cautious optimism', level: 'low' },
                  { time: '8 hours ago', title: 'Multiple countries express commitment to dialogue', level: 'low' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex-1">
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.time}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      item.level === 'high' ? 'bg-orange-100 text-orange-700' :
                      item.level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {item.level}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
