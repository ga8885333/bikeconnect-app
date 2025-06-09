import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 檢查本地存儲中的用戶信息
    const savedUser = localStorage.getItem('bikeapp_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // 模擬登入API調用
      const mockUser = {
        id: '1',
        email: email,
        name: '騎行者',
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150',
        phone: '+886 912345678',
        verified: true,
        premiumMember: false,
        stats: {
          totalDistance: 1250,
          totalRides: 89,
          totalTime: 156
        }
      };
      
      localStorage.setItem('bikeapp_user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast.success('登入成功！');
      return { success: true };
    } catch (error) {
      toast.error('登入失敗，請重試');
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      // 模擬註冊API調用
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        verified: false,
        premiumMember: false,
        stats: {
          totalDistance: 0,
          totalRides: 0,
          totalTime: 0
        }
      };
      
      localStorage.setItem('bikeapp_user', JSON.stringify(newUser));
      setUser(newUser);
      toast.success('註冊成功！');
      return { success: true };
    } catch (error) {
      toast.error('註冊失敗，請重試');
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('bikeapp_user');
    setUser(null);
    toast.success('已登出');
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('bikeapp_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    toast.success('資料更新成功');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 