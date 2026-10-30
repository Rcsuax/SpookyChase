import type { GameState } from '../../types'
import { nameColor } from '../colors'

type Props = {
  gameState: GameState
  onRestart: () => void
}

export default function GameOverOverlay({ gameState, onRestart }: Props) {
  // Last caught lasted longest. Players who joined mid-round were never caught, so they're left out
  const ranked = gameState.players
    .filter((p) => p.caughtAt !== undefined)
    .sort((a, b) => b.caughtAt! - a.caughtAt!)
  const winner = ranked[0]

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm rounded-lg bg-[#1a1326] p-6 text-center shadow-xl">
        <p className="text-4xl">👻</p>
        <h2 className="mt-2 text-2xl font-bold text-white">Game over</h2>
        {winner && (
          <p className="mt-2 text-gray-300">
            <span className="font-semibold" style={{ color: nameColor(winner.color) }}>{winner.name}</span>
            {' '}survived longest
          </p>
        )}

        <ol className="mt-5 space-y-1 text-left text-sm">
          {ranked.map((player, i) => (
            <li key={player.id} className="flex justify-between rounded-md bg-black/30 px-3 py-1.5">
              <span style={{ color: nameColor(player.color) }}>{i + 1}. {player.name}</span>
              <span className="text-gray-400">tick {player.caughtAt}</span>
            </li>
          ))}
        </ol>

        <button
          onClick={onRestart}
          className="mt-6 w-full rounded-md bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-500"
        >
          Back to lobby
        </button>
      </div>
    </div>
  )
}
