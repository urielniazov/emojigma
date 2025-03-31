import React, { createContext, useState, useEffect, useContext } from 'react';
import { getTodaysPuzzle, recordGuess, markAsShared, fetchUserStreak } from '../services/apiService';
import { getDeviceId } from '../utils/deviceUtils';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const [currentPuzzle, setCurrentPuzzle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [guess, setGuess] = useState('');
    const [attempts, setAttempts] = useState([]);
    const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
    const [deviceId] = useState(() => getDeviceId());
    const [streak, setStreak] = useState(0);
    const [statsTimestamp, setStatsTimestamp] = useState(0);

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
                    const { attempts, gameStatus, streak } = JSON.parse(savedState);
                    setAttempts(attempts);
                    setGameStatus(gameStatus);
                    if (streak !== undefined) setStreak(streak);
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
                streak,  // Make sure streak is included here
            }));
        }
    }, [attempts, gameStatus, streak]); 

    const checkGuess = async () => {
        if (!guess.trim() || !currentPuzzle?.id) return;

        // Client-side validation first
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

        // Create new attempt for local state
        const newAttempt = { guess, status };
        const newAttempts = [...attempts, newAttempt];

        // Update local state
        setAttempts(newAttempts);
        setGuess('');

        if (status === 'correct') {
            setGameStatus('won');
            setStreak(prev => prev + 1);
        } else if (newAttempts.length >= 6) {
            // If they've made 6 attempts and still haven't won, they lose
            setGameStatus('lost');
        }

        // Record guess on the server - do this after updating local state
        // so the UI doesn't wait for the network request
        try {
            await recordGuess(deviceId, currentPuzzle.id, guess, status);

            // If correct, update streak from server
            if (isCorrect) {
                const { streak: streakData } = await fetchUserStreak(deviceId);
                setStreak(streakData.currentStreak);
                setStatsTimestamp(Date.now());
            }
        } catch (error) {
            console.error('Error saving guess to server:', error);
        }
    };

    const shareResults = async () => {
        const didSolve = gameStatus === 'won';

        const shareText = `Emojigma
${didSolve ? `I solved today's puzzle in ${attempts.length} tries!` : `I couldn't solve today's puzzle :(`}
${currentPuzzle?.emojis}
    
${attempts.map((a) =>
            a.status === 'correct' ? '✅' :
                a.status === 'partial' ? '🔄' :
                    '❌'
        ).join(' ')}

Do you think you can guess it?
Play at https://emojigma.vercel.app/`;

        let shared = false;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Emojigma Results',
                    text: shareText
                });
                shared = true;
            } catch (err) {
                if (err.name !== 'AbortError') {
                    // If user didn't cancel sharing
                    navigator.clipboard.writeText(shareText)
                        .then(() => {
                            alert('Results copied to clipboard!');
                            shared = true;
                        })
                        .catch(err => console.error('Failed to copy: ', err));
                }
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareText);
                alert('Results copied to clipboard!');
                shared = true;
            } catch (err) {
                console.error('Failed to copy: ', err);
            }
        }

        if (shared && currentPuzzle?.id) {
            try {
                await markAsShared(deviceId, currentPuzzle.id);
            } catch (error) {
                console.error('Error marking as shared:', error);
            }
        }
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
            shareResults,
            streak,
            statsTimestamp
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);