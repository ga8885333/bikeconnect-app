import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../../config/firebase';
import { getCurrentUser } from './AuthService';

/**
 * 安全的 Firestore 操作包裝器
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
 * 獲取用戶資料
 */
export const getUserProfile = async (userId = null) => {
  try {
    const uid = userId || getCurrentUser()?.uid;
    if (!uid) {
      throw new Error('用戶未登入');
    }

    const userDoc = await safeFirestoreOperation(async () => {
      return await getDoc(doc(db, 'users', uid));
    });

    if (userDoc?.exists()) {
      return {
        success: true,
        data: { id: userDoc.id, ...userDoc.data() }
      };
    } else {
      return {
        success: false,
        message: '用戶資料不存在'
      };
    }
  } catch (error) {
    console.error('獲取用戶資料失敗:', error);
    return {
      success: false,
      error: error.message,
      message: '獲取用戶資料失敗'
    };
  }
};

/**
 * 更新用戶資料
 */
export const updateUserProfile = async (userData) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('用戶未登入');
    }

    const updateData = {
      ...userData,
      updatedAt: new Date().toISOString()
    };

    await safeFirestoreOperation(async () => {
      await updateDoc(doc(db, 'users', user.uid), updateData);
    });

    return {
      success: true,
      message: '用戶資料更新成功'
    };
  } catch (error) {
    console.error('更新用戶資料失敗:', error);
    return {
      success: false,
      error: error.message,
      message: '更新用戶資料失敗'
    };
  }
};

/**
 * 上傳用戶頭像
 */
export const uploadUserAvatar = async (file) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('用戶未登入');
    }

    // 檢查文件類型
    if (!file.type.startsWith('image/')) {
      throw new Error('只能上傳圖片文件');
    }

    // 檢查文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('圖片大小不能超過 5MB');
    }

    // 創建存儲引用
    const fileName = `avatars/${user.uid}_${Date.now()}.${file.name.split('.').pop()}`;
    const storageRef = ref(storage, fileName);

    // 上傳文件
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // 更新用戶資料中的頭像 URL
    await updateUserProfile({ photoURL: downloadURL });

    return {
      success: true,
      data: { photoURL: downloadURL },
      message: '頭像上傳成功'
    };
  } catch (error) {
    console.error('頭像上傳失敗:', error);
    return {
      success: false,
      error: error.message,
      message: '頭像上傳失敗'
    };
  }
};

/**
 * 更新用戶統計數據
 */
export const updateUserStats = async (statsData) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('用戶未登入');
    }

    const currentProfile = await getUserProfile();
    if (!currentProfile.success) {
      throw new Error('無法獲取當前用戶資料');
    }

    const currentStats = currentProfile.data.stats || {};
    const updatedStats = {
      ...currentStats,
      ...statsData,
      updatedAt: new Date().toISOString()
    };

    await updateUserProfile({ stats: updatedStats });

    return {
      success: true,
      data: updatedStats,
      message: '統計數據更新成功'
    };
  } catch (error) {
    console.error('更新統計數據失敗:', error);
    return {
      success: false,
      error: error.message,
      message: '更新統計數據失敗'
    };
  }
};

/**
 * 更新用戶偏好設定
 */
export const updateUserPreferences = async (preferences) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('用戶未登入');
    }

    const currentProfile = await getUserProfile();
    if (!currentProfile.success) {
      throw new Error('無法獲取當前用戶資料');
    }

    const currentPreferences = currentProfile.data.preferences || {};
    const updatedPreferences = {
      ...currentPreferences,
      ...preferences,
      updatedAt: new Date().toISOString()
    };

    await updateUserProfile({ preferences: updatedPreferences });

    return {
      success: true,
      data: updatedPreferences,
      message: '偏好設定更新成功'
    };
  } catch (error) {
    console.error('更新偏好設定失敗:', error);
    return {
      success: false,
      error: error.message,
      message: '更新偏好設定失敗'
    };
  }
};

/**
 * 搜尋用戶
 */
export const searchUsers = async (searchTerm, limitCount = 10) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('displayName', '>=', searchTerm),
      where('displayName', '<=', searchTerm + '\uf8ff'),
      orderBy('displayName'),
      limit(limitCount)
    );

    const querySnapshot = await safeFirestoreOperation(async () => {
      return await getDocs(q);
    });

    if (querySnapshot) {
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });

      return {
        success: true,
        data: users,
        message: `找到 ${users.length} 個用戶`
      };
    } else {
      return {
        success: true,
        data: [],
        message: '搜尋結果為空'
      };
    }
  } catch (error) {
    console.error('搜尋用戶失敗:', error);
    return {
      success: false,
      error: error.message,
      message: '搜尋用戶失敗'
    };
  }
};

/**
 * 獲取用戶列表（按等級或活躍度排序）
 */
export const getUserList = async (orderByField = 'lastLoginAt', limitCount = 20) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      orderBy(orderByField, 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await safeFirestoreOperation(async () => {
      return await getDocs(q);
    });

    if (querySnapshot) {
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });

      return {
        success: true,
        data: users,
        message: `獲取 ${users.length} 個用戶`
      };
    } else {
      return {
        success: true,
        data: [],
        message: '用戶列表為空'
      };
    }
  } catch (error) {
    console.error('獲取用戶列表失敗:', error);
    return {
      success: false,
      error: error.message,
      message: '獲取用戶列表失敗'
    };
  }
};

/**
 * 刪除用戶帳號（軟刪除）
 */
export const deleteUserAccount = async () => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('用戶未登入');
    }

    // 軟刪除：標記為已刪除而不是真正刪除
    await updateUserProfile({
      deleted: true,
      deletedAt: new Date().toISOString(),
      email: `deleted_${Date.now()}@deleted.com` // 避免郵箱衝突
    });

    return {
      success: true,
      message: '帳號已刪除'
    };
  } catch (error) {
    console.error('刪除帳號失敗:', error);
    return {
      success: false,
      error: error.message,
      message: '刪除帳號失敗'
    };
  }
};

/**
 * 關注/取消關注用戶
 */
export const toggleFollowUser = async (targetUserId, isFollowing) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('用戶未登入');
    }

    const currentProfile = await getUserProfile();
    if (!currentProfile.success) {
      throw new Error('無法獲取當前用戶資料');
    }

    const following = currentProfile.data.following || [];
    let updatedFollowing;

    if (isFollowing) {
      // 取消關注
      updatedFollowing = following.filter(id => id !== targetUserId);
    } else {
      // 添加關注
      updatedFollowing = [...following, targetUserId];
    }

    await updateUserProfile({ following: updatedFollowing });

    return {
      success: true,
      data: { following: updatedFollowing },
      message: isFollowing ? '已取消關注' : '關注成功'
    };
  } catch (error) {
    console.error('關注操作失敗:', error);
    return {
      success: false,
      error: error.message,
      message: '關注操作失敗'
    };
  }
};

export default {
  getUserProfile,
  updateUserProfile,
  uploadUserAvatar,
  updateUserStats,
  updateUserPreferences,
  searchUsers,
  getUserList,
  deleteUserAccount,
  toggleFollowUser
}; 