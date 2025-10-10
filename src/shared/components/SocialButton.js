import React, { useCallback } from 'react';
import { socialIcons } from '../data/icons';

const SocialButton = ({ type, href, children, isMobile, onClick, onSocialClick }) => {
  const handleClick = useCallback((e) => {
    // สำหรับปุ่มพิเศษ (qr, ai) ให้ใช้ onSocialClick
    if (type === 'qr' || type === 'ai') {
      e.preventDefault();
      if (onSocialClick) {
        onSocialClick(type);
      }
      return;
    }
    
    // สำหรับลิ้งค์ปกติ ให้เปิดลิ้งค์ในแท็บใหม่
    if (href && href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
    
    // เรียก onClick ถ้ามี
    if (onClick) {
      onClick();
    }
  }, [onSocialClick, onClick, href, type]);

  const handleMouseMove = useCallback((e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    button.style.setProperty('--mouse-x', `${x}px`);
    button.style.setProperty('--mouse-y', `${y}px`);
  }, []);

  const icon = socialIcons[type];
  const isIconPadded = type === 'ai' || type === 'lan';

  return (
    <button
      className={`social-button ${isMobile ? 'mobile' : ''}`}
      data-type={type}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      style={{
        '--mouse-x': '50%',
        '--mouse-y': '50%'
      }}
    >
      <div className={`social-icon ${isIconPadded ? 'padded' : ''}`}>
        {icon}
      </div>
      <span>{children}</span>
    </button>
  );
};

export default SocialButton;