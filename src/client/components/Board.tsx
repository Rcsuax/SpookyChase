import { useEffect, useRef, useCallback } from 'react';
import { ROWS, COLS } from '../../constants';
import { ClientMessage, Direction, GameState, Position } from '../../types';
import useKeyboardInputs from '../hooks/useKeyboardInputs';

const CELL_SIZE = 100
const WIDTH = COLS * CELL_SIZE;
const HEIGHT = ROWS * CELL_SIZE; 

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

    for(let row = 0; row < gameState.board.length; row++) {
      for(let col = 0; col < gameState.board.length; col++) {
        if(gameState.board[row][col] === 1) {
          drawCell(ctx, { x: col * CELL_SIZE, y: row * CELL_SIZE})
        }
      }
    }
    // drawCell(ctx, { x: 0, y: 0 })
    drawGrid(ctx);
  }, [gameState])

  return (
    <canvas
      ref={canvasRef}
      className="mt-6"
      style={{ width: WIDTH, maxWidth: '100%', aspectRatio: `${WIDTH} / ${HEIGHT}` }}
    >
    </canvas>
  )
}

function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.beginPath()
  for (let x = 0; x <= WIDTH; x += CELL_SIZE) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, HEIGHT)
  }
  for (let y = 0; y <= HEIGHT; y += CELL_SIZE) {
    ctx.moveTo(0, y)
    ctx.lineTo(WIDTH, y)
  }
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 2
  ctx.stroke()
}

function drawCell(ctx: CanvasRenderingContext2D, p: Position) {
  ctx.fillStyle = 'red';
  ctx.fillRect(p.x, p.y, CELL_SIZE, CELL_SIZE);
}


export default Board
