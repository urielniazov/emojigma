import React from 'react';
import { useGame } from '../context/GameContext';
import { splitEmojiString } from '../utils/emojiUtils';

const PuzzleDisplay = () => {
  const { currentPuzzle, isLoading, error } = useGame();
  
  if (isLoading) {
    return (
      <div className="text-center mb-4">
        <div className="flex justify-center my-6">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
        </div>
        <p className="text-gray-600">Loading today's puzzle...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center mb-4">
        <div className="bg-red-100 p-4 rounded-md text-red-800">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  if (!currentPuzzle || !currentPuzzle.emojis) {
    return (
      <div className="text-center mb-4">
        <p className="text-gray-600">No puzzle available</p>
      </div>
    );
  }
  
  // Only proceed with splitting emojis if we have a valid puzzle
  const emojis = splitEmojiString(currentPuzzle.emojis);
  
  return (
    <div className="text-center mb-4">
      <div className="flex justify-center space-x-2 text-4xl my-6">
        {emojis.map((emoji, index) => (
          <div 
            key={index} 
            className="inline-block emoji-bounce" 
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {emoji}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PuzzleDisplay;