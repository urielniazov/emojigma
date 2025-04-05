const userPuzzleAttemptRepository = require('../repositories/userPuzzleAttemptRepository');
const { getTodayString } = require('../utils/helpers');

/**
 * Start a new attempt when user clicks the Start button
 * @param {string} deviceId - Device identifier
 * @param {string} puzzleId - Puzzle ID
 * @returns {Promise<Object>} Created or existing attempt
 */
const startAttempt = async (deviceId, puzzleId) => {
  const today = getTodayString();

  // Check if attempt already exists
  let attempt = await userPuzzleAttemptRepository.getAttempt(deviceId, puzzleId, today);

  if (!attempt) {
    // Create new attempt record with timestamp but no guesses yet
    const newAttempt = {
      device_id: deviceId,
      puzzle_id: puzzleId,
      date: today,
      completed: false,
      attempts_count: 0,
      attempts_data: [],
      time_to_solve: null
    };

    attempt = await userPuzzleAttemptRepository.createAttempt(newAttempt);
  }

  return attempt;
};

/**
 * Record a user's guess attempt
 * @param {string} deviceId - Device identifier
 * @param {string} puzzleId - Puzzle ID
 * @param {string} guess - User's guess
 * @param {string} status - Status of the guess (correct, partial, incorrect)
 * @returns {Promise<Object>} Updated attempt record
 */
const recordGuess = async (deviceId, puzzleId, guess, status) => {
  const today = getTodayString();
  const isCorrect = status === 'correct';

  // Get existing attempt or create new one
  let attempt = await userPuzzleAttemptRepository.getAttempt(deviceId, puzzleId, today);

  const newGuessData = {
    guess,
    status,
    timestamp: new Date().toISOString()
  };

  if (attempt) {
    // Update existing attempt
    const attemptsData = attempt.attempts_data || [];
    attemptsData.push(newGuessData);

    const updates = {
      attempts_count: attempt.attempts_count + 1,
      attempts_data: attemptsData,
      completed: isCorrect || attempt.completed
    };

    // If correct and not previously completed, record time to solve
    if (isCorrect && !attempt.completed && !attempt.time_to_solve) {
      // Calculate time from first attempt to now
      const firstAttemptTime = new Date(attempt.created_at).getTime();
      const solveTime = Math.floor((new Date().getTime() - firstAttemptTime) / 1000);
      updates.time_to_solve = solveTime;
    }

    return await userPuzzleAttemptRepository.updateAttempt(attempt.id, updates);
  } else {
    // Create new attempt
    const newAttempt = {
      device_id: deviceId,
      puzzle_id: puzzleId,
      date: today,
      completed: isCorrect,
      attempts_count: 1,
      attempts_data: [newGuessData],
      time_to_solve: isCorrect ? 0 : null // Will be updated later if solved
    };

    return await userPuzzleAttemptRepository.createAttempt(newAttempt);
  }
};

/**
 * Mark a puzzle solution as shared
 * @param {string} deviceId - Device identifier
 * @param {string} puzzleId - Puzzle ID
 * @returns {Promise<Object>} Updated attempt
 */
const markAsShared = async (deviceId, puzzleId) => {
  const today = getTodayString();

  const attempt = await userPuzzleAttemptRepository.getAttempt(deviceId, puzzleId, today);

  if (!attempt) {
    throw new Error('No attempt found');
  }

  return await userPuzzleAttemptRepository.updateAttempt(attempt.id, {
    shared: true
  });
};

/**
 * Calculate user's current streak
 * @param {string} deviceId - Device identifier
 * @returns {Promise<Object>} Streak info
 */
const calculateStreak = async (deviceId) => {
  try {
    const stats = await userPuzzleAttemptRepository.getUserStats(deviceId);

    // Sort completed puzzles by date (newest first)
    const sortedDates = (stats.completedPuzzles || [])
      .map(p => p.date)
      .sort((a, b) => new Date(b) - new Date(a));

    console.log('Sorted dates for streak calculation:', sortedDates);

    // Calculate current streak
    let currentStreak = 0;

    if (sortedDates.length > 0) {
      currentStreak = 1; // Start with 1 for the most recent completion

      // Check for consecutive days
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let currentDate = new Date(sortedDates[0]);
      currentDate.setHours(0, 0, 0, 0);

      // If the most recent completion is not today, check if it was yesterday
      if (currentDate.getTime() !== today.getTime()) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // If most recent completion is not yesterday, streak is broken
        if (currentDate.getTime() !== yesterday.getTime()) {
          return {
            currentStreak: 0,
            totalCompleted: stats.completedCount || 0,
            completionRate: stats.completedCount / (stats.totalAttempts || 1) * 100
          };
        }
      }

      // Check the rest of the dates for continuity
      for (let i = 0; i < sortedDates.length - 1; i++) {
        const current = new Date(sortedDates[i]);
        current.setHours(0, 0, 0, 0);

        const next = new Date(sortedDates[i + 1]);
        next.setHours(0, 0, 0, 0);

        // Calculate difference in days
        const diffDays = Math.round((current - next) / (24 * 60 * 60 * 1000));

        if (diffDays === 1) {
          // Days are consecutive
          currentStreak++;
        } else {
          // Streak is broken
          break;
        }
      }
    }

    return {
      currentStreak,
      totalCompleted: stats.completedCount || 0,
      completionRate: Math.round((stats.completedCount / (stats.totalAttempts || 1)) * 100)
    };
  } catch (error) {
    console.error('Error calculating streak:', error);
    return {
      currentStreak: 0,
      totalCompleted: 0,
      completionRate: 0
    };
  }
};

/**
 * Get leaderboard for today
 * @param {number} limit - Number of top entries to return
 * @returns {Promise<Array>} Leaderboard entries
 */
const getTodayLeaderboard = async (limit = 10) => {
  const today = getTodayString();
  return await userPuzzleAttemptRepository.getLeaderboardByDate(today, limit);
};

/**
 * Get user's position on today's leaderboard
 * @param {string} deviceId - Device identifier
 * @returns {Promise<Object>} User's position info
 */
const getUserLeaderboardPosition = async (deviceId) => {
  const today = getTodayString();

  // Get all entries for today
  const leaderboard = await userPuzzleAttemptRepository.getLeaderboardByDate(today, 1000);

  // Find user's position
  const userIndex = leaderboard.findIndex(entry => entry.device_id === deviceId);

  if (userIndex === -1) {
    return { onLeaderboard: false };
  }

  return {
    onLeaderboard: true,
    position: userIndex + 1,
    totalPlayers: leaderboard.length,
    entry: leaderboard[userIndex]
  };
};


module.exports = {
  startAttempt,
  recordGuess,
  markAsShared,
  calculateStreak,
  getTodayLeaderboard,
  getUserLeaderboardPosition
};