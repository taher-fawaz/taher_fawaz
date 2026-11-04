import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildSeriesNav, type SeriesMember } from './series.ts'

const m = (part: number, slug = `part-${part}`): SeriesMember => ({ slug, title: `Title ${part}`, part })

test('orders parts, finds neighbours and reports completeness', () => {
  const nav = buildSeriesNav([m(3), m(1), m(2), m(4)], 'part-2', 4)!
  assert.deepEqual(nav.parts.map((p) => p.part), [1, 2, 3, 4])
  assert.equal(nav.part, 2)
  assert.equal(nav.total, 4)
  assert.equal(nav.prev?.slug, 'part-1')
  assert.equal(nav.next?.slug, 'part-3')
  assert.equal(nav.first.slug, 'part-1')
  assert.equal(nav.complete, true)
})

test('first and last parts have a single neighbour', () => {
  const members = [m(1), m(2), m(3)]
  assert.equal(buildSeriesNav(members, 'part-1', 3)!.prev, undefined)
  assert.equal(buildSeriesNav(members, 'part-3', 3)!.next, undefined)
})

test('unpublished parts are simply absent: gaps are skipped and the planned total is kept', () => {
  const nav = buildSeriesNav([m(1), m(3)], 'part-1', 4)!
  assert.equal(nav.next?.slug, 'part-3')
  assert.equal(nav.total, 4)
  assert.equal(nav.complete, false)
  assert.deepEqual(nav.parts.map((p) => p.slug), ['part-1', 'part-3'])
})

test('returns null when the current article is not a published member', () => {
  assert.equal(buildSeriesNav([m(1), m(2)], 'part-3', 3), null)
  assert.equal(buildSeriesNav([], 'part-1', 3), null)
})

test('ignores duplicate or invalid part numbers and never lets total drop below the highest part', () => {
  const nav = buildSeriesNav([m(1), m(1, 'dup'), m(0, 'zero'), m(1.5, 'frac'), m(5)], 'part-5', 3)!
  assert.deepEqual(nav.parts.map((p) => p.slug), ['part-1', 'part-5'])
  assert.equal(nav.total, 5)
  assert.equal(buildSeriesNav([m(1)], 'part-1', undefined)!.total, 1)
})
