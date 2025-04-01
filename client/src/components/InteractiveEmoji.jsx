import React, { useState, useEffect, useRef } from 'react';

const InteractiveEmoji = () => {
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const emojiRef = useRef(null);

  // Handle cursor movement for eye following
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (emojiRef.current) {
        const rect = emojiRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate vector from emoji center to mouse
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        
        // Normalize and scale for eye movement
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxMove = 4; // Maximum pixels eyes can move
        const normalizedX = distance > 0 ? (dx / distance) * Math.min(distance / 10, maxMove) : 0;
        const normalizedY = distance > 0 ? (dy / distance) * Math.min(distance / 10, maxMove) : 0;
        
        setEyePosition({ x: normalizedX, y: normalizedY });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="ml-3 relative" style={{ width: '40px', height: '40px' }} ref={emojiRef}>
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 40 40" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Emoji face - yellow circle with orange border */}
        <circle cx="20" cy="20" r="19" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />
        
        {/* Left eye white */}
        <circle cx="12" cy="16" r="6" fill="white" />
        
        {/* Right eye white */}
        <circle cx="28" cy="16" r="6" fill="white" />
        
        {/* Left eye pupil - follows cursor */}
        <circle 
          cx={12 + eyePosition.x} 
          cy={16 + eyePosition.y} 
          r="3" 
          fill="#000000" 
        />
        
        {/* Right eye pupil - follows cursor */}
        <circle 
          cx={28 + eyePosition.x} 
          cy={16 + eyePosition.y} 
          r="3" 
          fill="#000000" 
        />
        
        {/* Simple smile */}
        <path
          d="M12,26 Q20,32 28,26"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default InteractiveEmoji;