import React, { useState, useEffect } from 'react';

function AnimatedText({ texts = [], className = "" }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (texts.length === 0) return;
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % texts.length);
    }, 4000); // Sync with CSS animation duration
    return () => clearInterval(timer);
  }, [texts.length]);

  if (texts.length === 0) return null;

  return (
    <div className={`animated-text ${className}`}>
      <span key={idx}>
        {texts[idx]?.text || ''}
      </span>
    </div>
  );
}

export default AnimatedText;