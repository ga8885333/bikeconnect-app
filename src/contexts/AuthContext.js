import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  loginWithEmail, 
  loginWithGoogle, 
  registerWithEmail, 
  logout as authLogout,
  onAuthStateChange,
  getCurrentUser
} from '../services/firebase/AuthService';
import { getUserProfile } from '../services/firebase/UserService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * 安全的操作包裝器 - 處理離線狀態
 */
const safeOperation = async (operation, fallbackData = null) => {
  try {
    if (!navigator.onLine) {
      console.warn('離線狀態，使用本地數據');
      return { success: false, message: '目前離線，請檢查網絡連接', data: fallbackData };
    }
    return await operation();
  } catch (error) {
    console.error('操作失敗:', error);
    return { success: false, message: error.message || '操作失敗', data: fallbackData };
  }
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // 監聽網絡狀態
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 監聽認證狀態變化
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsAuthenticated(true);
        
        // 獲取用戶詳細資料
        const profileResult = await safeOperation(
          () => getUserProfile(firebaseUser.uid),
          {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || '騎行者',
            email: firebaseUser.email,
            avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            verified: firebaseUser.emailVerified,
            level: 'BASIC',
            stats: {
              totalDistance: '0',
              totalRides: '0',
              avgSpeed: '0'
            }
          }
        );

        if (profileResult.success) {
          setUserProfile(profileResult.data);
        } else {
          // 使用 Firebase 用戶數據作為後備
          setUserProfile({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || '騎行者',
            email: firebaseUser.email,
            avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            verified: firebaseUser.emailVerified,
            level: 'BASIC',
            stats: {
              totalDistance: '0',
              totalRides: '0',
              avgSpeed: '0'
            }
          });
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  /**
   * 登入功能
   */
  const login = async (email, password, loginType = 'email') => {
    setLoading(true);
    
    try {
      let result;
      
      if (loginType === 'google') {
        result = await safeOperation(() => loginWithGoogle());
      } else {
        result = await safeOperation(() => loginWithEmail(email, password));
      }

      if (result.success) {
        toast.success(result.message || '登入成功');
        return { success: true };
      } else {
        toast.error(result.message || '登入失敗');
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = error.message || '登入失敗';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * 註冊功能
   */
  const register = async (userData) => {
    setLoading(true);
    
    try {
      const result = await safeOperation(() => registerWithEmail(userData));

      if (result.success) {
        toast.success(result.message || '註冊成功');
        return { success: true };
      } else {
        toast.error(result.message || '註冊失敗');
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = error.message || '註冊失敗';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * 登出功能
   */
  const logout = async () => {
    setLoading(true);
    
    try {
      const result = await safeOperation(() => authLogout());
      
      if (result.success) {
        toast.success(result.message || '登出成功');
        return { success: true };
      } else {
        toast.error(result.message || '登出失敗');
        return { success: false, message: result.message };
      }
    } catch (error) {
      const errorMessage = error.message || '登出失敗';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * 更新用戶資料
   */
  const updateUser = (userData) => {
    if (userProfile) {
      const updatedProfile = { ...userProfile, ...userData };
      setUserProfile(updatedProfile);
    }
  };

  /**
   * 刷新用戶資料
   */
  const refreshUserProfile = async () => {
    if (!user) return;
    
    const result = await safeOperation(() => getUserProfile(user.uid));
    if (result.success) {
      setUserProfile(result.data);
    }
  };

  /**
   * 檢查用戶是否已驗證郵箱
   */
  const isEmailVerified = () => {
    return user?.emailVerified || false;
  };

  /**
   * 獲取用戶等級
   */
  const getUserLevel = () => {
    return userProfile?.level || 'BASIC';
  };

  /**
   * 檢查是否為 VIP 用戶
   */
  const isVipUser = () => {
    const level = getUserLevel();
    return ['PRO', 'VIP', 'PREMIUM'].includes(level);
  };

  const value = {
    // 用戶狀態
    user,
    userProfile,
    isAuthenticated,
    loading,
    isOnline,
    
    // 認證方法
    login,
    register,
    logout,
    
    // 用戶資料方法
    updateUser,
    refreshUserProfile,
    
    // 工具方法
    isEmailVerified,
    getUserLevel,
    isVipUser,
    
    // 原始 Firebase 用戶（用於需要直接訪問的情況）
    firebaseUser: user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 