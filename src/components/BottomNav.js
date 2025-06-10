import React from 'react';
import { Home, Search, Map, Users, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { 
      icon: Home,
      label: '首頁', 
      path: '/',
      color: 'text-primary-600'
    },
    { 
      icon: Map,
      label: '地圖', 
      path: '/map',
      color: 'text-primary-600'
    },
    { 
      icon: Search,
      label: '探索', 
      path: '/store-map',
      color: 'text-accent-600'
    },
    { 
      icon: Users,
      label: '社群', 
      path: '/social',
      color: 'text-accent-600'
    },
    { 
      icon: User,
      label: '我的', 
      path: '/profile',
      color: 'text-primary-600'
    }
  ];

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* 漸層背景 */}
      <div className="bg-white/95 backdrop-blur-sm border-t border-primary-100 shadow-lg">
        <div className="flex items-center justify-around py-2 px-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-warm text-white shadow-warm transform scale-105' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-primary-50'
                }`}
              >
                <Icon 
                  size={20} 
                  className={`mb-1 ${isActive ? 'text-white' : item.color}`}
                />
                <span 
                  className={`text-xs font-medium ${
                    isActive ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </span>
                
                {/* 活躍指示器 */}
                {isActive && (
                  <div className="absolute -top-1 w-6 h-1 bg-white rounded-full opacity-80"></div>
                )}
              </button>
            );
          })}
        </div>
        
        {/* 底部裝飾線 */}
        <div className="h-1 bg-gradient-warm"></div>
      </div>
    </div>
  );
};

export default BottomNav; 