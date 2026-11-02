// "Catch the bugs": pure game logic for the handheld (no React, no randomness inside — tests pass it in).
// Bugs fall down 4 lanes; Taher stands at the bottom and catches the ones that land in his lane.

export const LANES = 4
export const ROWS = 6
export const TICK_MS = 330
export const ROUND_TICKS = 91 // about 30 seconds
export const LIVES = 5

export type Bug = { id: number; lane: number; row: number }
export type CatchState = {
  status: 'ready' | 'playing' | 'over'
  lane: number
  bugs: Bug[]
  score: number
  best: number
  lives: number
  ticks: number
  nextId: number
  /** Ticks left of the cheer pose after a catch. */
  cheer: number
}
export type CatchAction =
  | { type: 'start' }
  | { type: 'stop' }
  | { type: 'move'; dir: -1 | 1 }
  | { type: 'goto'; lane: number }
  /** `roll` and `lane` are random numbers in [0, 1) supplied by the caller. */
  | { type: 'tick'; roll: number; lane: number }

export const initialCatch = (best = 0): CatchState => ({ status: 'ready', lane: 1, bugs: [], score: 0, best, lives: LIVES, ticks: 0, nextId: 1, cheer: 0 })

const clampLane = (l: number) => Math.min(LANES - 1, Math.max(0, l))

export function catchReducer(s: CatchState, a: CatchAction): CatchState {
  switch (a.type) {
    case 'start':
      return { ...initialCatch(s.best), status: 'playing', lane: s.lane }
    case 'stop':
      return s.status === 'playing' ? { ...s, status: 'ready', bugs: [] } : s
    case 'move':
      return s.status === 'playing' ? { ...s, lane: clampLane(s.lane + a.dir) } : s
    case 'goto':
      return s.status === 'playing' ? { ...s, lane: clampLane(a.lane) } : s
    case 'tick': {
      if (s.status !== 'playing') return s
      const ticks = s.ticks + 1
      const moved = s.bugs.map((b) => ({ ...b, row: b.row + 1 }))
      const landed = moved.filter((b) => b.row >= ROWS)
      const caught = landed.filter((b) => b.lane === s.lane).length
      const missed = landed.length - caught
      let bugs = moved.filter((b) => b.row < ROWS)
      let nextId = s.nextId
      // Spawn more often as the round goes on, never two bugs on top of each other.
      const chance = ticks < 4 ? 0 : 0.3 + ticks / 260
      const lane = Math.floor(a.lane * LANES)
      if (a.roll < chance && !bugs.some((b) => b.lane === lane && b.row === 0)) {
        bugs = [...bugs, { id: nextId, lane, row: 0 }]
        nextId++
      }
      const score = s.score + caught
      const lives = s.lives - missed
      const over = lives <= 0 || ticks >= ROUND_TICKS
      return {
        ...s,
        ticks,
        bugs: over ? [] : bugs,
        nextId,
        score,
        lives: Math.max(0, lives),
        cheer: caught ? 3 : Math.max(0, s.cheer - 1),
        status: over ? 'over' : 'playing',
        best: over ? Math.max(s.best, score) : s.best,
      }
    }
  }
}

export const secondsLeft = (s: CatchState) => Math.max(0, Math.ceil(((ROUND_TICKS - s.ticks) * TICK_MS) / 1000))
