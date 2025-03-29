/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**
 * Format error responses for API
 * @param {Error} error - The error object
 * @param {string} message - Custom message
 * @returns {Object} Formatted error object
 */
const formatError = (error, message = 'An error occurred') => {
  return {
    error: true,
    message,
    details: process.env.NODE_ENV === 'production' ? {} : error
  };
};

module.exports = {
  getTodayString,
  formatError
};