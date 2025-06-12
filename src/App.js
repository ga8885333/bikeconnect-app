import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './contexts/AuthContext';
import BottomNavigation from './components/ui/BottomNavigation';

// Pages
import HomePage from './pages/HomePage';
import SocialPage from './pages/SocialPage';
import GroupsPage from './pages/GroupsPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import FreeMapPage from './pages/FreeMapPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/social" element={<SocialPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/map" element={<FreeMapPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
          <BottomNavigation />
          <Toaster position="top-center" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 