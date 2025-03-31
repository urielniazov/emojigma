const userPuzzleAttemptService = require('../services/userPuzzleAttemptService');

/**
 * Get today's leaderboard
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getTodayLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '10', 10);
    const leaderboard = await userPuzzleAttemptService.getTodayLeaderboard(limit);
    
    return res.json({ leaderboard });
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return res.status(500).json({
      error: true,
      message: 'Failed to get leaderboard',
      details: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};

/**
 * Get user's position on the leaderboard
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUserPosition = async (req, res) => {
  try {
    const deviceId = req.params.deviceId;
    
    if (!deviceId) {
      return res.status(400).json({ error: 'Device ID is required' });
    }
    
    const position = await userPuzzleAttemptService.getUserLeaderboardPosition(deviceId);
    
    return res.json({ position });
  } catch (error) {
    console.error('Error getting user position:', error);
    return res.status(500).json({
      error: true,
      message: 'Failed to get user position',
      details: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};