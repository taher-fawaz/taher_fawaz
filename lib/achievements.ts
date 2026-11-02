// A tiny in-memory store for the playful achievements (client only, per visit, nothing stored or sent).

export type AchievementId = 'flip' | 'cart' | 'gamer' | 'hi'
export const ACHIEVEMENT_IDS: AchievementId[] = ['flip', 'cart', 'gamer', 'hi']

type Snapshot = { count: number; last: AchievementId | null; seq: number }

let unlocked = new Set<AchievementId>()
let snapshot: Snapshot = { count: 0, last: null, seq: 0 }
const listeners = new Set<() => void>()

export function unlock(id: AchievementId) {
  if (unlocked.has(id)) return
  unlocked = new Set(unlocked).add(id)
  snapshot = { count: unlocked.size, last: id, seq: snapshot.seq + 1 }
  listeners.forEach((l) => l())
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const getSnapshot = () => snapshot
const serverSnapshot: Snapshot = { count: 0, last: null, seq: 0 }
export const getServerSnapshot = () => serverSnapshot
