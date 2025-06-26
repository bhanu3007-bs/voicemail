import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Trash2, Download, Search, Filter } from 'lucide-react';
import Header from '../components/Header';
import { useAudioFeedback } from '../contexts/AudioFeedbackContext';

interface Message {
  id: string;
  sender: string;
  subject: string;
  timestamp: string;
  duration: string;
  isNew: boolean;
}

const Inbox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'Sarah Johnson', subject: 'Project Update', timestamp: '2 hours ago', duration: '1:24', isNew: true },
    { id: '2', sender: 'Michael Chen', subject: 'Meeting Reminder', timestamp: '1 day ago', duration: '0:45', isNew: true },
    { id: '3', sender: 'Alex Rodriguez', subject: 'Vacation Plans', timestamp: '3 days ago', duration: '2:10', isNew: true },
    { id: '4', sender: 'Emma Thompson', subject: 'Weekly Report', timestamp: '1 week ago', duration: '3:22', isNew: false },
    { id: '5', sender: 'David Wilson', subject: 'Conference Call', timestamp: '2 weeks ago', duration: '5:07', isNew: false },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'new' | 'old'>('all');
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const { playSound, announceMessage } = useAudioFeedback();
  const navigate = useNavigate();

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.sender.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'new') return matchesSearch && message.isNew;
    if (filter === 'old') return matchesSearch && !message.isNew;
    
    return matchesSearch;
  });

  const handleMessageClick = (id: string, sender: string) => {
    playSound('click');
    announceMessage(`Opening message from ${sender}`);
    navigate(`/message/${id}`);
  };

  const toggleMessageSelection = (id: string) => {
    setSelectedMessages(prev => 
      prev.includes(id) 
        ? prev.filter(msgId => msgId !== id)
        : [...prev, id]
    );
    
    const message = messages.find(msg => msg.id === id);
    if (message) {
      playSound('click');
      announceMessage(
        selectedMessages.includes(id) 
          ? `Deselected message from ${message.sender}` 
          : `Selected message from ${message.sender}`
      );
    }
  };

  const deleteSelectedMessages = () => {
    if (selectedMessages.length === 0) {
      announceMessage('No messages selected for deletion');
      return;
    }
    
    setMessages(prev => prev.filter(message => !selectedMessages.includes(message.id)));
    announceMessage(`Deleted ${selectedMessages.length} messages`);
    playSound('notification');
    setSelectedMessages([]);
  };

  const downloadSelectedMessages = () => {
    if (selectedMessages.length === 0) {
      announceMessage('No messages selected for download');
      return;
    }
    
    // In a real app, this would trigger actual downloads
    announceMessage(`Downloaded ${selectedMessages.length} messages`);
    playSound('success');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value) {
      announceMessage(`Searching for ${e.target.value}`);
    }
  };

  const handleFilterChange = (newFilter: 'all' | 'new' | 'old') => {
    setFilter(newFilter);
    playSound('click');
    
    const filterLabels = {
      all: 'all messages',
      new: 'new messages',
      old: 'read messages'
    };
    
    announceMessage(`Filtered to show ${filterLabels[newFilter]}`);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Inbox
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Manage your voice messages
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
          {/* Search and Filters */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="accessible-input pl-10"
                  placeholder="Search messages"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  aria-label="Search messages"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-slate-700 dark:text-slate-300 mr-2 flex items-center">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter:
                </span>
                <div className="flex rounded-md shadow-sm" role="group" aria-label="Message filter options">
                  <button
                    onClick={() => handleFilterChange('all')}
                    className={`px-3 py-2 text-sm font-medium rounded-l-md ${
                      filter === 'all' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                    aria-pressed={filter === 'all'}
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleFilterChange('new')}
                    className={`px-3 py-2 text-sm font-medium ${
                      filter === 'new' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                    aria-pressed={filter === 'new'}
                  >
                    New
                  </button>
                  <button
                    onClick={() => handleFilterChange('old')}
                    className={`px-3 py-2 text-sm font-medium rounded-r-md ${
                      filter === 'old' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                    aria-pressed={filter === 'old'}
                  >
                    Read
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bulk Actions */}
          {selectedMessages.length > 0 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 flex items-center justify-between">
              <p className="text-blue-700 dark:text-blue-300">
                {selectedMessages.length} message{selectedMessages.length > 1 ? 's' : ''} selected
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={downloadSelectedMessages}
                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus-ring"
                  aria-label={`Download ${selectedMessages.length} selected messages`}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </button>
                <button
                  onClick={deleteSelectedMessages}
                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus-ring"
                  aria-label={`Delete ${selectedMessages.length} selected messages`}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          )}
          
          {/* Message List */}
          {filteredMessages.length > 0 ? (
            <ul className="divide-y divide-slate-200 dark:divide-slate-700" role="list" aria-label="Messages">
              {filteredMessages.map((message) => (
                <li key={message.id} className="relative">
                  <div className="flex items-center py-4 px-6">
                    <div className="min-w-0 flex-1">
                      <div 
                        className={`flex items-center ${selectedMessages.includes(message.id) ? 'bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2' : ''}`}
                      >
                        <input
                          type="checkbox"
                          className="h-5 w-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                          checked={selectedMessages.includes(message.id)}
                          onChange={() => toggleMessageSelection(message.id)}
                          aria-label={`Select message from ${message.sender}`}
                        />
                        
                        <button
                          onClick={() => handleMessageClick(message.id, message.sender)}
                          className="ml-4 block flex-1 text-left focus-ring rounded-lg p-2 hover:bg-slate-50 dark:hover:bg-slate-700"
                          aria-label={`Message from ${message.sender} about ${message.subject}, received ${message.timestamp}, duration ${message.duration}${message.isNew ? ', new message' : ''}`}
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
                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                              <span className="mr-4">{message.timestamp}</span>
                              <span className="flex items-center">
                                <Play className="h-4 w-4 mr-1" />
                                {message.duration}
                              </span>
                            </div>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 mt-1">
                            {message.subject}
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center">
              <p className="text-slate-500 dark:text-slate-400">
                {searchTerm 
                  ? 'No messages found matching your search'
                  : filter !== 'all'
                    ? `No ${filter === 'new' ? 'new' : 'read'} messages`
                    : 'Your inbox is empty'
                }
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Inbox;