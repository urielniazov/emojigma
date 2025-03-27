import React from 'react';
import { useGame } from '../context/GameContext';
import { splitEmojiString } from '../utils/emojiUtils';

const PuzzleDisplay = () => {
    const { currentPuzzle, showHint } = useGame();

    // Properly split the emoji string to handle complex emoji sequences
    const emojis = splitEmojiString(currentPuzzle.emojis);

    return (
        <div className="text-center mb-4">
            <div className="flex justify-center space-x-2 text-4xl my-6">
                {emojis.map((emoji, index) => (
                    <div
                        key={index}
                        className="inline-block animate-bounce"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {emoji}
                    </div>
                ))}
            </div>

            {showHint && (
                <div className="bg-indigo-50 text-indigo-800 p-2 rounded-md text-sm mt-2">
                    <strong>Hint:</strong> {currentPuzzle.category} - {currentPuzzle.answer.length} characters
                </div>
            )}
        </div>
    );
};

export default PuzzleDisplay;