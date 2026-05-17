import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { gamesData } from '../data/gamesData';
import GameCard from '../components/GameCard';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] relative">
      
      {/* Synthwave Grid Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-[linear-gradient(transparent_0%,rgba(176,38,255,0.2)_100%)]">
           {/* Placeholder for moving synthwave grid */}
           <div className="w-full h-full" style={{
              backgroundImage: 'linear-gradient(rgba(0,210,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,255,0.5) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              transform: 'perspective(500px) rotateX(60deg)',
              transformOrigin: 'bottom'
           }}></div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center z-10"
      >
        <h1 className="font-press-start text-4xl md:text-6xl text-white mb-6 text-shadow-neon">
          RETRO <span className="text-neon-purple">ARCADE</span>
        </h1>
        <p className="font-orbitron text-electric-blue text-xl md:text-2xl mb-12 uppercase tracking-[0.3em]">
          The Golden Age Returns
        </p>
      </motion.div>

      <motion.div
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        className="mt-12 z-10"
      >
        <p className="font-vt323 text-3xl text-hot-pink tracking-widest text-shadow-neon mb-6">
          &gt; INSERT COIN _
        </p>
      </motion.div>

      <Link to="/games">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="z-10 mt-12 px-8 py-4 bg-neon-purple/20 border-2 border-neon-purple text-white font-press-start text-lg rounded-sm box-shadow-neon hover:bg-neon-purple/40 transition-colors cursor-pointer"
        >
          START GAME
        </motion.button>
      </Link>
      
      {/* Featured Games Section */}
      <div className="w-full max-w-7xl mx-auto px-8 mt-32 z-10">
        <h2 className="font-press-start text-2xl text-white mb-12 border-b-2 border-neon-purple pb-4 inline-block text-shadow-neon">
          FEATURED <span className="text-electric-blue">GAMES</span>
        </h2>
        
        <div className="flex gap-8 overflow-x-auto pb-12 snap-x hide-scrollbar">
          {gamesData.slice(0, 4).map((game) => (
            <div key={game.id} className="snap-center shrink-0">
              <GameCard game={game} />
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default LandingPage;
