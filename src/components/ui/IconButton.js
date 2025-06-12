import React from 'react';

const IconButton = ({ 
  icon: Icon, 
  onClick, 
  color = '#ef4444', 
  bgColor = '#fef2f2',
  size = 'medium',
  disabled = false,
  badge = null,
  tooltip = null
}) => {
  const sizeMap = {
    small: { button: 36, icon: 16, padding: 8 },
    medium: { button: 44, icon: 20, padding: 12 },
    large: { button: 52, icon: 24, padding: 14 }
  };

  const currentSize = sizeMap[size];

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={onClick}
        disabled={disabled}
        title={tooltip}
        style={{
          width: `${currentSize.button}px`,
          height: `${currentSize.button}px`,
          background: disabled ? '#f3f4f6' : bgColor,
          border: `2px solid ${disabled ? '#d1d5db' : color}20`,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          opacity: disabled ? 0.5 : 1
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.target.style.background = color;
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = `0 4px 12px ${color}30`;
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.target.style.background = bgColor;
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }
        }}
      >
        <Icon 
          size={currentSize.icon} 
          color={disabled ? '#9ca3af' : color}
          style={{ transition: 'color 0.2s ease' }}
        />
      </button>
      
      {/* 徽章 */}
      {badge && (
        <div style={{
          position: 'absolute',
          top: '-4px',
          right: '-4px',
          background: badge.color || '#ef4444',
          color: 'white',
          fontSize: '10px',
          fontWeight: '600',
          padding: '2px 6px',
          borderRadius: '10px',
          border: '2px solid #ffffff',
          minWidth: '16px',
          textAlign: 'center'
        }}>
          {badge.count}
        </div>
      )}
    </div>
  );
};

export default IconButton; 