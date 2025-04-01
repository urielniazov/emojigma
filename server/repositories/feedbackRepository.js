/**
 * Puzzle Repository
 * Handles all data access for feedbacks
 */
const supabase = require('../config/supabase');

/**
 * Create a new feedback entry
 * @param {Object} feedbackData - The feedback data to insert
 * @returns {Promise<Object>} The created feedback record
 */
async function createFeedback(feedbackData) {
  const { data, error } = await supabase
    .from('feedback')
    .insert([feedbackData])
    .select()
    .single();

  if (error) {
    console.error('Error creating feedback:', error);
    throw new Error(`Failed to create feedback: ${error.message}`);
  }

  return data;
}


module.exports = {
  createFeedback
};