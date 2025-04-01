import React, { useState } from 'react';
import { Trophy, HelpCircle, MessageCircle } from 'lucide-react';
import LeaderboardModal from './LeaderboardModal';
import InstructionsModal from './InstructionsModal';
import FeedbackModal from './FeedbackModal';

const NavBar = () => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <>
      <nav className="w-full flex justify-between items-center py-3 px-4 bg-white shadow-sm mb-4">
        <div className="flex-1"></div>
        <div className="flex gap-4 flex-1 justify-end">
          <button
            onClick={() => setShowLeaderboard(true)}
            className="text-indigo-600 hover:text-indigo-800 transition-colors"
            aria-label="Show Leaderboard"
          >
            <Trophy size={24} />
          </button>

          <button
            onClick={() => setShowFeedback(true)}
            className="text-indigo-600 hover:text-indigo-800 transition-colors"
            aria-label="Leave Feedback"
          >
            <MessageCircle size={24} />
          </button>

          <button
            onClick={() => setShowInstructions(true)}
            className="text-indigo-600 hover:text-indigo-800 transition-colors"
            aria-label="How to Play"
          >
            <HelpCircle size={24} />
          </button>
        </div>
      </nav>

      {/* Modals */}
      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />

      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />

      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
      />
    </>
  );
};

export default NavBar;