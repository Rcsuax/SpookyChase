import { MIN_PLAYERS } from './../../constants'
import type { ClientMessage, GameState } from '../../types'
import { nameColor } from '../colors'

interface LobbyProps {
  myId: string | null,
  connected: boolean,
  gameState: GameState,
  send: (msg: ClientMessage) => void,
}

const Lobby = ({
  myId,
  connected,
  gameState,
  send,
}: LobbyProps) => {
  const { players } = gameState;
  const me = players.find((p) => p.id === myId)
  const readyCount = players.filter((p) => p.ready).length
  const needed = Math.max(0, MIN_PLAYERS - players.length)

  return (
    <div className="mx-auto max-w-md rounded-lg bg-[#1a1326] p-6">
      <h1 className="text-2xl font-bold text-white">🎃 Spooky Chase</h1>
      <p className="mt-2 flex items-center gap-2 text-sm text-gray-400">
        <span className={`size-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
        {connected ? 'Connected' : 'Disconnected'}
      </p>

      <h2 className="mt-6 font-semibold text-white">
        Lobby · {readyCount}/{players.length} ready
      </h2>
      <ul className="mt-3 space-y-2">
        {players.map((player) => (
          <li key={player.id} className="flex items-center justify-between rounded-md bg-black/30 px-3 py-2">
            <span className="font-semibold" style={{ color: nameColor(player.color) }}>
              {player.name}{player.id === myId && <span className="ml-1 text-gray-400">(you)</span>}
            </span>
            <span className={`text-sm ${player.ready ? 'text-green-400' : 'text-gray-500'}`}>
              {player.ready ? '✅ Ready' : '⏳ Not ready'}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => me && send({ type: 'ready', ready: !me.ready })}
        disabled={!me}
        className={`mt-6 w-full rounded-md px-4 py-2 font-semibold text-white disabled:opacity-50 ${
          me?.ready ? 'bg-gray-600 hover:bg-gray-500' : 'bg-orange-600 hover:bg-orange-500'
        }`}
      >
        {me?.ready ? 'Not ready' : "I'm ready"}
      </button>
      <p className="mt-3 text-center text-xs text-gray-400">
        {needed > 0
          ? `Waiting for ${needed} more ${needed === 1 ? 'player' : 'players'}`
          : 'The game starts when everyone is ready'}
      </p>
    </div>
  )
}

export default Lobby;
