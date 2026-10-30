import { MIN_PLAYERS } from './../../constants'
import type { ClientMessage, GameState } from '../../types'

interface LobbyProps {
  name: string | null,
  connected: boolean,
  gameState: GameState,
  send: (msg: ClientMessage) => void,
}

const Lobby = ({
  name,
  connected,
  gameState,
  send,
}: LobbyProps) => {
  const { players } = gameState;

  return (
    <>
      {name && <p className="mt-1 text-gray-700">Hi, {name}</p>}
      
      <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
        <span className={`size-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
        {connected ? 'Connected' : 'Disconnected'}
      </p>
        <h2 className="mt-6 font-semibold">Lobby ({ players.length })</h2>
        <ul className="mt-2 space-y-1">
          {players.map((player, i) => (
            <li key={i}>{player.name}</li>
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
  )
}

export default Lobby;