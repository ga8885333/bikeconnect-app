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
  limit,
  addDoc
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { getCurrentUser } from './AuthService';
import { updateUserStats } from './UserService';

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
 * 創建騎行記錄
 */
export const createRideRecord = async (rideData) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('用戶未登入');
    }

    const rideRecord = {
      userId: user.uid,
      ...rideData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await safeFirestoreOperation(async () => {
      return await addDoc(collection(db, 'rides'), rideRecord);
    });

    if (docRef) {
      // 更新用戶統計數據
      await updateRideStats(rideData);

      return {
        success: true,
        data: { id: docRef.id, ...rideRecord },
        message: '騎行記錄創建成功'
      };
    } else {
      throw new Error('創建騎行記錄失敗');
    }
  } catch (error) {
    console.error('創建騎行記錄失敗:', error);
    return {
      success: false,
      error: error.message,
      message: '創建騎行記錄失敗'
    };
  }
};

/**
 * 獲取用戶騎行記錄
 */
export const getUserRides = async (userId = null, limitCount = 20) => {
  try {
    const uid = userId || getCurrentUser()?.uid;
    if (!uid) {
      throw new Error('用戶未登入');
    }

    const ridesRef = collection(db, 'rides');
    const q = query(
      ridesRef,
      where('userId', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await safeFirestoreOperation(async () => {
      return await getDocs(q);
    });

    if (querySnapshot) {
      const rides = [];
      querySnapshot.forEach((doc) => {
        rides.push({ id: doc.id, ...doc.data() });
      });

      return {
        success: true,
        data: rides,
        message: `獲取 ${rides.length} 條騎行記錄`
      };
    } else {
      return {
        success: true,
        data: [],
        message: '騎行記錄為空'
      };
    }
  } catch (error) {
    console.error('獲取騎行記錄失敗:', error);
    return {
      success: false,
      error: error.message,
      message: '獲取騎行記錄失敗'
    };
  }
};

/**
 * 更新騎行記錄
 */
export const updateRideRecord = async (rideId, updateData) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('用戶未登入');
    }

    const rideDoc = await safeFirestoreOperation(async () => {
      return await getDoc(doc(db, 'rides', rideId));
    });

    if (!rideDoc?.exists()) {
      throw new Error('騎行記錄不存在');
    }

    // 檢查是否為記錄擁有者
    if (rideDoc.data().userId !== user.uid) {
      throw new Error('無權限修改此記錄');
    }

    const updatedData = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    await safeFirestoreOperation(async () => {
      await updateDoc(doc(db, 'rides', rideId), updatedData);
    });

    return {
      success: true,
      message: '騎行記錄更新成功'
    };
  } catch (error) {
    console.error('更新騎行記錄失敗:', error);
    return {
      success: false,
      error: error.message,
      message: '更新騎行記錄失敗'
    };
  }
};

/**
 * 刪除騎行記錄
 */
export const deleteRideRecord = async (rideId) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('用戶未登入');
    }

    const rideDoc = await safeFirestoreOperation(async () => {
      return await getDoc(doc(db, 'rides', rideId));
    });

    if (!rideDoc?.exists()) {
      throw new Error('騎行記錄不存在');
    }

    // 檢查是否為記錄擁有者
    if (rideDoc.data().userId !== user.uid) {
      throw new Error('無權限刪除此記錄');
    }

    await safeFirestoreOperation(async () => {
      await deleteDoc(doc(db, 'rides', rideId));
    });

    return {
      success: true,
      message: '騎行記錄刪除成功'
    };
  } catch (error) {
    console.error('刪除騎行記錄失敗:', error);
    return {
      success: false,
      error: error.message,
      message: '刪除騎行記錄失敗'
    };
  }
};

/**
 * 更新騎行統計數據
 */
const updateRideStats = async (rideData) => {
  try {
    const { distance, duration, avgSpeed } = rideData;
    
    // 獲取當前統計數據並更新
    const statsUpdate = {};
    
    if (distance) {
      statsUpdate.totalDistance = distance;
    }
    
    if (duration) {
      statsUpdate.totalTime = duration;
    }
    
    if (avgSpeed) {
      statsUpdate.avgSpeed = avgSpeed;
    }

    // 增加騎行次數
    statsUpdate.totalRides = 1;

    await updateUserStats(statsUpdate);
  } catch (error) {
    console.error('更新騎行統計失敗:', error);
  }
};

/**
 * 獲取騎行統計摘要
 */
export const getRideStatsSummary = async (userId = null) => {
  try {
    const uid = userId || getCurrentUser()?.uid;
    if (!uid) {
      throw new Error('用戶未登入');
    }

    const rides = await getUserRides(uid, 100); // 獲取最近100次騎行
    
    if (!rides.success) {
      throw new Error('無法獲取騎行記錄');
    }

    const rideData = rides.data;
    
    // 計算統計數據
    const stats = {
      totalRides: rideData.length,
      totalDistance: rideData.reduce((sum, ride) => sum + (parseFloat(ride.distance) || 0), 0),
      totalTime: rideData.reduce((sum, ride) => sum + (parseFloat(ride.duration) || 0), 0),
      avgSpeed: 0,
      longestRide: 0,
      recentActivity: rideData.slice(0, 5) // 最近5次騎行
    };

    // 計算平均速度
    if (stats.totalTime > 0) {
      stats.avgSpeed = stats.totalDistance / (stats.totalTime / 60); // km/h
    }

    // 找出最長騎行
    stats.longestRide = Math.max(...rideData.map(ride => parseFloat(ride.distance) || 0));

    return {
      success: true,
      data: stats,
      message: '統計數據獲取成功'
    };
  } catch (error) {
    console.error('獲取騎行統計失敗:', error);
    return {
      success: false,
      error: error.message,
      message: '獲取騎行統計失敗'
    };
  }
};

/**
 * 成就系統 - 檢查並解鎖成就
 */
export const checkAndUnlockAchievements = async (rideData) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('用戶未登入');
    }

    const stats = await getRideStatsSummary();
    if (!stats.success) {
      return { success: false, message: '無法獲取統計數據' };
    }

    const achievements = [];
    const { totalRides, totalDistance, longestRide } = stats.data;

    // 定義成就條件
    const achievementRules = [
      { id: 'first_ride', name: '首次騎行', condition: totalRides >= 1, icon: '🚴' },
      { id: 'ten_rides', name: '騎行達人', condition: totalRides >= 10, icon: '🏆' },
      { id: 'hundred_km', name: '百公里挑戰', condition: totalDistance >= 100, icon: '🎯' },
      { id: 'long_distance', name: '長途騎士', condition: longestRide >= 50, icon: '🌟' },
      { id: 'speed_demon', name: '速度惡魔', condition: rideData.avgSpeed >= 25, icon: '⚡' }
    ];

    // 檢查每個成就
    for (const rule of achievementRules) {
      if (rule.condition) {
        achievements.push({
          id: rule.id,
          name: rule.name,
          icon: rule.icon,
          unlockedAt: new Date().toISOString()
        });
      }
    }

    if (achievements.length > 0) {
      // 保存成就到用戶資料
      await updateUserStats({ achievements });
    }

    return {
      success: true,
      data: achievements,
      message: `解鎖 ${achievements.length} 個成就`
    };
  } catch (error) {
    console.error('檢查成就失敗:', error);
    return {
      success: false,
      error: error.message,
      message: '檢查成就失敗'
    };
  }
};

/**
 * 獲取排行榜數據
 */
export const getLeaderboard = async (type = 'distance', limitCount = 10) => {
  try {
    // 這裡可以實現不同類型的排行榜
    // 目前返回模擬數據，實際實現需要聚合查詢
    
    const mockLeaderboard = [
      { userId: '1', name: '騎行王者', value: 1500, rank: 1 },
      { userId: '2', name: '速度之星', value: 1200, rank: 2 },
      { userId: '3', name: '耐力騎士', value: 1000, rank: 3 }
    ];

    return {
      success: true,
      data: mockLeaderboard,
      message: `獲取 ${type} 排行榜成功`
    };
  } catch (error) {
    console.error('獲取排行榜失敗:', error);
    return {
      success: false,
      error: error.message,
      message: '獲取排行榜失敗'
    };
  }
};

export default {
  createRideRecord,
  getUserRides,
  updateRideRecord,
  deleteRideRecord,
  getRideStatsSummary,
  checkAndUnlockAchievements,
  getLeaderboard
}; 