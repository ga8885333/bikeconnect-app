import React from 'react';

const SectionTitle = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  action, 
  actionText = "查看全部",
  color = '#ef4444' 
}) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {Icon && (
        <div style={{
          width: '40px',
          height: '40px',
          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={20} color="white" />
        </div>
      )}
      <div>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#111827',
          margin: '0 0 4px 0'
        }}>
          {title}
        </h3>
        {subtitle && (
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: '0'
          }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
    {action && (
      <button
        onClick={action}
        style={{
          background: 'transparent',
          border: 'none',
          color: color,
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          padding: '8px 12px',
          borderRadius: '8px',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = `${color}10`;
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'transparent';
        }}
      >
        {actionText}
      </button>
    )}
  </div>
);

export default SectionTitle; 