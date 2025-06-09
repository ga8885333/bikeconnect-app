import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// 導入頁面組件
import HomePage from './pages/HomePage';
import GroupsPage from './pages/GroupsPage';
import MapPage from './pages/MapPage';
import StoreMapPage from './pages/FreeMapPage';
import SocialPage from './pages/SocialPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';

// 導入組件
import BottomNavigation from './components/BottomNavigation';
import AuthProvider, { useAuth } from './contexts/AuthContext';

function AppContent() {
  const location = useLocation();
  const { user, loading } = useAuth();
  
  // 檢查是否需要顯示底部導覽
  const hideBottomNav = location.pathname === '/auth' || location.pathname === '/login';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-bike-500 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4 pulse-bike">
            <span className="text-3xl">🏍️</span>
          </div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className={`${!hideBottomNav ? 'pb-20' : ''}`}>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={user ? <HomePage /> : <AuthPage />} />
          <Route path="/groups" element={user ? <GroupsPage /> : <AuthPage />} />
          <Route path="/map" element={user ? <MapPage /> : <AuthPage />} />
          <Route path="/store-map" element={user ? <StoreMapPage /> : <AuthPage />} />
          <Route path="/social" element={user ? <SocialPage /> : <AuthPage />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <AuthPage />} />
        </Routes>
      </main>
      
      {!hideBottomNav && user && (
        <BottomNavigation />
      )}
      
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#1f2937',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App; 