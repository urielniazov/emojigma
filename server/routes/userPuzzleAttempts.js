const express = require('express');
const router = express.Router();
const userPuzzleAttemptController = require('../controllers/userPuzzleAttemptController');
const validatePuzzleId = require('../middlewares/validatePuzzleId');

// Apply validation middleware to routes that need puzzle ID validation
router.post('/guess', validatePuzzleId, userPuzzleAttemptController.recordGuess);
router.post('/shared', validatePuzzleId, userPuzzleAttemptController.markAsShared);
router.post('/start', validatePuzzleId, userPuzzleAttemptController.startAttempt);

// These routes don't need puzzle validation
router.get('/streak/:deviceId', userPuzzleAttemptController.getUserStreak);

module.exports = router;