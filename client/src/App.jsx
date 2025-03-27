import React from 'react';
import GamePage from './pages/GamePage';
import { GameProvider } from './context/GameContext';

function App() {
  return (
    <GameProvider>
      <GamePage />
    </GameProvider>
  );
}

export default App;