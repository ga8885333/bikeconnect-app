import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// 修復 Leaflet 預設圖標問題
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// 簡化的自定義圖標
const createUserIcon = () => {
  return L.divIcon({
    className: 'custom-user-marker',
    html: `<div style="
      width: 24px;
      height: 24px;
      background: #f59e0b;
      border: 3px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    ">
      <div style="
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
      "></div>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const createStoreIcon = (store, categories) => {
  // 從categories數組中找到對應的類別資料
  const categoryData = categories.find(cat => cat.id === store.type) || {
    icon: '📍',
    color: '#6b7280'
  };

  const color = categoryData.color;
  const iconEmoji = categoryData.icon;
  
  return L.divIcon({
    className: 'custom-store-marker',
    html: `<div style="
      position: relative;
      width: 32px;
      height: 40px;
    ">
      <div style="
        width: 32px;
        height: 32px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">${iconEmoji}</div>
      <div style="
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid ${color};
      "></div>
    </div>`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
  });
};

// 地圖中心控制組件
function ChangeView({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
}

const StoreMapComponent = ({ 
  currentLocation, 
  stores = [], 
  categories = [],
  onStoreClick,
  className = "w-full h-full" 
}) => {
  const [mapCenter, setMapCenter] = useState([25.0330, 121.5654]); // 台北市中心
  const [mapZoom, setMapZoom] = useState(12);
  const [mapError, setMapError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Debug 信息
  useEffect(() => {
    console.log('=== StoreMapComponent Debug ===');
    console.log('Component mounted');
    console.log('Stores count:', stores.length);
    console.log('Categories count:', categories.length);
    console.log('Current location:', currentLocation);
    console.log('MapCenter:', mapCenter);
    console.log('MapZoom:', mapZoom);
    console.log('================================');
  }, [stores, categories, currentLocation, mapCenter, mapZoom]);

  // 當獲得用戶位置時，更新地圖中心
  useEffect(() => {
    if (currentLocation) {
      console.log('Setting map center to user location:', currentLocation);
      setMapCenter([currentLocation.lat, currentLocation.lng]);
      setMapZoom(15);
    } else if (stores.length > 0) {
      // 如果沒有用戶位置，以第一個店家為中心
      const firstStore = stores[0];
      console.log('Setting map center to first store:', firstStore.location);
      setMapCenter([firstStore.location.lat, firstStore.location.lng]);
      setMapZoom(12);
    }
  }, [currentLocation, stores]);

  const userIcon = createUserIcon();

  const getCategoryData = (type) => {
    return categories.find(cat => cat.id === type) || {
      name: '其他',
      icon: '📍',
      color: '#6b7280'
    };
  };

  // 錯誤處理
  if (mapError) {
    return (
      <div className={`${className} bg-red-100 flex items-center justify-center`}>
        <div className="text-center p-8">
          <div className="text-4xl mb-4">❌</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">地圖載入失敗</h3>
          <p className="text-gray-500 mb-4">{mapError}</p>
          <button
            onClick={() => {
              setMapError(null);
              setMapLoaded(false);
            }}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            重試
          </button>
        </div>
      </div>
    );
  }

  // 載入中狀態
  if (!mapLoaded) {
    return (
      <div className={`${className} bg-yellow-50 flex items-center justify-center relative`} style={{ height: '100vh', minHeight: '400px' }}>
        <div className="text-center p-8 z-20">
          <div className="text-4xl mb-4 animate-pulse">🗺️</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">正在載入地圖...</h3>
          <p className="text-gray-500 mb-4">請稍候，地圖正在初始化</p>
          <div className="text-xs text-gray-400">
            Debug: Center={mapCenter[0]}, {mapCenter[1]} | Zoom={mapZoom}
          </div>
        </div>
        
        {/* 實際地圖組件，但隱藏載入動畫 */}
        <div className="absolute inset-0 opacity-0">
          {mapLoaded === false && (
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%', minHeight: '400px' }}
              zoomControl={true}
              scrollWheelZoom={true}
              className="rounded-lg z-10"
              whenCreated={(map) => {
                console.log('🗺️ Leaflet map instance created');
                setTimeout(() => {
                  map.invalidateSize();
                  console.log('📏 Map size invalidated (100ms)');
                  setMapLoaded(true);
                  console.log('✅ Map marked as loaded');
                }, 200);
                
                setTimeout(() => {
                  map.invalidateSize();
                  console.log('📏 Map size invalidated again (1000ms)');
                }, 1000);
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                onLoad={() => {
                  console.log('🎯 TileLayer loaded successfully');
                }}
                onError={(error) => {
                  console.error('❌ TileLayer error:', error);
                  setMapError('地圖圖層載入失敗');
                }}
              />
            </MapContainer>
          )}
        </div>
      </div>
    );
  }

  try {
    return (
      <div className={`${className}`} style={{ height: '100vh', minHeight: '400px' }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%', minHeight: '400px' }}
          zoomControl={true}
          scrollWheelZoom={true}
          className="rounded-lg z-10"
          whenCreated={(map) => {
            console.log('🗺️ Final map created successfully');
            setTimeout(() => {
              map.invalidateSize();
              console.log('📏 Final map size invalidated');
            }, 100);
          }}
        >
          {/* 變更地圖中心 */}
          <ChangeView center={mapCenter} zoom={mapZoom} />
          
          {/* OpenStreetMap 圖資 */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            onError={(error) => {
              console.error('TileLayer error:', error);
              setMapError('地圖圖層載入失敗');
            }}
          />
          
          {/* 用戶位置標記 */}
          {currentLocation && (
            <Marker 
              position={[currentLocation.lat, currentLocation.lng]} 
              icon={userIcon}
            >
              <Popup>
                <div className="text-center p-2">
                  <div className="font-semibold text-primary-600 flex items-center justify-center">
                    <span className="mr-2">📍</span> 我的位置
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                  </div>
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* 商家標記 */}
          {stores.map(store => {
            const categoryData = getCategoryData(store.type);
            
            return (
              <Marker 
                key={store.id}
                position={[store.location.lat, store.location.lng]}
                icon={createStoreIcon(store, categories)}
                eventHandlers={{
                  click: () => onStoreClick && onStoreClick(store)
                }}
              >
                <Popup>
                  <div className="max-w-xs p-2">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={store.image}
                          alt={store.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 truncate">
                          {store.name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center space-x-1">
                          <span>{categoryData.icon}</span>
                          <span>{categoryData.name}</span>
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-xs text-gray-600">{store.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {store.description}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500 flex items-center">
                        <span className="mr-1">📍</span>
                        <span className="truncate">{store.address}</span>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <span className="mr-1">⏰</span>
                        <span>{store.hours}</span>
                      </div>
                      {store.phone && (
                        <div className="text-xs text-gray-500 flex items-center">
                          <span className="mr-1">📞</span>
                          <span>{store.phone}</span>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => onStoreClick && onStoreClick(store)}
                      className="w-full mt-3 bg-primary-500 hover:bg-primary-600 text-white py-2 px-3 rounded-lg text-xs font-medium transition-colors"
                    >
                      查看詳情
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    );
  } catch (error) {
    console.error('Map rendering error:', error);
    setMapError(error.message);
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <div className="text-center p-8">
          <div className="text-4xl mb-4">❌</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">地圖初始化失敗</h3>
          <p className="text-gray-500 mb-4">請重新整理頁面</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            重新整理
          </button>
        </div>
      </div>
    );
  }
};

export default StoreMapComponent; 