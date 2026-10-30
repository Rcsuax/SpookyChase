import { useEffect, useState } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import NameOverlay from './overlays/NameOverlay';
import Lobby from './components/Lobby';
import Board from './components/Board';




export default function App() {
  const { gameState, connected, send } = useWebSocket();
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (name && connected) send({ type: 'join', name });
  }, [name, connected, send]);

  return (
    <main className="mx-auto my-8 max-w-4xl px-4 font-sans">
      {/* {name === null && <NameOverlay onSubmit={setName} />} */}
      
      <h1 className="text-3xl font-bold">Chase</h1>
      {/* { gameState.mode === "LOBBY" ?  */}
      { false? 
        <Lobby name={name} send={send} connected={connected} gameState={gameState} />
        :  
        <Board gameState = {gameState} send={send}/>
      }
    </main>
  );
}
