import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Navigation, 
  MapPin, 
  Users,
  Play,
  Square,
  Clock,
  AlertCircle,
  Locate,
  Calendar,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const MapPage = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
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
    speed: 0
  });

  // Mobile-first 地圖樣式 - 使用 useMemo 優化
  const mapStyles = useMemo(() => [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'road',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'transit',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#f5f5f5' }]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#ffffff' }]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#e0f2fe' }]
    }
  ], []);

  // 添加用戶位置標記
  const addUserLocationMarker = useCallback((mapInstance, location) => {
    new window.google.maps.Marker({
      position: location,
      map: mapInstance,
      title: '我的位置',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="12" fill="#0ea5e9" stroke="white" stroke-width="3"/>
            <circle cx="16" cy="16" r="4" fill="white"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(32, 32),
        anchor: new window.google.maps.Point(16, 16)
      },
      zIndex: 1000
    });

    // 添加脈衝動畫效果
    new window.google.maps.Marker({
      position: location,
      map: mapInstance,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="24" fill="#0ea5e9" opacity="0.3"/>
          </svg>
        `),
        scaledSize: new window.google.maps.Size(64, 64),
        anchor: new window.google.maps.Point(32, 32)
      },
      zIndex: 999
    });
  }, []);

  // 添加活動標記
  const addEventMarkers = useCallback((mapInstance) => {
    events.forEach(event => {
      const marker = new window.google.maps.Marker({
        position: event.location,
        map: mapInstance,
        title: event.title,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="16" fill="#f43f5e" stroke="white" stroke-width="3"/>
              <path d="M20 10l3 6h6l-5 4 2 6-6-4-6 4 2-6-5-4h6z" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 40)
        }
      });

      marker.addListener('click', () => {
        setSelectedEvent(event);
        setShowEventDetails(true);
        mapInstance.panTo(event.location);
      });
    });
  }, [events]);

  // 初始化地圖
  const initializeMap = useCallback(() => {
    if (!window.google || !window.google.maps || !mapRef.current) {
      console.log('Google Maps API 尚未載入');
      return;
    }

    try {
      const mapOptions = {
        center: currentLocation || { lat: 23.8103, lng: 120.9605 }, // 台灣中心
        zoom: currentLocation ? 15 : 8,
        styles: mapStyles,
        disableDefaultUI: true,
        gestureHandling: 'greedy',
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_BOTTOM
        }
      };

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);
      setMapLoaded(true);

      // 如果有當前位置，添加用戶標記
      if (currentLocation) {
        addUserLocationMarker(newMap, currentLocation);
      }

      // 添加活動標記
      addEventMarkers(newMap);
      
      toast.success('地圖載入成功');
    } catch (error) {
      console.error('地圖初始化失敗:', error);
      toast.error('地圖載入失敗，請重新整理頁面');
    }
  }, [currentLocation, mapStyles, addUserLocationMarker, addEventMarkers]);

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
        
        if (map) {
          map.setCenter(location);
          map.setZoom(15);
          addUserLocationMarker(map, location);
        }
        
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
  }, [map, addUserLocationMarker]);

  // 模擬資料
  useEffect(() => {
    // 模擬活動資料
    const mockEvents = [
      {
        id: '1',
        title: '台北河濱夜騎',
        description: '一起騎河濱，享受夜晚的涼風和美景！',
        location: { lat: 25.0718, lng: 121.5230 },
        date: '2024-01-15',
        time: '19:00',
        participants: 12,
        maxParticipants: 20,
        organizer: '夜騎王',
        difficulty: 'beginner'
      },
      {
        id: '2',
        title: '陽明山挑戰賽',
        description: '挑戰陽明山的蜿蜒山路！',
        location: { lat: 25.1553, lng: 121.5581 },
        date: '2024-01-20',
        time: '08:00',
        participants: 8,
        maxParticipants: 15,
        organizer: '山路高手',
        difficulty: 'advanced'
      },
      {
        id: '3',
        title: '淡水老街美食騎',
        description: '騎到淡水品嚐美食，輕鬆愉快的行程',
        location: { lat: 25.1677, lng: 121.4362 },
        date: '2024-01-18',
        time: '10:00',
        participants: 6,
        maxParticipants: 12,
        organizer: '美食探險家',
        difficulty: 'beginner'
      }
    ];

    setEvents(mockEvents);

    // 模擬附近騎士
    const mockNearbyRiders = [
      {
        id: '1',
        name: '風速騎士',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        distance: '0.8km',
        status: 'riding'
      },
      {
        id: '2',
        name: '山路探險家',
        avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150',
        distance: '1.2km',
        status: 'online'
      }
    ];

    setNearbyRiders(mockNearbyRiders);
  }, []);

  // 檢查 Google Maps API 並初始化
  useEffect(() => {
    const handleGoogleMapsLoaded = () => {
      console.log('收到 Google Maps API 載入完成事件');
      initializeMap();
    };

    const handleGoogleMapsError = () => {
      console.log('收到 Google Maps API 載入失敗事件');
      toast.error('Google Maps API 載入失敗，請檢查 API Key 設定');
      setMapLoaded(false);
    };

    // 檢查是否已經載入
    if (window.googleMapsApiLoaded && window.google && window.google.maps) {
      console.log('Google Maps API 已載入，直接初始化');
      initializeMap();
    } else if (window.googleMapsApiError) {
      console.log('Google Maps API 載入失敗');
      handleGoogleMapsError();
    } else {
      console.log('等待 Google Maps API 載入...');
      // 監聽載入事件
      window.addEventListener('googleMapsLoaded', handleGoogleMapsLoaded);
      window.addEventListener('googleMapsError', handleGoogleMapsError);
    }

    return () => {
      window.removeEventListener('googleMapsLoaded', handleGoogleMapsLoaded);
      window.removeEventListener('googleMapsError', handleGoogleMapsError);
    };
  }, [initializeMap]);

  // 獲取位置
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  // 記錄數據更新
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingData(prev => ({
          distance: prev.distance + 0.01,
          time: prev.time + 1,
          speed: Math.random() * 20 + 10
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingData({ distance: 0, time: 0, speed: 0 });
    toast.success('開始記錄騎行！');
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    toast.success('騎行記錄已保存！');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '新手';
      case 'intermediate': return '中級';
      case 'advanced': return '進階';
      default: return '未知';
    }
  };

  return (
    <div className="relative h-screen bg-gray-100">
      {/* 地圖容器 */}
      <div 
        ref={mapRef}
        className="w-full h-full"
      />

      {/* 載入中提示 */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-white flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-bike-500 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4 pulse-bike">
              <MapPin size={32} className="text-white" />
            </div>
            <p className="text-gray-600 font-medium">載入地圖中...</p>
            <p className="text-gray-400 text-sm mt-2">請稍候片刻</p>
            {!window.google && (
              <p className="text-red-500 text-xs mt-2">正在載入 Google Maps API...</p>
            )}
          </div>
        </div>
      )}

      {/* API 錯誤提示 */}
      {!window.google && mapLoaded && (
        <div className="absolute inset-0 bg-white flex items-center justify-center z-50">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-red-500 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">地圖載入失敗</h3>
            <p className="text-gray-600 mb-4">Google Maps API 無法載入</p>
            <p className="text-sm text-gray-500 mb-4">請檢查：</p>
            <ul className="text-xs text-gray-500 text-left mb-4">
              <li>• 網路連線是否正常</li>
              <li>• Google Maps API Key 是否正確</li>
              <li>• API Key 是否有適當權限</li>
            </ul>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-bike-500 text-white rounded-lg hover:bg-bike-600 transition-colors"
            >
              重新載入
            </button>
          </div>
        </div>
      )}

      {/* 頂部控制列 */}
      <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4 z-20">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800">騎行地圖</h1>
          <div className="flex space-x-2">
            <button
              onClick={getCurrentLocation}
              className={`p-2 rounded-xl transition-colors ${
                currentLocation 
                  ? 'bg-bike-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Locate size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* 定位權限提示 */}
      {locationPermissionDenied && (
        <div className="absolute top-20 left-4 right-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4 z-30">
          <div className="flex items-start space-x-3">
            <AlertCircle size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-medium text-yellow-800">需要定位權限</h3>
              <p className="text-sm text-yellow-700 mt-1">
                請在瀏覽器設定中允許定位，以便顯示您的位置和附近活動
              </p>
              <button
                onClick={getCurrentLocation}
                className="mt-2 text-sm font-medium text-yellow-800 hover:text-yellow-900"
              >
                重新嘗試
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 記錄面板 */}
      {isRecording && (
        <div className="absolute top-32 left-4 right-4 bg-white rounded-2xl shadow-lg p-4 z-20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">騎行記錄中</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">REC</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-bike-600">{recordingData.distance.toFixed(2)}</div>
              <div className="text-xs text-gray-600">距離(km)</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{formatTime(recordingData.time)}</div>
              <div className="text-xs text-gray-600">時間</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">{recordingData.speed.toFixed(1)}</div>
              <div className="text-xs text-gray-600">速度(km/h)</div>
            </div>
          </div>
          
          <button
            onClick={handleStopRecording}
            className="w-full bg-red-500 text-white py-2 rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center justify-center"
          >
            <Square size={16} className="mr-2" />
            停止記錄
          </button>
        </div>
      )}

      {/* 開始記錄按鈕 */}
      {!isRecording && mapLoaded && window.google && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20">
          <button
            onClick={handleStartRecording}
            className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110"
          >
            <Play size={24} />
          </button>
        </div>
      )}

      {/* 附近騎士面板 */}
      {nearbyRiders.length > 0 && !isRecording && mapLoaded && (
        <div className="absolute bottom-24 right-4 w-64 bg-white rounded-2xl shadow-lg p-4 z-20 mobile-hidden">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <Users size={18} className="mr-2" />
            附近騎士
          </h3>
          <div className="space-y-3">
            {nearbyRiders.slice(0, 3).map(rider => (
              <div key={rider.id} className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={rider.avatar}
                    alt={rider.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                    rider.status === 'riding' ? 'bg-green-500' : 'bg-orange-500'
                  }`}></div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{rider.name}</p>
                  <p className="text-xs text-gray-600">{rider.distance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 活動詳情彈窗 */}
      {showEventDetails && selectedEvent && (
        <div className="absolute inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">{selectedEvent.title}</h3>
                <button
                  onClick={() => setShowEventDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600">{selectedEvent.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>{selectedEvent.time}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedEvent.difficulty)}`}>
                      {getDifficultyText(selectedEvent.difficulty)}
                    </span>
                    <span className="text-sm text-gray-600">
                      {selectedEvent.participants}/{selectedEvent.maxParticipants} 人參加
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button className="flex-1 bg-bike-500 text-white py-3 rounded-xl font-medium hover:bg-bike-600 transition-colors">
                    立即參加
                  </button>
                  <button className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
                    <Navigation size={18} />
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

export default MapPage; 