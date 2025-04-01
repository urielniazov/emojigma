import React, { useState } from 'react';
import { getDeviceId } from '../utils/deviceUtils';
import { submitFeedback } from '../services/apiService';
import InteractiveEmoji from './InteractiveEmoji';


const FeedbackModal = ({ isOpen, onClose }) => {
  const [feedback, setFeedback] = useState('');
  const deviceId = getDeviceId();
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      // Submit feedback using the API function
      await submitFeedback({
        feedback,
        deviceId, // Pass deviceId if available
      });

      setStatus('success');
      setFeedback('');

      // Close the modal after showing success message
      setTimeout(() => {
        onClose();
        setStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {status === 'idle' && (
          <div>
        <InteractiveEmoji/>
        <h2 className="text-2xl font-bold mb-4">
          Leave Feedback
        </h2>
        </div>)}
        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Thank you for your feedback!</h3>
            <p className="text-gray-500 mt-2">Your input helps us improve our application.</p>
          </div>
        ) : status === 'error' ? (
          <div className="text-center py-8">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
              🫢
            </h2>
            <h3 className="text-lg font-medium text-red-900">Something went wrong </h3>
            <p className="text-gray-500 mt-2">{errorMessage}</p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Try Again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <textarea
                id="feedback"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Totally anonymized feedback, we promise! 🙈"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === 'submitting' || !feedback.trim()}
                className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${(status === 'submitting' || !feedback.trim()) && 'opacity-70 cursor-not-allowed'
                  }`}
              >
                {status === 'submitting' ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
