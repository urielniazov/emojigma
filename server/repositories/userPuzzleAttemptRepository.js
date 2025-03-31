const supabase = require('../config/supabase');

/**
 * Get a user's attempt for a specific puzzle and date
 * @param {string} deviceId - Device identifier
 * @param {string} puzzleId - Puzzle ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} User's attempt
 */
const getAttempt = async (deviceId, puzzleId, date) => {
  const { data, error } = await supabase
    .from('user_puzzle_attempts')
    .select('*')
    .eq('device_id', deviceId)
    .eq('puzzle_id', puzzleId)
    .eq('date', date)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    throw error;
  }
  
  return data;
};

/**
 * Create a new attempt
 * @param {Object} attempt - Attempt data
 * @returns {Promise<Object>} Created attempt
 */
const createAttempt = async (attempt) => {
  const { data, error } = await supabase
    .from('user_puzzle_attempts')
    .insert(attempt)
    .select();
  
  if (error) {
    throw error;
  }
  
  return data[0];
};

/**
 * Update an existing attempt
 * @param {string} id - Attempt ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated attempt
 */
const updateAttempt = async (id, updates) => {
  updates.updated_at = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('user_puzzle_attempts')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) {
    throw error;
  }
  
  return data[0];
};

/**
 * Get user's statistics
 * @param {string} deviceId - Device identifier
 * @returns {Promise<Object>} User stats
 */
const getUserStats = async (deviceId) => {
  // Get total attempts
  const { count: totalAttempts, error: countError } = await supabase
    .from('user_puzzle_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('device_id', deviceId);
  
  if (countError) {
    throw countError;
  }
  
  // Get completed puzzles
  const { count: completedCount, error: completeError } = await supabase
    .from('user_puzzle_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('device_id', deviceId)
    .eq('completed', true);
  
  if (completeError) {
    throw completeError;
  }
  
  // Get all completed puzzles with dates to calculate streak
  const { data: completedPuzzles, error: puzzlesError } = await supabase
    .from('user_puzzle_attempts')
    .select('date')
    .eq('device_id', deviceId)
    .eq('completed', true)
    .order('date', { ascending: false });
  
  if (puzzlesError) {
    throw puzzlesError;
  }
  
  return {
    totalAttempts,
    completedCount,
    completedPuzzles
  };
};

/**
 * Get leaderboard for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {number} limit - Number of top entries to return
 * @returns {Promise<Array>} Leaderboard entries
 */
const getLeaderboardByDate = async (date, limit = 10) => {
  const { data, error } = await supabase
    .from('user_puzzle_attempts')
    .select(`
      id,
      device_id,
      attempts_count,
      time_to_solve,
      completed
    `)
    .gt('time_to_solve', 0)
    .eq('date', date)
    .eq('completed', true)
    .order('attempts_count', { ascending: true })
    .order('time_to_solve', { ascending: true })
    .limit(limit);
  
  if (error) {
    throw error;
  }
  
  return data;
};

module.exports = {
  getAttempt,
  createAttempt,
  updateAttempt,
  getUserStats,
  getLeaderboardByDate
};