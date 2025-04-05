/**
 * Puzzle Service
 * Handles business logic for puzzles
 */
const puzzleRepository = require('../repositories/puzzleRepository');
const { getTodayString } = require('../utils/helpers');
const dailyPuzzleCache = require('../utils/dailyPuzzleCache');

/**
 * Get today's puzzle or select a new one if none exists
 * @returns {Promise<Object>} Today's puzzle object
 */
const getTodaysPuzzle = async () => {
  const today = getTodayString();
  // Try to get from cache first
  const cachedPuzzle = dailyPuzzleCache.getTodaysPuzzle(today);
  if (cachedPuzzle) {
    return cachedPuzzle;
  }

  console.log('Fetching puzzle from database');
  // Check if we already have a puzzle for today
  const existingPuzzle = await puzzleRepository.getPuzzleByDate(today);

  if (existingPuzzle) {
    dailyPuzzleCache.setTodaysPuzzle(today, existingPuzzle);
    return existingPuzzle;
  }

  // If no puzzle for today, select the first unused one
  const unusedPuzzle = await puzzleRepository.getFirstUnusedPuzzle();

  if (!unusedPuzzle) {
    // If no unused puzzles, reset all puzzles
    await puzzleRepository.resetAllPuzzles();

    // Get first puzzle after reset
    const resetPuzzle = await puzzleRepository.getFirstUnusedPuzzle();

    if (!resetPuzzle) {
      throw new Error('No puzzles available after reset');
    }

    // Mark it as used for today
    return await puzzleRepository.markPuzzleAsUsed(resetPuzzle.id, today);
  }

  // Mark the first unused puzzle as used for today
  return await puzzleRepository.markPuzzleAsUsed(unusedPuzzle.id, today);
};

/**
 * Validate that a puzzleId matches today's puzzle
 * @param {string} puzzleId - Puzzle ID to validate
 * @returns {Promise<boolean>} True if valid
 */
const isValidTodaysPuzzleId = async (puzzleId) => {
  const today = getTodayString();

  // Check cache first
  if (dailyPuzzleCache.isValidPuzzleId(today, puzzleId)) {
    return true;
  }

  // If not in cache or invalid, get puzzle from database and verify
  const puzzle = await getTodaysPuzzle(); // This will also update the cache

  return puzzle && puzzle.id === puzzleId;
};

module.exports = {
  getTodaysPuzzle,
  isValidTodaysPuzzleId
};