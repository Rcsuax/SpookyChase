import { useEffect, useRef } from 'react'

const WIDTH = 800
const HEIGHT = 500
const CELL_SIZE = 100

const Board = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // Draw at device resolution so it stays sharp on high-DPI screens
    const dpr = window.devicePixelRatio || 1
    canvas.width = WIDTH * dpr
    canvas.height = HEIGHT * dpr
    ctx.scale(dpr, dpr)

    drawGrid(ctx)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="mt-6 rounded-lg bg-gray-50 outline outline-gray-300"
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

export default Board
