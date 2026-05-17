import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const InvadersGame = () => {
  const canvasRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const state = useRef({ px: 180, bullets: [], enemies: [], edx: 1 });
  
  const init = () => {
    state.current.enemies = [];
    for(let i=0; i<6; i++) {
      for(let j=0; j<3; j++) {
        state.current.enemies.push({ x: 40 + i*50, y: 30 + j*40, alive: true });
      }
    }
  };

  const loop = () => {
    if(!hasStarted || gameOver) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0,0,400,400);

    ctx.fillStyle = '#00ffff';
    ctx.fillRect(state.current.px, 360, 40, 20);

    ctx.fillStyle = '#ff007f';
    state.current.bullets.forEach((b, i) => {
      b.y -= 5;
      ctx.fillRect(b.x, b.y, 4, 15);
      if(b.y < 0) state.current.bullets.splice(i, 1);
    });

    let hitEdge = false;
    ctx.fillStyle = '#b026ff';
    state.current.enemies.forEach(e => {
      if(!e.alive) return;
      e.x += state.current.edx * 0.5;
      if(e.x > 370 || e.x < 10) hitEdge = true;
      ctx.fillRect(e.x, e.y, 25, 20);

      state.current.bullets.forEach((b, bi) => {
        if(b.x > e.x && b.x < e.x+25 && b.y > e.y && b.y < e.y+20) {
          e.alive = false;
          state.current.bullets.splice(bi, 1);
          setScore(s => s + 10);
        }
      });
      if (e.y > 340) setGameOver(true);
    });

    if(hitEdge) {
      state.current.edx *= -1;
      state.current.enemies.forEach(e => e.y += 15);
    }
    
    if(state.current.enemies.every(e => !e.alive)) init();

    requestAnimationFrame(loop);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if(e.key === 'ArrowLeft' || e.key === 'a') state.current.px = Math.max(0, state.current.px - 20);
      if(e.key === 'ArrowRight' || e.key === 'd') state.current.px = Math.min(360, state.current.px + 20);
      if(e.key === ' ') state.current.bullets.push({ x: state.current.px + 18, y: 360 });
    };
    window.addEventListener('keydown', handleKey);
    if(hasStarted) { init(); requestAnimationFrame(loop); }
    return () => window.removeEventListener('keydown', handleKey);
  }, [hasStarted, gameOver]);

  return (
    <div className="flex flex-col items-center py-12 z-10 relative">
      <h1 className="font-press-start text-3xl text-neon-purple text-shadow-neon mb-4">INVADERS</h1>
      <p className="text-white font-vt323 text-2xl mb-4">SCORE: {score} (Space to Shoot)</p>
      <div className="relative glass-panel p-2 box-shadow-neon border-2 border-neon-purple">
        <canvas ref={canvasRef} width={400} height={400} className="bg-[#0a0a1a] rounded" />
        {!hasStarted && <button onClick={() => setHasStarted(true)} className="absolute inset-0 m-auto w-32 h-12 bg-neon-purple/30 border-2 border-neon-purple text-white font-press-start">START</button>}
        {gameOver && <button onClick={() => {
          state.current = { px: 180, bullets: [], enemies: [], edx: 1 };
          setScore(0);
          setGameOver(false);
        }} className="absolute inset-0 m-auto w-48 h-12 bg-white/30 border-2 border-white text-white font-press-start z-20">TRY AGAIN</button>}
      </div>
      <Link to="/games" className="mt-8 text-gray-400 underline font-vt323 text-xl">Back</Link>
    </div>
  );
};
export default InvadersGame;
