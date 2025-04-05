/**
 * Singleton cache for today's puzzle
 * Extremely simple - just holds today's puzzle
 */
class DailyPuzzleCache {
    constructor() {
      if (DailyPuzzleCache.instance) {
        return DailyPuzzleCache.instance;
      }
      
      this.todaysDate = null;
      this.todaysPuzzle = null;
      DailyPuzzleCache.instance = this;
    }
    
    /**
     * Set today's puzzle
     * @param {string} date - Today's date in YYYY-MM-DD format
     * @param {Object} puzzle - Puzzle data
     */
    setTodaysPuzzle(date, puzzle) {
      this.todaysDate = date;
      this.todaysPuzzle = puzzle;
    }
    
    /**
     * Get today's puzzle if date matches
     * @param {string} date - Date to check in YYYY-MM-DD format
     * @returns {Object|null} Puzzle data or null if dates don't match
     */
    getTodaysPuzzle(date) {
      if (this.todaysPuzzle && this.todaysDate === date) {
        return this.todaysPuzzle;
      }
      return null;
    }
    
    /**
     * Check if a puzzle ID is valid for today
     * @param {string} date - Today's date in YYYY-MM-DD format
     * @param {string} puzzleId - Puzzle ID to validate
     * @returns {boolean} True if valid
     */
    isValidPuzzleId(date, puzzleId) {
      const puzzle = this.getTodaysPuzzle(date);
      return puzzle && puzzle.id === puzzleId;
    }
    
    /**
     * Clear the cache
     */
    clear() {
      this.todaysDate = null;
      this.todaysPuzzle = null;
    }
  }
  
  // Export a singleton instance
  const dailyPuzzleCache = new DailyPuzzleCache();
  
  module.exports = dailyPuzzleCache;