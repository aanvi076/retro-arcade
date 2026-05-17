import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const FlappyGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const animationRef = useRef(null);
  
  const state = useRef({
    birdY: 200, birdDY: 0,
    pipes: [{ x: 400, y: 150 }],
  });

  const jump = () => { if (hasStarted && !gameOver) state.current.birdDY = -7; };

  const loop = () => {
    if (gameOver || !hasStarted) return;
    const ctx = canvasRef.current.getContext('2d');
    
    state.current.birdDY += 0.4; // gravity
    state.current.birdY += state.current.birdDY;

    // Pipes
    if (state.current.pipes[state.current.pipes.length - 1].x < 250) {
      state.current.pipes.push({ x: 400, y: Math.random() * 200 + 100 });
    }
    
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, 400, 400);

    ctx.fillStyle = '#00ffcc';
    state.current.pipes.forEach(p => {
      p.x -= 2;
      ctx.fillRect(p.x, 0, 40, p.y - 60);
      ctx.fillRect(p.x, p.y + 60, 40, 400);
      
      // Collision
      if (50 > p.x && 30 < p.x + 40) {
        if (state.current.birdY < p.y - 60 || state.current.birdY > p.y + 60) setGameOver(true);
      }
      if (p.x === 30) setScore(s => s + 1);
    });

    // Floor/Ceiling
    if (state.current.birdY > 390 || state.current.birdY < 0) setGameOver(true);

    ctx.fillStyle = '#ff007f';
    ctx.fillRect(30, state.current.birdY, 20, 20);

    animationRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    const handler = (e) => { if(e.code === 'Space') jump(); };
    window.addEventListener('keydown', handler);
    if(hasStarted) animationRef.current = requestAnimationFrame(loop);
    return () => { window.removeEventListener('keydown', handler); cancelAnimationFrame(animationRef.current); };
  }, [hasStarted, gameOver]);

  return (
    <div className="flex flex-col items-center py-12 z-10 relative">
      <h1 className="font-press-start text-3xl text-hot-pink mb-4 text-shadow-neon">FLAPPY</h1>
      <p className="text-white font-vt323 text-2xl mb-4">SCORE: {score} (Space to Jump)</p>
      <div className="relative glass-panel p-2 box-shadow-neon border-2 border-hot-pink" onClick={jump}>
        <canvas ref={canvasRef} width={400} height={400} className="bg-[#0a0a1a] rounded cursor-pointer" />
        {!hasStarted && <button onClick={() => setHasStarted(true)} className="absolute inset-0 m-auto w-32 h-12 bg-hot-pink/30 border-2 border-hot-pink text-white font-press-start">START</button>}
        {gameOver && <button onClick={() => {
          state.current = { birdY: 200, birdDY: 0, pipes: [{ x: 400, y: 150 }] };
          setScore(0);
          setGameOver(false);
        }} className="absolute inset-0 m-auto w-48 h-12 bg-white/30 border-2 border-white text-white font-press-start">TRY AGAIN</button>}
      </div>
      <Link to="/games" className="mt-8 text-gray-400 underline font-vt323 text-xl">Back</Link>
    </div>
  );
};
export default FlappyGame;
