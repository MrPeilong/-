import React, { useEffect, useRef } from 'react';
import { useSnakeGame } from './hooks/useSnakeGame';
import GameBoard from './components/GameBoard';
import Controls from './components/Controls';
import AICommentary from './components/AICommentary';
import { Direction, GameStatus } from './types';
import { KEY_MAP } from './constants';

// Simple Audio Synthesizer
const playSound = (type: 'eat' | 'die') => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  if (type === 'eat') {
    // Retro high pitch ping
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } else if (type === 'die') {
    // Low crash sound
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }
};

const App: React.FC = () => {
  const { snake, food, score, highScore, status, direction, startGame, changeDirection } = useSnakeGame();
  
  // Refs to track previous values for sound triggers
  const prevScoreRef = useRef(score);
  const prevStatusRef = useRef(status);

  // Sound Effects Effect
  useEffect(() => {
    // Play eat sound
    if (score > prevScoreRef.current && score > 0) {
      playSound('eat');
    }
    prevScoreRef.current = score;

    // Play die sound
    if (status === GameStatus.GAME_OVER && prevStatusRef.current === GameStatus.PLAYING) {
      playSound('die');
    }
    prevStatusRef.current = status;
  }, [score, status]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const dirKey = KEY_MAP[e.key];
      if (dirKey) {
        e.preventDefault();
        changeDirection(Direction[dirKey as keyof typeof Direction]);
      } else if (e.code === 'Space' && status !== GameStatus.PLAYING) {
        e.preventDefault();
        startGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, startGame, status]);

  return (
    <div className="min-h-screen bg-neon-dark flex flex-col items-center justify-center p-4 font-mono relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-neon-dark to-black" />
      
      {/* Header */}
      <header className="z-10 w-full max-w-md flex justify-between items-end mb-6 border-b border-gray-800 pb-2">
        <div>
            <h1 className="text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue drop-shadow-[0_0_5px_rgba(57,255,20,0.5)]">
            SNAKE.AI
            </h1>
        </div>
        <div className="text-right">
            <div className="text-gray-400 text-xs">最高分</div>
            <div className="text-neon-blue text-xl font-bold">{highScore}</div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="z-10 relative flex flex-col items-center">
        
        {/* Score Display (Current) */}
        <div className="mb-4 flex items-center gap-2">
            <span className="text-gray-400 text-sm">得分:</span>
            <span className="text-neon-green text-3xl font-bold">{score}</span>
        </div>

        {/* Board */}
        <div className="relative">
            <GameBoard snake={snake} food={food} status={status} score={score} direction={direction} />
            
            {/* Overlays */}
            {status === GameStatus.IDLE && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">
                    <h2 className="text-white text-2xl font-bold mb-4 animate-pulse">准备开始</h2>
                    <button 
                        onClick={startGame}
                        className="pointer-events-auto bg-neon-green text-black px-6 py-2 rounded font-bold hover:bg-white transition-colors shadow-neon-green"
                    >
                        开始游戏
                    </button>
                    <p className="text-gray-400 text-xs mt-4">使用方向键或按钮控制</p>
                </div>
            )}

            {status === GameStatus.GAME_OVER && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">
                    <h2 className="text-red-500 text-4xl font-black mb-2 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">游戏结束</h2>
                    <button 
                        onClick={startGame}
                        className="pointer-events-auto mt-4 bg-neon-blue text-black px-8 py-3 rounded font-bold hover:bg-white transition-colors shadow-neon-blue"
                    >
                        再来一局
                    </button>
                 </div>
            )}
        </div>

        {/* AI Commentary Section */}
        <AICommentary status={status} score={score} />

        {/* Mobile Controls */}
        <div className="md:hidden">
            <Controls onMove={changeDirection} />
        </div>
        
        {/* Desktop Hint */}
        <div className="hidden md:block mt-8 text-gray-600 text-sm">
            按 <span className="text-gray-400 font-bold">空格键</span> 开始 / 重玩
        </div>

      </main>
      
      <footer className="mt-8 text-gray-700 text-xs z-10">
        Powered by React & Gemini 2.5 Flash
      </footer>
    </div>
  );
};

export default App;