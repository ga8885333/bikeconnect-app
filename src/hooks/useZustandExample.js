/**
 * Zustand 使用示例 Hook
 * 展示如何在組件中使用 Zustand stores
 */

import { useUserStore } from '../stores/userStore';
import { useAppStore } from '../stores/appStore';

export const useZustandExample = () => {
  // 認證相關狀態
  const {
    userProfile,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser
  } = useUserStore();

  // 應用程式狀態
  const {
    notifications,
    unreadCount,
    theme,
    addNotification,
    openModal,
    closeModal
  } = useAppStore();

  // 示例：添加通知
  const showWelcomeNotification = () => {
    addNotification({
      type: 'success',
      title: '歡迎使用 Zustand！',
      message: '狀態管理已成功遷移到 Zustand',
      duration: 5000
    });
  };

  // 示例：更新用戶資料
  const updateUserProfile = (newData) => {
    updateUser(newData);
    addNotification({
      type: 'success',
      title: '資料更新成功',
      message: '您的個人資料已更新'
    });
  };

  // 示例：處理登入
  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    if (result.success) {
      showWelcomeNotification();
    }
    return result;
  };

  // 示例：處理登出
  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      addNotification({
        type: 'info',
        title: '已登出',
        message: '期待您的再次光臨！'
      });
    }
    return result;
  };

  return {
    // 狀態
    userProfile,
    isAuthenticated,
    loading,
    notifications,
    unreadCount,
    theme,
    
    // 方法
    handleLogin,
    handleLogout,
    updateUserProfile,
    showWelcomeNotification,
    openModal,
    closeModal
  };
}; 