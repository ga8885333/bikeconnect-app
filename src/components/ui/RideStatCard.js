import React from 'react';

const RideStatCard = ({ icon: Icon, value, label, color = '#ef4444', bgColor = '#fef2f2' }) => (
  <div style={{
    background: bgColor,
    borderRadius: '16px',
    padding: '20px',
    textAlign: 'center',
    border: `2px solid ${color}20`,
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  }}
  onMouseEnter={(e) => {
    e.target.style.transform = 'translateY(-2px)';
    e.target.style.boxShadow = `0 8px 25px ${color}30`;
  }}
  onMouseLeave={(e) => {
    e.target.style.transform = 'translateY(0)';
    e.target.style.boxShadow = 'none';
  }}
  >
    <div style={{
      width: '48px',
      height: '48px',
      background: color,
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 12px auto'
    }}>
      <Icon size={24} color="white" />
    </div>
    <div style={{
      fontSize: '24px',
      fontWeight: '800',
      color: '#111827',
      marginBottom: '4px'
    }}>
      {value}
    </div>
    <div style={{
      fontSize: '14px',
      color: '#6b7280',
      fontWeight: '500'
    }}>
      {label}
    </div>
  </div>
);

export default RideStatCard; 