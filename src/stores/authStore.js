import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';
import { 
  loginWithEmail, 
  loginWithGoogle, 
  registerWithEmail, 
  logout as authLogout,
  onAuthStateChange
} from '../services/firebase/AuthService';
import { getUserProfile } from '../services/firebase/UserService';

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

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // 狀態
      user: null,
      userProfile: null,
      isAuthenticated: false,
      loading: false,
      isOnline: navigator.onLine,
      authStateListener: null,

      // 設置網絡狀態
      setOnlineStatus: (status) => set({ isOnline: status }),

      // 設置載入狀態
      setLoading: (loading) => set({ loading }),

      // 設置用戶狀態
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      // 設置用戶資料
      setUserProfile: (userProfile) => set({ userProfile }),

      // 初始化認證監聽器
      initAuthListener: () => {
        const { authStateListener } = get();
        
        // 避免重複設置監聽器
        if (authStateListener) return;

        const unsubscribe = onAuthStateChange(async (firebaseUser) => {
          set({ loading: true });
          
          if (firebaseUser) {
            set({ user: firebaseUser, isAuthenticated: true });
            
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
              set({ userProfile: profileResult.data });
            } else {
              // 使用 Firebase 用戶數據作為後備
              set({
                userProfile: {
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
              });
            }
          } else {
            set({ 
              user: null, 
              userProfile: null, 
              isAuthenticated: false 
            });
          }
          
          set({ loading: false });
        });

        set({ authStateListener: unsubscribe });
      },

      // 清理認證監聽器
      cleanupAuthListener: () => {
        const { authStateListener } = get();
        if (authStateListener) {
          authStateListener();
          set({ authStateListener: null });
        }
      },

      // 登入功能
      login: async (email, password, loginType = 'email') => {
        set({ loading: true });
        
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
          set({ loading: false });
        }
      },

      // 註冊功能
      register: async (userData) => {
        set({ loading: true });
        
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
          set({ loading: false });
        }
      },

      // 登出功能
      logout: async () => {
        set({ loading: true });
        
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
          set({ loading: false });
        }
      },

      // 更新用戶資料
      updateUser: (userData) => {
        const { userProfile } = get();
        if (userProfile) {
          const updatedProfile = { ...userProfile, ...userData };
          set({ userProfile: updatedProfile });
        }
      },

      // 刷新用戶資料
      refreshUserProfile: async () => {
        const { user } = get();
        if (!user) return;
        
        const result = await safeOperation(() => getUserProfile(user.uid));
        if (result.success) {
          set({ userProfile: result.data });
        }
      },

      // 工具方法
      isEmailVerified: () => {
        const { user } = get();
        return user?.emailVerified || false;
      },

      getUserLevel: () => {
        const { userProfile } = get();
        return userProfile?.level || 'BASIC';
      },

      isVipUser: () => {
        const { userProfile } = get();
        const level = userProfile?.level || 'BASIC';
        return ['PRO', 'VIP', 'PREMIUM'].includes(level);
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        userProfile: state.userProfile,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

// 網絡狀態監聽
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useAuthStore.getState().setOnlineStatus(true);
  });
  
  window.addEventListener('offline', () => {
    useAuthStore.getState().setOnlineStatus(false);
  });
} 