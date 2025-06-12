import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import BottomNavigation from './components/ui/BottomNavigation';

// i18n 初始化
import './i18n';

// Pages
import HomePage from './pages/HomePage';
import SocialPage from './pages/SocialPage';
import GroupsPage from './pages/GroupsPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import FreeMapPage from './pages/FreeMapPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/social" element={<SocialPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/map" element={<FreeMapPage />} />
        </Routes>
        <BottomNavigation />
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#ef4444',
              color: '#ffffff',
              fontWeight: '600',
              borderRadius: '12px',
              padding: '16px 20px'
            }
          }}
        />
      </div>
    </Router>
  );
}

export default App; 