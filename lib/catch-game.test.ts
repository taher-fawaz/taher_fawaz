import { test } from 'node:test'
import assert from 'node:assert/strict'
import { catchReducer, initialCatch, LANES, LIVES, ROUND_TICKS, ROWS, type CatchState } from './catch-game.ts'
import { FRAMES, SPRITE_H, SPRITE_W, toRuns } from './taher-sprite.ts'

const playing = (over: Partial<CatchState> = {}): CatchState => ({ ...initialCatch(), status: 'playing', ...over })
const quiet = { type: 'tick', roll: 0.99, lane: 0 } as const // a tick that spawns nothing

test('a bug landing in Taher’s lane is caught and he cheers', () => {
  const s = catchReducer(playing({ lane: 2, bugs: [{ id: 1, lane: 2, row: ROWS - 1 }] }), quiet)
  assert.equal(s.score, 1)
  assert.equal(s.lives, LIVES)
  assert.equal(s.bugs.length, 0)
  assert.equal(s.cheer, 3)
})

test('a bug landing in another lane costs a life; losing the last life ends the round', () => {
  let s = catchReducer(playing({ lane: 0, bugs: [{ id: 1, lane: 3, row: ROWS - 1 }] }), quiet)
  assert.equal(s.lives, LIVES - 1)
  s = catchReducer({ ...s, lives: 1, bugs: [{ id: 2, lane: 3, row: ROWS - 1 }] }, quiet)
  assert.equal(s.status, 'over')
  assert.equal(s.lives, 0)
})

test('bugs fall one row per tick and spawn only from the roll', () => {
  let s = catchReducer(playing({ ticks: 10 }), { type: 'tick', roll: 0, lane: 0.6 })
  assert.deepEqual(s.bugs.map((b) => [b.lane, b.row]), [[2, 0]])
  s = catchReducer(s, quiet)
  assert.deepEqual(s.bugs.map((b) => b.row), [1])
})

test('movement stays inside the lanes and is ignored when not playing', () => {
  assert.equal(catchReducer(playing({ lane: 0 }), { type: 'move', dir: -1 }).lane, 0)
  assert.equal(catchReducer(playing({ lane: LANES - 1 }), { type: 'move', dir: 1 }).lane, LANES - 1)
  assert.equal(catchReducer(initialCatch(), { type: 'move', dir: 1 }).lane, initialCatch().lane)
})

test('the round ends on time and keeps the best score', () => {
  const s = catchReducer(playing({ ticks: ROUND_TICKS - 1, score: 7, best: 4 }), quiet)
  assert.equal(s.status, 'over')
  assert.equal(s.best, 7)
  assert.equal(catchReducer(s, { type: 'start' }).best, 7)
})

test('every sprite frame is a full 16×24 grid of known colours', () => {
  for (const [name, rows] of Object.entries(FRAMES)) {
    assert.equal(rows.length, SPRITE_H, name)
    for (const r of rows) assert.equal(r.length, SPRITE_W, `${name}: ${r}`)
    assert.ok(toRuns(rows).length > 20, name)
  }
})
