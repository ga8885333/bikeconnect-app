# Firebase 服務層使用指南

## 概述

這個服務層將所有 Firebase 操作集中管理，提供模組化的 API 接口，避免在頁面組件中直接使用 Firebase SDK。

## 架構設計

```
src/services/firebase/
├── AuthService.js      # 認證相關服務
├── UserService.js      # 用戶資料 CRUD
├── RideService.js      # 騎行記錄與成就
├── ChatService.js      # 聊天功能
├── index.js           # 統一導出入口
└── README.md          # 使用說明
```

## 使用方式

### 1. 認證服務 (AuthService)

```javascript
import { loginWithEmail, loginWithGoogle, registerWithEmail } from '../services/firebase';

// 郵箱登入
const handleLogin = async () => {
  const result = await loginWithEmail('user@example.com', 'password');
  if (result.success) {
    console.log('登入成功:', result.message);
  } else {
    console.error('登入失敗:', result.message);
  }
};

// Google 登入
const handleGoogleLogin = async () => {
  const result = await loginWithGoogle();
  if (result.success) {
    console.log('Google 登入成功');
  }
};

// 註冊
const handleRegister = async () => {
  const result = await registerWithEmail({
    email: 'user@example.com',
    password: 'password',
    name: '用戶名'
  });
};
```

### 2. 用戶服務 (UserService)

```javascript
import { getUserProfile, updateUserProfile, updateUserStats } from '../services/firebase';

// 獲取用戶資料
const loadUserProfile = async () => {
  const result = await getUserProfile();
  if (result.success) {
    setUserData(result.data);
  }
};

// 更新用戶資料
const updateProfile = async (newData) => {
  const result = await updateUserProfile(newData);
  if (result.success) {
    console.log('更新成功');
  }
};

// 更新統計數據
const updateStats = async (statsData) => {
  const result = await updateUserStats({
    totalDistance: '100',
    totalRides: '5'
  });
};
```

### 3. 騎行服務 (RideService)

```javascript
import { createRideRecord, getUserRides, checkAndUnlockAchievements } from '../services/firebase';

// 創建騎行記錄
const saveRide = async (rideData) => {
  const result = await createRideRecord({
    distance: 25.5,
    duration: 90, // 分鐘
    avgSpeed: 17.0,
    route: 'City Loop',
    startLocation: '台北車站',
    endLocation: '信義區'
  });
  
  if (result.success) {
    // 檢查成就
    await checkAndUnlockAchievements(rideData);
  }
};

// 獲取騎行歷史
const loadRideHistory = async () => {
  const result = await getUserRides();
  if (result.success) {
    setRides(result.data);
  }
};
```

### 4. 聊天服務 (ChatService)

```javascript
import { 
  createChatRoom, 
  sendMessage, 
  getChatMessages, 
  listenToChatMessages 
} from '../services/firebase';

// 創建聊天室
const startChat = async (targetUserId) => {
  const result = await createChatRoom([targetUserId]);
  if (result.success) {
    setChatId(result.data.id);
  }
};

// 發送訊息
const sendChatMessage = async (text) => {
  const result = await sendMessage(chatId, {
    text: text,
    type: 'text'
  });
};

// 監聽訊息（實時更新）
useEffect(() => {
  if (chatId) {
    const unsubscribe = listenToChatMessages(chatId, (messages) => {
      setMessages(messages);
    });
    
    return unsubscribe; // 清理監聽器
  }
}, [chatId]);
```

## 在 AuthContext 中的集成

AuthContext 已經重構為使用服務層：

```javascript
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { 
    user,           // Firebase 用戶對象
    userProfile,    // 完整用戶資料
    isAuthenticated,
    loading,
    isOnline,       // 網絡狀態
    login,
    logout,
    updateUser,
    refreshUserProfile
  } = useAuth();

  // 使用用戶資料
  if (loading) return <div>載入中...</div>;
  if (!isAuthenticated) return <div>請先登入</div>;

  return (
    <div>
      <h1>歡迎, {userProfile?.name}</h1>
      <p>等級: {userProfile?.level}</p>
      <p>總騎行距離: {userProfile?.stats?.totalDistance} km</p>
    </div>
  );
};
```

## 錯誤處理

所有服務方法都返回統一的響應格式：

```javascript
{
  success: boolean,    // 操作是否成功
  data?: any,         // 返回的數據（成功時）
  message?: string,   // 提示訊息
  error?: string      // 錯誤訊息（失敗時）
}
```

## 離線處理

服務層內建離線處理邏輯：

- 自動檢測網絡狀態
- 離線時返回適當的錯誤訊息
- 支持本地數據後備方案
- 網絡恢復時自動重試

## 最佳實踐

### 1. 在組件中使用

```javascript
// ✅ 推薦：使用服務層
import { getUserProfile } from '../services/firebase';

// ❌ 避免：直接使用 Firebase
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
```

### 2. 錯誤處理

```javascript
// ✅ 推薦：檢查結果並處理錯誤
const result = await getUserProfile();
if (result.success) {
  setUserData(result.data);
} else {
  toast.error(result.message);
}

// ❌ 避免：忽略錯誤處理
const data = await getUserProfile();
setUserData(data); // 可能導致錯誤
```

### 3. 載入狀態

```javascript
// ✅ 推薦：管理載入狀態
const [loading, setLoading] = useState(false);

const loadData = async () => {
  setLoading(true);
  try {
    const result = await getUserProfile();
    if (result.success) {
      setUserData(result.data);
    }
  } finally {
    setLoading(false);
  }
};
```

## 擴展服務

如需添加新功能，請遵循現有模式：

1. 在對應服務文件中添加新方法
2. 使用 `safeFirestoreOperation` 包裝 Firebase 操作
3. 返回統一的響應格式
4. 在 `index.js` 中導出新方法
5. 更新此文檔

## 注意事項

- 所有 Firebase 操作都應通過服務層進行
- 保持 UI 組件與 Firebase 邏輯分離
- 使用 AuthContext 獲取用戶狀態
- 適當處理離線狀態和錯誤情況 