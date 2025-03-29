/**
 * Puzzle Service
 * Handles business logic for puzzles
 */
const puzzleRepository = require('../repositories/puzzleRepository');
const { getTodayString } = require('../utils/helpers');

/**
 * Get today's puzzle or select a new one if none exists
 * @returns {Promise<Object>} Today's puzzle object
 */
const getTodaysPuzzle = async () => {
  const today = getTodayString();
  
  // Check if we already have a puzzle for today
  const existingPuzzle = await puzzleRepository.getPuzzleByDate(today);
  
  if (existingPuzzle) {
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

module.exports = {
  getTodaysPuzzle
};