/**
 * Zustand 持久化功能測試
 * 用於驗證用戶狀態是否正確保存到 localStorage
 */

export const testPersistence = () => {
  console.log('🔍 測試 Zustand 持久化功能...');
  
  // 檢查 localStorage 中的用戶資料
  const userStorage = localStorage.getItem('user-storage');
  
  if (userStorage) {
    try {
      const parsedData = JSON.parse(userStorage);
      console.log('✅ 找到持久化資料:', parsedData);
      
      // 檢查必要的欄位
      const hasUser = parsedData.state?.user;
      const hasAuth = parsedData.state?.isAuthenticated;
      const hasProfile = parsedData.state?.userProfile;
      
      console.log('📊 持久化狀態檢查:');
      console.log('  - 用戶資料:', hasUser ? '✅' : '❌');
      console.log('  - 認證狀態:', hasAuth ? '✅' : '❌');
      console.log('  - 用戶檔案:', hasProfile ? '✅' : '❌');
      
      return {
        success: true,
        data: parsedData,
        hasUser,
        hasAuth,
        hasProfile
      };
    } catch (error) {
      console.error('❌ 解析持久化資料失敗:', error);
      return { success: false, error };
    }
  } else {
    console.log('ℹ️ 未找到持久化資料（首次使用或已清除）');
    return { success: false, message: '無持久化資料' };
  }
};

export const clearPersistence = () => {
  localStorage.removeItem('user-storage');
  console.log('🗑️ 已清除持久化資料');
};

export const mockLogin = () => {
  console.log('🔐 模擬登入以測試持久化...');
  // 這個函數可以在開發者工具中使用
  // 實際登入邏輯在 userStore 中
}; 