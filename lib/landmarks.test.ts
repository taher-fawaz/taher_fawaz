import { test } from 'node:test'
import assert from 'node:assert/strict'
import { assignLandmarks, cityOf, LANDMARK_H, LANDMARK_PALETTE, LANDMARK_W, LANDMARKS } from './landmarks.ts'

test('every landmark is a full 16×20 grid of known colours', () => {
  for (const [name, rows] of Object.entries(LANDMARKS)) {
    assert.equal(rows.length, LANDMARK_H, name)
    for (const r of rows) {
      assert.equal(r.length, LANDMARK_W, `${name}: ${r}`)
      for (const ch of r) assert.ok(ch === '.' || ch in LANDMARK_PALETTE, `${name}: unknown colour ${ch}`)
    }
  }
})

test('cities are recognised in English and Arabic', () => {
  assert.equal(cityOf('Maadi, Cairo, Egypt'), 'cairo')
  assert.equal(cityOf('5th Settlement, Cairo, Egypt'), 'cairo')
  assert.equal(cityOf('دبي، الإمارات'), 'dubai')
  assert.equal(cityOf('Kuala Lumpur, Malaysia'), 'kualaLumpur')
  assert.equal(cityOf('Berlin'), 'other')
})

test('jobs in the same city get different landmarks, and the latest gets the most famous one', () => {
  const ids = assignLandmarks(['Kuala Lumpur', 'Kuala Lumpur', 'Cairo', 'Maadi, Cairo', 'Maadi, Cairo', 'Dubai', 'Cairo', 'Cairo'])
  assert.deepEqual(ids, ['klTower', 'petronas', 'cairoTower', 'sphinx', 'citadel', 'burjKhalifa', 'iconic', 'pyramids'])
  assert.deepEqual(assignLandmarks(['Cairo']), ['pyramids'])
})
