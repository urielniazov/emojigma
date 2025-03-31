const express = require('express');
const router = express.Router();
const userPuzzleAttemptController = require('../controllers/userPuzzleAttemptController');

// Record a guess
router.post('/guess', userPuzzleAttemptController.recordGuess);

// Mark as shared
router.post('/shared', userPuzzleAttemptController.markAsShared);

// Get user streak
router.get('/streak/:deviceId', userPuzzleAttemptController.getUserStreak);

module.exports = router;