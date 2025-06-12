import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set, get) => ({
      // 導航狀態
      currentPage: 'home',
      navigationHistory: [],

      // 模態框狀態
      modals: {
        showLoginModal: false,
        showRegisterModal: false,
        showProfileModal: false,
        showSettingsModal: false,
        showCommentModal: false,
        showCreatePostModal: false,
        showCreateEventModal: false
      },

      // 通知狀態
      notifications: [],
      unreadCount: 0,

      // 載入狀態
      globalLoading: false,
      pageLoading: {},

      // 主題設定
      theme: 'light',
      language: 'zh-TW',

      // 設置當前頁面
      setCurrentPage: (page) => {
        const { currentPage, navigationHistory } = get();
        const newHistory = [...navigationHistory, currentPage].slice(-10); // 保留最近10頁
        set({ 
          currentPage: page, 
          navigationHistory: newHistory 
        });
      },

      // 返回上一頁
      goBack: () => {
        const { navigationHistory } = get();
        if (navigationHistory.length > 0) {
          const previousPage = navigationHistory[navigationHistory.length - 1];
          const newHistory = navigationHistory.slice(0, -1);
          set({ 
            currentPage: previousPage, 
            navigationHistory: newHistory 
          });
          return previousPage;
        }
        return null;
      },

      // 模態框控制
      openModal: (modalName) => {
        set((state) => ({
          modals: {
            ...state.modals,
            [modalName]: true
          }
        }));
      },

      closeModal: (modalName) => {
        set((state) => ({
          modals: {
            ...state.modals,
            [modalName]: false
          }
        }));
      },

      closeAllModals: () => {
        set((state) => ({
          modals: Object.keys(state.modals).reduce((acc, key) => {
            acc[key] = false;
            return acc;
          }, {})
        }));
      },

      // 通知管理
      addNotification: (notification) => {
        const id = Date.now().toString();
        const newNotification = {
          id,
          timestamp: new Date().toISOString(),
          read: false,
          ...notification
        };
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1
        }));
        
        return id;
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      },

      markNotificationAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1)
        }));
      },

      markAllNotificationsAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, read: true })),
          unreadCount: 0
        }));
      },

      clearNotifications: () => {
        set({ notifications: [], unreadCount: 0 });
      },

      // 載入狀態管理
      setGlobalLoading: (loading) => set({ globalLoading: loading }),

      setPageLoading: (page, loading) => {
        set((state) => ({
          pageLoading: {
            ...state.pageLoading,
            [page]: loading
          }
        }));
      },

      // 主題設定
      setTheme: (theme) => set({ theme }),

      setLanguage: (language) => set({ language }),

      // 重置應用狀態
      resetAppState: () => {
        set({
          currentPage: 'home',
          navigationHistory: [],
          modals: {
            showLoginModal: false,
            showRegisterModal: false,
            showProfileModal: false,
            showSettingsModal: false,
            showCommentModal: false,
            showCreatePostModal: false,
            showCreateEventModal: false
          },
          notifications: [],
          unreadCount: 0,
          globalLoading: false,
          pageLoading: {}
        });
      }
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        notifications: state.notifications,
        unreadCount: state.unreadCount
      })
    }
  )
); 