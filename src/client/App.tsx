import { useEffect, useState } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import NameOverlay from './overlays/NameOverlay';
import GameOverOverlay from './overlays/GameOverOverlay';
import Lobby from './components/Lobby';
import Board from './components/Board';
import Sidebar from './components/Sidebar';




export default function App() {
  const { gameState, connected, myId, send } = useWebSocket();
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (name && connected) send({ type: 'join', name });
  }, [name, connected, send]);

  return (
    <main className="min-h-screen bg-[#141414] p-4 font-sans text-gray-100 md:p-8">
      {name === null && <NameOverlay onSubmit={setName} />}

      { gameState.mode === "LOBBY" ?
        <Lobby myId={myId} send={send} connected={connected} gameState={gameState} />
        :
        <div className="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-lg bg-[#07050b] md:flex-row">
          <div className="flex-1 p-4 md:p-8">
            <Board gameState = {gameState} send={send}/>
          </div>
          <Sidebar gameState={gameState} />
        </div>
      }

      {gameState.mode === "OVER" && <GameOverOverlay gameState={gameState} onRestart={() => send({ type: 'restart' })} />}
    </main>
  );
}
