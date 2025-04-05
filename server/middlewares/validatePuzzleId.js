const puzzleService = require('../services/puzzleService');

/**
 * Middleware to validate that requested puzzleId matches today's puzzle
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validatePuzzleId = async (req, res, next) => {
  try {
    const { puzzleId } = req.body;
    
    if (!puzzleId) {
      return res.status(400).json({ error: 'Missing puzzle ID' });
    }
    
    const isValid = await puzzleService.isValidTodaysPuzzleId(puzzleId);
    
    if (!isValid) {
      return res.status(403).json({ 
        error: 'Invalid puzzle ID',
        message: 'The provided puzzle ID does not match today\'s puzzle'
      });
    }
    
    // If valid, continue to the next middleware/route handler
    next();
  } catch (error) {
    console.error('Error validating puzzle ID:', error);
    return res.status(500).json({
      error: true,
      message: 'Failed to validate puzzle ID',
      details: process.env.NODE_ENV === 'production' ? {} : error
    });
  }
};

module.exports = validatePuzzleId;