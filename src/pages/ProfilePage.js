import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Edit3,
  Plus,
  X,
  Heart,
  Bike,
  Trophy,
  Target,
  Users,
  User,
  Settings,
  Award,
  TrendingUp,
  Clock,
  Zap,
  Share2,
  ChevronRight,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState([
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      caption: '週末河濱騎行',
      likes: 12,
      timestamp: '2天前'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
      caption: '山區挑戰路線',
      likes: 8,
      timestamp: '1週前'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400',
      caption: '新車開箱',
      likes: 25,
      timestamp: '2週前'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1544191696-15693072beb0?w=400',
      caption: '城市夜騎',
      likes: 15,
      timestamp: '3週前'
    }
  ]);

  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || ''
  });

  const [achievements] = useState([
    {
      id: '1',
      title: '百公里挑戰者',
      description: '單次騎行超過100公里',
      icon: '🏆',
      date: '2023-12-01',
      type: 'distance'
    },
    {
      id: '2',
      title: '早起鳥兒',
      description: '凌晨5點前開始騎行',
      icon: '🌅',
      date: '2023-11-15',
      type: 'time'
    },
    {
      id: '3',
      title: '社交達人',
      description: '參加超過20場群組活動',
      icon: '👥',
      date: '2023-10-30',
      type: 'social'
    },
    {
      id: '4',
      title: '攝影師',
      description: '分享超過50張騎行照片',
      icon: '📸',
      date: '2023-10-15',
      type: 'content'
    }
  ]);

  const [recentRides] = useState([
    {
      id: '1',
      title: '陽明山晨騎',
      distance: '28.5km',
      time: '1小時45分',
      date: '2天前',
      photos: 3,
      likes: 24
    },
    {
      id: '2',
      title: '淡水河濱夜騎',
      distance: '15.2km',
      time: '52分鐘',
      date: '5天前',
      photos: 2,
      likes: 18
    },
    {
      id: '3',
      title: '新店溪畔悠騎',
      distance: '22.8km',
      time: '1小時12分',
      date: '1週前',
      photos: 4,
      likes: 31
    }
  ]);

  const [activeTab, setActiveTab] = useState('overview');
  const [showEditProfile, setShowEditProfile] = useState(false);

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('圖片大小不能超過5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto = {
          id: Date.now() + Math.random(),
          url: e.target.result,
          caption: '',
          likes: 0,
          timestamp: '剛剛'
        };
        setGalleryPhotos(prev => [newPhoto, ...prev]);
        toast.success('照片上傳成功！');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeletePhoto = (photoId) => {
    setGalleryPhotos(prev => prev.filter(photo => photo.id !== photoId));
    setIsPhotoModalOpen(false);
    toast.success('照片已刪除');
  };

  const handleSaveProfile = () => {
    updateUser(editedUser);
    setIsEditing(false);
    toast.success('個人資料已更新！');
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleFollow = () => {
    toast.success('功能開發中', {
      style: { 
        background: '#dc2626', 
        color: '#ffffff',
        fontWeight: '600'
      }
    });
  };

  const handleShare = () => {
    toast.success('個人檔案已分享！', {
      style: { 
        background: '#dc2626', 
        color: '#ffffff',
        fontWeight: '600'
      }
    });
  };

  const EditProfileModal = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '24px',
        width: '100%',
        maxWidth: '400px',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>編輯個人檔案</h3>
          <button 
            onClick={() => setShowEditProfile(false)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
              alt="個人頭像"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #dc2626'
              }}
            />
            <button style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#dc2626',
              border: '2px solid #ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Camera size={14} style={{ color: '#ffffff' }} />
            </button>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>
              姓名
            </label>
            <input
              type="text"
              defaultValue={editedUser.name}
              onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '500'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>
              個人簡介
            </label>
            <textarea
              defaultValue={editedUser.bio}
              onChange={(e) => setEditedUser(prev => ({ ...prev, bio: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '16px',
                height: '80px',
                resize: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '6px' }}>
              所在地區
            </label>
            <input
              type="text"
              defaultValue={editedUser.location}
              onChange={(e) => setEditedUser(prev => ({ ...prev, location: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '500'
              }}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button 
            onClick={() => setShowEditProfile(false)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: '#6b7280'
            }}
          >
            取消
          </button>
          <button 
            onClick={handleSaveProfile}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '700'
            }}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );

  const StatCard = ({ icon: Icon, value, label, color, bgColor }) => (
    <div className={`${bgColor} p-4 rounded-xl`}>
      <div className="text-center">
        <Icon size={24} className={`${color} mx-auto mb-2`} />
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
        <div className={`text-xs ${color} opacity-80`}>{label}</div>
      </div>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* 個人檔案頭部 */}
      <div style={{
        background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                  alt="個人頭像"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '4px solid rgba(255, 255, 255, 0.3)'
                  }}
                />
                {user?.verified && (
                  <div style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#ffffff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #dc2626'
                  }}>
                    <span style={{ color: '#dc2626', fontSize: '12px', fontWeight: '700' }}>✓</span>
                  </div>
                )}
              </div>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', margin: 0 }}>{user?.name || '騎行者'}</h1>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: '700',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#ffffff'
                  }}>
                    {user?.level || '騎行者'}
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: '#ffffff', margin: '0 0 8px 0', opacity: 0.8, fontWeight: '500' }}>
                  {user?.username || '@bikerlee'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} style={{ color: '#ffffff', opacity: 0.8 }} />
                    <span style={{ fontSize: '12px', color: '#ffffff', opacity: 0.8, fontWeight: '500' }}>{user?.location || '台北市'}</span>
                  </div>
                  <span style={{ color: '#ffffff', opacity: 0.5 }}>•</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} style={{ color: '#ffffff', opacity: 0.8 }} />
                    <span style={{ fontSize: '12px', color: '#ffffff', opacity: 0.8, fontWeight: '500' }}>
                      {new Date(user?.joinDate || '2023-01-15').toLocaleDateString('zh-TW')} 加入
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleShare}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Share2 size={16} style={{ color: '#ffffff' }} />
              </button>
              <button
                onClick={handleEditProfile}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Edit3 size={16} style={{ color: '#ffffff' }} />
              </button>
            </div>
          </div>

          {/* 個人簡介 */}
          <p style={{ 
            fontSize: '14px', 
            color: '#ffffff', 
            marginBottom: '20px', 
            lineHeight: '1.5',
            opacity: 0.9,
            fontWeight: '500'
          }}>
            {user?.bio || '熱愛騎行的自由靈魂，喜歡探索城市的每個角落 🚴‍♂️'}
          </p>

          {/* 統計數據 */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#111827', marginBottom: '4px' }}>
                {user?.stats?.totalDistance || '1,235'}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>總里程 (km)</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#111827', marginBottom: '4px' }}>
                {user?.stats?.totalRides || '89'}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>騎行次數</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: '#111827', marginBottom: '4px' }}>
                {user?.stats?.avgSpeed || '15.2'}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>平均時速</div>
            </div>
          </div>

          {/* 社交統計 */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <div style={{
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '12px',
              padding: '12px 16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>{user?.stats?.followers || '245'}</div>
              <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>追蹤者</div>
            </div>
            <div style={{
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '12px',
              padding: '12px 16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>{user?.stats?.following || '189'}</div>
              <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>正在追蹤</div>
            </div>
            <div style={{
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '12px',
              padding: '12px 16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>{user?.stats?.achievements || '15'}</div>
              <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>成就</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '0 20px' }}>
        {/* 標籤切換 */}
        <div style={{ display: 'flex', marginBottom: '24px', backgroundColor: '#f9fafb', borderRadius: '12px', padding: '4px' }}>
          {[
            { key: 'overview', label: '總覽' },
            { key: 'achievements', label: '成就' },
            { key: 'rides', label: '騎行' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === tab.key ? '#ffffff' : 'transparent',
                color: activeTab === tab.key ? '#dc2626' : '#6b7280',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === tab.key ? '0 2px 4px rgba(0, 0, 0, 0.05)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 內容區域 */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* 本月統計 */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #f3f4f6',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>本月表現</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#dc2626' }}>156km</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>本月騎行</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#dc2626' }}>12次</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>騎行次數</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#dc2626' }}>18.2</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>平均速度</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#dc2626' }}>2,850</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>燃燒卡路里</div>
                </div>
              </div>
            </div>

            {/* 最新成就 */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #f3f4f6',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: 0 }}>最新成就</h3>
                <button 
                  onClick={() => setActiveTab('achievements')}
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#dc2626',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  查看全部 <ChevronRight size={12} />
                </button>
              </div>
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                {achievements.slice(0, 3).map(achievement => (
                  <div key={achievement.id} style={{
                    minWidth: '120px',
                    backgroundColor: '#fee2e2',
                    borderRadius: '12px',
                    padding: '16px 12px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{achievement.icon}</div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#dc2626', marginBottom: '4px' }}>
                      {achievement.title}
                    </div>
                    <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: '500' }}>
                      {achievement.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
              成就收藏 ({achievements.length})
            </h3>
            {achievements.map(achievement => (
              <div key={achievement.id} style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #f3f4f6',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  {achievement.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0 0 4px 0' }}>
                    {achievement.title}
                  </h4>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 6px 0', fontWeight: '500' }}>
                    {achievement.description}
                  </p>
                  <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600' }}>
                    獲得於 {achievement.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'rides' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
              最近騎行
            </h3>
            {recentRides.map(ride => (
              <div key={ride.id} style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #f3f4f6',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0 0 4px 0' }}>
                      {ride.title}
                    </h4>
                    <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600' }}>{ride.date}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Camera size={12} style={{ color: '#6b7280' }} />
                      <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>{ride.photos}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Heart size={12} style={{ color: '#6b7280' }} />
                      <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>{ride.likes}</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    backgroundColor: '#fee2e2',
                    borderRadius: '10px',
                    padding: '12px',
                    flex: 1,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#111827' }}>{ride.distance}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600' }}>距離</div>
                  </div>
                  <div style={{
                    backgroundColor: '#fee2e2',
                    borderRadius: '10px',
                    padding: '12px',
                    flex: 1,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#111827' }}>{ride.time}</div>
                    <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600' }}>時間</div>
                  </div>
                </div>
              </div>
            ))}
            
            <div style={{ textAlign: 'center', paddingTop: '16px' }}>
              <button style={{
                padding: '12px 24px',
                borderRadius: '20px',
                border: '1px solid #dc2626',
                backgroundColor: '#ffffff',
                color: '#dc2626',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                查看更多騎行記錄
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 編輯個人檔案彈窗 */}
      {showEditProfile && <EditProfileModal />}

      {/* 照片詳情彈窗 */}
      {isPhotoModalOpen && selectedPhoto && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
            <div className="relative">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{selectedPhoto.caption || '無標題'}</h3>
                  <p className="text-sm text-gray-500">{selectedPhoto.timestamp}</p>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <Heart size={16} />
                  <span>{selectedPhoto.likes}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    const newCaption = prompt('編輯照片說明', selectedPhoto.caption);
                    if (newCaption !== null) {
                      setGalleryPhotos(prev => prev.map(p => 
                        p.id === selectedPhoto.id ? { ...p, caption: newCaption } : p
                      ));
                      setSelectedPhoto({ ...selectedPhoto, caption: newCaption });
                      toast.success('照片說明已更新');
                    }
                  }}
                  className="flex-1 py-2 bg-primary-50 text-primary-600 rounded-lg font-medium hover:bg-primary-100 transition-colors"
                >
                  編輯說明
                </button>
                <button
                  onClick={() => handleDeletePhoto(selectedPhoto.id)}
                  className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                >
                  刪除照片
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage; 