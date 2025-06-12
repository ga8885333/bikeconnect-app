import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../../config/firebase';

/**
 * 安全的 Firestore 操作包裝器
 * 處理離線狀態和錯誤
 */
const safeFirestoreOperation = async (operation, fallback = null) => {
  try {
    if (!navigator.onLine) {
      console.warn('離線狀態，使用本地數據');
      return fallback;
    }
    return await operation();
  } catch (error) {
    console.error('Firestore 操作失敗:', error);
    return fallback;
  }
};

/**
 * 用戶資料結構模板
 */
const createUserProfile = (user, additionalData = {}) => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName || additionalData.name || '騎行者',
  photoURL: user.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  verified: user.emailVerified,
  level: additionalData.level || 'BASIC',
  createdAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString(),
  stats: {
    totalDistance: '0',
    totalRides: '0',
    avgSpeed: '0',
    totalTime: '0'
  },
  preferences: {
    notifications: true,
    privacy: 'public',
    theme: 'light'
  },
  ...additionalData
});

/**
 * 郵箱密碼登入
 */
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // 更新最後登入時間
    await safeFirestoreOperation(async () => {
      await updateDoc(doc(db, 'users', user.uid), {
        lastLoginAt: new Date().toISOString()
      });
    });

    return {
      success: true,
      user: user,
      message: '登入成功'
    };
  } catch (error) {
    console.error('登入失敗:', error);
    return {
      success: false,
      error: error.code,
      message: getAuthErrorMessage(error.code)
    };
  }
};

/**
 * Google 登入
 */
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // 檢查是否為新用戶，如果是則創建用戶資料
    const userDoc = await safeFirestoreOperation(async () => {
      return await getDoc(doc(db, 'users', user.uid));
    });

    if (!userDoc?.exists()) {
      const userProfile = createUserProfile(user, { level: 'PRO' });
      await safeFirestoreOperation(async () => {
        await setDoc(doc(db, 'users', user.uid), userProfile);
      });
    } else {
      // 更新最後登入時間
      await safeFirestoreOperation(async () => {
        await updateDoc(doc(db, 'users', user.uid), {
          lastLoginAt: new Date().toISOString()
        });
      });
    }

    return {
      success: true,
      user: user,
      message: 'Google 登入成功'
    };
  } catch (error) {
    console.error('Google 登入失敗:', error);
    return {
      success: false,
      error: error.code,
      message: getAuthErrorMessage(error.code)
    };
  }
};

/**
 * 郵箱密碼註冊
 */
export const registerWithEmail = async (userData) => {
  try {
    const { email, password, name, ...additionalData } = userData;
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 更新用戶顯示名稱
    await updateProfile(user, {
      displayName: name
    });

    // 創建用戶資料文檔
    const userProfile = createUserProfile(user, { name, ...additionalData });
    await safeFirestoreOperation(async () => {
      await setDoc(doc(db, 'users', user.uid), userProfile);
    });

    // 發送郵箱驗證
    await sendEmailVerification(user);

    return {
      success: true,
      user: user,
      message: '註冊成功，請檢查郵箱進行驗證'
    };
  } catch (error) {
    console.error('註冊失敗:', error);
    return {
      success: false,
      error: error.code,
      message: getAuthErrorMessage(error.code)
    };
  }
};

/**
 * 登出
 */
export const logout = async () => {
  try {
    await signOut(auth);
    return {
      success: true,
      message: '登出成功'
    };
  } catch (error) {
    console.error('登出失敗:', error);
    return {
      success: false,
      error: error.code,
      message: '登出失敗'
    };
  }
};

/**
 * 重設密碼
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: '密碼重設郵件已發送'
    };
  } catch (error) {
    console.error('密碼重設失敗:', error);
    return {
      success: false,
      error: error.code,
      message: getAuthErrorMessage(error.code)
    };
  }
};

/**
 * 監聽認證狀態變化
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * 獲取當前用戶
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * 發送郵箱驗證
 */
export const sendVerificationEmail = async () => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('用戶未登入');
    }
    
    await sendEmailVerification(user);
    return {
      success: true,
      message: '驗證郵件已發送'
    };
  } catch (error) {
    console.error('發送驗證郵件失敗:', error);
    return {
      success: false,
      error: error.code,
      message: '發送驗證郵件失敗'
    };
  }
};

/**
 * 錯誤訊息轉換
 */
const getAuthErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/user-not-found': '用戶不存在',
    'auth/wrong-password': '密碼錯誤',
    'auth/email-already-in-use': '郵箱已被使用',
    'auth/weak-password': '密碼強度不足',
    'auth/invalid-email': '郵箱格式無效',
    'auth/user-disabled': '用戶帳號已被停用',
    'auth/too-many-requests': '請求過於頻繁，請稍後再試',
    'auth/network-request-failed': '網絡連接失敗',
    'auth/popup-closed-by-user': '登入視窗被關閉',
    'auth/cancelled-popup-request': '登入請求被取消'
  };
  
  return errorMessages[errorCode] || '認證失敗，請稍後再試';
};

export default {
  loginWithEmail,
  loginWithGoogle,
  registerWithEmail,
  logout,
  resetPassword,
  onAuthStateChange,
  getCurrentUser,
  sendVerificationEmail
}; 