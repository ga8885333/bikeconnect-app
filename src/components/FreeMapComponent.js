import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// 簡化的自定義圖標
const createUserIcon = () => {
  return L.divIcon({
    className: 'custom-user-marker',
    html: `<div style="
      width: 24px;
      height: 24px;
      background: #0ea5e9;
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

  // 當獲得用戶位置時，更新地圖中心
  useEffect(() => {
    if (currentLocation) {
      setMapCenter([currentLocation.lat, currentLocation.lng]);
      setMapZoom(15);
    } else if (stores.length > 0) {
      // 如果沒有用戶位置，以第一個店家為中心
      const firstStore = stores[0];
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

  return (
    <div className={className}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
        className="rounded-lg"
      >
        {/* 變更地圖中心 */}
        <ChangeView center={mapCenter} zoom={mapZoom} />
        
        {/* OpenStreetMap 圖資 */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* 用戶位置標記 */}
        {currentLocation && (
          <Marker 
            position={[currentLocation.lat, currentLocation.lng]} 
            icon={userIcon}
          >
            <Popup>
              <div className="text-center p-2">
                <div className="font-semibold text-blue-600 flex items-center justify-center">
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
                  
                  <div className="text-sm text-gray-600 mb-2 line-clamp-2">{store.description}</div>
                  <div className="text-xs text-gray-500 mb-3">{store.address}</div>
                  
                  {store.phone && (
                    <div className="text-xs text-gray-500 mb-2 flex items-center">
                      <span className="mr-1">📞</span>
                      {store.phone}
                    </div>
                  )}
                  
                  <button 
                    onClick={() => onStoreClick && onStoreClick(store)}
                    className="w-full bg-bike-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-bike-600 transition-colors"
                  >
                    🧭 查看詳情
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default StoreMapComponent; 