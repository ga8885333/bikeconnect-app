// 開發環境下的離線測試工具
// 在瀏覽器控制台中使用這些函數來模擬離線狀態

// 模擬離線狀態
export const simulateOffline = () => {
  if (typeof window !== 'undefined') {
    // 覆蓋 navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    });
    
    // 觸發 offline 事件
    window.dispatchEvent(new Event('offline'));
    
    console.log('🔴 模擬離線狀態已啟用');
    console.log('使用 simulateOnline() 來恢復在線狀態');
  }
};

// 模擬在線狀態
export const simulateOnline = () => {
  if (typeof window !== 'undefined') {
    // 恢復 navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true
    });
    
    // 觸發 online 事件
    window.dispatchEvent(new Event('online'));
    
    console.log('🟢 模擬在線狀態已恢復');
  }
};

// 在開發環境下將函數添加到全局對象
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  window.simulateOffline = simulateOffline;
  window.simulateOnline = simulateOnline;
  
  console.log('🛠️ 離線測試工具已載入');
  console.log('在控制台中使用 simulateOffline() 和 simulateOnline() 來測試離線功能');
}

export default {
  simulateOffline,
  simulateOnline
}; 