import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email, password) => {
    // 模擬登錄邏輯
    const mockUser = {
      id: '1',
      name: '騎行者',
      email: email,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      verified: true,
      level: 'PRO',
      stats: {
        totalDistance: '1,235',
        totalRides: '89',
        avgSpeed: '15.2'
      }
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    return { success: true };
  };

  const register = async (userData) => {
    // 模擬註冊邏輯
    const { email, password, name } = userData;
    const mockUser = {
      id: Date.now().toString(),
      name: name || '新騎行者',
      email: email,
      avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150',
      verified: false,
      level: 'BASIC',
      stats: {
        totalDistance: '0',
        totalRides: '0',
        avgSpeed: '0'
      }
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    return { success: true };
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 