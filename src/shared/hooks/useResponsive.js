import { useState, useEffect, useCallback } from 'react';

export function useResponsive() {
  const [isMobile, setIsMobile] = useState(() => {
    try {
      return window.innerWidth <= 600;
    } catch (error) {
      console.warn('Error getting window width:', error);
      return false;
    }
  });

  const handleResize = useCallback(() => {
    try {
      setIsMobile(window.innerWidth <= 600);
    } catch (error) {
      console.warn('Error in resize handler:', error);
    }
  }, []);

  useEffect(() => {
    try {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    } catch (error) {
      console.warn('Error adding resize listener:', error);
    }
  }, [handleResize]);

  return isMobile;
}