import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.webp';

const StartPage = () => {
  const navigate = useNavigate();

  const handleStartGame = () => {
    // Set flag that game has been started
    sessionStorage.setItem('gameStarted', 'true');
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md w-full">
        <img src={logo} alt="Emojigma Logo" className="mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Emojigma</h1>
        <p className="text-gray-600 mb-8">Get 6 chances to guess the emoji sequence</p>
        <button
          onClick={handleStartGame}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Play
        </button>
      </div>
    </div>
  );
};

export default StartPage;