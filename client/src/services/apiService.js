// Simplified API Service for Emojigma - only fetches the daily puzzle

// Base URL - change this to your deployed server URL in production
const API_BASE_URL = 'http://localhost:2481/api';

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