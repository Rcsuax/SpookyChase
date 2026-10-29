import { randomUUID, type UUID } from 'crypto'
import type WebSocket from 'ws'
import type { ServerMessage } from '../types.js'

const TICK_RATE = 20              // ticks per second
const DT = 1 / TICK_RATE          // seconds per tick

export type User = {
  id: UUID,
  name: string,
}

class Game {
  state: "LOBBY" | "PLAYING" = "LOBBY"
  private users = new Map<WebSocket, User>()
  private interval: NodeJS.Timeout | null = null

  addClient(ws: WebSocket, name: string) {
    if (this.users.has(ws)) return
    this.users.set(ws, { id: randomUUID(), name })
    this.broadcastLobby()
  }

  removeClient(ws: WebSocket) {
    if (this.users.delete(ws)) this.broadcastLobby()
  }

  start() {
    if (this.state === 'PLAYING') return
    this.state = 'PLAYING'
    this.interval = setInterval(() => this.loop(), 1000 / TICK_RATE)
    this.broadcastLobby()
  }

  stop() {
    if (this.interval) clearInterval(this.interval)
    this.interval = null
    this.state = 'LOBBY'
    this.broadcastLobby()
  }

  private loop() {
    this.update(DT)
    // TODO: broadcast game state
  }

  private update(dt: number) {
    // TODO: game logic, using dt (seconds) so speeds are per second
  }

  private broadcastLobby() {
    const players = [...this.users.values()].map((user) => user.name)
    this.broadcast({ type: 'lobby', players, playing: this.state === 'PLAYING' })
  }

  private broadcast(message: ServerMessage) {
    const data = JSON.stringify(message)
    for (const ws of this.users.keys()) ws.send(data)
  }
}

export default Game;
