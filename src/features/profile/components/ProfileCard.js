import React, { useState, useEffect } from 'react';
import { profile } from '../data/profile';
import { metaVerifyIcon } from '../../../shared/data/icons';

const ProfileCard = ({ isMobile }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyDiscord = () => {
    // Remove '@' from the username for correct Discord ID format
    const discordId = profile.username.replace('@', '');

    // Copy to clipboard
    navigator.clipboard.writeText(discordId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!profile.avatars || profile.avatars.length <= 1) return;

    // Preload images for smoothness
    profile.avatars.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentAvatarIndex((prev) => (prev + 1) % profile.avatars.length);
        // Small delay before fading back in to ensure src is swapped
        requestAnimationFrame(() => {
          setIsFading(false);
        });
      }, 600); // Wait 600ms (slightly longer than CSS transition)
    }, 5000); // Switch every 5s

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="avatar-container">
        <img
          src={profile.avatars[currentAvatarIndex]}
          alt="avatar"
          className={`avatar ${isFading ? 'void-transition' : ''}`}
          onContextMenu={e => e.preventDefault()}
          onDragStart={e => e.preventDefault()}
          draggable={false}
        />
        <div className="avatar-glow" />
      </div>

      <div className="profile-name">
        <span>{profile.name}</span>
        <span className="verify-icon">{metaVerifyIcon}</span>
      </div>

      <div
        className="profile-username"
        onClick={handleCopyDiscord}
        style={{
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}
        onMouseOver={(e) => {
          if (!copied) {
            e.currentTarget.style.borderColor = '#5865F2'; // Discord Blurple
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(88, 101, 242, 0.4)';
          }
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.color = 'var(--text-secondary)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {copied ? (
          <span style={{ color: '#5865F2', fontWeight: 600 }}>✓ Copied Discord ID</span>
        ) : (
          <>
            <i className="fa-brands fa-discord" style={{ fontSize: '14px' }}></i>
            {profile.username}
          </>
        )}
      </div>
    </>
  );
};

export default ProfileCard;