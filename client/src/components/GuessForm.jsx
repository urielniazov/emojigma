import React from 'react';
import { useGame } from '../context/GameContext';

const GuessForm = () => {
  const { 
    guess, 
    setGuess, 
    checkGuess, 
    gameStatus,
  } = useGame();
  
  if (gameStatus !== 'playing') {
    return null;
  }
  
  return (
    <div className="mb-4">
      <div className="flex">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && checkGuess()}
          placeholder="Enter your guess..."
          className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={checkGuess}
          className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 transition-colors"
        >
          Guess
        </button>
      </div>
    </div>
  );
};

export default GuessForm;