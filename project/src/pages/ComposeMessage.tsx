import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Send, Search, UserPlus, X } from 'lucide-react';
import Header from '../components/Header';
import VoiceRecorder from '../components/VoiceRecorder';
import { useAudioFeedback } from '../contexts/AudioFeedbackContext';

interface Contact {
  id: string;
  name: string;
  email: string;
}

const ComposeMessage: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSelectingRecipients, setIsSelectingRecipients] = useState(false);
  const { playSound, announceMessage } = useAudioFeedback();
  const navigate = useNavigate();
  
  // Mock contacts
  const contacts: Contact[] = [
    { id: '1', name: 'Sarah Johnson', email: 'sarah.j@example.com' },
    { id: '2', name: 'Michael Chen', email: 'michael.c@example.com' },
    { id: '3', name: 'Alex Rodriguez', email: 'alex.r@example.com' },
    { id: '4', name: 'Emma Thompson', email: 'emma.t@example.com' },
    { id: '5', name: 'David Wilson', email: 'david.w@example.com' },
  ];

  const filteredContacts = contacts.filter(
    contact => !selectedContacts.some(selected => selected.id === contact.id) &&
    (contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     contact.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRecordingComplete = (blob: Blob) => {
    setAudioBlob(blob);
  };

  const toggleRecipientSelection = () => {
    setIsSelectingRecipients(prev => !prev);
    playSound('click');
    announceMessage(isSelectingRecipients ? 'Closing recipient selection' : 'Opening recipient selection');
  };

  const addRecipient = (contact: Contact) => {
    setSelectedContacts(prev => [...prev, contact]);
    setSearchTerm('');
    playSound('click');
    announceMessage(`Added ${contact.name} as recipient`);
  };

  const removeRecipient = (id: string) => {
    const contact = selectedContacts.find(c => c.id === id);
    setSelectedContacts(prev => prev.filter(contact => contact.id !== id));
    playSound('notification');
    if (contact) {
      announceMessage(`Removed ${contact.name} from recipients`);
    }
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubjectVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      playSound('recording');
      announceMessage('Speak the subject of your message');
      
      // Simulate voice input for demo
      setTimeout(() => {
        setSubject('Voice recorded subject line');
        playSound('success');
        announceMessage('Subject recorded: Voice recorded subject line');
      }, 2000);
    } else {
      announceMessage('Speech recognition not supported in your browser');
      playSound('error');
    }
  };

  const handleSend = () => {
    if (!audioBlob) {
      announceMessage('Please record a message before sending');
      playSound('error');
      return;
    }
    
    if (selectedContacts.length === 0) {
      announceMessage('Please select at least one recipient');
      playSound('error');
      return;
    }
    
    // In a real app, this would send the message
    playSound('success');
    announceMessage('Message sent successfully');
    
    setTimeout(() => {
      navigate('/inbox');
    }, 1500);
  };

  const activateVoiceRecipientSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      playSound('recording');
      announceMessage('Speak the name of the person you want to send a message to');
      
      // Simulate voice input for demo
      setTimeout(() => {
        setSearchTerm('Sarah');
        playSound('success');
        announceMessage('Searching for: Sarah');
      }, 2000);
    } else {
      announceMessage('Speech recognition not supported in your browser');
      playSound('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Compose Message
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Record and send a new voice message
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
          <div className="space-y-6">
            {/* Recipients */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label 
                  htmlFor="recipients" 
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Recipients
                </label>
                <button
                  onClick={toggleRecipientSelection}
                  className="text-blue-600 dark:text-blue-400 text-sm font-medium focus-ring rounded px-2 py-1 flex items-center"
                  aria-expanded={isSelectingRecipients}
                  aria-controls="recipient-selection"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  {isSelectingRecipients ? 'Done' : 'Add Recipient'}
                </button>
              </div>
              
              {selectedContacts.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedContacts.map(contact => (
                    <div 
                      key={contact.id}
                      className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full px-3 py-1 text-sm flex items-center"
                    >
                      <User className="h-3 w-3 mr-1" />
                      <span>{contact.name}</span>
                      <button
                        onClick={() => removeRecipient(contact.id)}
                        className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 focus-ring rounded-full"
                        aria-label={`Remove ${contact.name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  No recipients selected
                </p>
              )}
              
              {isSelectingRecipients && (
                <div 
                  id="recipient-selection"
                  className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 mt-2"
                >
                  <div className="flex mb-4">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        className="accessible-input pl-10 pr-10"
                        placeholder="Search contacts"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        aria-label="Search contacts"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-500"
                          aria-label="Clear search"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    <button
                      onClick={activateVoiceRecipientSearch}
                      className="ml-2 p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/30 focus-ring"
                      aria-label="Search by voice"
                    >
                      <User className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto">
                    {filteredContacts.length > 0 ? (
                      <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredContacts.map(contact => (
                          <li key={contact.id}>
                            <button
                              onClick={() => addRecipient(contact)}
                              className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg focus-ring transition-colors"
                              aria-label={`Add ${contact.name} as recipient`}
                            >
                              <div className="flex items-center">
                                <div className="bg-slate-200 dark:bg-slate-600 p-2 rounded-full mr-3">
                                  <User className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900 dark:text-white">{contact.name}</p>
                                  <p className="text-sm text-slate-500 dark:text-slate-400">{contact.email}</p>
                                </div>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center text-slate-500 dark:text-slate-400 py-4">
                        {searchTerm ? 'No contacts found' : 'No more contacts available'}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Subject */}
            <div>
              <label 
                htmlFor="subject" 
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Subject
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="subject"
                  className="accessible-input"
                  placeholder="Enter message subject"
                  value={subject}
                  onChange={handleSubjectChange}
                  aria-label="Message subject"
                />
                <button
                  onClick={handleSubjectVoiceInput}
                  className="ml-2 p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/30 focus-ring"
                  aria-label="Enter subject by voice"
                >
                  <User className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Voice Recorder */}
        <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
        
        {/* Send Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSend}
            disabled={!audioBlob || selectedContacts.length === 0}
            className={`
              flex items-center py-3 px-6 rounded-lg text-white text-lg font-medium focus-ring
              ${!audioBlob || selectedContacts.length === 0
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 transition-colors'
              }
            `}
            aria-label="Send message"
          >
            <Send className="h-5 w-5 mr-2" />
            Send Message
          </button>
        </div>
      </main>
    </div>
  );
};

export default ComposeMessage;