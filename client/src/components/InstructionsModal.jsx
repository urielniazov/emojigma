import React from 'react';
import { X } from 'lucide-react';

const InstructionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">How to Play</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4">
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>Each puzzle consists of <strong>5 emojis</strong> of different categories</li>
            <li>Enter your guess in the text field – spelling matters!</li>
            <li>Get feedback on your guess:
              <ul className="list-disc list-inside ml-5 mt-1">
                <li><span className="text-green-600">✅</span> Correct: You solved the puzzle!</li>
                <li><span className="text-yellow-600">🔄</span> Partially correct: You're on the right track</li>
                <li><span className="text-red-600">❌</span> Incorrect: Try a different approach</li>
              </ul>
            </li>
            <li>You have <strong>6 attempts</strong> to solve each puzzle</li>
            <li>A new puzzle is available every 24 hours</li>
            <li>Build your streak by solving puzzles on consecutive days</li>
          </ol>
          
          <div className="mt-6 p-3 bg-blue-50 rounded-md">
            <h3 className="font-medium text-blue-800 mb-1">Tips</h3>
            <ul className="list-disc list-inside text-blue-700">
              <li>Look for themes or connections between the emojis</li>
            </ul>
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionsModal;