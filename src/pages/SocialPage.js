import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  Camera,
  Video,
  MapPin,
  Clock,
  Crown,
  Send,
  MoreHorizontal,
  ThumbsUp,
  Users,
  Star,
  Zap,
  Award,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import toast from 'react-hot-toast';

const SocialPage = () => {
  const { user } = useUserStore();
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // all, following, popular
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    images: [],
    location: '',
    tags: []
  });
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comment, setComment] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    // 模擬獲取社群動態
    const mockPosts = [
      {
        id: '1',
        user: {
          id: '1',
          name: '騎行女神',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c12c?w=150',
          verified: true,
          following: false,
          followerCount: 1200
        },
        content: '今天騎了一條超美的山路！空氣清新，風景如畫 🏍️✨',
        images: [
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'
        ],
        video: null,
        location: '陽明山國家公園',
        timestamp: '2小時前',
        likes: 89,
        comments: 23,
        shares: 12,
        isLiked: false,
        isBookmarked: false,
        tags: ['山路騎行', '風景攝影', '陽明山']
      },
      {
        id: '2',
        user: {
          id: '2',
          name: '機車達人',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          verified: true,
          following: true,
          followerCount: 850
        },
        content: '新車開箱！Yamaha R1 終於到手了 🔥 準備開始新的騎行冒險',
        images: [
          'https://images.unsplash.com/photo-1558717914-f4e1cca0b8bd?w=400'
        ],
        video: null,
        location: '台北車行',
        timestamp: '5小時前',
        likes: 156,
        comments: 45,
        shares: 28,
        isLiked: true,
        isBookmarked: true,
        tags: ['新車開箱', 'YamahaR1', '重機']
      },
      {
        id: '3',
        user: {
          id: '3',
          name: '夜騎愛好者',
          avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150',
          verified: false,
          following: false,
          followerCount: 324
        },
        content: '河濱夜騎真的超療癒！城市燈光配上涼風，完美的夜晚 🌃',
        images: [],
        video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        location: '淡水河濱公園',
        timestamp: '1天前',
        likes: 67,
        comments: 18,
        shares: 9,
        isLiked: false,
        isBookmarked: false,
        tags: ['夜騎', '河濱', '療癒']
      }
    ];

    setPosts(mockPosts);
  }, []);

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleBookmark = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isBookmarked: !post.isBookmarked
        };
      }
      return post;
    }));
    
    const post = posts.find(p => p.id === postId);
    toast.success(post.isBookmarked ? '已取消收藏' : '已收藏');
  };

  const handleFollow = (userId) => {
    setPosts(posts.map(post => {
      if (post.user.id === userId) {
        return {
          ...post,
          user: {
            ...post.user,
            following: !post.user.following
          }
        };
      }
      return post;
    }));
  };

  const handleShare = (post) => {
    // 模擬分享功能
    if (navigator.share) {
      navigator.share({
        title: `${post.user.name}的動態`,
        text: post.content,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('鏈接已復製到剪貼板');
    }
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    const post = {
      id: Date.now().toString(),
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        verified: user.verified,
        following: false,
        followerCount: 0
      },
      content: newPost.content,
      images: newPost.images,
      video: null,
      location: newPost.location,
      timestamp: '剛剛',
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isBookmarked: false,
      tags: newPost.tags
    };

    setPosts([post, ...posts]);
    setShowCreateModal(false);
    setNewPost({ content: '', images: [], location: '', tags: [] });
    toast.success('動態發布成功！');
  };

  const handleComment = (post) => {
    setSelectedPost(post);
    setShowCommentModal(true);
  };

  const handleSendComment = () => {
    if (!comment.trim()) return;
    
    toast.success('評論發送成功！');
    setComment('');
    setShowCommentModal(false);
    
    // 更新評論數
    setPosts(posts.map(post => 
      post.id === selectedPost.id 
        ? { ...post, comments: post.comments + 1 }
        : post
    ));
  };

  const handleStartPrivateChat = (targetUser) => {
    if (!user.premiumMember && !targetUser.following) {
      toast.error('需要升級為付費會員才能私訊非互相關注的用戶');
      return;
    }
    toast.success(`開始與 ${targetUser.name} 的私人聊天`);
  };

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'following') return post.user.following;
    if (activeTab === 'popular') return post.likes > 100;
    return true;
  });

  const getFilteredPosts = () => {
    switch (filterType) {
      case 'challenges':
        return posts.filter(post => post.tags.includes('挑戰'));
      case 'casual':
        return posts.filter(post => post.tags.includes('休閒'));
      case 'equipment':
        return posts.filter(post => post.tags.includes('裝備'));
      default:
        return posts;
    }
  };

  const CreatePostModal = () => (
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
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>發布動態</h3>
          <button 
            onClick={() => setShowCreateModal(false)}
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
        
        <textarea 
          placeholder="分享你的騎行體驗..."
          style={{
            width: '100%',
            height: '120px',
            padding: '16px',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '16px',
            resize: 'none',
            marginBottom: '16px',
            fontFamily: 'inherit'
          }}
        />
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            flex: 1,
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#6b7280'
          }}>
            <Camera size={16} />
            添加照片
          </button>
          <button 
            onClick={() => {
              setShowCreateModal(false);
              toast.success('動態發布成功！', {
                style: { 
                  background: '#dc2626', 
                  color: '#ffffff',
                  fontWeight: '600'
                }
              });
            }}
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
            發布
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* 頂部導航區域 */}
      <div style={{
        background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', margin: 0 }}>騎行社群</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <Camera size={20} />
            </button>
          </div>

          {/* 搜索框 */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search size={18} style={{ 
              position: 'absolute', 
              left: '16px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#ffffff', 
              opacity: 0.8 
            }} />
            <input
              type="text"
              placeholder="搜索騎行動態..."
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '500'
              }}
            />
          </div>

          {/* 篩選標籤 */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {[
              { key: 'all', label: '全部', icon: '🏠' },
              { key: 'challenges', label: '挑戰', icon: '🏔️' },
              { key: 'casual', label: '休閒', icon: '🚴' },
              { key: 'equipment', label: '裝備', icon: '⚙️' }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setFilterType(filter.key)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  backgroundColor: filterType === filter.key ? '#ffffff' : 'rgba(255, 255, 255, 0.2)',
                  color: filterType === filter.key ? '#dc2626' : '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{filter.icon}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '0 20px' }}>
        {/* 動態列表 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
          {getFilteredPosts().map(post => (
            <div key={post.id} style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              border: '1px solid #f3f4f6',
              overflow: 'hidden'
            }}>
              {/* 用戶信息頭部 */}
              <div style={{ padding: '20px 20px 16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ position: 'relative' }}>
                    <img
                      src={post.user.avatar}
                      alt={post.user.name}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #dc2626'
                      }}
                    />
                    {post.user.verified && (
                      <div style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        width: '18px',
                        height: '18px',
                        backgroundColor: '#dc2626',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid #ffffff'
                      }}>
                        <span style={{ color: '#ffffff', fontSize: '10px', fontWeight: '700' }}>✓</span>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: 0 }}>{post.user.name}</h3>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: '700',
                        backgroundColor: post.user.level === 'PRO' ? '#fee2e2' : '#f3f4f6',
                        color: post.user.level === 'PRO' ? '#dc2626' : '#6b7280'
                      }}>
                        {post.user.level}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} style={{ color: '#9ca3af' }} />
                        <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '500' }}>{post.timestamp}</span>
                      </div>
                      {post.location && (
                        <>
                          <span style={{ color: '#d1d5db' }}>•</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} style={{ color: '#9ca3af' }} />
                            <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '500' }}>{post.location}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <button style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <MoreHorizontal size={16} style={{ color: '#6b7280' }} />
                  </button>
                </div>
              </div>

              {/* 內容文字 */}
              <div style={{ paddingLeft: '20px', paddingRight: '20px', marginBottom: '16px' }}>
                <p style={{ 
                  fontSize: '15px', 
                  lineHeight: '1.6', 
                  color: '#111827', 
                  margin: 0, 
                  fontWeight: '500' 
                }}>
                  {post.content}
                </p>
                
                {/* 標籤 */}
                {post.tags && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                    {post.tags.map(tag => (
                      <span key={tag} style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: '#fee2e2',
                        color: '#dc2626'
                      }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 圖片 */}
              {post.images && post.images.length > 0 && (
                <div style={{ paddingLeft: '20px', paddingRight: '20px', marginBottom: '16px' }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: post.images.length === 1 ? '1fr' : 'repeat(2, 1fr)', 
                    gap: '8px' 
                  }}>
                    {post.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt="Post"
                        style={{
                          width: '100%',
                          height: post.images.length === 1 ? '240px' : '160px',
                          objectFit: 'cover',
                          borderRadius: '12px'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 騎行數據 */}
              {post.rideData && (
                <div style={{ 
                  margin: '0 20px 16px 20px',
                  background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                  borderRadius: '16px',
                  padding: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Zap size={16} style={{ color: '#dc2626' }} />
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#dc2626' }}>騎行數據</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>{post.rideData.distance}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600' }}>距離</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>{post.rideData.time}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600' }}>時間</div>
                    </div>
                    {post.rideData.elevation && (
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>{post.rideData.elevation}</div>
                        <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600' }}>海拔</div>
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>{post.rideData.avgSpeed}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600' }}>平均速度</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 互動按鈕 */}
              <div style={{ 
                padding: '16px 20px', 
                borderTop: '1px solid #f3f4f6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <button
                  onClick={() => handleLike(post.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    backgroundColor: post.isLiked ? '#fee2e2' : '#f9fafb',
                    color: post.isLiked ? '#dc2626' : '#6b7280',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Heart size={16} fill={post.isLiked ? '#dc2626' : 'none'} />
                  {post.likes}
                </button>
                
                <button
                  onClick={() => handleComment(post)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    backgroundColor: '#f9fafb',
                    color: '#6b7280',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  <MessageCircle size={16} />
                  {post.comments}
                </button>
                
                <button
                  onClick={() => handleShare(post)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    backgroundColor: '#f9fafb',
                    color: '#6b7280',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  <Share2 size={16} />
                  {post.shares}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 底部加載更多 */}
        <div style={{ textAlign: 'center', paddingBottom: '32px' }}>
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
            加載更多動態
          </button>
        </div>
      </div>

      {/* 創建動態彈窗 */}
      {showCreateModal && <CreatePostModal />}
    </div>
  );
};

export default SocialPage; 