import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Mail, Key } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAudioFeedback } from '../contexts/AudioFeedbackContext';
import FaceScanLogin from '../components/FaceScanLogin';

const LoginPage: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<'face' | 'credentials'>('face');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const { playSound, announceMessage } = useAudioFeedback();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    playSound('click');
    
    try {
      await login(loginMethod === 'face');
      playSound('login');
      announceMessage('Login successful. Welcome to Voice Mail.');
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const toggleLoginMethod = () => {
    setLoginMethod(prev => prev === 'face' ? 'credentials' : 'face');
    playSound('click');
    announceMessage(`Switched to ${loginMethod === 'face' ? 'credential' : 'face scan'} login.`);
  };

  const handleFaceLoginSuccess = async () => {
    try {
      await login(true);
      playSound('login');
      announceMessage('Face scan successful. Welcome to Voice Mail.');
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleFaceLoginError = (errorMsg: string) => {
    announceMessage(errorMsg);
    setLoginMethod('credentials');
  };

  const startVoiceInput = () => {
    // This would be implemented with speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      playSound('recording');
      announceMessage('Voice input activated. Please speak your email and password.');
      // Simulating voice input for demo
      setTimeout(() => {
        setEmail('demo@example.com');
        setPassword('password123');
        announceMessage('Voice input detected: demo@example.com');
        playSound('success');
      }, 3000);
    } else {
      announceMessage('Speech recognition not supported in your browser.');
      playSound('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-indigo-100 dark:from-slate-900 dark:to-indigo-950 p-4">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
        role="region"
        aria-label="Login form"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400">
              Voice Mail
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Accessible voice messaging for everyone
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <button
              onClick={toggleLoginMethod}
              className="text-blue-600 dark:text-blue-400 text-sm font-medium focus-ring rounded px-3 py-1"
              aria-pressed={loginMethod === 'credentials'}
            >
              {loginMethod === 'face' ? 'Use Email Instead' : 'Use Face Scan Instead'}
            </button>
          </div>

          {loginMethod === 'face' ? (
            <FaceScanLogin 
              onSuccess={handleFaceLoginSuccess} 
              onError={handleFaceLoginError} 
            />
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-slate-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="accessible-input pl-10"
                    placeholder="Enter your email"
                    required
                    aria-required="true"
                  />
                </div>
              </div>
              
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-slate-400">
                    <Key className="h-5 w-5" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="accessible-input pl-10"
                    placeholder="Enter your password"
                    required
                    aria-required="true"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={startVoiceInput}
                  className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium focus-ring rounded px-3 py-1"
                  aria-label="Use voice input for login"
                >
                  <Mic className="h-4 w-4 mr-1" />
                  <span>Voice Input</span>
                </button>
                
                <a 
                  href="#" 
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-ring rounded px-2 py-1"
                  onClick={(e) => {
                    e.preventDefault();
                    announceMessage("Password reset functionality is not available in this demo.");
                  }}
                >
                  Forgot password?
                </a>
              </div>
              
              {error && (
                <div 
                  className="text-red-500 text-sm mt-2" 
                  role="alert"
                  aria-live="assertive"
                >
                  {error}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full py-3 px-4 rounded-lg focus-ring text-white text-lg font-medium
                  ${loading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 transition-colors'
                  }
                `}
                aria-busy={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  'Log In'
                )}
              </button>
            </form>
          )}
        </div>
        
        <div className="px-8 py-4 bg-slate-50 dark:bg-slate-700 border-t border-slate-200 dark:border-slate-600">
          <p className="text-sm text-slate-600 dark:text-slate-300 text-center">
            Demo account: demo@example.com / password123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;