import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const MapLoadingSpinner = ({ message = "正在載入地圖..." }) => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.9)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          boxShadow: '0 4px 20px rgba(239, 68, 68, 0.3)'
        }}
      >
        <MapPin size={28} color="white" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#374151',
          textAlign: 'center'
        }}
      >
        {message}
      </motion.div>
      
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '120px' }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          height: '3px',
          background: 'linear-gradient(90deg, #ef4444, #dc2626)',
          borderRadius: '2px',
          marginTop: '12px'
        }}
      />
    </div>
  );
};

export default MapLoadingSpinner; 