import React from 'react';
import { Clock, ExternalLink, Lock, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';
import type { NewsUpdate } from '../services/newsService';
import { formatDistanceToNow } from 'date-fns';

interface NewsUpdateDisplayProps {
  newsUpdate: NewsUpdate | null;
  loading?: boolean;
  className?: string;
}

export const NewsUpdateDisplay: React.FC<NewsUpdateDisplayProps> = ({ 
  newsUpdate, 
  loading = false,
  className = '' 
}) => {
  const { currentUser } = useAuth();
  const { hasActiveSubscription } = useSubscription();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className={`card ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 rounded mr-3" style={{ backgroundColor: 'var(--border-color)' }}></div>
            <div className="h-6 rounded w-1/3" style={{ backgroundColor: 'var(--border-color)' }}></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 rounded w-full" style={{ backgroundColor: 'var(--border-color)' }}></div>
            <div className="h-4 rounded w-full" style={{ backgroundColor: 'var(--border-color)' }}></div>
            <div className="h-4 rounded w-3/4" style={{ backgroundColor: 'var(--border-color)' }}></div>
          </div>
          <div className="mt-4 h-4 rounded w-1/4" style={{ backgroundColor: 'var(--border-color)' }}></div>
        </div>
      </div>
    );
  }
  if (!newsUpdate) {
    return (
      <div className={`card ${className}`}>
        <div className="text-center py-8">
          <Clock className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>NO UPDATES AVAILABLE</h3>
          <p style={{ color: 'var(--text-secondary)' }}>AWAITING LATEST INTELLIGENCE BRIEFING</p>
        </div>
      </div>
    );
  }  // Determine if user has access to full content
  const hasFullAccess = currentUser && hasActiveSubscription;

  return (
    <div className={`card ${className}`}>      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {formatDistanceToNow(new Date(newsUpdate.timestamp), { addSuffix: true })}
        </div>
      </div>      {/* Title */}
      <h2 className="text-xl font-semibold mb-4 leading-tight uppercase" style={{ color: 'var(--text-primary)' }}>
        {newsUpdate.title}
      </h2>      {/* Summary with paywall logic */}
      <div className="prose prose-sm max-w-none relative">
        {hasFullAccess ? (
          <p className="leading-relaxed whitespace-pre-line uppercase" style={{ color: 'var(--text-primary)' }}>
            {newsUpdate.summary}
          </p>
        ) : (
          /* Paywall for non-authenticated users */
          <div className="p-6 border-2 border-dashed rounded-lg text-center" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-background)' }}>
            <Lock className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--primary-brown)' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              SUBSCRIBE TO READ
            </h3>
            <p className="mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
              GET THE FULL WORLD WAR 3 UPDATE WITH CRITICAL ANALYSIS AND INSIGHTS
            </p>
            
            <div className="space-y-2">
              <button
                onClick={() => navigate('/payment')}
                className="w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                style={{ 
                  backgroundColor: 'var(--primary-brown)',
                  color: 'white'
                }}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Subscribe - $1.49 for 12 months
              </button>
              
              <button
                onClick={() => navigate('/login')}
                className="w-full px-4 py-2 rounded-lg font-medium transition-colors border"
                style={{ 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                  backgroundColor: 'transparent'
                }}
              >
                Already subscribed? Sign in
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sources - only show to authenticated users */}
      {hasFullAccess && newsUpdate.sources && newsUpdate.sources.length > 0 && (
        <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center mb-2">
            <ExternalLink className="h-4 w-4 mr-2" style={{ color: 'var(--text-secondary)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Sources
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {newsUpdate.sources.slice(0, 3).map((source, index) => (
              <span 
                key={index}
                className="px-2 py-1 text-xs rounded"
                style={{ 
                  backgroundColor: 'var(--border-color)', 
                  color: 'var(--text-primary)' 
                }}
              >
                {source}
              </span>
            ))}
            {newsUpdate.sources.length > 3 && (
              <span 
                className="px-2 py-1 text-xs rounded"
                style={{ 
                  backgroundColor: 'var(--border-color)', 
                  color: 'var(--text-secondary)' 
                }}
              >
                +{newsUpdate.sources.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Metadata - only show to authenticated users */}
      {hasFullAccess && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span>Update ID: {newsUpdate.id}</span>
            <span>Last updated: {formatDistanceToNow(new Date(newsUpdate.timestamp), { addSuffix: true })}</span>
          </div>
        </div>
      )}
    </div>
  );
};
