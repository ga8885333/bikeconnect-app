import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Map, MessageSquare, User, ShoppingBag } from 'lucide-react';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      id: 'home',
      path: '/',
      icon: Home,
      label: '首頁',
      color: 'text-primary-500'
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
      id: 'market',
      path: '/market',
      icon: ShoppingBag,
      label: '商城',
      color: 'text-blue-500'
    },
    {
      id: 'social',
      path: '/social',
      icon: MessageSquare,
      label: '社群',
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
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-4 py-2 z-50">
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
                  ? 'bg-gradient-warm text-white shadow-warm scale-105'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
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
                  className="absolute -top-1 w-1 h-1 rounded-full bg-primary-400 animate-pulse"
                />
              )}
            </button>
          );
        })}
      </div>
      
      {/* 橙黃色裝飾線 */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full" />
    </div>
  );
};

export default BottomNavigation; 