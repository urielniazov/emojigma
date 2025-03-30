import React from 'react';
import { useGame } from '../context/GameContext';
import  NextPuzzleCountdown from './NextPuzzleCountdown';

const GameOverPanel = () => {
  const { gameStatus, attempts, currentPuzzle, shareResults } = useGame();

  if (gameStatus === 'playing' || !currentPuzzle) {
    return null;
  }

  return (
    <div className="mb-4 text-center">
      {gameStatus === 'won' ? (
        <div className="bg-green-100 p-4 rounded-md text-green-800 mb-4 celebration">
          <h3 className="text-lg font-bold">Congratulations! 🎉</h3>
          <p>You solved it in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!</p>
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

      <NextPuzzleCountdown />
    </div>
  );
};

export default GameOverPanel;