import React, { createContext, useState, useEffect, useContext } from 'react';
import { getTodaysPuzzle } from '../services/apiService'; // Adjust the import path as necessary

const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const [currentPuzzle, setCurrentPuzzle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [guess, setGuess] = useState('');
    const [attempts, setAttempts] = useState([]);
    const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'

    // Get today's date in YYYY-MM-DD format for localStorage
    const getTodayString = () => {
        const today = new Date();
        return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    };

    // Load today's puzzle and previous progress
    useEffect(() => {
        const fetchPuzzle = async () => {
            try {
                setIsLoading(true);
                const puzzle = await getTodaysPuzzle();
                setCurrentPuzzle(puzzle);

                // Load saved state
                const todayString = getTodayString();
                const savedState = localStorage.getItem(`emojiCipher_${todayString}`);

                if (savedState) {
                    const { attempts, gameStatus } = JSON.parse(savedState);
                    setAttempts(attempts);
                    setGameStatus(gameStatus);
                }

                setIsLoading(false);
            } catch (err) {
                console.error('Failed to load puzzle:', err);
                setError('Failed to load today\'s puzzle. Please try again later.');
                setIsLoading(false);
            }
        };

        fetchPuzzle();
    }, []);

    // Save game state whenever it changes
    useEffect(() => {
        if (attempts.length > 0 || gameStatus !== 'playing') {
            localStorage.setItem(`emojiCipher_${getTodayString()}`, JSON.stringify({
                attempts,
                gameStatus,
            }));
        }
    }, [attempts, gameStatus]);

    // src/context/GameContext.js - update the checkGuess function
    const checkGuess = () => {
        if (!guess.trim() || !currentPuzzle?.answer) return;

        // Client-side validation against the answer provided by the backend
        const normalizedGuess = guess.trim().toLowerCase();
        const normalizedAnswer = currentPuzzle.answer.toLowerCase();

        // Determine if the guess is correct
        let status;
        let isCorrect = false;

        if (normalizedGuess === normalizedAnswer) {
            status = 'correct';
            isCorrect = true;
        } else if (
            normalizedAnswer.includes(normalizedGuess) ||
            normalizedGuess.includes(normalizedAnswer) ||
            // Check if at least half the words match
            normalizedGuess.split(' ').filter(word =>
                normalizedAnswer.split(' ').some(answerWord =>
                    answerWord.includes(word) || word.includes(answerWord)
                )
            ).length >= Math.ceil(normalizedAnswer.split(' ').length / 2)
        ) {
            status = 'partial';
        } else {
            status = 'incorrect';
        }

        // Create new attempt
        const newAttempt = { guess, status };
        const newAttempts = [...attempts, newAttempt];

        // Update state
        setAttempts(newAttempts);
        setGuess('');

        if (status === 'correct') {
            setGameStatus('won');
        } else if (newAttempts.length >= 6) {
            // If they've made 6 attempts and still haven't won, they lose
            setGameStatus('lost');
        }
    };

    const shareResults = () => {
        const didSolve = gameStatus === 'won';

        const shareText = `Emojigma
${didSolve ? `I solved today's puzzle in ${attempts.length} tries!` : `I couldn't solve today's puzzle :(`}
${currentPuzzle?.emojis}
    
${attempts.map((a) =>
        a.status === 'correct' ? '✅' :
            a.status === 'partial' ? '🔄' :
            '❌'
    ).join(' ')}
    
Play at emojigma.com`;

        navigator.clipboard.writeText(shareText)
            .then(() => alert('Results copied to clipboard!'))
            .catch(err => console.error('Failed to copy: ', err));
    };

    return (
        <GameContext.Provider value={{
            currentPuzzle,
            isLoading,
            error,
            guess,
            setGuess,
            attempts,
            gameStatus,
            checkGuess,
            shareResults
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);