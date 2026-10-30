// import type { UUID } from 'crypto'
// redefine type as it shared across client and server
type UUID = `${string}-${string}-${string}-${string}-${string}`;

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT"

export type Position = {
  x: number,
  y: number,
}
export type User = {
  id: UUID,
  name: string,
  position?: Position,
  direction?: Direction,
}

// export type Cell = {
  
// }

export type GameState = {
  mode: "LOBBY" | "PLAYING";
  players: User[]
  board: number[][]
}

export type ClientMessage =
  | { type: 'join'; name: string }
  | { type: 'start' }
  | { type: 'input'; direction: Direction };

export type ServerMessage =
  | { type: 'lobby'; gameState: GameState }
  | { type: 'update'; gameState: GameState }