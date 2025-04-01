const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
// Public route - anyone can submit feedback
router.post('/', feedbackController.submitFeedback);

module.exports = router;