import React, { useState, useRef } from 'react';
import { 
  Settings, 
  Edit3, 
  Wrench, 
  Calendar, 
  Award, 
  Crown, 
  ChevronRight,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Car,
  Clock,
  AlertTriangle,
  Camera,
  Upload,
  User,
  Plus,
  Trash2,
  Eye,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // profile, gallery, vehicles, settings
  const [showEditModal, setShowEditModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '熱愛騎車的自由靈魂，享受每一段旅程的風景與自由。',
    avatar: user?.avatar || null
  });
  
  // 個人相簿狀態
  const [gallery, setGallery] = useState([
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      caption: '我的愛車 Yamaha R1',
      type: 'bike',
      createdAt: '2024-01-15'
    },
    {
      id: '2', 
      url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
      caption: '山路騎行的美景',
      type: 'scenery',
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=400',
      caption: '和車友們的聚會',
      type: 'social',
      createdAt: '2024-01-05'
    }
  ]);

  const [vehicles, setVehicles] = useState([
    {
      id: '1',
      brand: 'Yamaha',
      model: 'R1',
      year: '2023',
      plateNumber: 'ABC-1234',
      lastMaintenance: '2024-01-01',
      nextMaintenance: '2024-04-01',
      mileage: 15500,
      maintenanceCost: 8500,
      inspectionDate: '2024-12-31'
    }
  ]);
  const [newVehicle, setNewVehicle] = useState({
    brand: '',
    model: '',
    year: '',
    plateNumber: '',
    mileage: 0
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    updateProfile(editData);
    setShowEditModal(false);
    setPreviewImage(null);
    toast.success('個人資料更新成功！');
  };

  // 處理頭像上傳
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB 限制
        toast.error('圖片大小不能超過 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setPreviewImage(imageUrl);
        setEditData(prev => ({ ...prev, avatar: imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 處理相簿照片上傳
  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`圖片 ${file.name} 大小超過 5MB`);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto = {
          id: Date.now().toString() + Math.random(),
          url: e.target.result,
          caption: '',
          type: 'other',
          createdAt: new Date().toISOString().split('T')[0]
        };
        
        setGallery(prev => [newPhoto, ...prev]);
      };
      reader.readAsDataURL(file);
    });
    
    toast.success('照片上傳成功！');
  };

  // 刪除照片
  const deletePhoto = (photoId) => {
    setGallery(prev => prev.filter(photo => photo.id !== photoId));
    toast.success('照片已刪除');
  };

  // 更新照片說明
  const updatePhotoCaption = (photoId, caption) => {
    setGallery(prev => prev.map(photo => 
      photo.id === photoId ? { ...photo, caption } : photo
    ));
  };

  // 觸發檔案選擇
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const triggerGalleryUpload = () => {
    galleryInputRef.current?.click();
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();
    const vehicle = {
      id: Date.now().toString(),
      ...newVehicle,
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextMaintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      maintenanceCost: 0,
      inspectionDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    setVehicles([...vehicles, vehicle]);
    setShowVehicleModal(false);
    setNewVehicle({ brand: '', model: '', year: '', plateNumber: '', mileage: 0 });
    toast.success('車輛新增成功！');
  };

  const handleMaintenanceReminder = (vehicle) => {
    const nextDate = new Date(vehicle.nextMaintenance);
    const today = new Date();
    const daysLeft = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft <= 7) {
      toast.error(`${vehicle.brand} ${vehicle.model} 需要保養了！還有 ${daysLeft} 天`);
    } else {
      toast.success(`${vehicle.brand} ${vehicle.model} 下次保養還有 ${daysLeft} 天`);
    }
  };

  const achievements = [
    { id: '1', title: '新手上路', description: '完成第一次騎行', icon: '🏁', unlocked: true },
    { id: '2', title: '百里騎士', description: '累計騎行100公里', icon: '🎯', unlocked: true },
    { id: '3', title: '山路征服者', description: '完成5次山路騎行', icon: '⛰️', unlocked: true },
    { id: '4', title: '社交達人', description: '參加10次揪團活動', icon: '👥', unlocked: false },
    { id: '5', title: '攝影大師', description: '發布50張騎行照片', icon: '📸', unlocked: false },
    { id: '6', title: '千里馬', description: '累計騎行1000公里', icon: '🏆', unlocked: false }
  ];

  const ProfileStats = () => (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="card text-center bg-gradient-to-br from-bike-50 to-bike-100">
        <div className="text-3xl font-bold text-bike-600">{user?.stats?.totalDistance || 0}</div>
        <div className="text-sm text-bike-600">總里程(km)</div>
      </div>
      <div className="card text-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="text-3xl font-bold text-green-600">{user?.stats?.totalRides || 0}</div>
        <div className="text-sm text-green-600">騎行次數</div>
      </div>
      <div className="card text-center bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="text-3xl font-bold text-purple-600">{gallery.length}</div>
        <div className="text-sm text-purple-600">相簿照片</div>
      </div>
    </div>
  );

  const ProfileTab = () => (
    <div>
      {/* 用戶信息 */}
      <div className="card mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
              {user?.verified && (
                <div className="w-6 h-6 bg-bike-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              {user?.premiumMember && (
                <Crown size={20} className="text-yellow-500" />
              )}
            </div>
            <p className="text-gray-600 mb-2">{editData.bio}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <Edit3 size={18} />
          </button>
        </div>
        
        {!user?.premiumMember && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">升級為付費會員</h3>
                <p className="text-sm opacity-90">解鎖更多功能和私訊權限</p>
              </div>
              <button className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                升級
              </button>
            </div>
          </div>
        )}
      </div>

      <ProfileStats />

      {/* 成就系統 */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Award size={20} className="mr-2" />
          成就徽章
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              className={`text-center p-3 rounded-xl border-2 transition-colors ${
                achievement.unlocked
                  ? 'border-yellow-300 bg-yellow-50'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="text-2xl mb-2">{achievement.icon}</div>
              <div className="text-xs font-medium text-gray-800">{achievement.title}</div>
              <div className="text-xs text-gray-600 mt-1">{achievement.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 快速操作 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">快速操作</h3>
        <div className="space-y-3">
          <button 
            onClick={() => setActiveTab('gallery')}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500 text-white rounded-lg">
                <Camera size={18} />
              </div>
              <span className="font-medium">個人相簿</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-bike-500 text-white rounded-lg">
                <Calendar size={18} />
              </div>
              <span className="font-medium">我的活動</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 text-white rounded-lg">
                <Award size={18} />
              </div>
              <span className="font-medium">騎行記錄</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );

  // 新增個人相簿標籤頁
  const GalleryTab = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">個人相簿</h2>
        <button
          onClick={triggerGalleryUpload}
          className="btn-primary py-2 px-4 text-sm flex items-center"
        >
          <Plus size={16} className="mr-2" />
          新增照片
        </button>
      </div>

      {gallery.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📷</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">還沒有照片</h3>
          <p className="text-gray-500 mb-6">上傳您的騎行照片和生活回憶</p>
          <button
            onClick={triggerGalleryUpload}
            className="btn-primary"
          >
            <Plus size={18} className="mr-2" />
            上傳第一張照片
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {gallery.map(photo => (
            <div key={photo.id} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              
              {/* 照片覆蓋層 */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center space-x-3">
                <button
                  onClick={() => {
                    setSelectedPhoto(photo);
                    setShowPhotoModal(true);
                  }}
                  className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => deletePhoto(photo.id)}
                  className="p-2 bg-red-500/80 rounded-lg text-white hover:bg-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              {/* 照片標題 */}
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 rounded-b-xl">
                  <p className="text-sm truncate">{photo.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleGalleryUpload}
        className="hidden"
      />
    </div>
  );

  const VehiclesTab = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">我的車輛</h2>
        <button
          onClick={() => setShowVehicleModal(true)}
          className="btn-primary py-2 px-4 text-sm"
        >
          新增車輛
        </button>
      </div>

      <div className="space-y-4">
        {vehicles.map(vehicle => {
          const nextMaintenance = new Date(vehicle.nextMaintenance);
          const today = new Date();
          const daysLeft = Math.ceil((nextMaintenance - today) / (1000 * 60 * 60 * 24));
          const needsMaintenance = daysLeft <= 30;

          return (
            <div key={vehicle.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-bike-100 text-bike-600 rounded-xl">
                    <Car size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <p className="text-sm text-gray-600">{vehicle.year} | {vehicle.plateNumber}</p>
                  </div>
                </div>
                {needsMaintenance && (
                  <div className="flex items-center space-x-1 text-orange-500">
                    <AlertTriangle size={16} />
                    <span className="text-xs">需保養</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600">里程數</div>
                  <div className="font-semibold">{vehicle.mileage.toLocaleString()} km</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">保養費用</div>
                  <div className="font-semibold">NT$ {vehicle.maintenanceCost.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">上次保養</div>
                  <div className="font-semibold">{vehicle.lastMaintenance}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">下次保養</div>
                  <div className={`font-semibold ${needsMaintenance ? 'text-orange-500' : ''}`}>
                    {vehicle.nextMaintenance}
                  </div>
                </div>
              </div>

              <div className={`rounded-xl p-3 mb-4 ${needsMaintenance ? 'bg-orange-50 border border-orange-200' : 'bg-green-50 border border-green-200'}`}>
                <div className="flex items-center space-x-2">
                  <Clock size={16} className={needsMaintenance ? 'text-orange-500' : 'text-green-500'} />
                  <span className={`text-sm font-medium ${needsMaintenance ? 'text-orange-700' : 'text-green-700'}`}>
                    {needsMaintenance ? `需要保養 (還有 ${daysLeft} 天)` : `保養正常 (還有 ${daysLeft} 天)`}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleMaintenanceReminder(vehicle)}
                  className="flex-1 btn-secondary py-2 text-sm"
                >
                  <Wrench size={16} className="mr-2" />
                  保養提醒
                </button>
                <button className="flex-1 btn-primary py-2 text-sm">
                  <Edit3 size={16} className="mr-2" />
                  編輯資料
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-4">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">通知設定</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell size={18} className="text-gray-600" />
              <span>活動提醒</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bike-500"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wrench size={18} className="text-gray-600" />
              <span>保養提醒</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bike-500"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">隱私設定</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <Shield size={18} className="text-gray-600" />
              <span>隱私權設定</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <HelpCircle size={18} className="text-gray-600" />
              <span>幫助中心</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>
      </div>

      <div className="card">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut size={18} />
          <span className="font-medium">登出</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部標題 */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800">個人資料</h1>
        
        {/* 標籤切換 */}
        <div className="flex space-x-1 mt-4 overflow-x-auto">
          {[
            { key: 'profile', label: '資料', icon: User },
            { key: 'gallery', label: '相簿', icon: Camera },
            { key: 'vehicles', label: '車輛', icon: Car },
            { key: 'settings', label: '設定', icon: Settings }
          ].map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-colors flex-shrink-0 ${
                  activeTab === tab.key
                    ? 'bg-bike-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <IconComponent size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 內容區域 */}
      <div className="px-4 py-6">
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'gallery' && <GalleryTab />}
        {activeTab === 'vehicles' && <VehiclesTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>

      {/* 編輯資料模態框 */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">編輯個人資料</h2>
              
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                {/* 頭像上傳 */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src={previewImage || editData.avatar || user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                      alt="頭像"
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={triggerFileUpload}
                      className="absolute bottom-0 right-0 p-2 bg-bike-500 text-white rounded-full shadow-lg hover:bg-bike-600 transition-colors"
                    >
                      <Camera size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">點擊相機圖標更換頭像</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* 基本資料 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="inline mr-2" />
                    姓名
                  </label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="input-field"
                    placeholder="請輸入您的姓名"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📱 手機號碼
                  </label>
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    className="input-field"
                    placeholder="0912-345-678"
                    required
                  />
                </div>

                {/* 自我介紹 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    💭 自我介紹
                  </label>
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                    className="input-field h-24 resize-none"
                    placeholder="分享您的騎車故事、興趣愛好或想對其他騎士說的話..."
                    maxLength={200}
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {editData.bio.length}/200
                  </div>
                </div>

                {/* 預設自我介紹範本 */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">💡 快速範本</p>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      "熱愛騎車的自由靈魂，享受每一段旅程的風景與自由。🏍️",
                      "重機愛好者，喜歡山路飆車和結交車友。安全至上！",
                      "週末騎士，平日上班族。騎車是我的紓壓方式。",
                      "機車維修技師，樂於分享保養知識和騎行經驗。🔧"
                    ].map((template, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setEditData({...editData, bio: template})}
                        className="text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {template}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setPreviewImage(null);
                      setEditData({
                        name: user?.name || '',
                        phone: user?.phone || '',
                        bio: user?.bio || '熱愛騎車的自由靈魂，享受每一段旅程的風景與自由。',
                        avatar: user?.avatar || null
                      });
                    }}
                    className="flex-1 btn-secondary py-3"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary py-3 flex items-center justify-center"
                  >
                    <Upload size={16} className="mr-2" />
                    保存修改
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 新增車輛模態框 */}
      {showVehicleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">新增車輛</h2>
              
              <form onSubmit={handleAddVehicle} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">品牌</label>
                    <input
                      type="text"
                      value={newVehicle.brand}
                      onChange={(e) => setNewVehicle({...newVehicle, brand: e.target.value})}
                      className="input-field"
                      placeholder="Yamaha"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">型號</label>
                    <input
                      type="text"
                      value={newVehicle.model}
                      onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                      className="input-field"
                      placeholder="R1"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">年份</label>
                    <input
                      type="text"
                      value={newVehicle.year}
                      onChange={(e) => setNewVehicle({...newVehicle, year: e.target.value})}
                      className="input-field"
                      placeholder="2023"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">車牌號碼</label>
                    <input
                      type="text"
                      value={newVehicle.plateNumber}
                      onChange={(e) => setNewVehicle({...newVehicle, plateNumber: e.target.value})}
                      className="input-field"
                      placeholder="ABC-1234"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">目前里程 (km)</label>
                  <input
                    type="number"
                    value={newVehicle.mileage}
                    onChange={(e) => setNewVehicle({...newVehicle, mileage: parseInt(e.target.value)})}
                    className="input-field"
                    placeholder="15000"
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowVehicleModal(false)}
                    className="flex-1 btn-secondary py-3"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary py-3"
                  >
                    新增
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 照片預覽模態框 */}
      {showPhotoModal && selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="relative">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="w-full h-80 object-cover"
              />
              <button
                onClick={() => setShowPhotoModal(false)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">照片詳情</h3>
                  <p className="text-sm text-gray-500">上傳於 {selectedPhoto.createdAt}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">照片描述</label>
                <input
                  type="text"
                  value={selectedPhoto.caption}
                  onChange={(e) => {
                    updatePhotoCaption(selectedPhoto.id, e.target.value);
                    setSelectedPhoto({...selectedPhoto, caption: e.target.value});
                  }}
                  className="input-field"
                  placeholder="為這張照片新增說明..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    deletePhoto(selectedPhoto.id);
                    setShowPhotoModal(false);
                  }}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center justify-center"
                >
                  <Trash2 size={16} className="mr-2" />
                  刪除照片
                </button>
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="flex-1 btn-secondary py-3"
                >
                  關閉
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