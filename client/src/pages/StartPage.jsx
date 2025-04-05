import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.webp';
import { getDeviceId } from '../utils/deviceUtils';
import { startAttempt } from '../services/apiService';
import { useGame } from '../context/GameContext';

const StartPage = () => {
  const { currentPuzzle, isLoading, error } = useGame();
  const navigate = useNavigate();

  const handleStartGame = async () => {
    try {
      // Only proceed if we have a puzzle
      if (!currentPuzzle || !currentPuzzle.id) {
        console.error('No puzzle available');
        sessionStorage.setItem('gameStarted', 'true');
        navigate('/');
        return;
      }

      const deviceId = getDeviceId();
      await startAttempt(deviceId, currentPuzzle.id);
      
      // Set flag that game has been started
      sessionStorage.setItem('gameStarted', 'true');
      navigate('/');
    } catch (error) {
      console.error('Error starting game:', error);
      // Still navigate to game even if API fails
      sessionStorage.setItem('gameStarted', 'true');
      navigate('/');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md w-full">
          <img src={logo} alt="Emojigma Logo" className="mx-auto mb-6 opacity-50" />
          <h1 className="text-3xl font-bold mb-4">Emojigma</h1>
          <p className="text-gray-600 mb-8">Loading today's puzzle...</p>
          <div className="animate-pulse bg-indigo-300 h-10 w-24 rounded-lg mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md w-full">
          <img src={logo} alt="Emojigma Logo" className="mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Emojigma</h1>
          <p className="text-red-600 mb-4">Oops! Something went wrong.</p>
          <p className="text-gray-600 mb-8">We couldn't load today's puzzle.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md w-full">
        <img src={logo} alt="Emojigma Logo" className="mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Emojigma</h1>
        <p className="text-gray-600 mb-8">Get 6 chances to guess the emoji sequence</p>
        <button
          onClick={handleStartGame}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          disabled={!currentPuzzle}
        >
          Play
        </button>
      </div>
    </div>
  );
};

export default StartPage;