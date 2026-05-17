import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const MOCK_LEADERBOARD = [
  { name: 'NEO_HACKER', score: 9999, game: 'Snake' },
  { name: 'CYBER_PUNK', score: 8500, game: 'Tetris' },
  { name: 'SYNTH_WAVE', score: 7200, game: 'Pong' },
  { name: 'RETRO_KID', score: 6400, game: 'Space Invaders' },
  { name: 'PIXEL_NINJA', score: 5100, game: 'Flappy' },
];

const Leaderboard = () => {
  const mySnakeScore = parseInt(localStorage.getItem('snake_highscore') || '0');
  const myTetrisScore = parseInt(localStorage.getItem('tetris_highscore') || '0');
  
  const realLeaderboard = [...MOCK_LEADERBOARD];
  if (mySnakeScore > 0) realLeaderboard.push({ name: 'YOU (P1)', score: mySnakeScore, game: 'Snake' });
  if (myTetrisScore > 0) realLeaderboard.push({ name: 'YOU (P1)', score: myTetrisScore, game: 'Tetris' });
  
  realLeaderboard.sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-[80vh] flex flex-col items-center py-12 px-8 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="font-press-start text-3xl md:text-5xl text-white mb-6 text-shadow-neon flex items-center justify-center gap-4">
          <Trophy className="text-electric-blue w-12 h-12" />
          HALL OF <span className="text-neon-purple">FAME</span>
        </h1>
        <p className="font-orbitron text-gray-400 text-lg uppercase tracking-widest">
          Top Scores Worldwide
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl glass-panel p-8 border-2 border-electric-blue/50 box-shadow-neon"
      >
        <div className="grid grid-cols-4 gap-4 border-b-2 border-hot-pink pb-4 mb-4 font-press-start text-hot-pink text-sm md:text-base">
          <div className="col-span-1">RANK</div>
          <div className="col-span-1">PLAYER</div>
          <div className="col-span-1 text-right">SCORE</div>
          <div className="col-span-1 text-right">GAME</div>
        </div>
        
        <div className="space-y-4">
          {realLeaderboard.slice(0, 10).map((entry, index) => (
            <motion.div 
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`grid grid-cols-4 gap-4 items-center py-3 border-b border-white/10 font-vt323 text-xl md:text-2xl hover:bg-white/5 transition-colors ${entry.name === 'YOU (P1)' ? 'bg-white/10 border-hot-pink font-bold' : ''}`}
            >
              <div className="col-span-1 text-electric-blue">#{index + 1}</div>
              <div className={`col-span-1 ${entry.name === 'YOU (P1)' ? 'text-hot-pink' : 'text-white'}`}>{entry.name}</div>
              <div className="col-span-1 text-right text-neon-purple">{entry.score}</div>
              <div className="col-span-1 text-right text-gray-400">{entry.game}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;
