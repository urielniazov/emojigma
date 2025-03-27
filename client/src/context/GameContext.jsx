import React, { createContext, useState, useEffect, useContext } from 'react';

const GameContext = createContext();

// Sample puzzles
const puzzles = [
  { emojis: '🎩🕰️🐇🎭✨', answer: 'Alice in Wonderland', category: 'Movies' },
  { emojis: '💍🌋👁️🧙‍♂️🗡️', answer: 'Lord of the Rings', category: 'Movies' },
  { emojis: '🌊🚢❄️💔🎻', answer: 'Titanic', category: 'Movies' },
  { emojis: '👠👠🌈🧙‍♀️🌪️', answer: 'Wizard of Oz', category: 'Movies' },
  { emojis: '🧠💭🔍😴🏙️', answer: 'Inception', category: 'Movies' },
  { emojis: '🐱👑🦁🌍🐘', answer: 'Lion King', category: 'Movies' },
];

export const GameProvider = ({ children }) => {
  const [currentPuzzle, setCurrentPuzzle] = useState({
    emojis: '🎩🕰️🐇🎭✨',
    answer: 'Alice in Wonderland',
    category: 'Movies'
  });
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  
  // Get today's date in YYYY-MM-DD format for seeding the random puzzle
  const getTodayString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  };
  
  // Select a puzzle based on the date (same puzzle for everyone on the same day)
  useEffect(() => {
    const todayString = getTodayString();
    const dateHash = Array.from(todayString).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const puzzleIndex = dateHash % puzzles.length;
    setCurrentPuzzle(puzzles[puzzleIndex]);
    
    // Load saved state
    const savedState = localStorage.getItem(`emojiCipher_${todayString}`);
    if (savedState) {
      const { attempts, gameStatus, streak, hintUsed } = JSON.parse(savedState);
      setAttempts(attempts);
      setGameStatus(gameStatus);
      setStreak(streak);
      setHintUsed(hintUsed);
    }
  }, []);
  
  // Save game state whenever it changes
  useEffect(() => {
    if (attempts.length > 0 || gameStatus !== 'playing' || hintUsed) {
      localStorage.setItem(`emojiCipher_${getTodayString()}`, JSON.stringify({
        attempts,
        gameStatus,
        streak,
        hintUsed
      }));
    }
  }, [attempts, gameStatus, streak, hintUsed]);
  
  const checkGuess = () => {
    if (!guess.trim()) return;
    
    const normalizedGuess = guess.trim().toLowerCase();
    const normalizedAnswer = currentPuzzle.answer.toLowerCase();
    
    let status;
    if (normalizedGuess === normalizedAnswer) {
      status = 'correct';
      setGameStatus('won');
      setStreak(prev => prev + 1);
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
    
    setAttempts([...attempts, { guess, status }]);
    setGuess('');
    
    // If they've made 6 attempts and still haven't won, they lose
    if (attempts.length >= 5 && status !== 'correct') {
      setGameStatus('lost');
    }
  };
  
  const handleHint = () => {
    setShowHint(true);
    setHintUsed(true);
  };
  
  const resetGame = () => {
    // This would normally get a new puzzle, but since we're using date-based puzzles,
    // this is just for demo purposes
    const puzzleIndex = Math.floor(Math.random() * puzzles.length);
    setCurrentPuzzle(puzzles[puzzleIndex]);
    setAttempts([]);
    setGameStatus('playing');
    setGuess('');
    setShowHint(false);
    setHintUsed(false);
  };
  
  const shareResults = () => {
    const shareText = `🎭 Emoji Cipher 🎭
I solved today's puzzle in ${attempts.length} tries!
${currentPuzzle.emojis}

${attempts.map((a) => 
  a.status === 'correct' ? '✅' : 
  a.status === 'partial' ? '🔄' : 
  '❌'
).join(' ')}

Play at emojiCipher.com`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Emoji Cipher Results',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText)
        .then(() => alert('Results copied to clipboard!'))
        .catch(err => console.error('Failed to copy: ', err));
    }
  };

  return (
    <GameContext.Provider value={{
      currentPuzzle,
      guess,
      setGuess,
      attempts,
      gameStatus,
      streak,
      showHint,
      hintUsed,
      checkGuess,
      handleHint,
      resetGame,
      shareResults
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);