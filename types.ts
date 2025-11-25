export interface Point {
  x: number;
  y: number;
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
}

export interface GameState {
  snake: Point[];
  food: Point;
  score: number;
  status: GameStatus;
  direction: Direction;
  highScore: number;
}

export interface SnakeConf {
  gridSize: number;
  initialSpeed: number;
  speedIncrement: number; // ms to subtract per food
}