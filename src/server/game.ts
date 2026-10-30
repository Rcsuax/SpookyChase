import { randomUUID, type UUID } from 'crypto'
import type WebSocket from 'ws'
import type { Direction, GameState, ServerMessage } from '../types.js'
import type { User, Position } from '../types.js'
import {MOVES , ROWS, COLS, TICK_LENGTH, DEFAULT_GAME_STATE, CELL, MIN_PLAYERS, createBoard } from '../constants.js'

const BOT_MOVE_EVERY = 2   // bot moves every Nth tick, so players can outrun it
const GOLDEN_ANGLE = 137.5  // stepping hues by this keeps each new colour far from the previous ones

class Game {
  private users = new Map<WebSocket, User>();
  private interval: NodeJS.Timeout | null = null;
  private prevTick = performance.now();
  private gameState: GameState = DEFAULT_GAME_STATE;
  private bots: Position[] = [];
  private tick = 0;
  private colorCount = 0;

  // Joining only adds you to the list; you get a position when a round starts
  addClient(ws: WebSocket, name: string) {
    if (this.users.has(ws)) return
    const color = (this.colorCount++ * GOLDEN_ANGLE) % 360
    const usr: User = { id: randomUUID(), name, color, ready: false }

    this.users.set(ws, usr)
    this.gameState.players.push(usr);
    ws.send(JSON.stringify({ type: 'joined', id: usr.id } satisfies ServerMessage))
    this.broadcastLobby()
  }

  removeClient(ws: WebSocket) {
    const usr = this.users.get(ws)
    if (!usr) return;

    // Caught players have no position but still need removing
    if (usr.position) this.gameState.board[usr.position.y][usr.position.x] = { type: CELL.EMPTY }
    this.users.delete(ws)
    this.gameState.players = this.gameState.players.filter((p) => p.id !== usr.id)

    if (this.gameState.mode === 'LOBBY') this.maybeStart()      // they may have been the last one not ready
    if (this.gameState.mode === 'PLAYING' && this.survivors() === 0) return this.endGame()
    this.broadcastLobby()
  }

  setReady(ws: WebSocket, ready: boolean) {
    const usr = this.users.get(ws)
    if (!usr || this.gameState.mode !== 'LOBBY') return
    usr.ready = ready
    if (!this.maybeStart()) this.broadcastLobby()
  }

  // Starts once there are enough players and all of them are ready
  private maybeStart(): boolean {
    const players = [...this.users.values()]
    if (players.length < MIN_PLAYERS || !players.every((p) => p.ready)) return false
    this.start()
    return true
  }

  private start() {
    if (this.gameState.mode === 'PLAYING') return
    this.gameState.mode = 'PLAYING'
    this.tick = 0
    this.gameState.tick = 0
    this.gameState.board = createBoard()
    this.bots = []

    for (const usr of this.users.values()) {
      Object.assign(usr, { caught: false, caughtAt: undefined, direction: undefined, ready: false })
      usr.position = this.randomEmptyCell() ?? undefined
      if (usr.position) this.gameState.board[usr.position.y][usr.position.x] = { type: CELL.PLAYER, owner: usr.id }
    }
    this.spawnBot()
    this.broadcastLobby()
    this.loop()
  }

  private endGame() {
    if (this.interval) clearInterval(this.interval);
    this.interval = null
    this.gameState.mode = 'OVER'
    this.broadcastLobby()
  }

  // From the game over screen: everyone back to the lobby, not ready, on an empty board
  restart() {
    if (this.gameState.mode !== 'OVER') return
    this.gameState.mode = 'LOBBY'
    this.gameState.board = createBoard()
    this.tick = 0
    this.gameState.tick = 0
    this.bots = []
    for (const usr of this.users.values()) {
      Object.assign(usr, { position: undefined, caught: false, caughtAt: undefined, direction: undefined, ready: false })
    }
    this.broadcastLobby()
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
    this.tick++
    this.gameState.tick = this.tick
    for (const usr of this.users.values()) {
      if (usr.direction) this.step(usr, usr.direction)
    }
    if (this.tick % BOT_MOVE_EVERY === 0) {
      // Only the bots that existed at the start of this tick move; anyone
      // caught this tick becomes a bot that starts moving next time
      const count = this.bots.length
      for (let i = 0; i < count; i++) this.moveBot(i)
    }
    if (this.survivors() === 0) return this.endGame()
    this.broadcastLobby()
  }

  private survivors() {
    return [...this.users.values()].filter((u) => u.position).length
  }

  private spawnBot() {
    const position = this.randomEmptyCell()
    if (!position) return
    this.bots.push(position)
    this.gameState.board[position.y][position.x] = { type: CELL.BOT }
  }

  // One step towards the nearest player, along whichever axis is further away.
  // Walls don't stop bots: moving onto one destroys it. Other bots do.
  private moveBot(index: number) {
    const bot = this.bots[index]
    const target = this.nearestPlayer(bot)
    if (!target) return

    const dx = target.x - bot.x
    const dy = target.y - bot.y
    const horizontal = Math.abs(dx) >= Math.abs(dy)
    const next = horizontal
      ? { x: bot.x + Math.sign(dx), y: bot.y }
      : { x: bot.x, y: bot.y + Math.sign(dy) }
    const facing: Direction = horizontal ? (dx > 0 ? 'RIGHT' : 'LEFT') : (dy > 0 ? 'DOWN' : 'UP')

    const cell = this.gameState.board[next.y][next.x]
    if (cell.type === CELL.BOT) return
    if (cell.type === CELL.PLAYER) {
      const caught = [...this.users.values()].find((u) => u.position?.x === next.x && u.position?.y === next.y)
      if (caught) this.onCatch(caught)
      return
    }

    const owner = this.gameState.board[bot.y][bot.x].owner      // set if this bot used to be a player
    this.gameState.board[bot.y][bot.x] = { type: CELL.EMPTY }
    this.gameState.board[next.y][next.x] = { type: CELL.BOT, owner, facing }   // replaces any wall, so it's destroyed
    this.bots[index] = next
  }

  private nearestPlayer(from: Position): Position | null {
    let nearest: Position | null = null
    let best = Infinity
    for (const usr of this.users.values()) {
      if (!usr.position) continue
      const distance = Math.abs(usr.position.x - from.x) + Math.abs(usr.position.y - from.y)
      if (distance < best) {
        best = distance
        nearest = usr.position
      }
    }
    return nearest
  }

  private onCatch(usr: User) {
    console.log('Bot caught', usr.name)
    // The player becomes a bot where they stood. With no position, nearestPlayer
    // skips them (so bots move on to the next person) and step() won't move them
    if (usr.position) {
      const { facing } = this.gameState.board[usr.position.y][usr.position.x]
      // Keeps owner so the client can ring the ghost in the player's colour
      this.gameState.board[usr.position.y][usr.position.x] = { type: CELL.BOT, owner: usr.id, facing }
      this.bots.push(usr.position)
    }
    usr.position = undefined
    usr.caught = true
    usr.caughtAt = this.tick
  }

  private broadcastLobby() {
    let msg = { type: 'lobby', gameState: this.gameState } as ServerMessage
    this.broadcast(msg);
  }

  private broadcast(message: ServerMessage) {
    const data = JSON.stringify(message)
    for (const ws of this.users.keys()) ws.send(data)
  }

  // Only records the direction; update() does the moving on the next tick
  setDirection(ws: WebSocket, d: Direction) {
    const usr = this.users.get(ws)
    if (usr) usr.direction = d
  }

  private step(usr: User, d: Direction) {
    if (!usr.position) return

    const x = usr.position.x + MOVES[d].x
    const y = usr.position.y + MOVES[d].y
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return   // off the board
    if (this.gameState.board[y][x].type !== CELL.EMPTY) return   // walls, players and the bot block players

    this.gameState.board[usr.position.y][usr.position.x] = { type: CELL.WALL, owner: usr.id }   // leave a wall behind
    this.gameState.board[y][x] = { type: CELL.PLAYER, owner: usr.id, facing: d }                // enter new cell
    usr.position = { x, y }
    usr.direction = undefined
  }

  private randomEmptyCell(): Position | null {
    const empty: Position[] = []
    this.gameState.board.forEach((cells, y) => {
      cells.forEach((cell, x) => {
        if (cell.type === CELL.EMPTY) empty.push({ x, y })
      })
    })
    if (empty.length === 0) return null
    return empty[Math.floor(Math.random() * empty.length)]
  }
}


export default Game;
