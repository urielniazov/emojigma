const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');

// Get today's leaderboard
router.get('/today', leaderboardController.getTodayLeaderboard);

// Get user's position
router.get('/position/:deviceId', leaderboardController.getUserPosition);

module.exports = router;