import React from 'react';
import GamePage from './pages/GamePage';
import { GameProvider } from './context/GameContext';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <div>
      <GameProvider>
        <GamePage />
      </GameProvider>
      <Analytics />
    </div>
  );
}

export default App;