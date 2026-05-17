import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Trophy, Medal, Volume2, VolumeX, SkipForward, Music } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';

const Navbar = () => {
  const { isMuted, toggleMute, nextTrack, currentTrackName } = useAudio();
  return (
    <nav className="sticky top-0 z-50 glass-panel mx-4 mt-4 px-6 py-4 flex items-center justify-between border-neon-purple shadow-[0_0_15px_rgba(176,38,255,0.3)]">
      <Link to="/" className="flex items-center gap-3 group">
        <Gamepad2 className="w-8 h-8 text-neon-purple group-hover:text-electric-blue transition-colors duration-300" />
        <span className="font-press-start text-sm tracking-wider text-white group-hover:text-shadow-neon transition-all duration-300">
          RETRO<span className="text-neon-purple">HUB</span>
        </span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8">
        <NavLink to="/games" icon={<Gamepad2 size={18} />} text="GAMES" />
        <NavLink to="/leaderboard" icon={<Trophy size={18} />} text="LEADERBOARD" />
        <NavLink to="/achievements" icon={<Medal size={18} />} text="ACHIEVEMENTS" />
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 text-xs font-vt323 text-electric-blue bg-white/5 px-3 py-1 rounded-full border border-electric-blue/30">
          <Music size={14} className="animate-pulse" />
          <span>{currentTrackName}</span>
        </div>
        
        <button 
          onClick={nextTrack}
          title="Next Track"
          className="p-2 rounded-full hover:bg-white/10 transition-colors border border-transparent hover:border-hot-pink hover:box-shadow-neon group cursor-pointer"
        >
          <SkipForward className="w-5 h-5 text-hot-pink group-hover:text-white" />
        </button>

        <button 
          onClick={toggleMute}
          title="Toggle Mute"
          className="p-2 rounded-full hover:bg-white/10 transition-colors border border-transparent hover:border-retro-cyan hover:box-shadow-neon group cursor-pointer"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-gray-500 group-hover:text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-retro-cyan group-hover:text-white" />
          )}
        </button>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, text }) => (
  <Link 
    to={to} 
    className="flex items-center gap-2 font-vt323 text-xl hover:text-electric-blue hover:text-shadow-neon transition-all duration-300"
  >
    {icon}
    <span>{text}</span>
  </Link>
);

export default Navbar;
