import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import Header from '../components/Header';
import PuzzleDisplay from '../components/PuzzleDisplay';
import GuessForm from '../components/GuessForm';
import AttemptsList from '../components/AttemptsList';
import GameOverPanel from '../components/GameOverPanel';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';

const GamePage = () => {
  const { isLoading, error } = useGame();
  const navigate = useNavigate();
  const [hasStarted, setHasStarted] = useState(false);
  
  useEffect(() => {
    // Check if user came from the start page
    const gameStarted = sessionStorage.getItem('gameStarted');
    
    if (gameStarted === 'true') {
      setHasStarted(true);
    } else {
      navigate('/start');
    }
  }, [navigate]);

  if (!hasStarted) {
    return null; // Don't render anything while checking/redirecting
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
        <Header />
        <main className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <PuzzleDisplay />

            {!error && !isLoading && (
              <>
                <GuessForm />
                <AttemptsList />
                <GameOverPanel />
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default GamePage;