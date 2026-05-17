import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ComingSoon = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 relative z-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-16 text-center border-2 border-hot-pink box-shadow-neon"
      >
        <h1 className="font-press-start text-4xl text-hot-pink mb-8 text-shadow-neon">{title}</h1>
        <div className="font-vt323 text-3xl text-white mb-8 animate-pulse">
          &gt; DEVELOPMENT IN PROGRESS _
        </div>
        <p className="font-orbitron text-gray-400 mb-12">
          Our arcade engineers are wiring up the cabinets. Check back soon!
        </p>
        <Link 
          to="/games"
          className="px-6 py-3 bg-white/5 border-2 border-white/20 text-white font-press-start hover:bg-white/10 transition-colors"
        >
          BACK TO ARCADE
        </Link>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
