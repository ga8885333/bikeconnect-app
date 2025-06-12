/**
 * Firebase 服務層統一入口
 * 提供所有 Firebase 相關服務的統一導出
 */

// 認證服務
export {
  loginWithEmail,
  loginWithGoogle,
  registerWithEmail,
  logout,
  resetPassword,
  onAuthStateChange,
  getCurrentUser,
  sendVerificationEmail
} from './AuthService';

// 用戶服務
export {
  getUserProfile,
  updateUserProfile,
  uploadUserAvatar,
  updateUserStats,
  updateUserPreferences,
  searchUsers,
  getUserList,
  deleteUserAccount,
  toggleFollowUser
} from './UserService';

// 騎行服務
export {
  createRideRecord,
  getUserRides,
  updateRideRecord,
  deleteRideRecord,
  getRideStatsSummary,
  checkAndUnlockAchievements,
  getLeaderboard
} from './RideService';

// 聊天服務
export {
  createChatRoom,
  getUserChatRooms,
  sendMessage,
  getChatMessages,
  listenToChatMessages,
  markMessagesAsRead,
  deleteMessage,
  getUnreadMessageCount
} from './ChatService';

// 服務對象導出（用於需要整個服務對象的情況）
export { default as AuthService } from './AuthService';
export { default as UserService } from './UserService';
export { default as RideService } from './RideService';
export { default as ChatService } from './ChatService'; 