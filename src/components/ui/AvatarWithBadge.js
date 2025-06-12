import React from 'react';
import { Crown } from 'lucide-react';

const AvatarWithBadge = ({ 
  src, 
  alt, 
  size = 60, 
  verified = false, 
  online = false,
  badge = null,
  onClick 
}) => (
  <div 
    style={{
      position: 'relative',
      display: 'inline-block',
      cursor: onClick ? 'pointer' : 'default'
    }}
    onClick={onClick}
  >
    <img
      src={src}
      alt={alt}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        objectFit: 'cover',
        border: '3px solid #ffffff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}
    />
    
    {/* 在线状态指示器 */}
    {online && (
      <div style={{
        position: 'absolute',
        bottom: '2px',
        right: '2px',
        width: `${size * 0.25}px`,
        height: `${size * 0.25}px`,
        background: '#10b981',
        border: '2px solid #ffffff',
        borderRadius: '50%'
      }} />
    )}
    
    {/* 认证徽章 */}
    {verified && (
      <div style={{
        position: 'absolute',
        top: '-2px',
        right: '-2px',
        width: `${size * 0.3}px`,
        height: `${size * 0.3}px`,
        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid #ffffff'
      }}>
        <Crown size={size * 0.15} color="white" />
      </div>
    )}
    
    {/* 自定义徽章 */}
    {badge && (
      <div style={{
        position: 'absolute',
        top: '-4px',
        right: '-4px',
        background: badge.color || '#ef4444',
        color: 'white',
        fontSize: `${size * 0.2}px`,
        fontWeight: '600',
        padding: '2px 6px',
        borderRadius: '10px',
        border: '2px solid #ffffff',
        minWidth: `${size * 0.3}px`,
        textAlign: 'center'
      }}>
        {badge.text}
      </div>
    )}
  </div>
);

export default AvatarWithBadge; 