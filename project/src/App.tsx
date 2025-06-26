import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AudioFeedbackProvider } from './contexts/AudioFeedbackContext';
import { VoiceCommandProvider } from './contexts/VoiceCommandContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Inbox from './pages/Inbox';
import ComposeMessage from './pages/ComposeMessage';
import MessageDetail from './pages/MessageDetail';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import AccessibilityAnnouncer from './components/AccessibilityAnnouncer';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AudioFeedbackProvider>
          <VoiceCommandProvider>
            <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
              <AccessibilityAnnouncer />
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/inbox" element={<PrivateRoute><Inbox /></PrivateRoute>} />
                <Route path="/compose" element={<PrivateRoute><ComposeMessage /></PrivateRoute>} />
                <Route path="/message/:id" element={<PrivateRoute><MessageDetail /></PrivateRoute>} />
                <Route path="/not-found" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/not-found" replace />} />
              </Routes>
            </div>
          </VoiceCommandProvider>
        </AudioFeedbackProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;