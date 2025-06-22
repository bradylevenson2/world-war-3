import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  nextUpdateTime?: number;
  className?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  nextUpdateTime, 
  className = '' 
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      // If no next update time provided, calculate next hour
      const now = new Date();
      const target = nextUpdateTime 
        ? new Date(nextUpdateTime) 
        : new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0);
      
      const difference = target.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
        setIsUrgent(difference < 5 * 60 * 1000); // Urgent when less than 5 minutes
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        setIsUrgent(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [nextUpdateTime]);

  const formatTime = (value: number): string => {
    return value.toString().padStart(2, '0');
  };
  return (
    <div className={`card ${className}`}>
      <div className="flex items-center justify-center mb-4">
        <Clock className={`h-6 w-6 mr-2 ${isUrgent ? 'animate-pulse' : ''}`} style={{ color: isUrgent ? '#dc2626' : 'var(--primary-brown)' }} />
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          Next Update
        </h3>
      </div>
      
      <div className="flex justify-center space-x-4">
        <div className="text-center">
          <div 
            className={`text-3xl font-bold ${isUrgent ? 'animate-pulse' : ''}`}
            style={{ color: isUrgent ? '#dc2626' : 'var(--primary-brown)' }}
          >
            {formatTime(timeLeft.hours)}
          </div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Hours</div>
        </div>
        
        <div className="flex items-center">
          <span 
            className="text-3xl font-bold"
            style={{ color: isUrgent ? '#dc2626' : 'var(--text-secondary)' }}
          >:</span>
        </div>
        
        <div className="text-center">
          <div 
            className={`text-3xl font-bold ${isUrgent ? 'animate-pulse' : ''}`}
            style={{ color: isUrgent ? '#dc2626' : 'var(--primary-brown)' }}
          >
            {formatTime(timeLeft.minutes)}
          </div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Minutes</div>
        </div>
        
        <div className="flex items-center">
          <span 
            className="text-3xl font-bold"
            style={{ color: isUrgent ? '#dc2626' : 'var(--text-secondary)' }}
          >:</span>
        </div>
        
        <div className="text-center">
          <div 
            className={`text-3xl font-bold ${isUrgent ? 'animate-pulse' : ''}`}
            style={{ color: isUrgent ? '#dc2626' : 'var(--primary-brown)' }}
          >
            {formatTime(timeLeft.seconds)}
          </div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Seconds</div>
        </div>
      </div>

      {isUrgent && (
        <div className="mt-4 flex items-center justify-center text-red-600">
          <Clock className="h-4 w-4 mr-2 animate-pulse" />
          <span className="text-sm font-medium">Update due soon</span>
        </div>
      )}
    </div>
  );
};
