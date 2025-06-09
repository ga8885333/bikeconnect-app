import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Bell, 
  Search, 
  MapPin, 
  Clock, 
  Users, 
  Heart, 
  MessageCircle, 
  Share2,
  Camera,
  Navigation,
  Zap,
  Info
} from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [nearbyRiders, setNearbyRiders] = useState([]);

  useEffect(() => {
    // 模擬獲取動態數據
    const mockPosts = [
      {
        id: '1',
        user: {
          name: '風速騎士',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          verified: true
        },
        content: '今天騎了淡水河堤，風景超美的！',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        location: '淡水河濱公園',
        timestamp: '2小時前',
        likes: 24,
        comments: 8,
        distance: '35.2km'
      },
      {
        id: '2',
        user: {
          name: '山路探險家',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          verified: false
        },
        content: '陽明山夜騎真的太爽了！誰要一起？',
        location: '陽明山國家公園',
        timestamp: '4小時前',
        likes: 67,
        comments: 12,
        distance: '28.7km'
      }
    ];

    const mockNearbyRiders = [
      {
        id: '1',
        name: '速度與激情',
        avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150',
        distance: '2.3km',
        bike: 'Yamaha R1',
        status: 'online'
      },
      {
        id: '2',
        name: '城市漫遊',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        distance: '4.1km',
        bike: 'Honda CBR',
        status: 'riding'
      }
    ];

    setPosts(mockPosts);
    setNearbyRiders(mockNearbyRiders);
  }, []);

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const QuickActionCard = ({ icon: Icon, title, subtitle, color, onClick }) => (
    <div 
      onClick={onClick}
      className={`card cursor-pointer transform hover:scale-105 ${color}`}
    >
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-white rounded-xl shadow-sm">
          <Icon size={24} className="text-bike-600" />
        </div>
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-sm text-white/80">{subtitle}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部標題欄 */}
      <div className="gradient-bg px-4 py-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              嗨，{user?.name || '騎行者'}！
            </h1>
            <p className="text-blue-100">今天想騎去哪裡？</p>
          </div>
          <div className="flex space-x-3">
            <button className="p-2 bg-white/20 rounded-xl">
              <Search size={20} className="text-white" />
            </button>
            <button className="p-2 bg-white/20 rounded-xl relative">
              <Bell size={20} className="text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>
          </div>
        </div>

        {/* 快速動作區 */}
        <div className="grid grid-cols-2 gap-3">
          <QuickActionCard
            icon={Navigation}
            title="開始騎行"
            subtitle="記錄你的路線"
            color="bg-gradient-to-br from-green-500 to-green-600"
            onClick={() => window.location.href = '/map'}
          />
          <QuickActionCard
            icon={Users}
            title="找人揪團"
            subtitle="附近的騎士"
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            onClick={() => window.location.href = '/groups'}
          />
          <QuickActionCard
            icon={MapPin}
            title="附近商家"
            subtitle="維修店・車行・加油站"
            color="bg-gradient-to-br from-emerald-500 to-emerald-600"
            onClick={() => window.location.href = '/store-map'}
          />
          <QuickActionCard
            icon={Camera}
            title="社群動態"
            subtitle="分享精彩瞬間"
            color="bg-gradient-to-br from-rose-500 to-rose-600"
            onClick={() => window.location.href = '/social'}
          />
        </div>
        
        {/* 地圖選擇提示 */}
        <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-start space-x-3">
            <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-800 text-sm">功能說明</h4>
              <p className="text-blue-700 text-xs mt-1">
                🗺️ <strong>開始騎行</strong>：Google Maps (需 API Key，功能完整)<br/>
                🏪 <strong>附近商家</strong>：OpenStreetMap (完全免費，支援導航)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4">
        {/* 附近騎士 */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">附近騎士</h2>
            <button className="text-bike-600 text-sm font-medium">查看全部</button>
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {nearbyRiders.map(rider => (
              <div key={rider.id} className="flex-shrink-0 text-center">
                <div className="relative">
                  <img
                    src={rider.avatar}
                    alt={rider.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-bike-200"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    rider.status === 'online' ? 'bg-green-500' : 'bg-orange-500'
                  }`}></div>
                </div>
                <p className="text-xs font-medium mt-2 w-16 truncate">{rider.name}</p>
                <p className="text-xs text-gray-500">{rider.distance}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 今日統計 */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="card bg-gradient-to-br from-bike-50 to-bike-100 text-center">
            <div className="text-2xl font-bold text-bike-600">{user?.stats?.totalDistance || 0}</div>
            <div className="text-xs text-bike-600">總里程(km)</div>
          </div>
          <div className="card bg-gradient-to-br from-green-50 to-green-100 text-center">
            <div className="text-2xl font-bold text-green-600">{user?.stats?.totalRides || 0}</div>
            <div className="text-xs text-green-600">騎行次數</div>
          </div>
          <div className="card bg-gradient-to-br from-purple-50 to-purple-100 text-center">
            <div className="text-2xl font-bold text-purple-600">{user?.stats?.totalTime || 0}</div>
            <div className="text-xs text-purple-600">騎行時數</div>
          </div>
        </div>

        {/* 動態時間軸 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">最新動態</h2>
            <button className="btn-secondary text-sm py-2 px-4">
              <Camera size={16} className="mr-2" />
              發布動態
            </button>
          </div>

          {posts.map(post => (
            <div key={post.id} className="card">
              {/* 用戶信息 */}
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={post.user.avatar}
                  alt={post.user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-800">{post.user.name}</h3>
                    {post.user.verified && (
                      <div className="w-4 h-4 bg-bike-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock size={12} />
                    <span>{post.timestamp}</span>
                    {post.location && (
                      <>
                        <span>·</span>
                        <MapPin size={12} />
                        <span>{post.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* 內容 */}
              <p className="text-gray-800 mb-4">{post.content}</p>

              {/* 圖片 */}
              {post.image && (
                <img
                  src={post.image}
                  alt="Post content"
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
              )}

              {/* 騎行數據 */}
              {post.distance && (
                <div className="bg-bike-50 rounded-xl p-3 mb-4">
                  <div className="flex items-center space-x-2 text-bike-600">
                    <Zap size={16} />
                    <span className="font-semibold">騎行數據</span>
                  </div>
                  <div className="text-2xl font-bold text-bike-600 mt-1">
                    {post.distance}
                  </div>
                </div>
              )}

              {/* 互動按鈕 */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Heart size={18} />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-500 hover:text-bike-500 transition-colors">
                  <MessageCircle size={18} />
                  <span className="text-sm">{post.comments}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                  <Share2 size={18} />
                  <span className="text-sm">分享</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage; 