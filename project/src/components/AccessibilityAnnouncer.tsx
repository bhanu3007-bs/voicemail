import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const AccessibilityAnnouncer: React.FC = () => {
  const [announcement, setAnnouncement] = useState('');
  const location = useLocation();

  // Announce route changes
  useEffect(() => {
    const path = location.pathname;
    let pageAnnouncement = '';

    switch (path) {
      case '/':
        pageAnnouncement = 'Dashboard page loaded. Use voice commands to navigate.';
        break;
      case '/login':
        pageAnnouncement = 'Login page loaded. You can use face scan or voice commands to log in.';
        break;
      case '/inbox':
        pageAnnouncement = 'Inbox page loaded. Your messages are displayed below.';
        break;
      case '/compose':
        pageAnnouncement = 'Compose message page loaded. You can record a voice message and select recipients.';
        break;
      default:
        if (path.startsWith('/message/')) {
          pageAnnouncement = 'Message details page loaded. The message is ready to be played.';
        } else {
          pageAnnouncement = 'Page loaded.';
        }
    }

    setAnnouncement(pageAnnouncement);

    // Use browser's speech synthesis to announce the page change
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(pageAnnouncement);
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      window.speechSynthesis.speak(utterance);
    }
  }, [location]);

  return (
    <div 
      className="sr-only" 
      role="status" 
      aria-live="polite" 
      aria-atomic="true"
    >
      {announcement}
    </div>
  );
};

export default AccessibilityAnnouncer;