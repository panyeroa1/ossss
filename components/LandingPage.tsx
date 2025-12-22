import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="stars-overlay"></div>
      <div className="landing-content">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="hero-section"
        >
          <div className="brand-logo-large">
            <span className="material-symbols-outlined">orbit</span>
          </div>
          <h1 className="hero-title">Orbit OS</h1>
          <p className="hero-subtitle">The next generation translation intelligence.</p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-get-started"
            onClick={() => navigate('/auth')}
          >
            Get Started
            <span className="material-symbols-outlined">arrow_forward</span>
          </motion.button>
        </motion.div>

        <div className="feature-grid">
          <div className="feature-pill">
            <span className="material-symbols-outlined">translate</span>
            Real-time Translation
          </div>
          <div className="feature-pill">
            <span className="material-symbols-outlined">auto_awesome</span>
            AI Powered
          </div>
          <div className="feature-pill">
            <span className="material-symbols-outlined">security</span>
            Secure & Private
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
