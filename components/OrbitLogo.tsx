import React from 'react';
import { motion } from 'framer-motion';
import logoUrl from '../images/logo.png';

const OrbitLogo: React.FC<{ size?: 'small' | 'large' }> = ({ size = 'large' }) => {
  const isLarge = size === 'large';
  
  return (
    <div className={`orbit-logo-container ${size}`}>
      {/* Animated Background Rings */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="orbit-ring ring-1"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        className="orbit-ring ring-2"
      />
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="orbit-ring ring-3"
      />

      {/* Internal Glow */}
      <div className="orbit-central-glow"></div>

      {/* Core Image */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="orbit-core"
      >
        <img 
          src={logoUrl} 
          alt="Orbit Logo" 
          className="orbit-image"
        />
      </motion.div>
    </div>
  );
};

export default OrbitLogo;
