const userPuzzleAttemptService = require('../services/userPuzzleAttemptService');

/**
 * Record a user's guess
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.recordGuess = async (req, res) => {
  try {
    const { deviceId, puzzleId, guess, status } = req.body;
    console.log('Received guess data:', { deviceId, puzzleId, guess, status }); // Add logging

    if (!deviceId || !puzzleId || !guess || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const attempt = await userPuzzleAttemptService.recordGuess(
      deviceId,
      puzzleId,
      guess,
      status
    );

    return res.json({ attempt });
  } catch (error) {
    console.error('Error recording guess:', error);
    return res.status(500).json({
      error: true,
      message: 'Failed to record guess',
      details: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};

/**
 * Mark a puzzle as shared
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.markAsShared = async (req, res) => {
  try {
    const { deviceId, puzzleId } = req.body;

    if (!deviceId || !puzzleId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const attempt = await userPuzzleAttemptService.markAsShared(deviceId, puzzleId);

    return res.json({ attempt });
  } catch (error) {
    console.error('Error marking as shared:', error);
    return res.status(500).json({
      error: true,
      message: 'Failed to mark as shared',
      details: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};

/**
 * Get user's streak information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUserStreak = async (req, res) => {
  try {
    const deviceId = req.params.deviceId;

    if (!deviceId) {
      return res.status(400).json({ error: 'Device ID is required' });
    }

    const streakInfo = await userPuzzleAttemptService.calculateStreak(deviceId);

    return res.json({ streak: streakInfo });
  } catch (error) {
    console.error('Error getting user streak:', error);
    return res.status(500).json({
      error: true,
      message: 'Failed to get user streak',
      details: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};