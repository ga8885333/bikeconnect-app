import React, { useState, useEffect, useCallback } from 'react';
import { 
  MapPin, 
  Users,
  Play,
  Square,
  Clock,
  AlertCircle,
  Locate,
  Calendar,
  X,
  Navigation,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// 修復 Leaflet 預設圖標問題
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// 橙色用戶位置圖標
const createUserIcon = () => {
  return L.divIcon({
    className: 'custom-user-marker',
    html: `<div style="
      width: 24px;
      height: 24px;
      background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
      border: 3px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4), 0 0 0 4px rgba(251, 191, 36, 0.15);
      position: relative;
    ">
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        width: 8px;
        height: 8px;
        background: #ffffff;
        border-radius: 50%;
        transform: translate(-50%, -50%);
      "></div>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// 深橙色活動圖標
const createEventIcon = () => {
  return L.divIcon({
    className: 'custom-event-marker',
    html: `<div style="
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #ea580c 0%, #f97316 100%);
      border: 2px solid #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(234, 88, 12, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      font-weight: 700;
    ">🎯</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  });
};

// 灰色騎士圖標
const createRiderIcon = () => {
  return L.divIcon({
    className: 'custom-rider-marker',
    html: `<div style="
      width: 20px;
      height: 20px;
      background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%);
      border: 2px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 3px 8px rgba(107, 114, 128, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 8px;
    ">•</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// 地圖點擊事件處理組件
function MapEventHandler({ onMapClick }) {
  useMapEvents({
    click: onMapClick,
  });
  return null;
}

// 地圖載入完成處理組件
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

const MapPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [nearbyRiders, setNearbyRiders] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [recordingData, setRecordingData] = useState({
    distance: 0,
    time: 0,
    speed: 0,
    avgSpeed: 0,
    maxSpeed: 0
  });
  const [routePath, setRoutePath] = useState([]);
  const [showNearbyRiders, setShowNearbyRiders] = useState(true);
  const [showStatsPanel, setShowStatsPanel] = useState(false);

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

  // 模擬資料
  useEffect(() => {
    const mockEvents = [
      {
        id: '1',
        title: '台北河濱夜騎',
        description: '夜間河濱騎行，體驗城市夜景',
        location: { lat: 25.0718, lng: 121.5230 },
        date: '2024-01-15',
        time: '19:00',
        participants: 12,
        maxParticipants: 20,
        difficulty: 'beginner'
      },
      {
        id: '2',
        title: '陽明山挑戰',
        description: '山路騎行挑戰，適合進階騎士',
        location: { lat: 25.1553, lng: 121.5581 },
        date: '2024-01-20',
        time: '08:00',
        participants: 8,
        maxParticipants: 15,
        difficulty: 'advanced'
      },
      {
        id: '3',
        title: '淡水休閒騎',
        description: '輕鬆的淡水老街騎行',
        location: { lat: 25.1677, lng: 121.4362 },
        date: '2024-01-18',
        time: '10:00',
        participants: 6,
        maxParticipants: 12,
        difficulty: 'beginner'
      }
    ];

    setEvents(mockEvents);

    const mockNearbyRiders = [
      {
        id: '1',
        name: 'Alex Chen',
        distance: '0.8km',
        status: 'riding',
        location: { lat: 25.0350, lng: 121.5680 }
      },
      {
        id: '2',
        name: 'Sarah Lin',
        distance: '1.2km',
        status: 'online',
        location: { lat: 25.0310, lng: 121.5620 }
      },
      {
        id: '3',
        name: 'David Wu',
        distance: '0.5km',
        status: 'riding',
        location: { lat: 25.0380, lng: 121.5700 }
      }
    ];

    setNearbyRiders(mockNearbyRiders);
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  // 記錄數據更新
  useEffect(() => {
    let interval;
    if (isRecording && currentLocation) {
      interval = setInterval(() => {
        const newSpeed = Math.random() * 25 + 5;
        
        setRecordingData(prev => {
          const newDistance = prev.distance + (newSpeed / 3600);
          const newTime = prev.time + 1;
          const newAvgSpeed = newDistance / (newTime / 3600);
          const newMaxSpeed = Math.max(prev.maxSpeed, newSpeed);
          
          return {
            distance: newDistance,
            time: newTime,
            speed: newSpeed,
            avgSpeed: newAvgSpeed,
            maxSpeed: newMaxSpeed
          };
        });

        if (Math.random() > 0.7) {
          const randomLat = currentLocation.lat + (Math.random() - 0.5) * 0.001;
          const randomLng = currentLocation.lng + (Math.random() - 0.5) * 0.001;
          setRoutePath(prev => [...prev, [randomLat, randomLng]]);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, currentLocation]);

  const handleStartRecording = () => {
    if (!currentLocation) {
      toast.error('請先允許定位權限', {
        style: { 
          background: '#dc2626', 
          color: '#ffffff',
          fontWeight: '600'
        }
      });
      return;
    }
    setIsRecording(true);
    setRecordingData({ distance: 0, time: 0, speed: 0, avgSpeed: 0, maxSpeed: 0 });
    setRoutePath([]);
    toast.success('開始記錄騎行', {
      style: { 
        background: '#f59e0b', 
        color: '#ffffff',
        fontWeight: '600'
      }
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    toast.success(`騎行完成 • ${recordingData.distance.toFixed(2)}km`, {
      style: { 
        background: '#f59e0b', 
        color: '#ffffff',
        fontWeight: '600'
      }
    });
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '休閒';
      case 'intermediate': return '中等';
      case 'advanced': return '挑戰';
      default: return '未知';
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
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
              <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>OpenStreetMap</p>
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
                <div style={{ padding: '12px', minWidth: '180px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0 0 8px 0' }}>您的位置</h3>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: '1.4', fontWeight: '500' }}>
                    {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* 活動標記 */}
          {events.map(event => (
            <Marker 
              key={event.id} 
              position={[event.location.lat, event.location.lng]}
              icon={createEventIcon()}
              eventHandlers={{
                click: () => handleEventClick(event)
              }}
            >
              <Popup className="modern-popup">
                <div style={{ padding: '12px', minWidth: '200px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0 0 6px 0' }}>{event.title}</h3>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 8px 0', fontWeight: '500' }}>{event.description}</p>
                  <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600' }}>
                    {event.date} • {event.time}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* 附近騎士標記 */}
          {showNearbyRiders && nearbyRiders.map(rider => (
            <Marker 
              key={rider.id} 
              position={[rider.location.lat, rider.location.lng]}
              icon={createRiderIcon()}
            >
              <Popup className="modern-popup">
                <div style={{ padding: '12px', minWidth: '140px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', margin: '0 0 4px 0' }}>{rider.name}</h3>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, fontWeight: '500' }}>{rider.distance}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* 騎行路線 */}
          {routePath.length > 1 && (
            <Polyline
              positions={routePath}
              color="#f59e0b"
              weight={4}
              opacity={0.8}
            />
          )}

          <MapEventHandler onMapClick={() => {}} />
        </MapContainer>
      </div>

      {/* 頂部控制欄 - 橙色系設計 */}
      {mapLoaded && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '20px 24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(245, 158, 11, 0.1)',
          zIndex: 30
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#111827', margin: 0 }}>騎行地圖</h1>
              {currentLocation && (
                <p style={{ fontSize: '13px', color: '#f59e0b', margin: 0, fontWeight: '600' }}>位置已開啟</p>
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowNearbyRiders(!showNearbyRiders)}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: showNearbyRiders ? '#f59e0b' : '#f9fafb',
                  color: showNearbyRiders ? '#ffffff' : '#6b7280',
                  border: showNearbyRiders ? 'none' : '1px solid #e5e7eb',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  fontWeight: '600'
                }}
              >
                <Users size={20} />
              </button>
              <button
                onClick={getCurrentLocation}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: currentLocation ? '#f59e0b' : '#f9fafb',
                  color: currentLocation ? '#ffffff' : '#6b7280',
                  border: currentLocation ? 'none' : '1px solid #e5e7eb',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  fontWeight: '600'
                }}
              >
                <Locate size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 騎行記錄面板 - 橙色漸層設計 */}
      {isRecording && (
        <div style={{
          position: 'absolute',
          bottom: '120px',
          left: '20px',
          right: '20px',
          background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '24px',
          color: '#ffffff',
          boxShadow: '0 10px 40px rgba(245, 158, 11, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          zIndex: 25
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#ffffff' }}>騎行中</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#ffffff', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
                <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: '700', opacity: 0.9 }}>LIVE</span>
              </div>
            </div>
            <button
              onClick={() => setShowStatsPanel(!showStatsPanel)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              {showStatsPanel ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#ffffff' }}>{recordingData.distance.toFixed(2)}</div>
              <div style={{ fontSize: '13px', color: '#ffffff', fontWeight: '600', opacity: 0.8 }}>距離 (km)</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#ffffff' }}>{formatTime(recordingData.time)}</div>
              <div style={{ fontSize: '13px', color: '#ffffff', fontWeight: '600', opacity: 0.8 }}>時間</div>
            </div>
          </div>

          {showStatsPanel && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.3)' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff' }}>{recordingData.speed.toFixed(1)}</div>
                <div style={{ fontSize: '12px', color: '#ffffff', fontWeight: '600', opacity: 0.8 }}>當前速度</div>
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff' }}>{recordingData.avgSpeed.toFixed(1)}</div>
                <div style={{ fontSize: '12px', color: '#ffffff', fontWeight: '600', opacity: 0.8 }}>平均速度</div>
              </div>
            </div>
          )}
          
          <button
            onClick={handleStopRecording}
            style={{
              width: '100%',
              backgroundColor: '#ffffff',
              color: '#f59e0b',
              padding: '16px',
              borderRadius: '14px',
              fontWeight: '700',
              fontSize: '15px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.2s ease'
            }}
          >
            <Square size={18} />
            結束騎行
          </button>
        </div>
      )}

      {/* 開始記錄按鈕 - 橙色漸層 */}
      {!isRecording && mapLoaded && (
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20
        }}>
          <button
            onClick={handleStartRecording}
            style={{
              width: '72px',
              height: '72px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
              color: '#ffffff',
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.background = 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.background = 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)';
            }}
          >
            <Play size={28} />
          </button>
        </div>
      )}

      {/* 附近騎士面板 - 白色卡片設計 */}
      {showNearbyRiders && nearbyRiders.length > 0 && !isRecording && mapLoaded && (
        <div style={{
          position: 'absolute',
          bottom: '40px',
          right: '20px',
          width: '260px',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.1)',
          zIndex: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Users size={18} style={{ color: '#f59e0b' }} />
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: 0 }}>附近騎士</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {nearbyRiders.slice(0, 3).map(rider => (
              <div key={rider.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0' }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: rider.status === 'riding' ? '#f59e0b' : '#6b7280'
                }}></div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#111827', margin: 0 }}>{rider.name}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, fontWeight: '500' }}>{rider.distance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 權限提示 - 橙色警告框 */}
      {locationPermissionDenied && mapLoaded && (
        <div style={{
          position: 'absolute',
          top: '100px',
          left: '20px',
          right: '20px',
          backgroundColor: '#fef3c7',
          borderRadius: '16px',
          padding: '20px',
          border: '2px solid #fbbf24',
          zIndex: 30
        }}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <AlertCircle size={24} style={{ color: '#d97706', marginTop: '2px', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#92400e', margin: '0 0 6px 0' }}>需要位置權限</h3>
              <p style={{ fontSize: '14px', color: '#b45309', margin: '0 0 12px 0', lineHeight: '1.5', fontWeight: '500' }}>
                請允許瀏覽器獲取您的位置以使用完整功能
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

      {/* 活動詳情彈窗 - 現代白色設計 */}
      {showEventDetails && selectedEvent && (
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
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: '0 0 8px 0' }}>{selectedEvent.title}</h3>
                  <span style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    backgroundColor: selectedEvent.difficulty === 'beginner' ? '#dcfce7' : selectedEvent.difficulty === 'advanced' ? '#fef3c7' : '#fef3c7',
                    color: selectedEvent.difficulty === 'beginner' ? '#166534' : selectedEvent.difficulty === 'advanced' ? '#92400e' : '#92400e'
                  }}>
                    {getDifficultyText(selectedEvent.difficulty)}
                  </span>
                </div>
                <button
                  onClick={() => setShowEventDetails(false)}
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

              <p style={{ color: '#6b7280', fontSize: '15px', lineHeight: '1.6', margin: '0 0 24px 0', fontWeight: '500' }}>
                {selectedEvent.description}
              </p>
              
              <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#9ca3af', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={16} />
                  <span style={{ fontWeight: '600' }}>{selectedEvent.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} />
                  <span style={{ fontWeight: '600' }}>{selectedEvent.time}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600' }}>
                  {selectedEvent.participants}/{selectedEvent.maxParticipants} 人參加
                </span>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <button style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                  color: '#ffffff',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '15px',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                  立即參加
                </button>
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
                  <Navigation size={20} style={{ color: '#6b7280' }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 版權信息 - 精緻設計 */}
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

export default MapPage; 