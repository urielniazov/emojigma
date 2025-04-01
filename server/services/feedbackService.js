const feedbackRepository = require('../repositories/feedbackRepository');

/**
 * Submit new feedback
 * @param {Object} feedbackData - The feedback data
 * @param {string} feedbackData.content - The feedback text content
 * @param {string} [feedbackData.deviceId] - Device identifier
 * @returns {Promise<Object>} The created feedback
 */
async function submitFeedback(feedbackData) {
    // Validate required fields
    if (!feedbackData.content || feedbackData.content.trim() === '') {
        throw new Error('Feedback content is required');
    }

    // Format data for database insertion
    const formattedData = {
        content: feedbackData.content.trim(),
        device_id: feedbackData.deviceId || null,
        status: 'new',
    };

    // Create feedback in the repository
    return await feedbackRepository.createFeedback(formattedData);
}

/**
 * Get all feedback with optional filtering
 * @param {Object} options - Query options
 * @returns {Promise<Array>} Array of feedback items
 */
async function getAllFeedback(options = {}) {
    return await feedbackRepository.getAllFeedback(options);
}

/**
 * Get feedback by ID
 * @param {string} id - The feedback ID
 * @returns {Promise<Object>} The feedback item
 */
async function getFeedbackById(id) {
    return await feedbackRepository.getFeedbackById(id);
}

/**
 * Update feedback status
 * @param {string} id - The feedback ID
 * @param {string} status - The new status
 * @returns {Promise<Object>} The updated feedback
 */
async function updateFeedbackStatus(id, status) {
    // Validate status
    const validStatuses = ['new', 'reviewed', 'responded', 'closed'];
    if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    return await feedbackRepository.updateFeedback(id, { status });
}

/**
 * Update feedback
 * @param {string} id - The feedback ID
 * @param {Object} updates - The fields to update
 * @returns {Promise<Object>} The updated feedback
 */
async function updateFeedback(id, updates) {
    // Format the updates
    const formattedUpdates = {};

    if (updates.content !== undefined) {
        formattedUpdates.content = updates.content.trim();
    }


    if (updates.status !== undefined) {
        const validStatuses = ['new', 'reviewed', 'responded', 'closed'];
        if (!validStatuses.includes(updates.status)) {
            throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
        }
        formattedUpdates.status = updates.status;
    }


    return await feedbackRepository.updateFeedback(id, formattedUpdates);
}

/**
 * Delete feedback
 * @param {string} id - The feedback ID
 * @returns {Promise<void>}
 */
async function deleteFeedback(id) {
    return await feedbackRepository.deleteFeedback(id);
}

/**
 * Get feedback count with optional filtering
 * @param {Object} options - Query options
 * @returns {Promise<number>} Count of feedback items
 */
async function getFeedbackCount(options = {}) {
    return await feedbackRepository.countFeedback(options);
}

module.exports = {
    submitFeedback,
    getAllFeedback,
    getFeedbackById,
    updateFeedbackStatus,
    updateFeedback,
    deleteFeedback,
    getFeedbackCount
};