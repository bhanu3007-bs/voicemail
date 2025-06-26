import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, User, Home, Inbox, MessageSquare, Mic, MicOff, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useVoiceCommand } from '../contexts/VoiceCommandContext';
import { useAudioFeedback } from '../contexts/AudioFeedbackContext';

const Header: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const { isListening, toggleListening } = useVoiceCommand();
  const { playSound, announceMessage } = useAudioFeedback();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    playSound('click');
    announceMessage(isDarkMode ? 'Light mode activated' : 'Dark mode activated');
  };

  const handleLogout = () => {
    playSound('logout');
    logout();
    navigate('/login');
  };

  const handleNavigation = (path: string, name: string) => {
    navigate(path);
    setIsMenuOpen(false);
    playSound('click');
    announceMessage(`Navigating to ${name}`);
  };

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md focus-ring text-slate-700 dark:text-slate-200"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="ml-3 text-xl font-bold text-blue-700 dark:text-blue-400">
              Voice Mail
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleListening}
              className={`p-2 rounded-full focus-ring ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
              }`}
              aria-label={isListening ? "Stop voice commands" : "Start voice commands"}
              aria-pressed={isListening}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus-ring"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={isDarkMode}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            {user && (
              <div className="relative">
                <button
                  className="flex items-center space-x-1 focus-ring p-1 rounded-full"
                  aria-label="User menu"
                >
                  <div className="bg-blue-600 p-1 rounded-full text-white">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="hidden md:block text-sm font-medium">{user.name}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <nav
          className="fixed inset-0 z-40 bg-slate-900 bg-opacity-50"
          aria-label="Main Navigation"
        >
          <div 
            className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-800 shadow-xl p-4 transform transition-transform duration-300"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-blue-700 dark:text-blue-400">Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-md focus-ring text-slate-700 dark:text-slate-200"
                aria-label="Close menu"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => handleNavigation('/', 'Dashboard')}
                  className="flex items-center w-full p-3 rounded-md focus-ring hover:bg-slate-100 dark:hover:bg-slate-700"
                  aria-label="Go to dashboard"
                >
                  <Home className="h-5 w-5 mr-3 text-blue-600" />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/inbox', 'Inbox')}
                  className="flex items-center w-full p-3 rounded-md focus-ring hover:bg-slate-100 dark:hover:bg-slate-700"
                  aria-label="Go to inbox"
                >
                  <Inbox className="h-5 w-5 mr-3 text-blue-600" />
                  <span>Inbox</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/compose', 'Compose Message')}
                  className="flex items-center w-full p-3 rounded-md focus-ring hover:bg-slate-100 dark:hover:bg-slate-700"
                  aria-label="Compose new message"
                >
                  <MessageSquare className="h-5 w-5 mr-3 text-blue-600" />
                  <span>New Message</span>
                </button>
              </li>
              <li className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full p-3 rounded-md focus-ring hover:bg-slate-100 dark:hover:bg-slate-700 text-red-500"
                  aria-label="Log out"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;