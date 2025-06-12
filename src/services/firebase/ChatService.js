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
  addDoc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../config/firebase';
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
 * 創建聊天室
 */
export const createChatRoom = async (participantIds, chatType = 'private') => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('用戶未登入');
    }

    // 確保當前用戶在參與者列表中
    const participants = [...new Set([user.uid, ...participantIds])];
    
    // 生成聊天室ID（私聊使用排序後的用戶ID組合）
    const chatId = chatType === 'private' 
      ? participants.sort().join('_')
      : `group_${Date.now()}`;

    const chatRoom = {
      id: chatId,
      participants,
      chatType,
      createdBy: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessage: null,
      lastMessageAt: null
    };

    await safeFirestoreOperation(async () => {
      await setDoc(doc(db, 'chats', chatId), chatRoom);
    });

    return {
      success: true,
      data: chatRoom,
      message: '聊天室創建成功'
    };
  } catch (error) {
    console.error('創建聊天室失敗:', error);
    return {
      success: false,
      error: error.message,
      message: '創建聊天室失敗'
    };
  }
};

/**
 * 獲取用戶聊天室列表
 */
export const getUserChatRooms = async () => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('用戶未登入');
    }

    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef,
      where('participants', 'array-contains', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const querySnapshot = await safeFirestoreOperation(async () => {
      return await getDocs(q);
    });

    if (querySnapshot) {
      const chatRooms = [];
      querySnapshot.forEach((doc) => {
        chatRooms.push({ id: doc.id, ...doc.data() });
      });

      return {
        success: true,
        data: chatRooms,
        message: `獲取 ${chatRooms.length} 個聊天室`
      };
    } else {
      return {
        success: true,
        data: [],
        message: '聊天室列表為空'
      };
    }
  } catch (error) {
    console.error('獲取聊天室列表失敗:', error);
    return {
      success: false,
      error: error.message,
      message: '獲取聊天室列表失敗'
    };
  }
};

/**
 * 發送訊息
 */
export const sendMessage = async (chatId, messageData) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('用戶未登入');
    }

    const message = {
      chatId,
      senderId: user.uid,
      senderName: user.displayName || '匿名用戶',
      ...messageData,
      createdAt: new Date().toISOString(),
      read: false
    };

    // 添加訊息到 messages 集合
    const docRef = await safeFirestoreOperation(async () => {
      return await addDoc(collection(db, 'messages'), message);
    });

    if (docRef) {
      // 更新聊天室的最後訊息
      await safeFirestoreOperation(async () => {
        await updateDoc(doc(db, 'chats', chatId), {
          lastMessage: messageData.text || messageData.type,
          lastMessageAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      });

      return {
        success: true,
        data: { id: docRef.id, ...message },
        message: '訊息發送成功'
      };
    } else {
      throw new Error('發送訊息失敗');
    }
  } catch (error) {
    console.error('發送訊息失敗:', error);
    return {
      success: false,
      error: error.message,
      message: '發送訊息失敗'
    };
  }
};

/**
 * 獲取聊天記錄
 */
export const getChatMessages = async (chatId, limitCount = 50) => {
  try {
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('chatId', '==', chatId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await safeFirestoreOperation(async () => {
      return await getDocs(q);
    });

    if (querySnapshot) {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });

      // 按時間正序排列（最舊的在前）
      messages.reverse();

      return {
        success: true,
        data: messages,
        message: `獲取 ${messages.length} 條訊息`
      };
    } else {
      return {
        success: true,
        data: [],
        message: '聊天記錄為空'
      };
    }
  } catch (error) {
    console.error('獲取聊天記錄失敗:', error);
    return {
      success: false,
      error: error.message,
      message: '獲取聊天記錄失敗'
    };
  }
};

/**
 * 監聽聊天訊息（實時更新）
 */
export const listenToChatMessages = (chatId, callback) => {
  try {
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('chatId', '==', chatId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      callback(messages);
    }, (error) => {
      console.error('監聽訊息失敗:', error);
      callback([]);
    });

    return unsubscribe;
  } catch (error) {
    console.error('設置訊息監聽失敗:', error);
    return () => {}; // 返回空函數避免錯誤
  }
};

/**
 * 標記訊息為已讀
 */
export const markMessagesAsRead = async (chatId) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('用戶未登入');
    }

    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('chatId', '==', chatId),
      where('senderId', '!=', user.uid),
      where('read', '==', false)
    );

    const querySnapshot = await safeFirestoreOperation(async () => {
      return await getDocs(q);
    });

    if (querySnapshot) {
      const batch = [];
      querySnapshot.forEach((doc) => {
        batch.push(
          updateDoc(doc.ref, { read: true })
        );
      });

      await Promise.all(batch);

      return {
        success: true,
        message: '訊息已標記為已讀'
      };
    }

    return {
      success: true,
      message: '沒有未讀訊息'
    };
  } catch (error) {
    console.error('標記已讀失敗:', error);
    return {
      success: false,
      error: error.message,
      message: '標記已讀失敗'
    };
  }
};

/**
 * 刪除訊息
 */
export const deleteMessage = async (messageId) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('用戶未登入');
    }

    const messageDoc = await safeFirestoreOperation(async () => {
      return await getDoc(doc(db, 'messages', messageId));
    });

    if (!messageDoc?.exists()) {
      throw new Error('訊息不存在');
    }

    // 檢查是否為訊息發送者
    if (messageDoc.data().senderId !== user.uid) {
      throw new Error('無權限刪除此訊息');
    }

    await safeFirestoreOperation(async () => {
      await deleteDoc(doc(db, 'messages', messageId));
    });

    return {
      success: true,
      message: '訊息刪除成功'
    };
  } catch (error) {
    console.error('刪除訊息失敗:', error);
    return {
      success: false,
      error: error.message,
      message: '刪除訊息失敗'
    };
  }
};

/**
 * 獲取未讀訊息數量
 */
export const getUnreadMessageCount = async () => {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('用戶未登入');
    }

    // 獲取用戶參與的所有聊天室
    const chatRooms = await getUserChatRooms();
    if (!chatRooms.success) {
      return { success: false, message: '無法獲取聊天室' };
    }

    let totalUnread = 0;

    // 計算每個聊天室的未讀訊息
    for (const chatRoom of chatRooms.data) {
      const messagesRef = collection(db, 'messages');
      const q = query(
        messagesRef,
        where('chatId', '==', chatRoom.id),
        where('senderId', '!=', user.uid),
        where('read', '==', false)
      );

      const querySnapshot = await safeFirestoreOperation(async () => {
        return await getDocs(q);
      });

      if (querySnapshot) {
        totalUnread += querySnapshot.size;
      }
    }

    return {
      success: true,
      data: { unreadCount: totalUnread },
      message: `共有 ${totalUnread} 條未讀訊息`
    };
  } catch (error) {
    console.error('獲取未讀訊息數量失敗:', error);
    return {
      success: false,
      error: error.message,
      message: '獲取未讀訊息數量失敗'
    };
  }
};

export default {
  createChatRoom,
  getUserChatRooms,
  sendMessage,
  getChatMessages,
  listenToChatMessages,
  markMessagesAsRead,
  deleteMessage,
  getUnreadMessageCount
}; 