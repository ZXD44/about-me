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

  // Image Rotation Logic
  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [areImagesReady, setAreImagesReady] = useState(false);

  // 1. Preload Images
  useEffect(() => {
    if (!profile.avatars || profile.avatars.length <= 1) return;

    let isMounted = true;
    const imagePromises = profile.avatars.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(src);
        img.onerror = () => resolve(src); // Proceed even if error to avoid blocking
      });
    });

    Promise.all(imagePromises).then(() => {
      if (isMounted) {
        setAreImagesReady(true);
        console.log("All profile images loaded.");
      }
    });

    return () => { isMounted = false; };
  }, []);

  // 2. Start Rotation only after images are ready
  useEffect(() => {
    if (!areImagesReady || profile.avatars.length <= 1) return;

    const interval = setInterval(() => {
      // Step 1: Start Fading Out
      setIsFading(true);

      // Step 2: Change Image after fade out matches CSS transition (400ms defined in CSS)
      // We use 600ms to be safe and ensure it's fully invisible
      setTimeout(() => {
        setCurrentAvatarIndex((prev) => {
          const nextIndex = (prev + 1) % profile.avatars.length;
          return nextIndex;
        });

        // Step 3: Fade In (short delay to allow DOM to update src)
        setTimeout(() => {
          setIsFading(false);
        }, 100);

      }, 600);

    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [areImagesReady]);

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