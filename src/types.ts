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
  color: number, // hue (0-360); the client draws the player and their walls in it
  caught?: boolean, // turned into a bot; stays in the list so the sidebar can show them
  caughtAt?: number, // tick they were caught, to rank who lasted longest
  ready?: boolean, // ready to start, in the lobby
}

export type Cell = {
  type: number,  // one of CELL in constants.ts
  owner?: UUID,  // the player standing here, or who left this wall (or became this bot)
  facing?: Direction, // which way the player or bot here last moved
}

export type GameState = {
  mode: "LOBBY" | "PLAYING" | "OVER";
  tick: number;
  players: User[]
  board: Cell[][]
}

export type ClientMessage =
  | { type: 'join'; name: string }
  | { type: 'ready'; ready: boolean }
  | { type: 'restart' }
  | { type: 'input'; direction: Direction };

export type ServerMessage =
  | { type: 'joined'; id: string }   // sent once, so the client knows which player is them
  | { type: 'lobby'; gameState: GameState }
  | { type: 'update'; gameState: GameState }