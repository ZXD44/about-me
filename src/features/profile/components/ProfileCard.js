import React, { useState, useEffect, useCallback } from 'react';
import { profile } from '../data/profile';
import { metaVerifyIcon } from '../../../shared/data/icons';

const ProfileCard = ({ isMobile }) => {
  const [isHovered, setIsHovered] = useState(false);

  // ใช้ useCallback เพื่อป้องกันการสร้าง function ใหม่ทุกครั้ง
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const avatarStyle = {
    position: "relative",
    marginBottom: isMobile ? 8 : 10,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
  };

  const avatarImageStyle = {
    width: isMobile ? '90px' : '120px',
    height: isMobile ? '90px' : '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: `3px solid rgba(255, 255, 255, ${isHovered ? 0.6 : 0.3})`,
    boxShadow: isHovered 
      ? `0 8px 24px rgba(0, 0, 0, 0.3), 0 0 20px rgba(100, 200, 255, 0.2)`
      : `0 4px 16px rgba(0, 0, 0, 0.2), 0 0 10px rgba(255, 255, 255, 0.1)`,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    position: 'relative',
    transition: 'all 0.3s ease',
    willChange: 'transform, box-shadow, border-color'
  };

  const glowRingStyle = {
    position: 'absolute',
    top: '-4px',
    left: '-4px',
    right: '-4px',
    bottom: '-4px',
    borderRadius: '50%',
    background: 'conic-gradient(from 0deg, rgba(255, 255, 255, 0.4), rgba(100, 200, 255, 0.3), rgba(255, 100, 200, 0.3), rgba(255, 255, 255, 0.4))',
    zIndex: -1,
    opacity: isHovered ? 1 : 0,
    transition: 'opacity 0.3s ease',
    animation: isHovered ? 'glowRotate 4s linear infinite' : 'none',
    willChange: 'opacity'
  };

  const nameStyle = {
    fontWeight: 700,
    fontSize: isMobile ? '20px' : '28px',
    color: '#0f172a',
    textShadow: isHovered 
      ? '0 2px 6px rgba(0, 0, 0, 0.3), 0 0 15px rgba(100, 200, 255, 0.2)'
      : '0 2px 4px rgba(0, 0, 0, 0.3)',
    marginBottom: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    marginTop: 0,
    marginBottom: 4,
    transition: 'all 0.3s ease',
    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
    willChange: 'transform, text-shadow'
  };

  const usernameStyle = {
    color: '#0f172a',
    fontSize: isMobile ? '14px' : '18px',
    marginBottom: isMobile ? 12 : 18,
    marginTop: 2,
    fontWeight: 600,
    letterSpacing: 0.2,
    textAlign: 'center',
    textShadow: isHovered 
      ? '0 1px 3px rgba(0, 0, 0, 0.3), 0 0 10px rgba(100, 200, 255, 0.15)'
      : '0 1px 2px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    transform: isHovered ? 'scale(1.01)' : 'scale(1)',
    willChange: 'transform, text-shadow'
  };

  return (
    <>
      {/* Avatar with enhanced effects */}
      <div 
        style={avatarStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div style={glowRingStyle} />
        <img
          src={profile.avatar}
          alt="avatar"
          style={avatarImageStyle}
          onContextMenu={e => e.preventDefault()}
          onDragStart={e => e.preventDefault()}
          draggable={false}
        />
      </div>
      
      {/* Name with enhanced effects */}
      <div style={nameStyle}>
        <span>{profile.name}{metaVerifyIcon}</span>
      </div>
      
      {/* Username with enhanced effects */}
      <div style={usernameStyle}>
        {profile.username}
      </div>

      {/* CSS Animations - ลดความซับซ้อน */}
      <style jsx>{`
        @keyframes glowRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default ProfileCard;