import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import Game from './game.js';
import type { ClientMessage, Direction } from '../types.js';
import { DIRECTIONS } from '../constants.js';

const PORT = process.env.PORT || 3000;
const app = express();
const server = createServer(app);

app.use(express.static(fileURLToPath(new URL('../../dist/public', import.meta.url))));
const wss = new WebSocketServer({ server, path: '/ws' });
const game = new Game();

wss.on('connection', function connection(ws) {
  console.log('New client connected');
  game.addClient(ws, "TEST");
  game.start();

  ws.on('message', function message(data) {
      const msg = parseMessage(data.toString());
      if (!msg) return;

      console.log("MSG: ", msg)

      // if (msg.type === 'join') {
      //   game.addClient(ws, msg.name);
      // } else if (msg.type === 'start') {
      //   game.start();
      // }
      if(msg.type === 'input') {
        game.moveDirection(ws, msg.direction)
      }
  });

  ws.on('error', function error(err) {
    console.error('Socket error:', err);
  });

  ws.on('close', function close() {
    console.log('Client disconnected');
    game.removeClient(ws);
  });
});



function parseMessage(text: string): ClientMessage | null {
  let msg: unknown;
  try {
    msg = JSON.parse(text);
  } catch {
    return null;
  }
  if (typeof msg !== 'object' || msg === null || !('type' in msg)) return null;

  const MAX_NAME_LENGTH = 20;
  if (msg.type === 'join' && 'name' in msg && typeof msg.name === 'string') {
    const name = msg.name.trim();
    if (!name || name.length > MAX_NAME_LENGTH) return null;
    return { type: 'join', name };
  }

  if (msg.type === 'start') {
    return { type: 'start' };
  }

  if(msg.type === 'input' && 'direction' in msg && typeof msg.direction === 'string') {
    if (!DIRECTIONS.includes(msg.direction as Direction)) {
      return null;
    }
    return { type: 'input', direction: msg.direction as Direction};
  }
    
  return null;
}

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});