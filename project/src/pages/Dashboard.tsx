import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Inbox, VoicemailIcon, Clock, Info } from 'lucide-react';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { useAudioFeedback } from '../contexts/AudioFeedbackContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { playSound, announceMessage } = useAudioFeedback();
  const navigate = useNavigate();

  const stats = [
    { label: 'New Messages', value: 3, icon: <MessageSquare className="h-8 w-8" />, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { label: 'Total Messages', value: 12, icon: <Inbox className="h-8 w-8" />, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
    { label: 'Voice Minutes', value: '8:45', icon: <VoicemailIcon className="h-8 w-8" />, color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
    { label: 'Recent Activity', value: '2h ago', icon: <Clock className="h-8 w-8" />, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  ];

  const quickActions = [
    { label: 'New Message', action: () => navigate('/compose'), color: 'bg-blue-600 hover:bg-blue-700' },
    { label: 'Check Inbox', action: () => navigate('/inbox'), color: 'bg-purple-600 hover:bg-purple-700' },
  ];

  const recentMessages = [
    { id: '1', sender: 'Sarah Johnson', subject: 'Project Update', timestamp: '2 hours ago', isNew: true },
    { id: '2', sender: 'Michael Chen', subject: 'Meeting Reminder', timestamp: '1 day ago', isNew: true },
    { id: '3', sender: 'Alex Rodriguez', subject: 'Vacation Plans', timestamp: '3 days ago', isNew: true },
  ];

  const handleCardClick = (action: () => void, label: string) => {
    playSound('click');
    announceMessage(`Selected ${label}`);
    action();
  };

  const handleMessageClick = (id: string, sender: string) => {
    playSound('click');
    announceMessage(`Opening message from ${sender}`);
    navigate(`/message/${id}`);
  };

  const getTips = () => {
    return [
      "Use voice commands by pressing the microphone button in the header.",
      "Say 'Go to inbox' or 'Open inbox' to navigate to your messages.",
      "Say 'Compose message' to start recording a new message.",
      "Say 'Logout' when you want to exit the application.",
    ];
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome, {user?.name || 'User'}
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Here's an overview of your voice mail account
          </p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 transition-transform hover:scale-105"
              tabIndex={0}
              onClick={() => announceMessage(`${stat.label}: ${stat.value}`)}
              onKeyDown={(e) => e.key === 'Enter' && announceMessage(`${stat.label}: ${stat.value}`)}
              role="button"
              aria-label={`${stat.label}: ${stat.value}`}
            >
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-full mr-4`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleCardClick(action.action, action.label)}
                className={`${action.color} text-white py-4 px-6 rounded-lg font-medium focus-ring transition-transform hover:scale-105 text-lg`}
                aria-label={action.label}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Recent Messages */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Recent Messages
          </h2>
          {recentMessages.length > 0 ? (
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
              {recentMessages.map((message) => (
                <li key={message.id} className="py-4">
                  <button
                    onClick={() => handleMessageClick(message.id, message.sender)}
                    className="w-full text-left focus-ring rounded-lg p-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    aria-label={`Message from ${message.sender} about ${message.subject}, received ${message.timestamp}${message.isNew ? ', new message' : ''}`}
                  >
                    <div className="flex justify-between">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {message.sender}
                        {message.isNew && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            New
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {message.timestamp}
                      </p>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">
                      {message.subject}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-center py-4">
              No recent messages
            </p>
          )}
          <div className="mt-4">
            <button
              onClick={() => handleCardClick(() => navigate('/inbox'), 'View All Messages')}
              className="text-blue-600 dark:text-blue-400 font-medium focus-ring rounded px-3 py-1"
              aria-label="View all messages"
            >
              View All Messages
            </button>
          </div>
        </div>
        
        {/* Accessibility Tips */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Info className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Accessibility Tips
            </h2>
          </div>
          <ul className="space-y-3 text-slate-700 dark:text-slate-300">
            {getTips().map((tip, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 mr-2 flex-shrink-0 text-sm">
                  {index + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;