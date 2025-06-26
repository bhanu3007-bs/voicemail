import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, ArrowLeft, Download, Trash2, Forward, Reply, Volume2 } from 'lucide-react';
import Header from '../components/Header';
import { useAudioFeedback } from '../contexts/AudioFeedbackContext';

interface Message {
  id: string;
  sender: string;
  subject: string;
  timestamp: string;
  duration: string;
  isNew: boolean;
  audioURL: string;
}

const MessageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState<Message | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const { playSound, announceMessage } = useAudioFeedback();
  const navigate = useNavigate();

  // Mock message data - in a real app, this would come from an API
  useEffect(() => {
    const mockMessages: { [key: string]: Message } = {
      '1': {
        id: '1',
        sender: 'Sarah Johnson',
        subject: 'Project Update',
        timestamp: '2 hours ago',
        duration: '1:24',
        isNew: true,
        audioURL: 'https://assets.mixkit.co/sfx/preview/mixkit-message-pop-alert-2354.mp3'
      },
      '2': {
        id: '2',
        sender: 'Michael Chen',
        subject: 'Meeting Reminder',
        timestamp: '1 day ago',
        duration: '0:45',
        isNew: true,
        audioURL: 'https://assets.mixkit.co/sfx/preview/mixkit-happy-bells-notification-937.mp3'
      },
      '3': {
        id: '3',
        sender: 'Alex Rodriguez',
        subject: 'Vacation Plans',
        timestamp: '3 days ago',
        duration: '2:10',
        isNew: true,
        audioURL: 'https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3'
      }
    };
    
    if (id && mockMessages[id]) {
      setMessage(mockMessages[id]);
      // Mark as read
      mockMessages[id].isNew = false;
    }
  }, [id]);

  // Set up audio player
  useEffect(() => {
    if (message && audioRef.current) {
      audioRef.current.src = message.audioURL;
      
      audioRef.current.onloadedmetadata = () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      };
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        if (progressIntervalRef.current) {
          window.clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        announceMessage('Message playback complete');
      };
      
      // Auto-announce message details
      announceMessage(`Message from ${message.sender} about ${message.subject}, received ${message.timestamp}`);
    }
    
    return () => {
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
    };
  }, [message, announceMessage]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      playSound('click');
      announceMessage('Playback paused');
    } else {
      audioRef.current.play();
      progressIntervalRef.current = window.setInterval(() => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      }, 100);
      playSound('click');
      announceMessage('Playing message');
    }
    
    setIsPlaying(!isPlaying);
  };

  const goBack = () => {
    navigate('/inbox');
    playSound('click');
    announceMessage('Returning to inbox');
  };

  const downloadMessage = () => {
    if (message) {
      // In a real app, this would trigger an actual download
      playSound('success');
      announceMessage(`Downloading message from ${message.sender}`);
      
      // Simulate download
      const a = document.createElement('a');
      a.href = message.audioURL;
      a.download = `voicemail-${message.id}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const deleteMessage = () => {
    if (message) {
      playSound('notification');
      announceMessage(`Message from ${message.sender} deleted`);
      navigate('/inbox');
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!message) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-slate-500 dark:text-slate-400">Message not found</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center">
          <button
            onClick={goBack}
            className="mr-4 p-2 rounded-full bg-white dark:bg-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 focus-ring transition-colors"
            aria-label="Return to inbox"
          >
            <ArrowLeft className="h-5 w-5 text-slate-700 dark:text-slate-200" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Message Details
          </h1>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
          {/* Message Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {message.subject}
            </h2>
            <div className="flex flex-wrap justify-between items-center text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 p-2 rounded-full mr-3">
                  <span className="font-medium">{message.sender.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-300">{message.sender}</p>
                  <p>{message.timestamp}</p>
                </div>
              </div>
              <div className="flex items-center mt-2 sm:mt-0">
                <Volume2 className="h-4 w-4 mr-1" />
                <span>Duration: {message.duration}</span>
              </div>
            </div>
          </div>
          
          {/* Audio Player */}
          <div className="p-6">
            <audio ref={audioRef} className="hidden" />
            
            <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-6">
              <div className="flex justify-center mb-8">
                <button
                  onClick={togglePlayPause}
                  className={`
                    p-6 rounded-full focus-ring transition-transform hover:scale-110
                    ${isPlaying 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                    } text-white
                  `}
                  aria-label={isPlaying ? 'Pause message' : 'Play message'}
                  aria-pressed={isPlaying}
                >
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                </button>
              </div>
              
              <div className="mb-4">
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-400">
                        {formatTime(currentTime)}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-400">
                        {formatTime(duration)}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-200 dark:bg-slate-600">
                    <div 
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      role="progressbar"
                      aria-valuenow={Math.round((currentTime / duration) * 100)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={downloadMessage}
                  className="flex items-center px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/30 focus-ring transition-colors"
                  aria-label="Download message"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download
                </button>
                <button
                  onClick={() => {
                    playSound('click');
                    announceMessage('Reply feature not implemented in this demo');
                  }}
                  className="flex items-center px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 focus-ring transition-colors"
                  aria-label="Reply to message"
                >
                  <Reply className="h-5 w-5 mr-2" />
                  Reply
                </button>
                <button
                  onClick={() => {
                    playSound('click');
                    announceMessage('Forward feature not implemented in this demo');
                  }}
                  className="flex items-center px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 focus-ring transition-colors"
                  aria-label="Forward message"
                >
                  <Forward className="h-5 w-5 mr-2" />
                  Forward
                </button>
                <button
                  onClick={deleteMessage}
                  className="flex items-center px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/30 focus-ring transition-colors"
                  aria-label="Delete message"
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MessageDetail;