import React, { useState, useEffect, useCallback } from 'react';

function AnimatedText({ texts = [] }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (texts.length === 0) return;
    
    setVisible(false);
    const showTimer = setTimeout(() => setVisible(true), 80);
    const switchTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => setIdx(i => (i + 1) % texts.length), 400);
    }, 3000 + 700);
    
    return () => {
      clearTimeout(showTimer);
      clearTimeout(switchTimer);
    };
  }, [idx, texts.length]);

  // ใช้ useCallback เพื่อป้องกันการสร้าง function ใหม่ทุกครั้ง
  const getTextStyle = useCallback(() => ({
    color: texts[idx]?.color || '#334155',
    textShadow: visible ? `0 0 15px rgba(100, 200, 255, 0.4)` : 'none',
    transition: 'all 0.3s ease',
    willChange: 'text-shadow, transform'
  }), [visible, texts, idx]);

  if (texts.length === 0) return null;

  return (
    <div className="animated-text">
      <span
        className={visible ? 'visible' : ''}
        style={getTextStyle()}
      >
        {texts[idx]?.text || ''}
      </span>
      
      {/* Enhanced glow effect - ลดความซับซ้อน */}
      {visible && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle, rgba(100, 200, 255, 0.2) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(15px)',
            opacity: 0.6,
            zIndex: -1,
            willChange: 'opacity'
          }}
        />
      )}
    </div>
  );
}

export default AnimatedText;