const feedbackService = require('../services/feedbackService');

/**
 * Submit new feedback
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function submitFeedback(req, res) {
  try {
    const { feedback, deviceId } = req.body;

    if (!feedback) {
      return res.status(400).json({
        error: 'Feedback content is required'
      });
    }

    const result = await feedbackService.submitFeedback({
      content: feedback,
      deviceId
    });

    return res.status(201).json({
      message: 'Feedback submitted successfully',
      data: result
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return res.status(500).json({
      error: 'Failed to submit feedback',
      details: error.message
    });
  }
}

module.exports = {
  submitFeedback
};