import React, { useEffect, useState } from 'react';
import { Point, GameStatus, Direction } from '../types';
import { GRID_SIZE } from '../constants';

interface GameBoardProps {
  snake: Point[];
  food: Point;
  status: GameStatus;
  score: number;
  direction: Direction;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

const GameBoard: React.FC<GameBoardProps> = ({ snake, food, status, score, direction }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  // Particle Effect Logic
  useEffect(() => {
    if (score > 0 && status === GameStatus.PLAYING) {
      // Spawn particles at snake head (where food was)
      const head = snake[0];
      const newParticles: Particle[] = [];
      for (let i = 0; i < 8; i++) {
        newParticles.push({
          id: Date.now() + i,
          x: head.x * 100 + 50, // relative percentage base approx
          y: head.y * 100 + 50, 
          vx: (Math.random() - 0.5) * 2, // Random velocity
          vy: (Math.random() - 0.5) * 2,
          color: Math.random() > 0.5 ? '#39ff14' : '#ff00ff', // Green or Pink
        });
      }
      setParticles(prev => [...prev, ...newParticles]);

      // Cleanup particles after animation
      setTimeout(() => {
        setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
      }, 600);
    }
  }, [score]); // Trigger when score changes

  // Helper to determine eyes position based on direction
  const getEyeStyles = (dir: Direction) => {
    // Returns absolute positions for two eyes
    // eyes are small dots
    const common = "absolute w-1.5 h-1.5 bg-black rounded-full shadow-[0_0_2px_#39ff14]";
    switch(dir) {
        case Direction.UP:
            return [
                `${common} top-1 left-1`,
                `${common} top-1 right-1`
            ];
        case Direction.DOWN:
             return [
                `${common} bottom-1 left-1`,
                `${common} bottom-1 right-1`
            ];
        case Direction.LEFT:
             return [
                `${common} top-1 left-1`,
                `${common} bottom-1 left-1`
            ];
        case Direction.RIGHT:
             return [
                `${common} top-1 right-1`,
                `${common} bottom-1 right-1`
            ];
        default: 
            return [`${common} top-1 left-1`, `${common} top-1 right-1`];
    }
  };

  // Create a flattened array representing the grid
  const cells = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
    const x = i % GRID_SIZE;
    const y = Math.floor(i / GRID_SIZE);
    return { x, y };
  });

  return (
    <div 
      className="relative bg-neon-grid rounded-xl shadow-2xl overflow-hidden border-4 border-gray-800"
      style={{
        width: 'min(90vw, 400px)',
        height: 'min(90vw, 400px)',
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
      }}
    >
      {cells.map((cell) => {
        const isSnakeHead = snake[0].x === cell.x && snake[0].y === cell.y;
        const isSnakeBody = !isSnakeHead && snake.some(s => s.x === cell.x && s.y === cell.y);
        const isFood = food.x === cell.x && food.y === cell.y;

        // Base cell styles
        let content = null;
        let cellClass = "w-full h-full border border-white/5 relative flex items-center justify-center ";
        
        if (isSnakeHead) {
          // Head with eyes
          const [eye1, eye2] = getEyeStyles(direction);
          content = (
            <div className={`w-[95%] h-[95%] bg-neon-green rounded-md shadow-[0_0_15px_#39ff14] z-10 relative ${status === GameStatus.GAME_OVER ? 'bg-red-500 shadow-none' : ''}`}>
               <div className={eye1} />
               <div className={eye2} />
            </div>
          );
        } else if (isSnakeBody) {
          // Body segment
           content = (
            <div className={`w-[90%] h-[90%] bg-neon-green/80 rounded-sm shadow-[0_0_5px_rgba(57,255,20,0.5)] ${status === GameStatus.GAME_OVER ? 'bg-red-500/80 animate-pulse' : ''}`} />
          );
        } else if (isFood) {
          // Styled Neon Apple/Fruit
          content = (
             <div className="relative w-full h-full flex items-center justify-center animate-pulse">
                {/* Fruit Body */}
                <div className="w-[75%] h-[75%] bg-neon-pink rounded-full shadow-[0_0_15px_#ff00ff]" />
                {/* Stem/Leaf */}
                <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-tr-lg" />
             </div>
          );
        }

        return (
            <div key={`${cell.x}-${cell.y}`} className={cellClass}>
                {content}
            </div>
        );
      })}

      {/* Particle Rendering Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => {
          // Calculate percentage position based on grid logic
          const left = (p.x / 100 / GRID_SIZE) * 100; 
          const top = (p.y / 100 / GRID_SIZE) * 100;
          
          return (
            <div
              key={p.id}
              className="absolute w-2 h-2 rounded-full animate-ping"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                backgroundColor: p.color,
                transform: `translate(${p.vx * 20}px, ${p.vy * 20}px)`,
                opacity: 0,
                transition: 'all 0.5s ease-out'
              }} 
            />
          );
        })}
      </div>

      {status !== GameStatus.PLAYING && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20 backdrop-blur-sm">
           {/* Overlay content handled by parent to keep board pure */}
        </div>
      )}
    </div>
  );
};

export default GameBoard;