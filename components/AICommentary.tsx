import React, { useEffect, useState } from 'react';
import { GameStatus } from '../types';
import { getGameCommentary } from '../services/geminiService';

interface AICommentaryProps {
  status: GameStatus;
  score: number;
}

const AICommentary: React.FC<AICommentaryProps> = ({ status, score }) => {
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === GameStatus.GAME_OVER) {
      setLoading(true);
      getGameCommentary(score)
        .then(text => {
          setComment(text);
          setLoading(false);
        });
    } else if (status === GameStatus.PLAYING) {
      setComment("");
    }
  }, [status, score]);

  if (status !== GameStatus.GAME_OVER) return null;

  return (
    <div className="mt-4 p-4 bg-gray-900/80 border border-neon-pink/50 rounded-lg max-w-sm w-full mx-auto text-center min-h-[80px] flex items-center justify-center flex-col shadow-neon-pink">
      <h3 className="text-neon-pink text-xs uppercase tracking-widest font-bold mb-1">AI 解说员</h3>
      {loading ? (
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-neon-pink rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 bg-neon-pink rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-neon-pink rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      ) : (
        <p className="text-white font-mono text-sm md:text-base italic">
          "{comment}"
        </p>
      )}
    </div>
  );
};

export default AICommentary;