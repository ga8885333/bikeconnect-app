import React, { useState } from 'react';
import { 
  MapPin, 
  Users, 
  Calendar,
  Trophy,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [todayStats] = useState({
    distance: 12.5,
    time: 45,
    calories: 285
  });

  const [weeklyProgress] = useState({
    current: 68,
    goal: 100,
    streakDays: 5
  });

  const [recentActivities] = useState([
    {
      id: 1,
      type: '騎行記錄',
      distance: '15.2km',
      time: '52分鐘',
      date: '今天',
      calories: 320
    },
    {
      id: 2,
      type: '群組活動',
      name: '台北河濱夜騎',
      participants: 12,
      date: '昨天',
      status: '已完成'
    },
    {
      id: 3,
      type: '挑戰達成',
      achievement: '連續騎行5天',
      reward: '15積分',
      date: '2天前'
    }
  ]);

  const [upcomingEvents] = useState([
    {
      id: 1,
      title: '陽明山挑戰賽',
      date: '1月20日',
      time: '08:00',
      participants: 8,
      maxParticipants: 15,
      difficulty: 'advanced'
    },
    {
      id: 2,
      title: '淡水休閒騎',
      date: '1月18日',
      time: '10:00',
      participants: 6,
      maxParticipants: 12,
      difficulty: 'beginner'
    }
  ]);

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
        toast.success('探索路線！', {
          style: { 
            background: '#dc2626', 
            color: '#ffffff',
            fontWeight: '600'
          }
        });
        break;
      case 'friends':
        toast.success('尋找騎友！', {
          style: { 
            background: '#dc2626', 
            color: '#ffffff',
            fontWeight: '600'
          }
        });
        break;
      case 'events':
        toast.success('創建活動！', {
          style: { 
            background: '#dc2626', 
            color: '#ffffff',
            fontWeight: '600'
          }
        });
        break;
      default:
        break;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#dc2626';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '休閒';
      case 'intermediate': return '中等';
      case 'advanced': return '挑戰';
      default: return '未知';
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* 頂部問候區域 */}
      <div style={{
        background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
        padding: '40px 20px 60px 20px',
        borderRadius: '0 0 32px 32px',
        marginBottom: '20px'
      }}>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid rgba(255, 255, 255, 0.3)'
            }}>
              <span style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff' }}>李</span>
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', margin: 0 }}>早安，小明！</h1>
              <p style={{ fontSize: '14px', color: '#ffffff', margin: 0, opacity: 0.9, fontWeight: '500' }}>今天是騎行的好日子</p>
            </div>
          </div>

          {/* 今日數據卡片 */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: '900', color: '#111827', marginBottom: '4px' }}>
                  {todayStats.distance}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>距離(km)</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: '900', color: '#111827', marginBottom: '4px' }}>
                  {todayStats.time}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>騎行時間(分)</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: '900', color: '#111827', marginBottom: '4px' }}>
                  {todayStats.calories}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>燃燒卡路里</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '0 20px' }}>
        {/* 快速操作 */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', marginBottom: '16px' }}>快速開始</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <button
              onClick={() => handleQuickAction('record')}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #dc2626',
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#fee2e2',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <MapPin size={20} style={{ color: '#dc2626' }} />
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>開始騎行</div>
              <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>記錄你的騎行路線</div>
            </button>

            <button
              onClick={() => handleQuickAction('explore')}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #dc2626',
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#fee2e2',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <TrendingUp size={20} style={{ color: '#dc2626' }} />
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>探索路線</div>
              <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>發現新的騎行路線</div>
            </button>

            <button
              onClick={() => handleQuickAction('friends')}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #dc2626',
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#fee2e2',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <Users size={20} style={{ color: '#dc2626' }} />
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>找騎友</div>
              <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>尋找附近的騎行夥伴</div>
            </button>

            <button
              onClick={() => handleQuickAction('events')}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #dc2626',
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#fee2e2',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <Calendar size={20} style={{ color: '#dc2626' }} />
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>創建活動</div>
              <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>組織騎行活動</div>
            </button>
          </div>
        </div>

        {/* 本週進度 */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid #ef4444',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>本週目標</h3>
              <Trophy size={20} style={{ color: '#dc2626' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>騎行進度</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#dc2626' }}>
                  {weeklyProgress.current}/{weeklyProgress.goal}km
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#fee2e2',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${weeklyProgress.current}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #dc2626 0%, #ef4444 100%)',
                  borderRadius: '4px'
                }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#111827' }}>
                  {weeklyProgress.streakDays}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>連續騎行天數</div>
              </div>
              <div style={{
                padding: '8px 16px',
                backgroundColor: '#fee2e2',
                borderRadius: '12px'
              }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#dc2626' }}>
                  還差 {weeklyProgress.goal - weeklyProgress.current}km
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 即將到來的活動 */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>即將到來</h3>
            <button style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#dc2626',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              查看更多 <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {upcomingEvents.map(event => (
              <div key={event.id} style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #f3f4f6',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0 0 4px 0' }}>
                      {event.title}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#6b7280' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} />
                        <span style={{ fontWeight: '600' }}>{event.date}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        <span style={{ fontWeight: '600' }}>{event.time}</span>
                      </div>
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: '700',
                    backgroundColor: event.difficulty === 'beginner' ? '#dcfce7' : event.difficulty === 'advanced' ? '#fee2e2' : '#fee2e2',
                    color: getDifficultyColor(event.difficulty)
                  }}>
                    {getDifficultyText(event.difficulty)}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600' }}>
                  {event.participants}/{event.maxParticipants} 人參加
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 最近活動 */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>最近活動</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentActivities.map(activity => (
              <div key={activity.id} style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #f3f4f6',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                      {activity.type}
                    </div>
                    {activity.distance && (
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px', fontWeight: '600' }}>
                        {activity.distance} • {activity.time}
                      </div>
                    )}
                    {activity.name && (
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px', fontWeight: '600' }}>
                        {activity.name} • {activity.participants} 人參加
                      </div>
                    )}
                    {activity.achievement && (
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '2px', fontWeight: '600' }}>
                        {activity.achievement} • 獲得 {activity.reward}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600' }}>{activity.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 