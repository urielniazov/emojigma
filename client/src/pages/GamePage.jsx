import React from 'react';
import Header from '../components/Header';
import PuzzleDisplay from '../components/PuzzleDisplay';
import GuessForm from '../components/GuessForm';
import AttemptsList from '../components/AttemptsList';
import GameOverPanel from '../components/GameOverPanel';
import InstructionsPanel from '../components/InstructionsPanel';

const GamePage = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
      <Header />
      <main className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <PuzzleDisplay />
          <GuessForm />
          <AttemptsList />
          <GameOverPanel />
        </div>
        <InstructionsPanel />
      </main>
    </div>
  );
};

export default GamePage;