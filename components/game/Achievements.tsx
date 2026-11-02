'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { ACHIEVEMENT_IDS, getServerSnapshot, getSnapshot, subscribe, type AchievementId } from '@/lib/achievements'

/** "★ 2/4" in the header. */
export function AchievementBadge({ label }: { label: string }) {
  const { count } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return (
    <span className="mono hidden rounded-full border-2 border-ink bg-yellow px-3.5 py-2 text-[0.8rem] sm:inline-block" title={label}>
      <span aria-hidden="true">★ </span>
      <span className="sr-only">{label}: </span>
      {count}/{ACHIEVEMENT_IDS.length}
    </span>
  )
}

/** Shows the latest unlocked achievement for three seconds. */
export function AchievementToast({ heading, items }: { heading: string; items: Record<AchievementId, [string, string]> }) {
  const { last, seq } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [dismissed, setDismissed] = useState(0)
  useEffect(() => {
    if (!seq) return
    const t = setTimeout(() => setDismissed(seq), 3000)
    return () => clearTimeout(t)
  }, [seq])
  const shown = seq > 0 && seq !== dismissed ? seq : 0
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed bottom-6 end-6 z-50">
      {shown && last ? (
        <div key={shown} className="toast hw flex max-w-[22rem] items-center gap-3.5 rounded-[22px] !bg-yellow px-4 py-3.5">
          <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-xl text-yellow">★</span>
          <span>
            <span className="mono block text-[0.72rem]">{heading}</span>
            <span className="block font-display text-[1.05rem] font-bold">{items[last][0]}</span>
            <span className="block text-[0.85rem]">{items[last][1]}</span>
          </span>
        </div>
      ) : null}
    </div>
  )
}
