import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set, get) => ({
      // 狀態
      user: null,
      userProfile: null,
      isAuthenticated: false,
      loading: false,

      // 設置用戶
      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: true,
          userProfile: user // 將用戶資料也設為 userProfile
        });
      },

      // 設置用戶資料
      setUserProfile: (userProfile) => {
        set({ userProfile });
      },

      // 更新用戶資料
      updateUser: (userData) => {
        const { userProfile } = get();
        if (userProfile) {
          const updatedProfile = { ...userProfile, ...userData };
          set({ userProfile: updatedProfile });
        }
      },

      // 設置載入狀態
      setLoading: (loading) => set({ loading }),

      // 登入方法
      login: async (email, password) => {
        set({ loading: true });
        
        try {
          // 模擬登入邏輯
          const mockUser = {
            id: '1',
            name: '騎行者',
            email: email,
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            verified: true,
            level: 'BASIC',
            username: '@bikerlee',
            location: '台北市',
            joinDate: '2023-01-15',
            bio: '熱愛騎行的自由靈魂，喜歡探索城市的每個角落 🚴‍♂️',
            stats: {
              totalDistance: '1,235',
              totalRides: '89',
              avgSpeed: '15.2',
              followers: '245',
              following: '189',
              achievements: '15'
            }
          };

          set({ 
            user: mockUser, 
            userProfile: mockUser,
            isAuthenticated: true,
            loading: false 
          });

          return { success: true, message: '登入成功' };
        } catch (error) {
          set({ loading: false });
          return { success: false, message: '登入失敗' };
        }
      },

      // 登出方法
      logout: () => {
        set({ 
          user: null, 
          userProfile: null,
          isAuthenticated: false,
          loading: false
        });
        return { success: true, message: '登出成功' };
      },

      // 註冊方法
      register: async (userData) => {
        set({ loading: true });
        
        try {
          // 模擬註冊邏輯
          const newUser = {
            id: Date.now().toString(),
            name: userData.name || '新騎行者',
            email: userData.email,
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            verified: false,
            level: 'BASIC',
            username: `@${userData.name?.toLowerCase() || 'newbiker'}`,
            location: userData.location || '台北市',
            joinDate: new Date().toISOString(),
            bio: '新加入的騎行愛好者',
            stats: {
              totalDistance: '0',
              totalRides: '0',
              avgSpeed: '0',
              followers: '0',
              following: '0',
              achievements: '0'
            }
          };

          set({ 
            user: newUser, 
            userProfile: newUser,
            isAuthenticated: true,
            loading: false 
          });

          return { success: true, message: '註冊成功' };
        } catch (error) {
          set({ loading: false });
          return { success: false, message: '註冊失敗' };
        }
      }
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        userProfile: state.userProfile,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
); 