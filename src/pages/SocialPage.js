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
  Send
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const SocialPage = () => {
  const { user } = useAuth();
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部導覽 */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">社群牆</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-bike-500 text-white p-2 rounded-xl hover:bg-bike-600 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* 標籤切換 */}
        <div className="flex space-x-1">
          {[
            { key: 'all', label: '全部' },
            { key: 'following', label: '關注中' },
            { key: 'popular', label: '熱門' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-bike-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 動態列表 */}
      <div className="px-4 py-4 space-y-4">
        {filteredPosts.map(post => (
          <div key={post.id} className="card">
            {/* 用戶信息 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={post.user.avatar}
                  alt={post.user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-800">{post.user.name}</h3>
                    {post.user.verified && (
                      <Crown size={16} className="text-yellow-500" />
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
              
              {post.user.id !== user.id && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleFollow(post.user.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      post.user.following
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-bike-500 text-white hover:bg-bike-600'
                    }`}
                  >
                    {post.user.following ? '已關注' : '關注'}
                  </button>
                  <button
                    onClick={() => handleStartPrivateChat(post.user)}
                    className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    私訊
                  </button>
                </div>
              )}
            </div>

            {/* 內容 */}
            <p className="text-gray-800 mb-4">{post.content}</p>

            {/* 標籤 */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-bike-100 text-bike-700 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 媒體內容 */}
            {post.images.length > 0 && (
              <div className={`grid gap-2 mb-4 ${
                post.images.length === 1 ? 'grid-cols-1' : 
                post.images.length === 2 ? 'grid-cols-2' : 
                'grid-cols-2'
              }`}>
                {post.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Post image ${index + 1}`}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                ))}
              </div>
            )}

            {post.video && (
              <video
                src={post.video}
                controls
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
            )}

            {/* 互動統計 */}
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <span>{post.likes} 讚</span>
              <span>{post.comments} 評論</span>
              <span>{post.shares} 分享</span>
            </div>

            {/* 互動按鈕 */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center space-x-2 transition-colors ${
                  post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart size={18} className={post.isLiked ? 'fill-current' : ''} />
                <span className="text-sm">讚</span>
              </button>
              
              <button
                onClick={() => handleComment(post)}
                className="flex items-center space-x-2 text-gray-500 hover:text-bike-500 transition-colors"
              >
                <MessageCircle size={18} />
                <span className="text-sm">評論</span>
              </button>
              
              <button
                onClick={() => handleShare(post)}
                className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
              >
                <Share2 size={18} />
                <span className="text-sm">分享</span>
              </button>
              
              <button
                onClick={() => handleBookmark(post.id)}
                className={`flex items-center space-x-2 transition-colors ${
                  post.isBookmarked ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'
                }`}
              >
                <Bookmark size={18} className={post.isBookmarked ? 'fill-current' : ''} />
                <span className="text-sm">收藏</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 創建動態模態框 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">發布動態</h2>
              
              <form onSubmit={handleCreatePost} className="space-y-4">
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  className="w-full h-32 p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-bike-500"
                  placeholder="分享你的騎行心得..."
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">地點 (可選)</label>
                  <input
                    type="text"
                    value={newPost.location}
                    onChange={(e) => setNewPost({...newPost, location: e.target.value})}
                    className="input-field"
                    placeholder="輸入地點"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    className="flex-1 border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-bike-500 transition-colors"
                  >
                    <Camera size={24} className="mx-auto mb-2 text-gray-400" />
                    <span className="text-sm text-gray-600">添加照片</span>
                  </button>
                  <button
                    type="button"
                    className="flex-1 border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-bike-500 transition-colors"
                  >
                    <Video size={24} className="mx-auto mb-2 text-gray-400" />
                    <span className="text-sm text-gray-600">添加影片</span>
                  </button>
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
                    發布
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 評論模態框 */}
      {showCommentModal && selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center p-0 z-50">
          <div className="bg-white rounded-t-2xl w-full max-h-[60vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">評論</h3>
                <button
                  onClick={() => setShowCommentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* 評論輸入 */}
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 flex space-x-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bike-500"
                    placeholder="寫下你的評論..."
                  />
                  <button
                    onClick={handleSendComment}
                    className="bg-bike-500 text-white p-2 rounded-xl hover:bg-bike-600 transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>

              {/* 模擬評論列表 */}
              <div className="space-y-3">
                <div className="flex space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40"
                    alt="Commenter"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-xl p-3">
                      <p className="font-medium text-sm">騎行愛好者</p>
                      <p className="text-sm">風景真的很美！下次也想去</p>
                    </div>
                    <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                      <span>2小時前</span>
                      <button className="hover:text-bike-500">回覆</button>
                      <button className="hover:text-red-500">讚</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialPage; 