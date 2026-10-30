import { useCallback, useEffect, useRef, useState } from 'react';
import { type ClientMessage, type ServerMessage, GameState } from '../../types';
import { DEFAULT_GAME_STATE } from '../../constants';

const wsURI = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`;

export function useWebSocket() {
  const [gameState, setGameState] = useState<GameState>(DEFAULT_GAME_STATE)
  const [connected, setConnected] = useState(false);
  const [myId, setMyId] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket(wsURI);
    socketRef.current = websocket;

    websocket.addEventListener('open', () => setConnected(true));
    websocket.addEventListener('close', () => setConnected(false));
    websocket.addEventListener('message', (event) => {
      const msg: ServerMessage = JSON.parse(event.data);
      console.log(gameState)
      if (msg.type === 'joined') setMyId(msg.id);
      else setGameState(msg.gameState);
    });

    return () => {
      setConnected(false);
      websocket.close();
    };
  }, []);

  const send = useCallback((msg: ClientMessage) => {
    console.log(msg)
    socketRef.current?.send(JSON.stringify(msg));
  }, []);

  return { connected, gameState, myId, send };
}
