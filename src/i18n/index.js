import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 翻譯資源
const resources = {
  'zh-TW': {
    translation: {
      // BottomNavigation 翻譯
      navigation: {
        home: '首頁',
        social: '社群',
        map: '地圖',
        groups: '車隊',
        profile: '個人'
      },
      
      // HomePage 翻譯
      home: {
        greeting: '你好',
        welcome: '歡迎回來！',
        todayRide: '今日騎行',
        weeklyStats: '本週統計',
        recentActivity: '最近活動',
        quickActions: '快速操作',
        startRide: '開始騎行',
        viewMap: '查看地圖',
        joinGroup: '加入車隊',
        viewProfile: '查看個人資料',
        distance: '距離',
        time: '時間',
        speed: '速度',
        calories: '卡路里',
        rides: '騎行次數',
        totalDistance: '總距離',
        avgSpeed: '平均速度',
        achievements: '成就',
        noActivity: '暫無活動記錄',
        startFirstRide: '開始你的第一次騎行吧！',
        km: '公里',
        min: '分鐘',
        kmh: '公里/小時',
        cal: '卡路里',
        times: '次'
      },
      
      // 語言切換
      language: {
        switch: '切換語言',
        traditionalChinese: '繁體中文',
        simplifiedChinese: '簡體中文',
        english: 'English'
      }
    }
  },
  
  'zh-CN': {
    translation: {
      // BottomNavigation 翻译
      navigation: {
        home: '首页',
        social: '社群',
        map: '地图',
        groups: '车队',
        profile: '个人'
      },
      
      // HomePage 翻译
      home: {
        greeting: '你好',
        welcome: '欢迎回来！',
        todayRide: '今日骑行',
        weeklyStats: '本周统计',
        recentActivity: '最近活动',
        quickActions: '快速操作',
        startRide: '开始骑行',
        viewMap: '查看地图',
        joinGroup: '加入车队',
        viewProfile: '查看个人资料',
        distance: '距离',
        time: '时间',
        speed: '速度',
        calories: '卡路里',
        rides: '骑行次数',
        totalDistance: '总距离',
        avgSpeed: '平均速度',
        achievements: '成就',
        noActivity: '暂无活动记录',
        startFirstRide: '开始你的第一次骑行吧！',
        km: '公里',
        min: '分钟',
        kmh: '公里/小时',
        cal: '卡路里',
        times: '次'
      },
      
      // 语言切换
      language: {
        switch: '切换语言',
        traditionalChinese: '繁體中文',
        simplifiedChinese: '简体中文',
        english: 'English'
      }
    }
  },
  
  'en': {
    translation: {
      // BottomNavigation translations
      navigation: {
        home: 'Home',
        social: 'Social',
        map: 'Map',
        groups: 'Groups',
        profile: 'Profile'
      },
      
      // HomePage translations
      home: {
        greeting: 'Hello',
        welcome: 'Welcome back!',
        todayRide: 'Today\'s Ride',
        weeklyStats: 'Weekly Stats',
        recentActivity: 'Recent Activity',
        quickActions: 'Quick Actions',
        startRide: 'Start Ride',
        viewMap: 'View Map',
        joinGroup: 'Join Group',
        viewProfile: 'View Profile',
        distance: 'Distance',
        time: 'Time',
        speed: 'Speed',
        calories: 'Calories',
        rides: 'Rides',
        totalDistance: 'Total Distance',
        avgSpeed: 'Avg Speed',
        achievements: 'Achievements',
        noActivity: 'No activity yet',
        startFirstRide: 'Start your first ride!',
        km: 'km',
        min: 'min',
        kmh: 'km/h',
        cal: 'cal',
        times: 'times'
      },
      
      // Language switching
      language: {
        switch: 'Switch Language',
        traditionalChinese: '繁體中文',
        simplifiedChinese: '简体中文',
        english: 'English'
      }
    }
  }
};

// i18n 初始化設定
i18n
  .use(LanguageDetector) // 自動偵測語言
  .use(initReactI18next) // 綁定 react-i18next
  .init({
    resources,
    fallbackLng: 'zh-TW', // 預設語言為繁體中文
    
    // 語言偵測設定
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'], // 將語言選擇儲存到 localStorage
      lookupLocalStorage: 'i18nextLng'
    },
    
    interpolation: {
      escapeValue: false // React 已經處理 XSS 防護
    },
    
    // 開發模式設定
    debug: process.env.NODE_ENV === 'development'
  });

export default i18n; 