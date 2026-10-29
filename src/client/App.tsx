import { useEffect, useState } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import NameOverlay from './overlays/NameOverlay';
import { MIN_PLAYERS } from './../constants'



export default function App() {
  const { players, connected, send } = useWebSocket();
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (name && connected) send({ type: 'join', name });
  }, [name, connected, send]);

  return (
    <main className="mx-auto my-8 max-w-3xl px-4 font-sans">
      {name === null && <NameOverlay onSubmit={setName} />}
      
      <h1 className="text-3xl font-bold">Chase</h1>
      
      {name && <p className="mt-1 text-gray-700">Hi, {name}</p>}
      
      <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
        <span className={`size-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
        {connected ? 'Connected' : 'Disconnected'}
      </p>

        <>
          <h2 className="mt-6 font-semibold">Lobby ({players.length})</h2>
          <ul className="mt-2 space-y-1">
            {players.map((player, i) => (
              <li key={i}>{player}</li>
            ))}
          </ul>
          <button
            onClick={() => send({ type: 'start' })}
            disabled={players.length < MIN_PLAYERS}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {players.length < MIN_PLAYERS ? `Need ${MIN_PLAYERS} players to start` : 'Start game'}
          </button>
        </>
    </main>
  );
}
