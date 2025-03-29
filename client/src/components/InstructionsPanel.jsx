import React from 'react';

const InstructionsPanel = () => {
  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-2">How to Play</h2>
      <ol className="list-decimal list-inside space-y-2 text-gray-700">
        <li>Each puzzle consists of <strong>5 emojis</strong></li>
        <li>Enter your guess – spelling matters!</li>
        <li>Get feedback: ✅ Correct, ❌ Incorrect, or 🔄 Partially correct.</li>
        <li>Solve it in the fewest attempts possible!</li>
      </ol>
    </div>
  );
};

export default InstructionsPanel;