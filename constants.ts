import { SnakeConf } from './types';

export const GRID_SIZE = 20; // 20x20 grid

export const GAME_CONFIG: SnakeConf = {
  gridSize: GRID_SIZE,
  initialSpeed: 150,
  speedIncrement: 2,
};

export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
]; // Head is at index 0

export const KEY_MAP: Record<string, string> = {
  ArrowUp: 'UP',
  w: 'UP',
  ArrowDown: 'DOWN',
  s: 'DOWN',
  ArrowLeft: 'LEFT',
  a: 'LEFT',
  ArrowRight: 'RIGHT',
  d: 'RIGHT',
};