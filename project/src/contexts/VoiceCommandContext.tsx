import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudioFeedback } from './AudioFeedbackContext';
import { useAuth } from './AuthContext';

interface VoiceCommandContextType {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  recognizedText: string;
  executeCommand: (command: string) => void;
}

const VoiceCommandContext = createContext<VoiceCommandContextType | undefined>(undefined);

export const useVoiceCommand = () => {
  const context = useContext(VoiceCommandContext);
  if (context === undefined) {
    throw new Error('useVoiceCommand must be used within a VoiceCommandProvider');
  }
  return context;
};

interface VoiceCommandProviderProps {
  children: ReactNode;
}

export const VoiceCommandProvider = ({ children }: VoiceCommandProviderProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const navigate = useNavigate();
  const { announceMessage, playSound } = useAudioFeedback();
  const { logout, isAuthenticated } = useAuth();

  // Mock SpeechRecognition if not available
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (recognition) {
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
        setRecognizedText(transcript);
        executeCommand(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'no-speech') {
          announceMessage('No speech detected. Please try again.');
        } else {
          announceMessage('Voice recognition error. Please try again.');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening) {
          recognition.start();
        }
      };
    }

    return () => {
      if (recognition && isListening) {
        recognition.stop();
      }
    };
  }, [isListening]);

  const startListening = () => {
    if (recognition) {
      try {
        recognition.start();
        setIsListening(true);
        playSound('click');
        announceMessage('Voice commands activated. What would you like to do?');
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    } else {
      announceMessage('Speech recognition is not supported in your browser.');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      playSound('click');
      announceMessage('Voice commands deactivated.');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const executeCommand = (command: string) => {
    if (!isAuthenticated && !command.includes('login')) {
      announceMessage('Please log in first.');
      return;
    }

    // Navigation commands
    if (command.includes('go to inbox') || command.includes('open inbox')) {
      navigate('/inbox');
      announceMessage('Opening inbox');
      playSound('success');
    } else if (command.includes('go to dashboard') || command.includes('open dashboard') || command.includes('go home')) {
      navigate('/');
      announceMessage('Opening dashboard');
      playSound('success');
    } else if (command.includes('compose message') || command.includes('new message') || command.includes('send message')) {
      navigate('/compose');
      announceMessage('Opening compose message');
      playSound('success');
    } else if (command.includes('logout') || command.includes('sign out')) {
      logout();
      navigate('/login');
      announceMessage('Logging out');
      playSound('logout');
    } else if (command.includes('login') || command.includes('sign in')) {
      navigate('/login');
      announceMessage('Opening login page');
      playSound('click');
    } else {
      announceMessage('Command not recognized: ' + command);
      playSound('error');
    }
  };

  const value = {
    isListening,
    startListening,
    stopListening,
    toggleListening,
    recognizedText,
    executeCommand
  };

  return <VoiceCommandContext.Provider value={value}>{children}</VoiceCommandContext.Provider>;
};