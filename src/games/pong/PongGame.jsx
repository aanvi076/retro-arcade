import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAudio } from '../../contexts/AudioContext';
import { Howl } from 'howler';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 10;

const hitSound = new Howl({ src: ['https://actions.google.com/sounds/v1/cartoon/woodblock_high.ogg'], volume: 0.5 });
const scoreSound = new Howl({ src: ['https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg'], volume: 0.5 });

const PongGame = () => {
  const canvasRef = useRef(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const { isMuted } = useAudio();

  const state = useRef({
    playerY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    aiY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT / 2,
    ballDX: 5,
    ballDY: 3,
  });

  const animationRef = useRef(null);
  const keys = useRef({});

  const resetBall = () => {
    state.current.ballX = CANVAS_WIDTH / 2;
    state.current.ballY = CANVAS_HEIGHT / 2;
    state.current.ballDX = (Math.random() > 0.5 ? 1 : -1) * 5;
    state.current.ballDY = (Math.random() > 0.5 ? 1 : -1) * 3;
  };

  const draw = (ctx) => {
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Center line
    ctx.strokeStyle = 'rgba(0, 210, 255, 0.2)';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Player Paddle
    ctx.fillStyle = '#ff007f';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff007f';
    ctx.fillRect(10, state.current.playerY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // AI Paddle
    ctx.fillStyle = '#00d2ff';
    ctx.shadowColor = '#00d2ff';
    ctx.fillRect(CANVAS_WIDTH - 20, state.current.aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Ball
    ctx.fillStyle = '#b026ff';
    ctx.shadowColor = '#b026ff';
    ctx.fillRect(state.current.ballX, state.current.ballY, BALL_SIZE, BALL_SIZE);
    
    ctx.shadowBlur = 0;
  };

  const update = () => {
    if (!hasStarted) return;

    // Player movement
    if (keys.current['ArrowUp'] || keys.current['w']) {
      state.current.playerY = Math.max(0, state.current.playerY - 6);
    }
    if (keys.current['ArrowDown'] || keys.current['s']) {
      state.current.playerY = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, state.current.playerY + 6);
    }

    // AI Movement (simple follow)
    const aiCenter = state.current.aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < state.current.ballY - 10) {
      state.current.aiY += 4; // AI speed
    } else if (aiCenter > state.current.ballY + 10) {
      state.current.aiY -= 4;
    }
    state.current.aiY = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, state.current.aiY));

    // Ball movement
    state.current.ballX += state.current.ballDX;
    state.current.ballY += state.current.ballDY;

    // Top/Bottom collision
    if (state.current.ballY <= 0 || state.current.ballY >= CANVAS_HEIGHT - BALL_SIZE) {
      state.current.ballDY *= -1;
    }

    // Paddle collision
    if (state.current.ballX <= 20 + PADDLE_WIDTH && state.current.ballX >= 20) {
      if (state.current.ballY + BALL_SIZE >= state.current.playerY && state.current.ballY <= state.current.playerY + PADDLE_HEIGHT) {
        state.current.ballDX *= -1;
        state.current.ballDX += 0.5; // speed up slightly
        if (!isMuted) hitSound.play();
      }
    }
    if (state.current.ballX + BALL_SIZE >= CANVAS_WIDTH - 20 - PADDLE_WIDTH && state.current.ballX + BALL_SIZE <= CANVAS_WIDTH - 20) {
      if (state.current.ballY + BALL_SIZE >= state.current.aiY && state.current.ballY <= state.current.aiY + PADDLE_HEIGHT) {
        state.current.ballDX *= -1;
        state.current.ballDX -= 0.5;
        if (!isMuted) hitSound.play();
      }
    }

    // Score
    if (state.current.ballX < 0) {
      setAiScore(s => s + 1);
      if (!isMuted) scoreSound.play();
      resetBall();
    } else if (state.current.ballX > CANVAS_WIDTH) {
      setPlayerScore(s => s + 1);
      if (!isMuted) scoreSound.play();
      resetBall();
    }
  };

  const loop = () => {
    update();
    if (canvasRef.current) {
      draw(canvasRef.current.getContext('2d'));
    }
    animationRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    const handleKeyDown = (e) => { keys.current[e.key] = true; };
    const handleKeyUp = (e) => { keys.current[e.key] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    animationRef.current = requestAnimationFrame(loop);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationRef.current);
    };
  }, [hasStarted]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 relative z-10">
      <div className="mb-8 text-center">
        <h1 className="font-press-start text-3xl text-neon-purple text-shadow-neon mb-4">NEON PONG</h1>
        <div className="flex gap-16 justify-center font-vt323 text-4xl mb-4">
          <p className="text-hot-pink">YOU: {playerScore}</p>
          <p className="text-electric-blue">CPU: {aiScore}</p>
        </div>
      </div>

      <div className="relative glass-panel p-4 rounded-lg box-shadow-neon border-2 border-neon-purple">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="bg-[#0a0a1a] rounded"
        />

        {!hasStarted && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded">
            <button 
              onClick={() => { resetBall(); setHasStarted(true); }}
              className="px-6 py-3 bg-neon-purple/20 border-2 border-neon-purple text-white font-press-start hover:bg-neon-purple/40 transition-colors cursor-pointer text-shadow-neon"
            >
              START MATCH
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

export default PongGame;
