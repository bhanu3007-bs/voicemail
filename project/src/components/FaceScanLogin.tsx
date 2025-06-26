import React, { useState, useEffect } from 'react';
import { Camera, Loader } from 'lucide-react';
import { useAudioFeedback } from '../contexts/AudioFeedbackContext';

interface FaceScanLoginProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

const FaceScanLogin: React.FC<FaceScanLoginProps> = ({ onSuccess, onError }) => {
  const [scanning, setScanning] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const { playSound, announceMessage } = useAudioFeedback();

  const startFaceScan = () => {
    setScanning(true);
    announceMessage("Face scan initiated. Please center your face in the camera. Scanning will begin in 3 seconds.");
    playSound('click');
  };

  useEffect(() => {
    if (scanning) {
      if (countdown > 0) {
        const timerId = setTimeout(() => {
          setCountdown(countdown - 1);
          announceMessage(countdown.toString());
        }, 1000);
        return () => clearTimeout(timerId);
      } else {
        // Simulate face scanning
        announceMessage("Scanning your face. Please remain still.");
        playSound('recording');
        
        const scanTimer = setTimeout(() => {
          // Simulate successful authentication
          const success = Math.random() > 0.2; // 80% success rate for demo
          
          if (success) {
            announceMessage("Face scan successful. Logging you in.");
            playSound('success');
            onSuccess();
          } else {
            announceMessage("Face scan failed. Please try again.");
            playSound('error');
            onError("Face scan failed. Please try again or use an alternative login method.");
          }
          
          setScanning(false);
          setCountdown(3);
        }, 3000);
        
        return () => clearTimeout(scanTimer);
      }
    }
  }, [scanning, countdown, onSuccess, onError, announceMessage, playSound]);

  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          w-64 h-64 border-4 rounded-xl overflow-hidden relative
          ${scanning ? 'border-blue-500 animate-pulse' : 'border-gray-300'}
        `}
        role="img"
        aria-label="Face scan camera view"
      >
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
          {scanning ? (
            countdown > 0 ? (
              <div className="text-6xl font-bold text-blue-600">{countdown}</div>
            ) : (
              <Loader className="w-16 h-16 text-blue-600 animate-spin" />
            )
          ) : (
            <Camera className="w-16 h-16 text-slate-400" />
          )}
        </div>
        
        {/* Scanning overlay */}
        {scanning && countdown === 0 && (
          <div className="absolute inset-0 border-2 border-blue-500 animate-pulse">
            <div className="absolute top-0 left-1/2 w-px h-full bg-blue-500 transform -translate-x-1/2"></div>
            <div className="absolute top-1/2 left-0 w-full h-px bg-blue-500 transform -translate-y-1/2"></div>
          </div>
        )}
      </div>
      
      <button
        onClick={startFaceScan}
        disabled={scanning}
        className={`
          mt-6 py-3 px-6 rounded-lg focus-ring text-lg font-medium transition-colors
          ${scanning 
            ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
          }
        `}
        aria-label="Start face scan"
      >
        {scanning ? 'Scanning...' : 'Scan Face to Login'}
      </button>
      
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 text-center">
        Position your face in the center of the frame and remain still during scanning.
      </p>
    </div>
  );
};

export default FaceScanLogin;