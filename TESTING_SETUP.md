# 騎騎應用程式 - 測試架構設置

## 🧪 測試環境配置

### 已安裝的測試套件

```json
{
  "@testing-library/react": "^16.3.0",
  "@testing-library/jest-dom": "^6.6.3", 
  "@testing-library/user-event": "^14.6.1",
  "jest-environment-jsdom": "^30.0.0"
}
```

### 測試初始化設定

**檔案**: `src/setupTests.js`

- ✅ 載入 `@testing-library/jest-dom` 支援
- ✅ Mock localStorage 功能
- ✅ Mock window.matchMedia 支援響應式設計測試
- ✅ Mock IntersectionObserver API

## 📋 測試腳本

### package.json 中的測試命令

```json
{
  "scripts": {
    "test": "react-scripts test",
    "test:coverage": "react-scripts test --coverage --watchAll=false"
  }
}
```

### 使用方式

```bash
# 執行所有測試（監視模式）
npm test

# 執行所有測試（單次執行）
npm test -- --watchAll=false

# 執行測試覆蓋率報告
npm run test:coverage
```

## 🎯 第一個元件測試 - RideStatCard

### 元件位置
- **元件檔案**: `src/components/ui/RideStatCard.js`
- **測試檔案**: `src/components/ui/__tests__/RideStatCard.test.js`

### 元件功能
RideStatCard 是一個顯示騎行統計資料的卡片元件：

```jsx
<RideStatCard 
  distance="15.5 km"
  time="45 min"
  title="今日騎行"
  className="custom-class"
/>
```

### 測試覆蓋範圍

✅ **基本渲染測試** - 確認元件能正常渲染  
✅ **預設值測試** - 驗證預設 props 顯示正確  
✅ **Props 傳遞測試** - 確認傳入的 distance、time、title 正確顯示  
✅ **標籤文字測試** - 驗證「距離」和「時間」標籤顯示  
✅ **CSS 類別測試** - 確認自定義 className 正確應用  
✅ **結構測試** - 驗證網格佈局結構  
✅ **樣式測試** - 確認紅色主題樣式類別  
✅ **圖示測試** - 驗證 MapPin 和 Clock 圖示渲染  
✅ **數值格式測試** - 測試不同格式的距離和時間值  
✅ **可訪問性測試** - 確認語義化 HTML 結構  

### 測試結果

```
✓ 10 個測試全部通過
✓ RideStatCard 元件 100% 測試覆蓋率
```

## 🎨 UI 風格保持

⚠️ **重要提醒**: 所有測試都確保不會影響現有的 UI 風格和顏色：

- ✅ 保持紅色主題 (`text-red-600`, `border-red-500`, `bg-red-100`)
- ✅ 保持 Tailwind CSS 樣式類別
- ✅ 保持元件的視覺設計和佈局
- ✅ 保持響應式設計

## 📊 測試覆蓋率報告

目前測試覆蓋率：
- **RideStatCard.js**: 100% 覆蓋率
- **整體專案**: 0.14% 覆蓋率（剛開始建立測試）

## 🚀 下一步測試計劃

建議為以下元件建立測試：

1. **userStore.js** - Zustand 狀態管理測試
2. **AuthPage.js** - 登入/註冊頁面測試
3. **HomePage.js** - 首頁元件測試
4. **BottomNavigation.js** - 底部導航測試
5. **AvatarWithBadge.js** - 頭像元件測試

## 🔧 測試最佳實踐

### 測試檔案命名規則
```
src/components/ui/ComponentName.js
src/components/ui/__tests__/ComponentName.test.js
```

### 測試結構範例
```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComponentName from '../ComponentName';

describe('ComponentName', () => {
  test('renders without crashing', () => {
    render(<ComponentName />);
    // 測試邏輯
  });
  
  test('displays correct props', () => {
    // 測試 props 傳遞
  });
});
```

### Mock 設置
- localStorage 已在 setupTests.js 中 mock
- window.matchMedia 已設置支援響應式測試
- IntersectionObserver 已 mock 支援滾動相關測試

## ✅ 測試架構完成

騎騎應用程式的基本單元測試架構已成功建立：

1. ✅ 測試套件安裝完成
2. ✅ 測試初始化設定完成  
3. ✅ 第一個元件測試建立並通過
4. ✅ 測試腳本配置完成
5. ✅ UI 風格完全保持不變

現在可以開始為更多元件建立測試，逐步提升測試覆蓋率！🎉 