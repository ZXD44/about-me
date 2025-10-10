import React, { useState } from 'react';
import { AnimatedText, useResponsive } from './shared';
import { ProfileCard, animatedTexts } from './features/profile';
import { SocialLinks } from './features/social';
import { QRPopup } from './features/qr-donation';
import { AIChatPopup } from './features/ai-chat';
import './shared/styles/App.css';

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
        <div className="bg-banner" />
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
          Thank You<br />© 2025 is Hdxw,Meo
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
    </div>
  );
}

export default App;