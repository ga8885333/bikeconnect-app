import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Map, MessageSquare, User } from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: 'home',
      path: '/',
      icon: Home,
      label: '首頁',
      color: 'text-bike-500'
    },
    {
      id: 'groups',
      path: '/groups',
      icon: Users,
      label: '揪團',
      color: 'text-green-500'
    },
    {
      id: 'map',
      path: '/map',
      icon: Map,
      label: '地圖',
      color: 'text-purple-500'
    },
    {
      id: 'social',
      path: '/social',
      icon: MessageSquare,
      label: '社群牆',
      color: 'text-pink-500'
    },
    {
      id: 'profile',
      path: '/profile',
      icon: User,
      label: '我',
      color: 'text-orange-500'
    }
  ];

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? `${item.color} bg-gray-50 scale-110`
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <IconComponent 
                size={22} 
                className={`mb-1 transition-all duration-300 ${
                  isActive ? 'scale-110' : ''
                }`}
              />
              <span 
                className={`text-xs font-medium transition-all duration-300 ${
                  isActive ? 'font-semibold' : ''
                }`}
              >
                {item.label}
              </span>
              
              {/* 活動指示器 */}
              {isActive && (
                <div 
                  className={`absolute -top-1 w-1 h-1 rounded-full ${item.color.replace('text-', 'bg-')} animate-pulse`}
                />
              )}
            </button>
          );
        })}
      </div>
      
      {/* 騎士風格裝飾線 */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-bike-400 to-bike-600 rounded-full" />
    </div>
  );
};

export default BottomNavigation; 