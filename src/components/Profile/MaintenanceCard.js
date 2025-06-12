import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

const MaintenanceCard = ({ maintenance, onMaintenanceClick }) => {
  const getStatusColor = (status) => {
    const colorMap = {
      completed: '#10b981',
      pending: '#f59e0b',
      overdue: '#ef4444',
      scheduled: '#6366f1'
    };
    return colorMap[status] || '#6b7280';
  };

  const getStatusText = (status) => {
    const textMap = {
      completed: '已完成',
      pending: '待處理',
      overdue: '已逾期',
      scheduled: '已預約'
    };
    return textMap[status] || '未知';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'overdue':
        return AlertTriangle;
      default:
        return Wrench;
    }
  };

  const StatusIcon = getStatusIcon(maintenance.status);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
        borderRadius: '16px',
        padding: '20px',
        border: `2px solid ${getStatusColor(maintenance.status)}20`,
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
      onClick={() => onMaintenanceClick?.(maintenance)}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: `linear-gradient(135deg, ${getStatusColor(maintenance.status)} 0%, ${getStatusColor(maintenance.status)}dd 100%)`,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <StatusIcon size={20} color="white" />
          </div>
          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#111827',
              margin: '0 0 4px 0'
            }}>
              {maintenance.type}
            </h4>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0'
            }}>
              {maintenance.description}
            </p>
          </div>
        </div>
        <div style={{
          background: `${getStatusColor(maintenance.status)}10`,
          color: getStatusColor(maintenance.status),
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          {getStatusText(maintenance.status)}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '16px'
      }}>
        <div>
          <div style={{
            fontSize: '12px',
            color: '#9ca3af',
            fontWeight: '500',
            marginBottom: '4px'
          }}>
            里程數
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#111827'
          }}>
            {maintenance.mileage} km
          </div>
        </div>
        <div>
          <div style={{
            fontSize: '12px',
            color: '#9ca3af',
            fontWeight: '500',
            marginBottom: '4px'
          }}>
            費用
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#111827'
          }}>
            ${maintenance.cost}
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#6b7280',
        fontSize: '14px'
      }}>
        <Calendar size={16} />
        <span>{maintenance.date}</span>
        {maintenance.nextDue && (
          <>
            <span style={{ margin: '0 8px' }}>•</span>
            <span>下次保養: {maintenance.nextDue}</span>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default MaintenanceCard; 