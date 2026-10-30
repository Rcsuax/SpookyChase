import { Direction, GameState, Position } from "./types.js";

export const MIN_PLAYERS = 1;
export const COLS = 20
export const ROWS = 20
export const CELL_SIZE = 60
export const DIRECTIONS: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
export const MOVES: Record<Direction, Position> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
}

export const DEFAULT_GAME_STATE: GameState = {
  mode: "LOBBY",
  board: Array.from({ length: ROWS }, () => Array(COLS).fill(0)),
  // board: [
  //   [0,1,0,0],
  //   [0,0,0,0],
  //   [0,0,0,0],
  //   [0,0,0,0],
  // ],
  players: []
};


export const ONE_SEC = 1000;
export const HALF_SEC = ONE_SEC / 2;
export const TICK_LENGTH = 150;