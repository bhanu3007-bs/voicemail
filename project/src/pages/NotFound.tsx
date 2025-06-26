import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useAudioFeedback } from '../contexts/AudioFeedbackContext';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { playSound, announceMessage } = useAudioFeedback();

  React.useEffect(() => {
    announceMessage('Page not found. The page you are looking for does not exist.');
  }, [announceMessage]);

  const goHome = () => {
    navigate('/');
    playSound('click');
    announceMessage('Navigating to dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Page Not Found</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={goHome}
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg focus-ring transition-colors"
          aria-label="Return to dashboard"
        >
          <Home className="h-5 w-5 mr-2" />
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;