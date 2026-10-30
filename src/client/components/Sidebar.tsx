import type { GameState, User } from '../../types';
import { nameColor } from '../colors';

type SidebarProps = {
  gameState: GameState
}

const Sidebar = ({ gameState }: SidebarProps) => {
  // Players who joined mid-round have no position until the next round starts
  const survivors = gameState.players.filter((p) => p.position).length
  const icon = (p: User) => p.caught ? '👻' : p.position ? '🏃' : '⏳'

  return (
    <aside className="bg-[#1a1326] p-5 text-sm md:w-60 md:shrink-0">
      <h2 className="text-base font-bold text-white">🎃 Spooky Chase</h2>
      <p className="mt-1 text-xs text-gray-400">
        Tick {gameState.tick} · {survivors} {survivors === 1 ? 'survivor' : 'survivors'} left
      </p>
      <ul className="mt-4 space-y-1.5">
        {gameState.players.map((player) => (
          <li
            key={player.id}
            className={`font-semibold ${player.caught ? 'line-through opacity-60' : ''}`}
            style={{ color: nameColor(player.color) }}
          >
            {icon(player)} {player.name}
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar
