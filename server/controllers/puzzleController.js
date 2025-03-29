/**
 * Puzzle Controller
 * Handles HTTP requests related to puzzles
 */
const puzzleService = require('../services/puzzleService');

/**
 * Get today's puzzle
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getTodaysPuzzle = async (req, res) => {
  try {
    const puzzle = await puzzleService.getTodaysPuzzle();
    
    // Remove the answer for security
    const { answer, ...puzzleWithoutAnswer } = puzzle;
    
    return res.json({
      puzzle: puzzleWithoutAnswer
    });
  } catch (error) {
    console.error('Error getting puzzle:', error);
    return res.status(500).json({
      error: true,
      message: 'Failed to get today\'s puzzle',
      details: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};