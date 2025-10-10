import React from 'react';
import SocialButton from '../../../shared/components/SocialButton';
import { profile } from '../../profile/data/profile';

const SocialLinks = ({ isMobile, onSocialClick }) => {
  return (
    <div className={`social-buttons ${isMobile ? 'mobile' : ''}`}>
      {profile.socials.map(social => (
        <SocialButton
          key={social.key}
          type={social.key}
          href={social.url}
          isMobile={isMobile}
          onSocialClick={onSocialClick}
        >
          {social.label}
        </SocialButton>
      ))}
    </div>
  );
};

export default SocialLinks;