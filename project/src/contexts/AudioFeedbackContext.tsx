import React, { createContext, useContext, ReactNode } from 'react';

interface AudioFeedbackContextType {
  playSound: (soundType: 'success' | 'error' | 'notification' | 'click' | 'recording' | 'login' | 'logout') => void;
  announceMessage: (message: string) => void;
}

const AudioFeedbackContext = createContext<AudioFeedbackContextType | undefined>(undefined);

export const useAudioFeedback = () => {
  const context = useContext(AudioFeedbackContext);
  if (context === undefined) {
    throw new Error('useAudioFeedback must be used within an AudioFeedbackProvider');
  }
  return context;
};

interface AudioFeedbackProviderProps {
  children: ReactNode;
}

export const AudioFeedbackProvider = ({ children }: AudioFeedbackProviderProps) => {
  // Map of sounds to play for different events
  const sounds = {
    success: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3'),
    error: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alert-quick-chime-766.mp3'),
    notification: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-remove-2576.mp3'),
    click: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-mouse-click-close-1113.mp3'),
    recording: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-multimedia-tech-beep-2566.mp3'),
    login: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3'),
    logout: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-click-900.mp3')
  };

  const playSound = (soundType: keyof typeof sounds) => {
    try {
      // Stop and reset the sound before playing
      sounds[soundType].pause();
      sounds[soundType].currentTime = 0;
      sounds[soundType].play().catch(err => console.error('Audio playback failed:', err));
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const announceMessage = (message: string) => {
    // This would use the browser's speech synthesis API
    if ('speechSynthesis' in window) {
      const announcement = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      window.speechSynthesis.speak(announcement);
    }
  };

  const value = { playSound, announceMessage };

  return <AudioFeedbackContext.Provider value={value}>{children}</AudioFeedbackContext.Provider>;
};