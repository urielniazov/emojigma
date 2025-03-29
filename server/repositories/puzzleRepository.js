/**
 * Puzzle Repository
 * Handles all data access for puzzles
 */
const supabase = require('../config/supabase');

/**
 * Get a puzzle by its date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Puzzle object
 */
const getPuzzleByDate = async (date) => {
  const { data, error } = await supabase
    .from('puzzles')
    .select('*')
    .eq('used_date', date)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    throw error;
  }
  
  return data;
};

/**
 * Get first unused puzzle
 * @returns {Promise<Object>} First unused puzzle object
 */
const getFirstUnusedPuzzle = async () => {
  const { data, error } = await supabase
    .from('puzzles')
    .select('*')
    .eq('used', false)
    .eq('active', true)
    .order('id')
    .limit(1);
  
  if (error) {
    throw error;
  }
  
  return data[0];
};

/**
 * Mark puzzle as used
 * @param {string} id - Puzzle ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Updated puzzle object
 */
const markPuzzleAsUsed = async (id, date) => {
  const { data, error } = await supabase
    .from('puzzles')
    .update({ used: true, used_date: date })
    .eq('id', id)
    .select();
  
  if (error) {
    throw error;
  }
  
  return data[0];
};

/**
 * Reset all puzzles to unused
 * @returns {Promise<void>}
 */
const resetAllPuzzles = async () => {
  const { error } = await supabase
    .from('puzzles')
    .update({ used: false, used_date: null })
    .eq('active', true);
  
  if (error) {
    throw error;
  }
};

/**
 * Get total puzzle count
 * @returns {Promise<number>} Count of puzzles
 */
const getPuzzleCount = async () => {
  const { count, error } = await supabase
    .from('puzzles')
    .select('*', { count: 'exact', head: true })
    .eq('active', true);
  
  if (error) {
    throw error;
  }
  
  return count;
};

module.exports = {
  getPuzzleByDate,
  getFirstUnusedPuzzle,
  markPuzzleAsUsed,
  resetAllPuzzles,
  getPuzzleCount
};