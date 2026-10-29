import { useCallback, useEffect, useRef, useState } from 'react';

// Same host that served the page, so it works on any PORT
const wsURI = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`;

export function useWebSocket() {
    const [messages, setMessages] = useState<string[]>([]);
    const [connected, setConnected] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);

    const addMessage = useCallback((text: string) => {
        setMessages((prev) => [...prev, text]);
    }, []);

    useEffect(() => {
        const websocket = new WebSocket(wsURI);
        socketRef.current = websocket;

        websocket.addEventListener('open', () => setConnected(true));
        websocket.addEventListener('message', (event) => addMessage(`Received: ${event.data}`));
        websocket.addEventListener('close', () => setConnected(false));

        return () => websocket.close();
    }, [addMessage]);

    const send = useCallback((text: string) => {
        socketRef.current?.send(text);
        addMessage(`Sent: ${text}`);
    }, [addMessage]);

    return { messages, connected, send };
}
