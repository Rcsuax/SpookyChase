import { useEffect, useRef, useCallback } from 'react';
import { ROWS, COLS, CELL } from '../../constants';
import type { Cell, ClientMessage, Direction, GameState, User } from '../../types';
import useKeyboardInputs from '../hooks/useKeyboardInputs';
import { BOARD_DARK, BOARD_LIGHT, UNOWNED_WALL_COLOR, playerColor, wallColor } from '../colors';

const CELL_SIZE = 100
const WIDTH = COLS * CELL_SIZE;
const HEIGHT = ROWS * CELL_SIZE;

const ARROWS: Record<Direction, string> = { UP: '↑', DOWN: '↓', LEFT: '←', RIGHT: '→' }

type BoardProps = {
  gameState: GameState
  send: (msg: ClientMessage) => void;
}

const Board = ({ gameState, send }: BoardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const sendDirection = useCallback((direction: Direction) => {
    send({ 'type': 'input', direction })
  }, [send]);

  useKeyboardInputs(sendDirection);

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = WIDTH * dpr
    canvas.height = HEIGHT * dpr
    ctx.scale(dpr, dpr)

    const players = new Map(gameState.players.map((p) => [p.id, p]))
    for (let row = 0; row < gameState.board.length; row++) {
      for (let col = 0; col < gameState.board[row].length; col++) {
        const cell = gameState.board[row][col]
        const owner = cell.owner ? players.get(cell.owner) : undefined
        drawCell(ctx, col * CELL_SIZE, row * CELL_SIZE, (row + col) % 2 === 0, cell, owner)
      }
    }
  }, [gameState])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', aspectRatio: `${WIDTH} / ${HEIGHT}` }}
    >
    </canvas>
  )
}

function drawCell(ctx: CanvasRenderingContext2D, x: number, y: number, dark: boolean, cell: Cell, owner?: User) {
  ctx.fillStyle = dark ? BOARD_DARK : BOARD_LIGHT
  ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE)

  const cx = x + CELL_SIZE / 2
  const cy = y + CELL_SIZE / 2

  if (cell.type === CELL.WALL) {
    ctx.fillStyle = owner ? wallColor(owner.color) : UNOWNED_WALL_COLOR
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE)
  } else if (cell.type === CELL.PLAYER && owner) {
    // Coloured token with the player's initial
    ctx.beginPath()
    ctx.arc(cx, cy, CELL_SIZE * 0.36, 0, Math.PI * 2)
    ctx.fillStyle = playerColor(owner.color)
    ctx.fill()
    drawText(ctx, owner.name.charAt(0).toUpperCase(), cx, cy, `bold ${CELL_SIZE * 0.36}px system-ui, sans-serif`, '#111')
  } else if (cell.type === CELL.BOT) {
    if (owner) {
      // A caught player: ghost, ringed in their colour
      ctx.beginPath()
      ctx.arc(cx, cy, CELL_SIZE * 0.4, 0, Math.PI * 2)
      ctx.strokeStyle = playerColor(owner.color)
      ctx.lineWidth = CELL_SIZE * 0.04
      ctx.stroke()
    }
    drawText(ctx, owner ? '👻' : '🎃', cx, cy + CELL_SIZE * 0.03, `${CELL_SIZE * 0.6}px system-ui, sans-serif`, '#fff')
  }

  if (cell.facing && (cell.type === CELL.PLAYER || cell.type === CELL.BOT)) {
    drawText(ctx, ARROWS[cell.facing], x + CELL_SIZE * 0.84, y + CELL_SIZE * 0.16, `bold ${CELL_SIZE * 0.24}px system-ui, sans-serif`, 'rgba(255,255,255,0.85)')
  }
}

function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, font: string, color: string) {
  ctx.font = font
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x, y)
}


export default Board
