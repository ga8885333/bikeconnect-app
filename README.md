# 🏍️ BikeConnect - 騎車交友社交平台 (React版本)

一個專為機車和自行車愛好者設計的現代化社交平台，讓騎士們能夠輕鬆找到騎行夥伴、分享精彩瞬間，並管理自己的騎行生活。

## ✨ 主要功能

### 🔐 用戶認證系統
- **多種登入方式**：支援 Google、Facebook、手機簡訊驗證、Email註冊
- **身份驗證**：用戶註冊時需上傳本人與機車合照、行照車牌照片
- **安全審核**：後台管理系統審核用戶身份，確保平台安全性

### 🗺️ 智能地圖功能
- **即時定位**：顯示用戶當前位置和附近騎士
- **熱門路線**：查看並導航到推薦的騎行路線
- **路線評分**：用戶可對路線評分和留言
- **導航集成**：一鍵開啟 Google Maps 導航

### 👥 騎乘揪團系統
- **活動發起**：用戶可創建騎行活動（時間/地點/標題/備註）
- **參與報名**：其他用戶可報名參加活動並留言討論
- **智能提醒**：集合時間前1小時自動提醒參加者
- **難度分級**：活動按新手、中級、進階分類

### 📱 社群牆功能 (類似小紅書)
- **多媒體發布**：上傳照片、影片，添加標題和描述
- **互動系統**：點讚、評論、分享、收藏功能
- **關注機制**：互相關注用戶可免費私訊
- **付費私訊**：單方面私訊需付費會員資格

### 🏠 個人檔案管理
- **基本資料**：姓名、頭像、聯絡方式、個人簡介
- **騎行統計**：總里程、騎行次數、時數等數據
- **成就系統**：解鎖各種騎行成就徽章
- **會員制度**：付費會員享有更多權限

### 🔧 車況管理功能
- **車輛登記**：記錄車輛品牌、型號、年份、車牌
- **保養追蹤**：記錄上次保養日期、里程、費用
- **智能提醒**：根據里程數和時間提醒保養時機
- **驗車提醒**：定期提醒車輛檢驗到期日

## 🛠️ 技術架構

### 前端技術
- **React 18** - 現代化前端框架
- **React Router** - 單頁應用路由管理
- **TailwindCSS** - 實用優先的 CSS 框架
- **Lucide React** - 高質量圖標庫
- **Framer Motion** - 流暢的動畫效果
- **React Hook Form** - 高效表單處理
- **React Hot Toast** - 優雅的提示信息

### 地圖與定位
- **Google Maps API** - 地圖顯示和導航
- **Geolocation API** - 獲取用戶位置
- **Places API** - 地點搜索和自動完成

### PWA 支持
- **Service Worker** - 離線緩存和推送通知
- **Web App Manifest** - 原生應用體驗
- **響應式設計** - 完美適配手機和平板

### 狀態管理
- **React Context** - 全局狀態管理
- **Local Storage** - 本地數據持久化
- **Custom Hooks** - 可復用業務邏輯

## 📱 頁面結構

### 🏠 首頁 (HomePage)
- 個人化歡迎界面
- 附近騎士動態顯示
- 快速操作入口（開始騎行、找人揪團）
- 今日騎行統計
- 社群動態時間軸

### 👥 揪團頁 (GroupsPage) 
- 活動列表展示（全部/已參加/我發起的）
- 活動創建表單
- 參加者頭像顯示
- 活動詳情和報名功能
- 搜索和篩選功能

### 🗺️ 地圖頁 (MapPage)
- 全屏地圖顯示
- 即時騎行記錄
- 附近騎士位置
- 熱門路線推薦
- 導航功能

### 📱 社群牆 (SocialPage)
- 瀑布流動態展示
- 多媒體內容支持
- 互動功能（讚、評論、分享）
- 動態發布功能
- 關注和私訊系統

### 👤 個人頁 (ProfilePage)
- 個人資料展示和編輯
- 騎行統計和成就系統
- 車輛管理功能
- 應用設置選項
- 會員升級入口

### 🔐 認證頁 (AuthPage)
- 多種登入方式
- 註冊流程和身份驗證
- 照片上傳功能
- 密碼安全設置

## 🚀 快速開始

### 環境要求
- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器
- Google Maps API 密鑰

### 安裝依賴
```bash
npm install
```

### 配置環境變數
在 `public/index.html` 中替換 Google Maps API 密鑰：
```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>
```

### 啟動開發服務器
```bash
npm start
```

應用將在 http://localhost:3000 啟動

### 構建生產版本
```bash
npm run build
```

## 📋 功能特色

### 🎨 用戶體驗
- **直觀導航**：底部標籤式導航，符合移動端使用習慣
- **流暢動畫**：頁面切換和交互動畫提升使用體驗
- **響應式設計**：完美適配各種設備尺寸
- **暗色模式**：即將推出暗色主題支持

### 🔒 安全功能
- **身份驗證**：多重身份驗證機制
- **隱私保護**：用戶可控制個人信息可見性
- **內容審核**：社群內容自動和人工審核
- **舉報系統**：用戶可舉報不當內容或行為

### 🌟 社交功能
- **好友系統**：添加好友和關注功能
- **群組聊天**：活動參與者群組討論
- **私人聊天**：一對一私訊功能
- **動態分享**：分享騎行照片和心得

### 📊 數據統計
- **騎行追蹤**：詳細的騎行數據記錄
- **成就系統**：多種成就徽章激勵用戶
- **排行榜**：騎行里程和活動參與排名
- **個人報告**：月度和年度騎行報告

## 🔮 未來計劃

### 近期更新
- [ ] 推送通知功能
- [ ] 離線地圖下載
- [ ] 語音導航
- [ ] 天氣信息集成

### 中期計劃
- [ ] AI 路線推薦
- [ ] 直播騎行功能
- [ ] 商家合作優惠
- [ ] 騎行比賽系統

### 長期願景
- [ ] AR 導航功能
- [ ] IoT 設備集成
- [ ] 國際化多語言支持
- [ ] 跨平台桌面應用

## 🤝 貢獻指南

我們歡迎社區貢獻！請參考以下步驟：

1. Fork 項目
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權協議

本項目採用 MIT 授權協議 - 詳見 [LICENSE](LICENSE) 文件

## 📞 聯絡我們

- 📧 Email: support@bikeconnect.app
- 🐛 問題回報: [GitHub Issues](https://github.com/yourusername/bike-socialapp/issues)
- 💬 社群討論: [GitHub Discussions](https://github.com/yourusername/bike-socialapp/discussions)

---

**BikeConnect** - 讓每一次騎行都成為難忘的冒險！🏍️✨

### 2. 設定 Google Maps API Key

#### 🔑 獲取 API Key
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 創建新專案或選擇現有專案
3. 啟用以下 API：
   - Maps JavaScript API
   - Places API
   - Geolocation API
4. 創建 API Key
5. 設定 API Key 限制（建議限制網域）

#### 💰 Google Maps API 計費說明

**🆓 免費額度（每月）**：
- **Maps JavaScript API**：28,000 次載入（約 $200 美元價值）
- **Places API**：免費額度有限
- **Geocoding API**：40,000 次請求

**💳 付費標準**：
- Maps JavaScript API：每 1,000 次載入 $7 美元
- Places API 詳細搜尋：每次 $17 美元
- Geocoding：每 1,000 次 $5 美元

**📊 一般使用估算**：
- 小型應用（<1000用戶/月）：通常在免費額度內
- 中型應用：可能需要 $10-50/月
- 大型應用：需要更多預算

#### 🔒 API Key 安全設定
為了控制費用和確保安全：

1. **設定使用限制**：
   ```
   - 每日請求限制：建議設定適當上限
   - 應用程式限制：HTTP 引薦網址
   - 網站限制：yourdomain.com/*, localhost:3000/*
   ```

2. **監控使用量**：
   ```
   - 在 Google Cloud Console 設定預算提醒
   - 定期檢查 API 使用統計
   - 設定使用量警告
   ```

#### 🆓 免費替代方案

如果想避免費用，可以考慮以下替代方案：

**1. OpenStreetMap + Leaflet**
```bash
npm install leaflet react-leaflet
```
- 完全免費
- 功能豐富
- 社群支援良好

**2. Mapbox** 
- 每月 50,000 次免費載入
- 超過後每 1,000 次 $0.50
- 通常比 Google Maps 便宜

**3. 純模擬模式**
- 使用靜態地圖圖片
- 不需要 API Key
- 適合展示和測試

#### ⚙️ 設定 API Key
在 `public/index.html` 中找到第 28 行：
```html
<script 
  async 
  defer 
  src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places&callback=initGoogleMaps">
</script>
```

將 `YOUR_GOOGLE_MAPS_API_KEY` 替換為您的實際 API Key：
```html
<script 
  async 
  defer 
  src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx&libraries=places&callback=initGoogleMaps">
</script>
```

#### 💡 節省費用的建議

1. **啟用必要 API**：只啟用需要的 API 服務
2. **設定配額**：限制每日/每月使用量
3. **優化請求**：減少不必要的 API 調用
4. **緩存結果**：避免重複請求相同數據
5. **監控帳單**：設定預算警告和限制

## 🗺️ 商家地圖功能

### 🏪 主要特色
- **免費地圖**：使用 OpenStreetMap，完全免費且無 API 限制
- **商家定位**：顯示附近的機車相關商家
- **智能導航**：自動偵測裝置並開啟對應的導航應用
- **Mobile-First 設計**：專為手機使用優化

### 🎯 商家類型
- 🔧 **維修店**：機車維修、保養服務
- 🏪 **車行**：機車買賣、零件販售
- ⛽ **加油站**：汽柴油、機車用品
- 🅿️ **停車場**：機車停車服務

### 📱 導航功能
#### iOS 裝置
- 優先開啟 Apple Maps 導航
- 備用 Google Maps 網頁版
- 自動帶入起點和終點座標

#### Android 裝置
- 直接開啟 Google Maps 應用
- 支援語音導航和路線規劃

#### 桌面裝置
- 開啟 Google Maps 網頁版
- 新視窗顯示導航路線

### 🎨 UI 特色
- **位置權限提示**：引導用戶開啟定位
- **商家詳情彈窗**：完整顯示店家資訊
- **分類標示**：不同商家類型用顏色區分
- **評分系統**：顯示商家評價和營業時間
- **一鍵撥號**：直接撥打商家電話

### 🛠️ 技術實現
- **Leaflet.js**：開源地圖函式庫
- **OpenStreetMap**：免費地圖圖資
- **HTML5 Geolocation**：取得用戶位置
- **Device Detection**：自動偵測裝置類型
- **Custom SVG Icons**：自製商家圖標

### 🚀 使用方式
1. 點擊首頁「附近商家」按鈕
2. 允許瀏覽器定位權限
3. 查看地圖上的商家標記
4. 點擊標記查看詳細資訊
5. 點擊「前往導航」開始導航

### 📊 模擬資料
目前使用台北地區的模擬商家資料：
- 6 個不同類型的商家
- 涵蓋大安、中山、信義、松山區
- 包含完整的店家資訊和聯絡方式
