import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Edit3,
  Heart,
  Share2,
  ChevronRight,
  Users,
  Trophy,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/ui/PageTransition';
import RideStatCard from '../components/ui/RideStatCard';
import SectionTitle from '../components/ui/SectionTitle';

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

  const navigate = useNavigate();
  const user = useAuth().user;

  const getGreeting = () => {
    const now = new Date();
    const hours = now.getHours();
    if (hours < 12) {
      return '早安';
    } else if (hours < 18) {
      return '午安';
    } else {
      return '晚安';
    }
  };

  return (
    <PageTransition>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)',
        paddingBottom: '80px'
      }}>
        {/* 头部用户信息 */}
        <div style={{
          background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
          padding: '60px 20px 40px 20px',
          color: 'white'
        }}>
          <div style={{
            maxWidth: '400px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
              alt="用戶頭像"
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid rgba(255, 255, 255, 0.3)'
              }}
            />
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '800',
                margin: '0 0 4px 0'
              }}>
                {getGreeting()}，{user?.name || '騎士'}！
              </h1>
              <p style={{
                fontSize: '16px',
                opacity: 0.9,
                margin: '0'
              }}>
                今天準備好騎行了嗎？
              </p>
            </div>
          </div>

          {/* 今日统计 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginTop: '24px',
            maxWidth: '400px',
            margin: '24px auto 0 auto'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '20px',
                fontWeight: '800',
                marginBottom: '4px'
              }}>
                {todayStats.distance}km
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>今日騎行</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '20px',
                fontWeight: '800',
                marginBottom: '4px'
              }}>
                {todayStats.time}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>騎行時間</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '20px',
                fontWeight: '800',
                marginBottom: '4px'
              }}>
                {todayStats.calories}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>燃燒卡路里</div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '0 20px' }}>
          {/* 快速操作 */}
          <SectionTitle 
            title="快速開始" 
            subtitle="選擇你想要的騎行活動"
            icon={MapPin}
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
            <button
              onClick={() => handleQuickAction('record')}
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid #dc262620',
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
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
                border: '2px solid #dc262620',
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
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
                border: '2px solid #dc262620',
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
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
                border: '2px solid #dc262620',
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
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

          {/* 本週進度 */}
          <SectionTitle 
            title="本週目標" 
            subtitle="追蹤你的騎行進度"
            icon={Trophy}
          />
          
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            border: '2px solid #ef444420',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            marginBottom: '32px'
          }}>
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
                  width: `${(weeklyProgress.current / weeklyProgress.goal) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #dc2626 0%, #ef4444 100%)',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
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

          {/* 即將到來的活動 */}
          <SectionTitle 
            title="即將到來" 
            subtitle="不要錯過精彩活動"
            icon={Calendar}
            action={() => navigate('/groups')}
            actionText="查看全部"
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {upcomingEvents.map((event, index) => (
              <div
                key={event.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '2px solid #f3f4f6',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <div>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#111827',
                      margin: '0 0 4px 0'
                    }}>
                      {event.title}
                    </h4>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <MapPin size={14} color="#6b7280" />
                      <span style={{
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        {event.location}
                      </span>
                    </div>
                  </div>
                  <div style={{
                    background: getDifficultyColor(event.difficulty),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {getDifficultyText(event.difficulty)}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Calendar size={14} color="#6b7280" />
                      <span style={{
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        {event.date}
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Users size={14} color="#6b7280" />
                      <span style={{
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        {event.participants}人參加
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={16} color="#9ca3af" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default HomePage; 