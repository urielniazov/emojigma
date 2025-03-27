import React from 'react';
import { useGame } from '../context/GameContext';

const GameOverPanel = () => {
  const { gameStatus, attempts, streak, currentPuzzle, shareResults } = useGame();
  
  if (gameStatus === 'playing') {
    return null;
  }
  
  return (
    <div className="mb-4 text-center">
      {gameStatus === 'won' ? (
        <div className="bg-green-100 p-4 rounded-md text-green-800 mb-4">
          <h3 className="text-lg font-bold">Congratulations! 🎉</h3>
          <p>You solved it in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!</p>
          <p className="text-sm mt-2">Current streak: {streak}</p>
        </div>
      ) : (
        <div className="bg-red-100 p-4 rounded-md text-red-800 mb-4 border border-red-500">
          <h3 className="text-lg font-bold">Better luck next time!</h3>
          <p>The answer was: <strong>{currentPuzzle.answer}</strong></p>
        </div>
      )}
      
      <div className="flex space-x-2 justify-center">
        <button 
          onClick={shareResults}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Share Results
        </button>
      </div>
    </div>
  );
};

export default GameOverPanel;