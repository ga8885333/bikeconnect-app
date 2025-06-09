import React, { useState, useEffect, useCallback } from 'react';
import { 
  MapPin, 
  AlertCircle,
  Locate,
  X,
  Info,
  Navigation,
  Phone,
  Search,
  Filter,
  Star,
  Clock,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';
import StoreMapComponent from '../components/FreeMapComponent';
import storesData from '../data/storesData.json';

// 簡單的備用地圖組件
const FallbackMap = ({ onRetry, error }) => (
  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
    <div className="text-center p-8 max-w-md">
      <div className="text-6xl mb-4">
        {error ? '❌' : '🗺️'}
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        {error ? '地圖載入失敗' : '地圖載入中...'}
      </h3>
      <p className="text-gray-500 mb-4">
        {error ? `錯誤: ${error}` : '正在初始化地圖組件，請稍候...'}
      </p>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-left">
          <p className="text-sm text-red-700">
            <strong>可能的解決方案：</strong>
          </p>
          <ul className="text-xs text-red-600 mt-1 space-y-1">
            <li>• 檢查網路連線</li>
            <li>• 清除瀏覽器快取</li>
            <li>• 重新整理頁面</li>
          </ul>
        </div>
      )}
      <div className="flex flex-col space-y-2">
        <button 
          onClick={onRetry}
          className="px-6 py-3 bg-bike-500 text-white rounded-xl font-medium hover:bg-bike-600 transition-colors shadow-lg"
        >
          重新載入地圖
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
        >
          重新整理頁面
        </button>
      </div>
    </div>
  </div>
);

const StoreMapPage = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showStoreDetails, setShowStoreDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  
  // 搜尋和篩選狀態
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  // 載入店家資料
  useEffect(() => {
    setStores(storesData.stores);
    setFilteredStores(storesData.stores);
    setCategories(storesData.categories);
  }, []);

  // 搜尋和篩選邏輯
  useEffect(() => {
    let filtered = stores;

    // 搜尋篩選
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(store => 
        store.name.toLowerCase().includes(query) ||
        store.address.toLowerCase().includes(query) ||
        store.description.toLowerCase().includes(query)
      );
    }

    // 類別篩選
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(store => 
        selectedCategories.includes(store.type)
      );
    }

    setFilteredStores(filtered);
  }, [stores, searchQuery, selectedCategories]);

  // 獲取當前位置
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('您的瀏覽器不支援定位功能');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCurrentLocation(location);
        setLocationPermissionDenied(false);
        toast.success('已取得您的位置');
      },
      (error) => {
        console.error('定位失敗:', error);
        setLocationPermissionDenied(true);
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            toast.error('定位權限被拒絕，請在瀏覽器設定中允許定位');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('無法取得位置資訊');
            break;
          case error.TIMEOUT:
            toast.error('定位請求逾時');
            break;
          default:
            toast.error('定位發生未知錯誤');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  }, []);

  // 偵測裝置類型並開啟導航
  const openNavigation = (store) => {
    if (!store || !store.location) {
      toast.error('商家位置資訊不完整');
      return;
    }

    const { lat, lng } = store.location;
    const startLat = currentLocation?.lat || '';
    const startLng = currentLocation?.lng || '';
    
    // Google Maps 網頁版（通用備用方案）
    const googleWebUrl = startLat && startLng 
      ? `https://www.google.com/maps/dir/${startLat},${startLng}/${lat},${lng}`
      : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    
    try {
      const newWindow = window.open(googleWebUrl, '_blank');
      
      if (!newWindow) {
        toast.error('請允許彈窗以開啟導航');
        window.location.href = googleWebUrl;
      }
      
      toast.success('正在開啟導航應用...', { duration: 2000 });
      setShowStoreDetails(false);
      
    } catch (error) {
      console.error('導航開啟失敗:', error);
      window.open(googleWebUrl, '_blank');
      toast.error('使用網頁版導航開啟');
    }
  };

  // 獲取位置
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  const handleStoreClick = (store) => {
    setSelectedStore(store);
    setShowStoreDetails(true);
  };

  const getCategoryData = (type) => {
    return categories.find(cat => cat.id === type) || 
           { name: '其他', icon: '📍', color: '#6b7280' };
  };

  const toggleCategoryFilter = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
  };

  return (
    <div className="relative h-screen bg-gray-100">
      {/* 商家地圖組件 */}
      <StoreMapComponent 
        currentLocation={currentLocation}
        stores={filteredStores}
        categories={categories}
        onStoreClick={handleStoreClick}
        className="w-full h-full"
      />

      {/* 頂部搜尋列 */}
      <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4 z-20">
        <div className="flex items-center space-x-3">
          {/* 搜尋框 */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜尋店家名稱或地址..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-bike-500 focus:border-transparent"
            />
          </div>
          
          {/* 篩選按鈕 */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-xl transition-colors ${
              showFilters || selectedCategories.length > 0
                ? 'bg-bike-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Filter size={20} />
          </button>
          
          {/* 定位按鈕 */}
          <button
            onClick={getCurrentLocation}
            className={`p-2 rounded-xl transition-colors ${
              currentLocation 
                ? 'bg-emerald-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Locate size={20} />
          </button>
        </div>

        {/* 結果統計 */}
        <div className="flex items-center justify-between mt-3">
          <div className="text-sm text-gray-600">
            找到 {filteredStores.length} 個商家
            {(searchQuery || selectedCategories.length > 0) && (
              <button
                onClick={clearFilters}
                className="ml-2 text-bike-500 hover:text-bike-600 underline"
              >
                清除篩選
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 篩選面板 */}
      {showFilters && (
        <div className="absolute top-24 left-4 right-4 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">類別篩選</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => toggleCategoryFilter(category.id)}
                className={`p-3 rounded-xl border-2 transition-colors text-center ${
                  selectedCategories.includes(category.id)
                    ? 'border-bike-500 bg-bike-50 text-bike-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="text-lg mb-1">{category.icon}</div>
                <div className="text-xs font-medium">{category.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 定位權限提示 */}
      {locationPermissionDenied && (
        <div className="absolute top-40 left-4 right-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4 z-30">
          <div className="flex items-start space-x-3">
            <AlertCircle size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-medium text-yellow-800">需要定位權限</h3>
              <p className="text-sm text-yellow-700 mt-1">
                請允許定位以獲得更精確的導航服務
              </p>
              <button
                onClick={getCurrentLocation}
                className="mt-2 text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
              >
                重新嘗試
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 商家詳情彈窗 */}
      {showStoreDetails && selectedStore && (
        <div className="absolute inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              {/* 標題列 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={selectedStore.image}
                        alt={selectedStore.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">{selectedStore.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {getCategoryData(selectedStore.type).icon} {getCategoryData(selectedStore.type).name}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star size={14} className="text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{selectedStore.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowStoreDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* 描述 */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-gray-700">{selectedStore.description}</p>
              </div>

              {/* 詳細資訊 */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                {/* 地址 */}
                <div className="flex items-start space-x-3">
                  <MapPin size={18} className="text-gray-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-800 font-medium">地址</p>
                    <p className="text-gray-600 text-sm">{selectedStore.address}</p>
                  </div>
                </div>

                {/* 電話 */}
                {selectedStore.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone size={18} className="text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-gray-800 font-medium">電話</p>
                      <a 
                        href={`tel:${selectedStore.phone}`}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        {selectedStore.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* 營業時間 */}
                <div className="flex items-center space-x-3">
                  <Clock size={18} className="text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-gray-800 font-medium">營業時間</p>
                    <p className="text-gray-600 text-sm">{selectedStore.openHours}</p>
                  </div>
                </div>

                {/* 價格範圍 */}
                <div className="flex items-center space-x-3">
                  <DollarSign size={18} className="text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-gray-800 font-medium">價格範圍</p>
                    <p className="text-gray-600 text-sm">{selectedStore.priceRange}</p>
                  </div>
                </div>
              </div>

              {/* 服務項目 */}
              {selectedStore.services && selectedStore.services.length > 0 && (
                <div className="mb-6">
                  <p className="text-gray-800 font-medium mb-2">服務項目</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedStore.services.map((service, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 動作按鈕 */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                {/* 主要導航按鈕 */}
                <button 
                  onClick={() => openNavigation(selectedStore)}
                  className="w-full bg-bike-500 text-white py-3 rounded-xl font-medium hover:bg-bike-600 transition-colors flex items-center justify-center"
                >
                  <Navigation size={18} className="mr-2" />
                  前往導航
                </button>
                
                {/* 其他選項 */}
                <div className="grid grid-cols-3 gap-2">
                  {/* Google Maps 網頁版 */}
                  <button
                    onClick={() => {
                      const url = currentLocation 
                        ? `https://www.google.com/maps/dir/${currentLocation.lat},${currentLocation.lng}/${selectedStore.location.lat},${selectedStore.location.lng}`
                        : `https://www.google.com/maps/search/?api=1&query=${selectedStore.location.lat},${selectedStore.location.lng}`;
                      window.open(url, '_blank');
                      toast.success('開啟 Google Maps');
                      setShowStoreDetails(false);
                    }}
                    className="py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    🗺️ Google
                  </button>
                  
                  {/* 電話 */}
                  {selectedStore.phone && (
                    <a
                      href={`tel:${selectedStore.phone}`}
                      className="py-2 px-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm text-center"
                    >
                      📞 撥號
                    </a>
                  )}
                  
                  {/* 複製地址 */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedStore.address);
                      toast.success('地址已複製');
                    }}
                    className="py-2 px-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm"
                  >
                    📋 地址
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreMapPage; 