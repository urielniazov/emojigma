import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import GamePage from './pages/GamePage';
import StartPage from './pages/StartPage';
import { GameProvider } from './context/GameContext';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <Routes>
          <Route path="/start" element={<StartPage />} />
          <Route path="/" element={<GamePage />} />
          <Route path="*" element={<Navigate to="/start" replace />} />
        </Routes>
      </GameProvider>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;