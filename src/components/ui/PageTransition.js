import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.3, 
        ease: "easeInOut" 
      }}
      className={className}
      style={{
        width: '100%',
        height: '100%'
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition; 