import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, MessageSquare, Map, User } from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: '首頁', path: '/' },
    { icon: MessageSquare, label: '社群', path: '/social' },
    { icon: Users, label: '揪團', path: '/groups' },
    { icon: Map, label: '地圖', path: '/map' },
    { icon: User, label: '個人', path: '/profile' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'white',
      borderTop: '1px solid #e5e7eb',
      padding: '8px 0',
      zIndex: 1000,
      boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '8px 12px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: active ? '#dc2626' : '#6b7280',
                transform: active ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              <Icon 
                size={20} 
                style={{
                  marginBottom: '4px',
                  strokeWidth: active ? 2.5 : 2
                }}
              />
              <span style={{
                fontSize: '12px',
                fontWeight: active ? '600' : '500'
              }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation; 