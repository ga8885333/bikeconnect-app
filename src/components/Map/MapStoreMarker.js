import React, { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Star, Phone, Clock, Navigation } from 'lucide-react';

const MapStoreMarker = ({ store, onStoreClick }) => {
  // 使用 useMemo 优化图标创建
  const storeIcon = useMemo(() => {
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
        background: ${colorMap[store.type] || '#f59e0b'};
        border: 2px solid #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.2s ease;
      " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">${iconMap[store.type] || '📍'}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  }, [store.type]);

  // 使用 useMemo 优化弹窗内容
  const popupContent = useMemo(() => (
    <div style={{
      minWidth: '250px',
      padding: '8px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px'
      }}>
        <div>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#111827',
            margin: '0 0 4px 0'
          }}>
            {store.name}
          </h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginBottom: '8px'
          }}>
            <Star size={14} color="#fbbf24" fill="#fbbf24" />
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#111827'
            }}>
              {store.rating}
            </span>
            <span style={{
              fontSize: '12px',
              color: '#6b7280',
              marginLeft: '8px'
            }}>
              {store.distance}
            </span>
          </div>
        </div>
      </div>

      <div style={{
        fontSize: '14px',
        color: '#6b7280',
        marginBottom: '12px',
        lineHeight: '1.4'
      }}>
        {store.address}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px'
      }}>
        <Clock size={14} color="#6b7280" />
        <span style={{
          fontSize: '14px',
          color: '#6b7280'
        }}>
          {store.hours}
        </span>
      </div>

      {store.services && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{
            fontSize: '12px',
            color: '#9ca3af',
            fontWeight: '500',
            marginBottom: '6px'
          }}>
            服務項目
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px'
          }}>
            {store.services.map((service, index) => (
              <span
                key={index}
                style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{
        display: 'flex',
        gap: '8px',
        marginTop: '12px'
      }}>
        <button
          onClick={() => window.open(`tel:${store.phone}`)}
          style={{
            flex: 1,
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <Phone size={14} />
          撥打
        </button>
        <button
          onClick={() => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${store.location.lat},${store.location.lng}`;
            window.open(url, '_blank');
          }}
          style={{
            flex: 1,
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <Navigation size={14} />
          導航
        </button>
      </div>
    </div>
  ), [store]);

  return (
    <Marker
      position={[store.location.lat, store.location.lng]}
      icon={storeIcon}
      eventHandlers={{
        click: () => onStoreClick?.(store)
      }}
    >
      <Popup>
        {popupContent}
      </Popup>
    </Marker>
  );
};

export default MapStoreMarker; 