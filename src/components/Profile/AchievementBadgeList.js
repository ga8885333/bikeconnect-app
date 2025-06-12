import React from 'react';
import { motion } from 'framer-motion';

const AchievementBadgeList = ({ achievements, onAchievementClick }) => {
  const getAchievementColor = (type) => {
    const colorMap = {
      distance: '#ef4444',
      time: '#f59e0b',
      social: '#10b981',
      content: '#8b5cf6'
    };
    return colorMap[type] || '#6b7280';
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '16px',
      marginTop: '16px'
    }}>
      {achievements.map((achievement, index) => (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
            borderRadius: '16px',
            padding: '20px',
            border: `2px solid ${getAchievementColor(achievement.type)}20`,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onClick={() => onAchievementClick?.(achievement)}
          whileHover={{ 
            scale: 1.02,
            boxShadow: `0 8px 25px ${getAchievementColor(achievement.type)}20`
          }}
          whileTap={{ scale: 0.98 }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '12px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: `linear-gradient(135deg, ${getAchievementColor(achievement.type)} 0%, ${getAchievementColor(achievement.type)}dd 100%)`,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              {achievement.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#111827',
                margin: '0 0 4px 0'
              }}>
                {achievement.title}
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '0'
              }}>
                {achievement.description}
              </p>
            </div>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{
              fontSize: '12px',
              color: '#9ca3af',
              fontWeight: '500'
            }}>
              獲得於 {achievement.date}
            </span>
            <div style={{
              background: `${getAchievementColor(achievement.type)}10`,
              color: getAchievementColor(achievement.type),
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {achievement.type === 'distance' && '距離'}
              {achievement.type === 'time' && '時間'}
              {achievement.type === 'social' && '社交'}
              {achievement.type === 'content' && '內容'}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AchievementBadgeList; 