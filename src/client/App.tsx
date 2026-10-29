import { useEffect, useState } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import NameOverlay from './overlays/NameOverlay';
import Lobby from './components/Lobby';
import Board from './components/Board';




export default function App() {
  const { playing, players, connected, send } = useWebSocket();
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (name && connected) send({ type: 'join', name });
  }, [name, connected, send]);

  useEffect(() => {
    console.log("PLAYING")
  }, [playing])

  return (
    <main className="mx-auto my-8 max-w-4xl px-4 font-sans">
      {name === null && <NameOverlay onSubmit={setName} />}
      
      <h1 className="text-3xl font-bold">Chase</h1>
      { playing ? 
        <Board />
        :  
        <Lobby players={players} name={name} send={send} connected={connected} />
      }
    </main>
  );
}
