import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import GamesLibrary from './pages/GamesLibrary';
import Leaderboard from './pages/Leaderboard';
import Achievements from './pages/Achievements';
import SnakeGame from './games/snake/SnakeGame';
import PongGame from './games/pong/PongGame';
import TetrisGame from './games/tetris/TetrisGame';
import FlappyGame from './games/flappy/FlappyGame';
import InvadersGame from './games/invaders/InvadersGame';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/games" element={<GamesLibrary />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/games/snake" element={<SnakeGame />} />
            <Route path="/games/pong" element={<PongGame />} />
            <Route path="/games/tetris" element={<TetrisGame />} />
            <Route path="/games/flappy" element={<FlappyGame />} />
            <Route path="/games/invaders" element={<InvadersGame />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
