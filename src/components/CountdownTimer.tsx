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
  };  return (
    <div className={`card ${className}`}>
      <div className="flex items-center justify-center mb-8">
        <Clock className={`h-16 w-16 mr-4 ${isUrgent ? 'animate-pulse' : ''}`} style={{ color: '#dc2626' }} />
        <h3 className="text-5xl font-bold text-red-600">
          NEXT UPDATE IN
        </h3>
      </div>
        <div className="flex justify-center space-x-6">
        <div className="text-center">
          <div 
            className={`font-black ${isUrgent ? 'animate-pulse' : ''}`}
            style={{ 
              color: '#dc2626', 
              textShadow: '4px 4px 8px rgba(0,0,0,0.5)',
              fontSize: '16rem',
              lineHeight: '1'
            }}
          >
            {formatTime(timeLeft.hours)}
          </div>
          <div className="text-3xl font-bold text-red-500 mt-3">HOURS</div>
        </div>
        
        <div className="flex items-center">
          <span 
            className="font-black"
            style={{ 
              color: '#dc2626',
              fontSize: '16rem',
              lineHeight: '1'
            }}
          >:</span>
        </div>
        
        <div className="text-center">
          <div 
            className={`font-black ${isUrgent ? 'animate-pulse' : ''}`}
            style={{ 
              color: '#dc2626', 
              textShadow: '4px 4px 8px rgba(0,0,0,0.5)',
              fontSize: '16rem',
              lineHeight: '1'
            }}
          >
            {formatTime(timeLeft.minutes)}
          </div>
          <div className="text-3xl font-bold text-red-500 mt-3">MINUTES</div>
        </div>
        
        <div className="flex items-center">
          <span 
            className="font-black"
            style={{ 
              color: '#dc2626',
              fontSize: '16rem',
              lineHeight: '1'
            }}
          >:</span>
        </div>
        
        <div className="text-center">
          <div 
            className={`font-black ${isUrgent ? 'animate-pulse' : ''}`}
            style={{ 
              color: '#dc2626', 
              textShadow: '4px 4px 8px rgba(0,0,0,0.5)',
              fontSize: '16rem',
              lineHeight: '1'
            }}
          >
            {formatTime(timeLeft.seconds)}
          </div>
          <div className="text-3xl font-bold text-red-500 mt-3">SECONDS</div>
        </div>
      </div>

      {isUrgent && (
        <div className="mt-8 flex items-center justify-center text-red-600">
          <Clock className="h-12 w-12 mr-4 animate-pulse" />
          <span className="text-4xl font-bold animate-pulse">⚠️ UPDATE IMMINENT ⚠️</span>
        </div>
      )}
    </div>
  );
};
