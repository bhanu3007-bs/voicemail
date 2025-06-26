import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Trash2, Save } from 'lucide-react';
import { useAudioFeedback } from '../contexts/AudioFeedbackContext';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const { playSound, announceMessage } = useAudioFeedback();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    audioChunksRef.current = [];
    setAudioURL(null);
    setRecordingTime(0);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        onRecordingComplete(audioBlob);
        
        // Stop all tracks from the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      playSound('recording');
      announceMessage("Recording started. Speak now.");
      
      // Start the timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      announceMessage("Could not access microphone. Please ensure microphone permissions are enabled.");
      playSound('error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      playSound('click');
      announceMessage("Recording stopped. You can now play back your message.");
    }
  };

  const playRecording = () => {
    if (audioURL && audioElementRef.current) {
      audioElementRef.current.play();
      setIsPlaying(true);
      playSound('click');
      announceMessage("Playing your recorded message.");
    }
  };

  const deleteRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL(null);
      audioChunksRef.current = [];
      playSound('notification');
      announceMessage("Recording deleted.");
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    announceMessage("Playback complete.");
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">
        Record Your Message
      </h2>
      
      <div className="flex flex-col items-center">
        <div 
          className={`
            w-full h-24 mb-4 rounded-lg flex items-center justify-center
            ${isRecording ? 'bg-red-100 dark:bg-red-900/30' : 'bg-slate-100 dark:bg-slate-700'}
          `}
          aria-live="polite"
        >
          {isRecording ? (
            <div className="flex flex-col items-center">
              <div className="flex space-x-1 mb-2">
                <div className="w-2 h-6 bg-red-500 animate-pulse"></div>
                <div className="w-2 h-8 bg-red-500 animate-pulse delay-75"></div>
                <div className="w-2 h-4 bg-red-500 animate-pulse delay-150"></div>
                <div className="w-2 h-10 bg-red-500 animate-pulse delay-300"></div>
                <div className="w-2 h-5 bg-red-500 animate-pulse delay-200"></div>
              </div>
              <div className="text-red-600 dark:text-red-400 font-medium">
                Recording: {formatTime(recordingTime)}
              </div>
            </div>
          ) : audioURL ? (
            <div className="w-full px-4">
              <audio 
                ref={audioElementRef} 
                src={audioURL} 
                className="w-full" 
                controls 
                onEnded={handleAudioEnded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
          ) : (
            <p className="text-slate-500 dark:text-slate-400">
              Press the record button to start recording
            </p>
          )}
        </div>
        
        <div className="flex space-x-4">
          {!isRecording && !audioURL && (
            <button
              onClick={startRecording}
              className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 focus-ring transition-colors"
              aria-label="Start recording"
            >
              <Mic className="h-6 w-6" />
            </button>
          )}
          
          {isRecording && (
            <button
              onClick={stopRecording}
              className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 focus-ring transition-colors animate-pulse"
              aria-label="Stop recording"
              data-recording="true"
            >
              <Square className="h-6 w-6" />
            </button>
          )}
          
          {audioURL && !isPlaying && (
            <button
              onClick={playRecording}
              className="p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus-ring transition-colors"
              aria-label="Play recording"
            >
              <Play className="h-6 w-6" />
            </button>
          )}
          
          {audioURL && (
            <button
              onClick={deleteRecording}
              className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 focus-ring transition-colors"
              aria-label="Delete recording"
            >
              <Trash2 className="h-6 w-6" />
            </button>
          )}
          
          {audioURL && (
            <button
              onClick={() => {
                playSound('success');
                announceMessage("Recording saved successfully.");
              }}
              className="p-4 bg-green-600 text-white rounded-full hover:bg-green-700 focus-ring transition-colors"
              aria-label="Save recording"
            >
              <Save className="h-6 w-6" />
            </button>
          )}
        </div>
        
        <div className="w-full mt-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
            {isRecording ? 
              "Recording in progress. Press the square button to stop." : 
              audioURL ? 
                "Recording complete. Use the buttons to play, delete, or save your message." : 
                "Press the microphone button to start recording your message."
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceRecorder;