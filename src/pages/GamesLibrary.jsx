import React from 'react';
import { motion } from 'framer-motion';
import { gamesData } from '../data/gamesData';
import GameCard from '../components/GameCard';

const GamesLibrary = () => {
  return (
    <div className="min-h-screen pt-12 px-8 pb-12 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="font-press-start text-3xl md:text-5xl text-white mb-6 text-shadow-neon">
          GAMES <span className="text-electric-blue">LIBRARY</span>
        </h1>
        <p className="font-orbitron text-gray-400 text-lg uppercase tracking-widest">
          Select your challenge
        </p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
        {gamesData.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <GameCard game={game} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GamesLibrary;
