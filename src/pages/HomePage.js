import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Users,
  Trophy,
  Timer,
  Bike,
  Map,
  Zap,
  Navigation,
  Plus,
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import toast from 'react-hot-toast';

const HomePage = () => {
  const { userProfile } = useUserStore();
  const navigate = useNavigate();
  
  const [todayStats] = useState({
    distance: 12.5,
    time: 45,
    calories: 285,
    speed: 28.3
  });

  const [weeklyProgress] = useState({
    current: 68,
    goal: 100,
    streakDays: 5
  });

  const handleQuickAction = (action) => {
    switch (action) {
      case 'record':
        toast.success('開始騎行記錄！', {
          style: { 
            background: '#dc2626', 
            color: '#ffffff',
            fontWeight: '600'
          }
        });
        break;
      case 'explore':
        navigate('/map');
        break;
      case 'friends':
        navigate('/social');
        break;
      case 'events':
        navigate('/groups');
        break;
      default:
        toast.success('操作成功！');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 頂部歡迎區 */}
      <div className="bg-red-500 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              歡迎回來, {userProfile?.name || '騎行者'}! 👋
            </h1>
            <p className="text-red-100">
              {new Date().toLocaleDateString('zh-TW', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
            </p>
          </div>
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
            <Bike className="text-white" size={32} />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* 今日統計 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">今日統計</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Map size={20} className="text-red-500" />
                </div>
                <span className="text-sm text-gray-600">今日距離</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900">{todayStats.distance}</span>
                <span className="text-sm text-gray-500">km</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Timer size={20} className="text-green-500" />
                </div>
                <span className="text-sm text-gray-600">騎行時間</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900">{todayStats.time}</span>
                <span className="text-sm text-gray-500">分鐘</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Zap size={20} className="text-purple-500" />
                </div>
                <span className="text-sm text-gray-600">平均速度</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900">{todayStats.speed}</span>
                <span className="text-sm text-gray-500">km/h</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Trophy size={20} className="text-orange-500" />
                </div>
                <span className="text-sm text-gray-600">消耗卡路里</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900">{todayStats.calories}</span>
                <span className="text-sm text-gray-500">kcal</span>
              </div>
            </div>
          </div>
        </div>

        {/* 快速操作 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">快速操作</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleQuickAction('record')}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
            >
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                <Navigation size={24} className="text-red-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">開始騎行</h3>
              <p className="text-sm text-gray-600">記錄新的騎行路線</p>
            </button>

            <button
              onClick={() => handleQuickAction('explore')}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <Map size={24} className="text-green-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">探索路線</h3>
              <p className="text-sm text-gray-600">發現熱門騎行路線</p>
            </button>

            <button
              onClick={() => handleQuickAction('friends')}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <Users size={24} className="text-purple-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">尋找騎友</h3>
              <p className="text-sm text-gray-600">與附近騎友連接</p>
            </button>

            <button
              onClick={() => handleQuickAction('events')}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                <Plus size={24} className="text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">參加活動</h3>
              <p className="text-sm text-gray-600">加入騎行活動</p>
            </button>
          </div>
        </div>

        {/* 本週進度 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">本週進度</h2>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">週目標進度</span>
              <span className="text-sm text-gray-500">{weeklyProgress.current}/{weeklyProgress.goal} km</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className="bg-red-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(weeklyProgress.current / weeklyProgress.goal) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">連續騎行 {weeklyProgress.streakDays} 天</span>
              <span className="text-red-500 font-medium">{Math.round((weeklyProgress.current / weeklyProgress.goal) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* 最近活動 */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">最近活動</h2>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">開始你的騎行之旅</h3>
              <p className="text-gray-600 mb-4">記錄你的第一次騎行，與社群分享你的體驗</p>
              <button 
                onClick={() => handleQuickAction('record')}
                className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                開始騎行
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 