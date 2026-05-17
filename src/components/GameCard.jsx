import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

const GameCard = ({ game }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05, y: -10 }}
      className="glass-panel overflow-hidden group relative w-72 h-96 flex flex-col border border-white/10 hover:border-neon-purple hover:box-shadow-neon transition-all duration-300"
    >
      <div className="h-48 overflow-hidden relative">
        <img src={game.image} alt={game.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-2 right-2 bg-black/60 px-3 py-1 rounded-sm border border-retro-cyan font-vt323 text-retro-cyan">
          {game.difficulty}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="font-press-start text-xs mb-2 text-white group-hover:text-neon-purple transition-colors leading-loose">
            {game.title}
          </h3>
          <p className="font-vt323 text-xl text-gray-400 mt-2">
            High Score: <span className="text-electric-blue">{localStorage.getItem(`${game.id}_highscore`) || 0}</span>
          </p>
        </div>
        
        <Link to={game.path} className="w-full py-3 bg-white/5 hover:bg-neon-purple/30 border border-white/20 hover:border-neon-purple rounded-sm flex items-center justify-center gap-2 transition-all font-vt323 text-2xl text-white">
          <Play size={20} className="text-hot-pink" />
          PLAY NOW
        </Link>
      </div>
    </motion.div>
  );
};

export default GameCard;
