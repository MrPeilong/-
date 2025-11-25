import React, { useState } from 'react';
import { Direction } from '../types';

interface ControlsProps {
  onMove: (dir: Direction) => void;
}

const Controls: React.FC<ControlsProps> = ({ onMove }) => {
  const [activeBtn, setActiveBtn] = useState<Direction | null>(null);

  const handlePress = (e: React.PointerEvent, dir: Direction) => {
    e.preventDefault();
    onMove(dir);
    setActiveBtn(dir);
    
    // Reset visual state after a short delay to create a "pulse" effect
    setTimeout(() => {
      setActiveBtn(null);
    }, 150);
  };

  const getBtnClass = (dir: Direction) => {
    const base = "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-150 shadow-lg border border-gray-700 text-2xl select-none touch-manipulation";
    const isActive = activeBtn === dir;
    
    if (isActive) {
      // Active state: Neon blue, scaled down, glowing
      return `${base} bg-neon-blue text-black scale-90 shadow-[0_0_15px_#00ffff] border-neon-blue`;
    }
    
    // Default state: Gray, with standard active pseudo-class fallback
    return `${base} bg-gray-800 hover:bg-gray-700 active:bg-neon-blue active:text-black active:scale-95 active:border-neon-blue`;
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-6 select-none">
      <button 
        className={getBtnClass(Direction.UP)} 
        onPointerDown={(e) => handlePress(e, Direction.UP)}
        aria-label="Up"
      >
        ⬆️
      </button>
      <div className="flex gap-4">
        <button 
          className={getBtnClass(Direction.LEFT)} 
          onPointerDown={(e) => handlePress(e, Direction.LEFT)}
          aria-label="Left"
        >
          ⬅️
        </button>
        <button 
          className={getBtnClass(Direction.DOWN)} 
          onPointerDown={(e) => handlePress(e, Direction.DOWN)}
          aria-label="Down"
        >
          ⬇️
        </button>
        <button 
          className={getBtnClass(Direction.RIGHT)} 
          onPointerDown={(e) => handlePress(e, Direction.RIGHT)}
          aria-label="Right"
        >
          ➡️
        </button>
      </div>
    </div>
  );
};

export default Controls;