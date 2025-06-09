import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Star, 
  MessageSquare,
  Filter,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';

const GroupsPage = () => {
  const [activeTab, setActiveTab] = useState('all'); // all, joined, created
  const [events, setEvents] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: 10,
    difficulty: 'beginner'
  });

  useEffect(() => {
    // 模擬獲取活動數據
    const mockEvents = [
      {
        id: '1',
        title: '台北河濱夜騎',
        description: '一起騎河濱，享受夜晚的涼風和美景！',
        organizer: {
          name: '夜騎王',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          rating: 4.8
        },
        date: '2024-01-15',
        time: '19:00',
        location: '大佳河濱公園',
        participants: 8,
        maxParticipants: 15,
        difficulty: 'beginner',
        status: 'open',
        isJoined: false,
        tags: ['夜騎', '河濱', '新手友善']
      },
      {
        id: '2',
        title: '陽明山挑戰賽',
        description: '挑戰陽明山的蜿蜒山路，適合有經驗的騎士！',
        organizer: {
          name: '山路高手',
          avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150',
          rating: 4.9
        },
        date: '2024-01-20',
        time: '08:00',
        location: '陽明山國家公園',
        participants: 12,
        maxParticipants: 20,
        difficulty: 'advanced',
        status: 'open',
        isJoined: true,
        tags: ['山路', '挑戰', '進階']
      },
      {
        id: '3',
        title: '淡水老街美食騎',
        description: '騎到淡水品嚐美食，輕鬆愉快的行程',
        organizer: {
          name: '美食探險家',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
          rating: 4.7
        },
        date: '2024-01-18',
        time: '10:00',
        location: '淡水捷運站',
        participants: 6,
        maxParticipants: 12,
        difficulty: 'beginner',
        status: 'open',
        isJoined: false,
        tags: ['美食', '觀光', '輕鬆']
      }
    ];

    setEvents(mockEvents);
  }, []);

  const handleCreateEvent = (e) => {
    e.preventDefault();
    const event = {
      id: Date.now().toString(),
      ...newEvent,
      organizer: {
        name: '我',
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150',
        rating: 4.5
      },
      participants: 1,
      status: 'open',
      isJoined: true,
      tags: ['新活動']
    };

    setEvents([event, ...events]);
    setShowCreateModal(false);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      maxParticipants: 10,
      difficulty: 'beginner'
    });
    toast.success('活動創建成功！');
  };

  const handleJoinEvent = (eventId) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { 
            ...event, 
            isJoined: !event.isJoined,
            participants: event.isJoined ? event.participants - 1 : event.participants + 1
          }
        : event
    ));
    
    const event = events.find(e => e.id === eventId);
    toast.success(event.isJoined ? '已退出活動' : '成功加入活動！');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '新手';
      case 'intermediate': return '中級';
      case 'advanced': return '進階';
      default: return '未知';
    }
  };

  const filteredEvents = events.filter(event => {
    if (activeTab === 'joined') return event.isJoined;
    if (activeTab === 'created') return event.organizer.name === '我';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部標題 */}
      <div className="gradient-bg px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">騎乘揪團</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-white text-bike-600 px-4 py-2 rounded-xl font-medium flex items-center space-x-2 hover:bg-gray-50 transition-colors"
          >
            <Plus size={18} />
            <span>發起活動</span>
          </button>
        </div>

        {/* 搜索欄 */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="搜索活動..."
            className="w-full pl-10 pr-10 py-3 bg-white rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Filter size={20} className="text-gray-400" />
          </button>
        </div>

        {/* 標籤切換 */}
        <div className="flex space-x-2">
          {[
            { key: 'all', label: '全部活動' },
            { key: 'joined', label: '已參加' },
            { key: 'created', label: '我發起的' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-bike-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 活動列表 */}
      <div className="px-4 -mt-4 space-y-4">
        {filteredEvents.map(event => (
          <div key={event.id} className="card">
            {/* 活動標題區 */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                
                {/* 標籤 */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(event.difficulty)}`}>
                    {getDifficultyText(event.difficulty)}
                  </span>
                  {event.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-bike-100 text-bike-700 rounded-full text-xs font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 主辦人信息 */}
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={event.organizer.avatar}
                alt={event.organizer.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-800">{event.organizer.name}</p>
                <div className="flex items-center space-x-1">
                  <Star size={12} className="text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600">{event.organizer.rating}</span>
                </div>
              </div>
            </div>

            {/* 活動詳情 */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar size={16} />
                <span className="text-sm">{event.date}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock size={16} />
                <span className="text-sm">{event.time}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin size={16} />
                <span className="text-sm">{event.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Users size={16} />
                <span className="text-sm">{event.participants}/{event.maxParticipants}</span>
              </div>
            </div>

            {/* 參加者頭像 */}
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-sm text-gray-600">參加者：</span>
              <div className="flex -space-x-2">
                {[...Array(Math.min(event.participants, 5))].map((_, i) => (
                  <img
                    key={i}
                    src={`https://images.unsplash.com/photo-${1500000000000 + i}?w=32&h=32&fit=crop&crop=face`}
                    alt="Participant"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                ))}
                {event.participants > 5 && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                    <span className="text-xs text-gray-600">+{event.participants - 5}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 操作按鈕 */}
            <div className="flex space-x-3">
              <button
                onClick={() => handleJoinEvent(event.id)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                  event.isJoined
                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    : 'btn-primary'
                }`}
              >
                {event.isJoined ? '已參加' : '立即參加'}
              </button>
              <button className="px-4 py-3 bg-bike-50 text-bike-600 rounded-xl hover:bg-bike-100 transition-colors">
                <MessageSquare size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 創建活動模態框 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">發起新活動</h2>
              
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">活動標題</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="input-field"
                    placeholder="輸入活動標題"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">活動描述</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    className="input-field h-20 resize-none"
                    placeholder="描述你的活動..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">日期</label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">時間</label>
                    <input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">集合地點</label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    className="input-field"
                    placeholder="輸入集合地點"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">最大人數</label>
                    <input
                      type="number"
                      value={newEvent.maxParticipants}
                      onChange={(e) => setNewEvent({...newEvent, maxParticipants: parseInt(e.target.value)})}
                      className="input-field"
                      min="2"
                      max="50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">難度等級</label>
                    <select
                      value={newEvent.difficulty}
                      onChange={(e) => setNewEvent({...newEvent, difficulty: e.target.value})}
                      className="input-field"
                    >
                      <option value="beginner">新手</option>
                      <option value="intermediate">中級</option>
                      <option value="advanced">進階</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 btn-secondary py-3"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary py-3"
                  >
                    創建活動
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsPage; 