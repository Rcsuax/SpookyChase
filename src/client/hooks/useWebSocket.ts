import { useCallback, useEffect, useRef, useState } from 'react';
import type { ClientMessage, ServerMessage } from '../../types';

// Same host that served the page, so it works on any PORT
const wsURI = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`;

export function useWebSocket() {
  const [players, setPlayers] = useState<string[]>([]);
  const [playing, setPlaying] = useState(false);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket(wsURI);
    socketRef.current = websocket;

    websocket.addEventListener('open', () => setConnected(true));
    websocket.addEventListener('close', () => setConnected(false));
    websocket.addEventListener('message', (event) => {
      const msg: ServerMessage = JSON.parse(event.data);
      if (msg.type === 'lobby') {
        setPlayers(msg.players);
        setPlaying(msg.playing);
      }
    });

    return () => {
      setConnected(false);
      websocket.close();
    };
  }, []);

  const send = useCallback((msg: ClientMessage) => {
    socketRef.current?.send(JSON.stringify(msg));
  }, []);

  return { players, playing, connected, send };
}
