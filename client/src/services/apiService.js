// Simplified API Service for Emojigma - only fetches the daily puzzle

// Base URL - change this to your deployed server URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Get today's puzzle from the server
 * @returns {Promise<Object>} The puzzle object
 */
export const getTodaysPuzzle = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/puzzles/today`);

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    return data.puzzle;
  } catch (error) {
    console.error('Error fetching today\'s puzzle:', error);
    throw error;
  }
};

/**
 * Record a guess attempt
 * @param {string} deviceId - Device identifier
 * @param {string} puzzleId - Puzzle ID
 * @param {string} guess - User's guess
 * @param {string} status - Result status (correct, partial, incorrect)
 * @returns {Promise<Object>} Updated attempt data
 */
export const recordGuess = async (deviceId, puzzleId, guess, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/attempts/guess`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ deviceId, puzzleId, guess, status }),
    });
    
    if (response.status === 429) {
      const errorData = await response.text();
      throw new Error(`Rate limit exceeded: ${errorData}`);
    }
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error recording guess:', error);
    throw error;
  }
};

/**
 * Mark puzzle as shared
 * @param {string} deviceId - Device identifier
 * @param {string} puzzleId - Puzzle ID
 * @returns {Promise<Object>} Updated attempt data
 */
export const markAsShared = async (deviceId, puzzleId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/attempts/shared`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ deviceId, puzzleId }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error marking as shared:', error);
    throw error;
  }
};

/**
 * Get user's streak
 * @param {string} deviceId - Device identifier
 * @returns {Promise<Object>} Streak information
 */
export const fetchUserStreak = async (deviceId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/attempts/streak/${deviceId}`);

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching streak:', error);
    throw error;
  }
};

/**
 * Fetch today's leaderboard
 * @param {number} limit - Number of entries to fetch
 * @returns {Promise<Object>} Leaderboard data
 */
export const fetchLeaderboard = async (limit = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/leaderboard/today?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};

/**
 * Fetch user's position on the leaderboard
 * @param {string} deviceId - Device identifier
 * @returns {Promise<Object>} Position data
 */
export const fetchUserPosition = async (deviceId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/leaderboard/position/${deviceId}`);
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user position:', error);
    throw error;
  }
};

/**
 * Submits user feedback to the API
 * @param {Object} feedbackData - Object containing feedback information
 * @param {string} feedbackData.feedback - The feedback text content
 * @param {string} [feedbackData.deviceId] - Optional device identifier
 * @returns {Promise<Object>} Response data from the server
 */
export const submitFeedback = async (feedbackData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

/**
 * Start a puzzle attempt
 * @param {string} deviceId - Device identifier
 * @param {string} puzzleId - Puzzle ID
 * @returns {Promise<Object>} Created attempt data
 */
export const startAttempt = async (deviceId, puzzleId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/attempts/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ deviceId, puzzleId }),
    });
    
    if (response.status === 429) {
      const errorData = await response.text();
      throw new Error(`Rate limit exceeded: ${errorData}`);
    }
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error starting attempt:', error);
    throw error;
  }
};