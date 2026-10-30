import { randomUUID, type UUID } from 'crypto'
import type WebSocket from 'ws'
import type { Direction, GameState, ServerMessage } from '../types.js'
import type { User, Position } from '../types.js'
import {MOVES , ROWS, COLS, TICK_LENGTH, DEFAULT_GAME_STATE } from '../constants.js'

class Game {
  private gameState: GameState = DEFAULT_GAME_STATE;
  private users = new Map<WebSocket, User>();
  private interval: NodeJS.Timeout | null = null;
  private prevTick = performance.now();

  addClient(ws: WebSocket, name: string) {
    if (this.users.has(ws)) return
    const position = this.randomEmptyCell()
    if (!position) return 
    const usr = { id: randomUUID(), name, position }
    
    this.users.set(ws, usr)
    this.gameState.players.push(usr);
    this.gameState.board[usr.position.y][usr.position.x] = 1
    this.broadcastLobby()
  }

  removeClient(ws: WebSocket) {
    const usr = this.users.get(ws)
    if (!usr || !usr.position) return;
    
    this.gameState.board[usr.position.y][usr.position.x] = 0
    this.users.delete(ws)
    this.gameState.players = this.gameState.players.filter((p) => p.id !== usr.id)
    this.broadcastLobby()

    if(this.users.size === 0) {
      this.stop()
    }
  }

  start() {
    if (this.gameState.mode === 'PLAYING') return
    console.log("SRV: GAME START", performance.now())
    
    this.gameState.mode = 'PLAYING'
    this.broadcastLobby()
    this.loop()
  }

  stop() {
    console.log("SRV: GAME STOP", performance.now())
    
    this.gameState.mode = 'LOBBY'
    this.broadcastLobby()
    if(this.interval) clearInterval(this.interval);
  }
  
  loop = () => {
    this.prevTick = performance.now()
    this.interval = setInterval(() => {
      const now = performance.now()
      const delta = (now - this.prevTick) / 1000;
      this.prevTick = now
      
      this.update(delta)
      
      
      // console.log(
      //   'delta', delta.toFixed(4),
      //   '(target: ' + this.TICK_LENGTH + ' ms)',
      //   'late by', (delta * 1000 - this.TICK_LENGTH).toFixed(2), 
      //   'ms'
      // )
    }, TICK_LENGTH)
  }

  private update(dt: number) {
    for (const usr of this.users.values()) {
      if (usr.direction) this.step(usr, usr.direction)
    }
    this.broadcastLobby()
  }

  private broadcastLobby() {
    let msg = { type: 'lobby', gameState: this.gameState } as ServerMessage
    this.broadcast(msg);
  }

  private broadcast(message: ServerMessage) {
    const data = JSON.stringify(message)
    for (const ws of this.users.keys()) ws.send(data)
  }

  setDirection(ws: WebSocket, d: Direction) {
    const usr = this.users.get(ws)
    if (usr) usr.direction = d
  }

  private step(usr: User, d: Direction) {
    if (!usr.position) return

    const x = usr.position.x + MOVES[d].x
    const y = usr.position.y + MOVES[d].y
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return   // off the board

    this.gameState.board[usr.position.y][usr.position.x] = 0   // leave old cell
    this.gameState.board[y][x] = 1                             // enter new cell
    usr.position = { x, y }
    usr.direction = undefined
  }

  private randomEmptyCell(): Position | null {
    const empty: Position[] = []
    this.gameState.board.forEach((cells, y) => {
      cells.forEach((cell, x) => {
        if (cell === 0) empty.push({ x, y })
      })
    })
    if (empty.length === 0) return null
    return empty[Math.floor(Math.random() * empty.length)]
  }
}


export default Game;
