import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 20, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // If text is empty or already fully displayed (e.g. on re-render if we persist state), just finish
    if (currentIndex >= text.length) {
      if (onComplete) onComplete();
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayedText((prev) => prev + text[currentIndex]);
      setCurrentIndex((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timeout);
  }, [currentIndex, text, speed, onComplete]);

  return <span className="whitespace-pre-wrap break-words">{displayedText}</span>;
};
