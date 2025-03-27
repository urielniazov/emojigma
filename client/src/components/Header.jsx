import React from 'react';
import { Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';

const Header = () => {
  const { currentPuzzle } = useGame();
  
  // Get formatted date
  const today = new Date();
  const month = today.toLocaleString('default', { month: 'long' });
  const day = today.getDate();
  const year = today.getFullYear();
  
  return (
    <header className="text-center mb-8 w-full">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
        Emojigma <Sparkles className="text-yellow-500" />
      </h1>
      <p className="text-gray-600">Decode the emoji sequence!</p>
      <div className="mt-2 text-sm bg-blue-100 text-blue-800 py-1 px-3 rounded-full inline-block">
        {currentPuzzle.category} - {month} {day}, {year}
      </div>
    </header>
  );
};

export default Header;