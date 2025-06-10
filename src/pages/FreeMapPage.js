import React, { useState, useEffect, useCallback } from 'react';
import { 
  MapPin, 
  Users,
  Navigation,
  Search,
  Filter,
  Clock,
  Star,
  Phone,
  ExternalLink,
  Locate,
  X,
  Fuel,
  Wrench,
  ShoppingCart,
  Coffee,
  Utensils,
  Car
} from 'lucide-react';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// 修復 Leaflet 預設圖標問題
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// 用戶位置圖標
const createUserIcon = () => {
  return L.divIcon({
    className: 'custom-user-marker',
    html: `<div style="
      width: 20px;
      height: 20px;
      background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
      border: 3px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
    "></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
};

// 商家圖標創建函數
const createStoreIcon = (type) => {
  const iconMap = {
    gas: '⛽',
    repair: '🔧',
    shop: '🛒',
    restaurant: '🍽️',
    cafe: '☕',
    parking: '🅿️'
  };
  
  const colorMap = {
    gas: '#ef4444',
    repair: '#f59e0b',
    shop: '#10b981',
    restaurant: '#8b5cf6',
    cafe: '#f97316',
    parking: '#6b7280'
  };

  return L.divIcon({
    className: 'custom-store-marker',
    html: `<div style="
      width: 32px;
      height: 32px;
      background: ${colorMap[type] || '#f59e0b'};
      border: 2px solid #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 16px;
    ">${iconMap[type] || '📍'}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

// 地圖載入處理組件
function MapLoadHandler({ onMapReady }) {
  const map = useMap();
  
  useEffect(() => {
    if (map) {
      setTimeout(() => {
        map.invalidateSize();
        onMapReady();
      }, 200);
    }
  }, [map, onMapReady]);
  
  return null;
}

const FreeMapPage = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [nearbyStores, setNearbyStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showStoreDetails, setShowStoreDetails] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);

  const categories = [
    { id: 'all', name: '全部', icon: '🏠', color: '#f59e0b' },
    { id: 'gas', name: '加油站', icon: '⛽', color: '#ef4444' },
    { id: 'repair', name: '維修店', icon: '🔧', color: '#f59e0b' },
    { id: 'shop', name: '機車行', icon: '🛒', color: '#10b981' },
    { id: 'restaurant', name: '餐廳', icon: '🍽️', color: '#8b5cf6' },
    { id: 'cafe', name: '咖啡廳', icon: '☕', color: '#f97316' },
    { id: 'parking', name: '停車場', icon: '🅿️', color: '#6b7280' }
  ];

  // 獲取當前位置
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('瀏覽器不支援定位功能', {
        style: { 
          background: '#1f2937', 
          color: '#ffffff',
          fontWeight: '600'
        }
      });
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
        toast.success('位置獲取成功', {
          style: { 
            background: '#f59e0b', 
            color: '#ffffff',
            fontWeight: '600'
          }
        });
      },
      (error) => {
        setLocationPermissionDenied(true);
        toast.error('定位失敗，請檢查權限設定', {
          style: { 
            background: '#dc2626', 
            color: '#ffffff',
            fontWeight: '600'
          }
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  }, []);

  // 模擬附近商家資料
  useEffect(() => {
    const mockStores = [
      {
        id: '1',
        name: '中油信義站',
        type: 'gas',
        address: '台北市信義區信義路五段100號',
        phone: '02-2345-6789',
        rating: 4.2,
        distance: '0.3km',
        hours: '24小時營業',
        location: { lat: 25.0330, lng: 121.5654 },
        services: ['加油', '便利商店', '洗車'],
        price: '95無鉛: 30.1元/公升'
      },
      {
        id: '2',
        name: '阿成機車行',
        type: 'repair',
        address: '台北市大安區復興南路一段50號',
        phone: '02-2345-6780',
        rating: 4.8,
        distance: '0.5km',
        hours: '週一-週六 9:00-18:00',
        location: { lat: 25.0320, lng: 121.5644 },
        services: ['維修', '保養', '改裝', '二手車買賣'],
        specialties: ['機車維修', 'YAMAHA專門', '電瓶更換']
      },
      {
        id: '3',
        name: '光陽機車',
        type: 'shop',
        address: '台北市松山區民生東路三段130號',
        phone: '02-2345-6781',
        rating: 4.5,
        distance: '0.8km',
        hours: '週一-週日 9:00-21:00',
        location: { lat: 25.0340, lng: 121.5624 },
        services: ['新車販售', '二手車', '零配件', '保養'],
        brands: ['KYMCO', 'SYM', '三陽']
      },
      {
        id: '4',
        name: '騎士咖啡',
        type: 'cafe',
        address: '台北市中山區中山北路二段20號',
        phone: '02-2345-6782',
        rating: 4.6,
        distance: '1.2km',
        hours: '週一-週日 7:00-22:00',
        location: { lat: 25.0360, lng: 121.5634 },
        services: ['咖啡', '輕食', '機車停車', 'WiFi'],
        specialties: ['機車主題咖啡廳', '車友聚會點', '免費停車']
      },
      {
        id: '5',
        name: '路邊停車格',
        type: 'parking',
        address: '台北市信義區信義路四段',
        phone: '',
        rating: 3.8,
        distance: '0.1km',
        hours: '24小時開放',
        location: { lat: 25.0310, lng: 121.5674 },
        services: ['機車停車', '計時收費'],
        price: '每小時 10元'
      }
    ];

    setNearbyStores(mockStores);
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  const filteredStores = nearbyStores.filter(store => {
    const matchesCategory = selectedCategory === 'all' || store.type === selectedCategory;
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleStoreClick = (store) => {
    setSelectedStore(store);
    setShowStoreDetails(true);
  };

  const handleMapReady = useCallback(() => {
    setMapLoaded(true);
  }, []);

  const mapCenter = currentLocation ? [currentLocation.lat, currentLocation.lng] : [25.0330, 121.5654];
  const mapZoom = currentLocation ? 15 : 12;

  return (
    <div style={{ 
      width: '100%', 
      height: '100vh', 
      position: 'relative',
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* 地圖容器 */}
      <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
        {!mapLoaded && (
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            backgroundColor: '#ffffff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 50
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                borderRadius: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 20px auto',
                boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)'
              }}>
                <MapPin size={28} style={{ color: '#ffffff' }} />
              </div>
              <p style={{ color: '#111827', fontWeight: '700', fontSize: '18px', marginBottom: '8px' }}>載入地圖</p>
              <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>OpenStreetMap 免費版</p>
            </div>
          </div>
        )}

        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ 
            height: '100%', 
            width: '100%', 
            position: 'absolute', 
            top: 0, 
            left: 0
          }}
          zoomControl={false}
          scrollWheelZoom={true}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          
          <MapLoadHandler onMapReady={handleMapReady} />
          
          {/* 用戶位置標記 */}
          {currentLocation && (
            <Marker position={[currentLocation.lat, currentLocation.lng]} icon={createUserIcon()}>
              <Popup className="modern-popup">
                <div style={{ padding: '8px', minWidth: '120px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#111827', margin: '0 0 4px 0' }}>您的位置</h3>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, lineHeight: '1.3', fontWeight: '500' }}>
                    {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* 商家標記 */}
          {filteredStores.map(store => (
            <Marker 
              key={store.id} 
              position={[store.location.lat, store.location.lng]}
              icon={createStoreIcon(store.type)}
              eventHandlers={{
                click: () => handleStoreClick(store)
              }}
            >
              <Popup className="modern-popup">
                <div style={{ padding: '12px', minWidth: '200px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0 0 6px 0' }}>{store.name}</h3>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 8px 0', fontWeight: '500' }}>{store.address}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#9ca3af' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Star size={12} style={{ color: '#fbbf24' }} />
                      <span style={{ fontWeight: '600' }}>{store.rating}</span>
                    </div>
                    <span>•</span>
                    <span style={{ fontWeight: '600' }}>{store.distance}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* 頂部搜索區域 */}
      {mapLoaded && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.1)',
          zIndex: 30
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: 0 }}>附近商家</h1>
            <button
              onClick={getCurrentLocation}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: currentLocation ? '#f59e0b' : '#f9fafb',
                color: currentLocation ? '#ffffff' : '#6b7280',
                border: currentLocation ? 'none' : '1px solid #e5e7eb',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <Locate size={18} />
            </button>
          </div>

          {/* 搜索框 */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search size={18} style={{ 
              position: 'absolute', 
              left: '16px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#9ca3af' 
            }} />
            <input
              type="text"
              placeholder="搜索商家名稱或地址..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                fontSize: '16px',
                fontWeight: '500',
                backgroundColor: '#ffffff'
              }}
            />
          </div>

          {/* 分類篩選 */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  backgroundColor: selectedCategory === category.id ? '#f59e0b' : '#f9fafb',
                  color: selectedCategory === category.id ? '#ffffff' : '#6b7280',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 商家列表 */}
      {mapLoaded && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          right: '20px',
          maxHeight: '40vh',
          overflowY: 'auto',
          zIndex: 25
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredStores.slice(0, 3).map(store => (
              <div key={store.id} style={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.1)',
                cursor: 'pointer'
              }}
              onClick={() => handleStoreClick(store)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '16px' }}>{categories.find(c => c.id === store.type)?.icon}</span>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: 0 }}>{store.name}</h3>
                    </div>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 6px 0', fontWeight: '500' }}>{store.address}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={12} style={{ color: '#fbbf24' }} />
                        <span style={{ fontWeight: '600', color: '#111827' }}>{store.rating}</span>
                      </div>
                      <span style={{ fontWeight: '600', color: '#f59e0b' }}>{store.distance}</span>
                      <span style={{ fontWeight: '500', color: '#6b7280' }}>{store.hours}</span>
                    </div>
                  </div>
                  <button style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#f59e0b',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}>
                    <Navigation size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 商家詳情彈窗 */}
      {showStoreDetails && selectedStore && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          zIndex: 50,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '420px',
            maxHeight: '75vh',
            overflowY: 'auto'
          }}>
            <div style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    {categories.find(c => c.id === selectedStore.type)?.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: '0 0 4px 0' }}>
                      {selectedStore.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={14} style={{ color: '#fbbf24' }} />
                        <span style={{ fontWeight: '600', color: '#111827' }}>{selectedStore.rating}</span>
                      </div>
                      <span style={{ color: '#d1d5db' }}>•</span>
                      <span style={{ fontWeight: '600', color: '#f59e0b' }}>{selectedStore.distance}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowStoreDetails(false)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={18} style={{ color: '#6b7280' }} />
                </button>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '15px', color: '#6b7280', margin: '0 0 12px 0', fontWeight: '500' }}>
                  <MapPin size={14} style={{ display: 'inline', marginRight: '6px' }} />
                  {selectedStore.address}
                </p>
                {selectedStore.phone && (
                  <p style={{ fontSize: '15px', color: '#6b7280', margin: '0 0 12px 0', fontWeight: '500' }}>
                    <Phone size={14} style={{ display: 'inline', marginRight: '6px' }} />
                    {selectedStore.phone}
                  </p>
                )}
                <p style={{ fontSize: '15px', color: '#6b7280', margin: 0, fontWeight: '500' }}>
                  <Clock size={14} style={{ display: 'inline', marginRight: '6px' }} />
                  {selectedStore.hours}
                </p>
              </div>

              {selectedStore.services && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>服務項目</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedStore.services.map((service, index) => (
                      <span key={index} style={{
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: '#fef3c7',
                        color: '#f59e0b'
                      }}>
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(selectedStore.price || selectedStore.specialties || selectedStore.brands) && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>詳細資訊</h4>
                  {selectedStore.price && (
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0', fontWeight: '500' }}>
                      價格：{selectedStore.price}
                    </p>
                  )}
                  {selectedStore.specialties && (
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0', fontWeight: '500' }}>
                      專長：{selectedStore.specialties.join('、')}
                    </p>
                  )}
                  {selectedStore.brands && (
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, fontWeight: '500' }}>
                      品牌：{selectedStore.brands.join('、')}
                    </p>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                  color: '#ffffff',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '15px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <Navigation size={16} />
                  導航前往
                </button>
                {selectedStore.phone && (
                  <button style={{
                    width: '52px',
                    height: '52px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Phone size={20} style={{ color: '#6b7280' }} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 權限提示 */}
      {locationPermissionDenied && mapLoaded && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '20px',
          right: '20px',
          transform: 'translateY(-50%)',
          backgroundColor: '#fef3c7',
          borderRadius: '16px',
          padding: '20px',
          border: '2px solid #fbbf24',
          zIndex: 40
        }}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <MapPin size={24} style={{ color: '#d97706', marginTop: '2px', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#92400e', margin: '0 0 6px 0' }}>需要位置權限</h3>
              <p style={{ fontSize: '14px', color: '#b45309', margin: '0 0 12px 0', lineHeight: '1.5', fontWeight: '500' }}>
                請允許瀏覽器獲取您的位置以找到附近的商家
              </p>
              <button
                onClick={getCurrentLocation}
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#d97706',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                重新嘗試
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 版權信息 */}
      {mapLoaded && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '6px 10px',
          borderRadius: '8px',
          fontSize: '11px',
          color: '#6b7280',
          fontWeight: '600',
          border: '1px solid rgba(245, 158, 11, 0.1)',
          zIndex: 10
        }}>
          © OpenStreetMap
        </div>
      )}
    </div>
  );
};

export default FreeMapPage; 