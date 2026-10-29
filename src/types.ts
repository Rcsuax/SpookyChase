// Messages the client sends to the server
export type ClientMessage =
  | { type: 'join'; name: string }
  | { type: 'start' }
// | { type: 'input'; ... };

// Messages the server sends to clients
export type ServerMessage =
  | { type: 'lobby'; players: string[]; playing: boolean }
// | { type: 'state'; ... };
