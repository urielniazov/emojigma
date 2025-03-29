const express = require('express');
const router = express.Router();
const puzzleController = require('../controllers/puzzleController');

// Get today's puzzle
router.get('/today', puzzleController.getTodaysPuzzle);

module.exports = router;