import { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction, GameStatus } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, GAME_CONFIG } from '../constants';

const getRandomPoint = (snake: Point[]): Point => {
  let newPoint: Point;
  while (true) {
    newPoint = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // Ensure food doesn't spawn on snake
    const onSnake = snake.some(s => s.x === newPoint.x && s.y === newPoint.y);
    if (!onSnake) break;
  }
  return newPoint;
};

export const useSnakeGame = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(Direction.UP);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snake-highscore');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Ref to track current direction to prevent multiple moves in one tick (180 deg turn glitch)
  const currentDirectionRef = useRef<Direction>(Direction.UP);

  const startGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(Direction.UP);
    currentDirectionRef.current = Direction.UP;
    setScore(0);
    setStatus(GameStatus.PLAYING);
    setFood(getRandomPoint(INITIAL_SNAKE));
  }, []);

  const changeDirection = useCallback((newDir: Direction) => {
    const currentDir = currentDirectionRef.current;
    
    // Prevent 180 degree turns
    const isOpposite = 
      (newDir === Direction.UP && currentDir === Direction.DOWN) ||
      (newDir === Direction.DOWN && currentDir === Direction.UP) ||
      (newDir === Direction.LEFT && currentDir === Direction.RIGHT) ||
      (newDir === Direction.RIGHT && currentDir === Direction.LEFT);

    if (!isOpposite) {
      setDirection(newDir);
    }
  }, []);

  useEffect(() => {
    if (status !== GameStatus.PLAYING) return;

    const tickRate = Math.max(50, GAME_CONFIG.initialSpeed - (score * GAME_CONFIG.speedIncrement));

    const gameLoop = setInterval(() => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };

        // Update ref to allow next input
        currentDirectionRef.current = direction;

        switch (direction) {
          case Direction.UP: newHead.y -= 1; break;
          case Direction.DOWN: newHead.y += 1; break;
          case Direction.LEFT: newHead.x -= 1; break;
          case Direction.RIGHT: newHead.x += 1; break;
        }

        // Check Wall Collision
        if (
          newHead.x < 0 || 
          newHead.x >= GRID_SIZE || 
          newHead.y < 0 || 
          newHead.y >= GRID_SIZE
        ) {
          setStatus(GameStatus.GAME_OVER);
          return prevSnake;
        }

        // Check Self Collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setStatus(GameStatus.GAME_OVER);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check Food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 1);
          setFood(getRandomPoint(newSnake));
          // Don't pop the tail, so snake grows
        } else {
          newSnake.pop(); // Remove tail
        }

        return newSnake;
      });
    }, tickRate);

    return () => clearInterval(gameLoop);
  }, [status, direction, food, score]);

  // Update high score when game over
  useEffect(() => {
    if (status === GameStatus.GAME_OVER) {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('snake-highscore', score.toString());
      }
    }
  }, [status, score, highScore]);

  return {
    snake,
    food,
    score,
    highScore,
    status,
    direction,
    startGame,
    changeDirection,
  };
};