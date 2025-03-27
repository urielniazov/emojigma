import React from 'react';
import { useGame } from '../context/GameContext';

const AttemptsList = () => {
  const { attempts } = useGame();
  
  // Get the appropriate feedback style based on status
  const getFeedbackStyle = (status) => {
    switch(status) {
      case 'correct':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'partial':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'incorrect':
        return 'bg-red-100 border-red-500 text-red-800';
      default:
        return '';
    }
  };
  
  // Get feedback icon
  const getFeedbackIcon = (status) => {
    switch(status) {
      case 'correct':
        return '✅';
      case 'partial':
        return '🔄';
      case 'incorrect':
        return '❌';
      default:
        return '';
    }
  };
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Your Attempts ({attempts.length}/6)</h3>
      {attempts.length > 0 ? (
        <ul className="space-y-2 mb-4">
          {attempts.map((attempt, index) => (
            <li 
              key={index}
              className={`border rounded-md p-2 flex justify-between items-center ${getFeedbackStyle(attempt.status)}`}
            >
              <span>{attempt.guess}</span>
              <span>{getFeedbackIcon(attempt.status)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm italic">No attempts yet. Make your first guess!</p>
      )}
    </div>
  );
};

export default AttemptsList;