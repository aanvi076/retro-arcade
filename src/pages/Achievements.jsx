import React from 'react';
import { motion } from 'framer-motion';
import { Medal, CheckCircle } from 'lucide-react';

const ACHIEVEMENTS = [
  { id: 1, title: 'First Win', desc: 'Win your first game', unlocked: true },
  { id: 2, title: 'Score 1000+', desc: 'Get over 1000 points in any game', unlocked: true },
  { id: 3, title: '10 Games Played', desc: 'Play 10 total games', unlocked: false },
  { id: 4, title: 'Flawless Victory', desc: 'Win without taking damage', unlocked: false },
  { id: 5, title: 'Arcade Master', desc: 'Unlock all other achievements', unlocked: false },
];

const Achievements = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center py-12 px-8 relative z-10">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="font-press-start text-3xl md:text-5xl text-white mb-6 text-shadow-neon flex items-center justify-center gap-4">
          <Medal className="text-hot-pink w-12 h-12" />
          ACHIEVE<span className="text-electric-blue">MENTS</span>
        </h1>
        <p className="font-orbitron text-gray-400 text-lg uppercase tracking-widest">Your Badges of Honor</p>
      </motion.div>
      <div className="w-full max-w-4xl grid gap-6">
        {ACHIEVEMENTS.map((ach, index) => (
          <motion.div key={ach.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.1 }} className={`glass-panel p-6 border-2 flex items-center justify-between ${ach.unlocked ? 'border-neon-purple box-shadow-neon' : 'border-white/10 opacity-50'}`}>
            <div>
              <h3 className={`font-press-start text-xl mb-2 ${ach.unlocked ? 'text-white' : 'text-gray-500'}`}>{ach.title}</h3>
              <p className="font-vt323 text-2xl text-gray-400">{ach.desc}</p>
            </div>
            {ach.unlocked && <CheckCircle className="text-electric-blue w-10 h-10" />}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default Achievements;
