import React, { useState, useEffect } from 'react';

const NextPuzzleCountdown = () => {
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const totalSeconds = Math.floor((tomorrow - now) / 1000);
      
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      setTimeRemaining({ hours, minutes, seconds });
    };
    
    // Calculate immediately on mount
    calculateTimeRemaining();
    
    // Set up interval for countdown
    const intervalId = setInterval(calculateTimeRemaining, 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className="mt-6 text-center">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Next Puzzle In</h3>
      <div className="flex justify-center space-x-4 text-xl">
        <div className="flex flex-col items-center">
          <span className="font-bold">{timeRemaining.hours.toString().padStart(2, '0')}</span>
          <span className="text-xs text-gray-500">hours</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold">{timeRemaining.minutes.toString().padStart(2, '0')}</span>
          <span className="text-xs text-gray-500">minutes</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold">{timeRemaining.seconds.toString().padStart(2, '0')}</span>
          <span className="text-xs text-gray-500">seconds</span>
        </div>
      </div>
    </div>
  );
};

export default NextPuzzleCountdown;