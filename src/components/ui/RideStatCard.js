import React from 'react';
import { MapPin, Clock } from 'lucide-react';

/**
 * RideStatCard 元件 - 顯示騎行統計資料
 * @param {Object} props
 * @param {string} props.distance - 騎行距離
 * @param {string} props.time - 騎行時間
 * @param {string} props.title - 卡片標題
 * @param {string} props.className - 額外的 CSS 類別
 */
const RideStatCard = ({ 
  distance = '0 km', 
  time = '0 min', 
  title = '騎行統計',
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 border-l-4 border-red-500 ${className}`}>
      {/* 標題 */}
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
          <MapPin className="w-4 h-4 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>

      {/* 統計資料 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 距離 */}
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-1">
            {distance}
          </div>
          <div className="text-sm text-gray-500 flex items-center justify-center">
            <MapPin className="w-3 h-3 mr-1" />
            距離
          </div>
        </div>

        {/* 時間 */}
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-1">
            {time}
          </div>
          <div className="text-sm text-gray-500 flex items-center justify-center">
            <Clock className="w-3 h-3 mr-1" />
            時間
          </div>
        </div>
      </div>

      {/* 底部裝飾線 */}
      <div className="mt-4 h-1 bg-gradient-to-r from-red-500 to-red-300 rounded-full"></div>
    </div>
  );
};

export default RideStatCard; 