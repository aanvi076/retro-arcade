import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 20;

const COLORS = [
  null,
  '#00ffff', // I - cyan
  '#0000ff', // J - blue
  '#ff7f00', // L - orange
  '#ffff00', // O - yellow
  '#00ff00', // S - green
  '#800080', // T - purple
  '#ff0000'  // Z - red
];

const PIECES = [
  [],
  [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]], // I
  [[2,0,0], [2,2,2], [0,0,0]], // J
  [[0,0,3], [3,3,3], [0,0,0]], // L
  [[4,4], [4,4]], // O
  [[0,5,5], [5,5,0], [0,0,0]], // S
  [[0,6,0], [6,6,6], [0,0,0]], // T
  [[7,7,0], [0,7,7], [0,0,0]]  // Z
];

const createMatrix = (w, h) => Array.from({length: h}, () => Array(w).fill(0));

const TetrisGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const state = useRef({
    matrix: createMatrix(COLS, ROWS),
    player: { pos: {x: 0, y: 0}, matrix: null },
    dropCounter: 0,
    dropInterval: 1000,
    lastTime: 0
  });

  const animationRef = useRef(null);

  const createPiece = (type) => PIECES[type];
  
  const drawMatrix = (matrix, offset, ctx) => {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          ctx.fillStyle = COLORS[value];
          ctx.fillRect((x + offset.x) * BLOCK_SIZE, (y + offset.y) * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
        }
      });
    });
  };

  const draw = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);
    
    drawMatrix(state.current.matrix, {x: 0, y: 0}, ctx);
    if(state.current.player.matrix) {
      drawMatrix(state.current.player.matrix, state.current.player.pos, ctx);
    }
  };

  const collide = (matrix, player) => {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
      for (let x = 0; x < m[y].length; ++x) {
        if (m[y][x] !== 0 && (matrix[y + o.y] && matrix[y + o.y][x + o.x]) !== 0) {
          return true;
        }
      }
    }
    return false;
  };

  const merge = (matrix, player) => {
    player.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          matrix[y + player.pos.y][x + player.pos.x] = value;
        }
      });
    });
  };

  const rotate = (matrix, dir) => {
    const m = matrix.map((_, i) => matrix.map(col => col[i]));
    if (dir > 0) return m.map(row => row.reverse());
    return m.reverse();
  };

  const playerReset = () => {
    const pieces = '1234567';
    state.current.player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    state.current.player.pos.y = 0;
    state.current.player.pos.x = (Math.floor(COLS / 2)) - (Math.floor(state.current.player.matrix[0].length / 2));
    
    if (collide(state.current.matrix, state.current.player)) {
      setGameOver(true);
      const currentHigh = parseInt(localStorage.getItem('tetris_highscore') || '0');
      if (score > currentHigh) localStorage.setItem('tetris_highscore', score.toString());
    }
  };

  const playerDrop = () => {
    state.current.player.pos.y++;
    if (collide(state.current.matrix, state.current.player)) {
      state.current.player.pos.y--;
      merge(state.current.matrix, state.current.player);
      playerReset();
      arenaSweep();
    }
    state.current.dropCounter = 0;
  };

  const playerMove = (offset) => {
    state.current.player.pos.x += offset;
    if (collide(state.current.matrix, state.current.player)) {
      state.current.player.pos.x -= offset;
    }
  };

  const playerRotate = (dir) => {
    const pos = state.current.player.pos.x;
    let offset = 1;
    state.current.player.matrix = rotate(state.current.player.matrix, dir);
    while (collide(state.current.matrix, state.current.player)) {
      state.current.player.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > state.current.player.matrix[0].length) {
        state.current.player.matrix = rotate(state.current.player.matrix, -dir);
        state.current.player.pos.x = pos;
        return;
      }
    }
  };

  const arenaSweep = () => {
    let rowCount = 1;
    outer: for (let y = ROWS - 1; y >= 0; --y) {
      for (let x = 0; x < COLS; ++x) {
        if (state.current.matrix[y][x] === 0) continue outer;
      }
      const row = state.current.matrix.splice(y, 1)[0].fill(0);
      state.current.matrix.unshift(row);
      ++y;
      setScore(s => {
        const newScore = s + rowCount * 100;
        const currentHigh = parseInt(localStorage.getItem('tetris_highscore') || '0');
        if (newScore > currentHigh) localStorage.setItem('tetris_highscore', newScore.toString());
        return newScore;
      });
      rowCount *= 2;
    }
  };

  const update = (time = 0) => {
    if(gameOver || !hasStarted) return;
    const deltaTime = time - state.current.lastTime;
    state.current.lastTime = time;
    
    state.current.dropCounter += deltaTime;
    if (state.current.dropCounter > state.current.dropInterval) {
      playerDrop();
    }
    draw();
    animationRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    const handleKey = (e) => {
      if(!hasStarted || gameOver) return;
      if (e.key === 'ArrowLeft') playerMove(-1);
      else if (e.key === 'ArrowRight') playerMove(1);
      else if (e.key === 'ArrowDown') playerDrop();
      else if (e.key === 'ArrowUp') playerRotate(1);
    };
    window.addEventListener('keydown', handleKey);
    if(hasStarted) {
      state.current.matrix = createMatrix(COLS, ROWS);
      setScore(0);
      setGameOver(false);
      playerReset();
      update();
    }
    return () => {
      window.removeEventListener('keydown', handleKey);
      cancelAnimationFrame(animationRef.current);
    };
  }, [hasStarted, gameOver, score]);

  return (
    <div className="flex flex-col items-center py-12 z-10 relative text-center">
      <h1 className="font-press-start text-3xl text-electric-blue text-shadow-neon mb-4">TETRIS</h1>
      <p className="text-white font-vt323 text-2xl mb-4">SCORE: {score}</p>
      
      <div className="relative glass-panel p-2 box-shadow-neon border-2 border-electric-blue">
        <canvas ref={canvasRef} width={COLS * BLOCK_SIZE} height={ROWS * BLOCK_SIZE} className="bg-[#0a0a1a] rounded" />
        
        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded">
            <button onClick={() => setHasStarted(true)} className="px-6 py-3 bg-electric-blue/30 border-2 border-electric-blue text-white font-press-start">START</button>
          </div>
        )}
        
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded">
            <h2 className="font-press-start text-2xl text-hot-pink mb-4">GAME OVER</h2>
            <button onClick={() => setHasStarted(false)} className="px-6 py-3 bg-white/30 border-2 border-white text-white font-press-start">TRY AGAIN</button>
          </div>
        )}
      </div>
      
      <Link to="/games" className="mt-8 text-gray-400 underline font-vt323 text-xl">Back</Link>
    </div>
  );
};
export default TetrisGame;
