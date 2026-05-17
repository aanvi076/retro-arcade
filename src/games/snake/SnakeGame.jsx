import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAudio } from '../../contexts/AudioContext';
import { Howl } from 'howler';

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;

const eatSound = new Howl({ src: ['https://actions.google.com/sounds/v1/cartoon/pop.ogg'], volume: 0.5 });
const overSound = new Howl({ src: ['https://actions.google.com/sounds/v1/cartoon/slide_whistle_to_drum_bump.ogg'], volume: 0.5 });

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const { isMuted } = useAudio();

  const snakeRef = useRef([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
  const foodRef = useRef({ x: 15, y: 5 });
  const dirRef = useRef({ x: 0, y: 0 });
  const nextDirRef = useRef({ x: 0, y: 0 });
  const speedRef = useRef(150);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);

  const initGame = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
    dirRef.current = { x: 0, y: 0 };
    nextDirRef.current = { x: 0, y: 0 };
    scoreRef.current = 0;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    speedRef.current = 150;
    spawnFood();
  }, []);

  const spawnFood = () => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE))
      };
      const onSnake = snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    foodRef.current = newFood;
  };

  const draw = (ctx) => {
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.strokeStyle = 'rgba(0, 210, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    ctx.fillStyle = '#ff007f';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff007f';
    ctx.fillRect(foodRef.current.x * GRID_SIZE + 1, foodRef.current.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2);

    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ffff';
    snakeRef.current.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00ffff' : '#00b3b3';
      ctx.fillRect(segment.x * GRID_SIZE + 1, segment.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2);
    });
    ctx.shadowBlur = 0;
  };

  const update = () => {
    if (gameOver || isPaused || !hasStarted) return;

    if (nextDirRef.current.x === 0 && nextDirRef.current.y === 0) return; // Wait for first key press

    dirRef.current = nextDirRef.current;
    const head = snakeRef.current[0];
    const newHead = {
      x: head.x + dirRef.current.x,
      y: head.y + dirRef.current.y
    };

    if (newHead.x < 0 || newHead.x >= CANVAS_SIZE / GRID_SIZE || 
        newHead.y < 0 || newHead.y >= CANVAS_SIZE / GRID_SIZE) {
      handleGameOver();
      return;
    }

    if (snakeRef.current.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      handleGameOver();
      return;
    }

    snakeRef.current.unshift(newHead);

    if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
      scoreRef.current += 10;
      setScore(scoreRef.current);
      if (!isMuted) eatSound.play();
      speedRef.current = Math.max(50, speedRef.current - 2);
      spawnFood();
      
      const currentHigh = parseInt(localStorage.getItem('snake_highscore') || '0');
      if (scoreRef.current > currentHigh) {
        localStorage.setItem('snake_highscore', scoreRef.current.toString());
      }
    } else {
      snakeRef.current.pop();
    }
  };

  const handleGameOver = () => {
    setGameOver(true);
    if (!isMuted) overSound.play();
    
    const currentHigh = parseInt(localStorage.getItem('snake_highscore') || '0');
    if (scoreRef.current > currentHigh) {
      localStorage.setItem('snake_highscore', scoreRef.current.toString());
    }
  };

  const loop = (timestamp) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const deltaTime = timestamp - lastTimeRef.current;

    if (deltaTime >= speedRef.current) {
      update();
      lastTimeRef.current = timestamp;
    }

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      draw(ctx);
    }

    animationRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
          if (dirRef.current.y === 0) nextDirRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
          if (dirRef.current.y === 0) nextDirRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
          if (dirRef.current.x === 0) nextDirRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
          if (dirRef.current.x === 0) nextDirRef.current = { x: 1, y: 0 };
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationRef.current);
  }, [gameOver, isPaused, hasStarted]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 relative z-10">
      <div className="mb-8 text-center">
        <h1 className="font-press-start text-3xl text-electric-blue text-shadow-neon mb-4">NEON SNAKE</h1>
        <div className="flex gap-8 justify-center font-vt323 text-2xl">
          <p className="text-hot-pink">SCORE: {score}</p>
          <p className="text-neon-purple">HIGH SCORE: {Math.max(score, parseInt(localStorage.getItem('snake_highscore') || '0'))}</p>
          <p className="text-white">USE ARROW KEYS OR WASD (SPACE TO PAUSE)</p>
        </div>
      </div>

      <div className="relative glass-panel p-4 rounded-lg box-shadow-neon border-2 border-electric-blue">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="bg-[#0a0a1a] rounded"
        />

        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded">
            <button 
              onClick={() => { initGame(); setHasStarted(true); }}
              className="px-6 py-3 bg-hot-pink/20 border-2 border-hot-pink text-white font-press-start hover:bg-hot-pink/40 transition-colors cursor-pointer"
            >
              START
            </button>
          </div>
        )}

        {isPaused && hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded">
            <h2 className="font-press-start text-2xl text-white tracking-widest">PAUSED</h2>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded">
            <h2 className="font-press-start text-3xl text-hot-pink mb-4 text-shadow-neon">GAME OVER</h2>
            <p className="font-vt323 text-2xl text-white mb-2">FINAL SCORE: {score}</p>
            <p className="font-vt323 text-2xl text-neon-purple mb-8">HIGH SCORE: {Math.max(score, parseInt(localStorage.getItem('snake_highscore') || '0'))}</p>
            <button 
              onClick={initGame}
              className="px-6 py-3 bg-electric-blue/20 border-2 border-electric-blue text-white font-press-start hover:bg-electric-blue/40 transition-colors cursor-pointer"
            >
              TRY AGAIN
            </button>
          </div>
        )}
      </div>

      <Link to="/games" className="mt-8 font-vt323 text-xl text-gray-400 hover:text-white transition-colors underline">
        &lt; Back to Library
      </Link>
    </div>
  );
};

export default SnakeGame;
