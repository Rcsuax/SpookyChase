import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';



const PORT = process.env.PORT || 3000;
const app = express();
const server = createServer(app);

// Built React app from `npm run build`; in dev, the Vite server serves the client
app.use(express.static(fileURLToPath(new URL('../dist/public', import.meta.url))));
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', function connection(ws) {
    console.log('New client connected');
    
    ws.send('Welcome to the WebSocket server!');

    ws.on('message', function message(data) {
        const messageText = data.toString();
        console.log('Received:', messageText);
        ws.send(`Echo: ${messageText}`);
    });

    ws.on('close', function close() {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});