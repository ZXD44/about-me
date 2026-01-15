import React, { useState } from 'react';
import { AnimatedText, useResponsive } from './shared';
import { ProfileCard, animatedTexts } from './features/profile';
import { SocialLinks } from './features/social';
import { QRPopup } from './features/qr-donation';
import { AIChatPopup } from './features/ai-chat';
import { MusicPlayer } from './features/music-player';
import './shared/styles/App.css';

import SeamlessLoopVideo from './shared/components/SeamlessLoopVideo';
import bgVideo from './shared/assets/video/void_background.mp4';

function App() {
  const [popup, setPopup] = useState(null);
  const isMobile = useResponsive();

  const handleSocialClick = (key) => {
    if (key === 'ai') setPopup('chat');
    else if (key === 'lan') setPopup('lan');
    else setPopup(key);
  };

  return (
    <div className="profile-container">
      {/* Background */}
      <div className="background-overlay">
        <SeamlessLoopVideo
          src={bgVideo}
          className="bg-video-container"
        />
      </div>

      {/* Main Content */}
      <div className={`profile-card ${isMobile ? 'mobile' : ''}`}>
        {/* Animated text above avatar */}
        <AnimatedText texts={animatedTexts} />

        {/* Profile Card */}
        <ProfileCard isMobile={isMobile} />

        {/* Social Links */}
        <SocialLinks isMobile={isMobile} onSocialClick={handleSocialClick} />

        {/* Footer */}
        <div className={`footer ${isMobile ? 'mobile' : ''}`}>
          Thank You<br />
          <span style={{ color: '#fff', fontWeight: 500, display: 'block', margin: '5px 0 2px' }}>Sahaphum Thabtawee</span>
          <span style={{ opacity: 0.5, fontSize: '0.85rem' }}>© 2025 - 2026</span>
        </div>
      </div>

      {/* Popups */}
      <QRPopup
        isOpen={popup === 'qr'}
        onClose={() => setPopup(null)}
        isMobile={isMobile}
      />

      <AIChatPopup
        isOpen={popup === 'chat'}
        onClose={() => setPopup(null)}
        isMobile={isMobile}
      />

      {/* Music Player */}
      <MusicPlayer isMobile={isMobile} />
    </div >
  );
}

export default App;