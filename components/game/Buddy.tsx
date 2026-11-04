'use client'

import { useEffect, useRef, useState } from 'react'
import { unlock } from '@/lib/achievements'
import { TaherSprite } from './TaherSprite'

export type BuddyLines = { label: string; hide: string; hi: string; page: string; sections: Record<string, string> }

/**
 * Pixel Taher keeps you company in the corner: he walks while you scroll, says something
 * about the section you are looking at, and cheers when clicked. The visitor can hide him
 * for the rest of the visit. Only passive listeners and one IntersectionObserver.
 */
export function Buddy({ lines }: { lines: BuddyLines }) {
  const [hidden, setHidden] = useState(false)
  const [walking, setWalking] = useState(false)
  const [cheer, setCheer] = useState(false)
  const [say, setSay] = useState<string | null>(null)
  const [facing, setFacing] = useState<1 | -1>(1)
  const timers = useRef<{ walk?: number; say?: number; cheer?: number }>({})
  const lastY = useRef(0)

  const speak = (text: string) => {
    setSay(text)
    window.clearTimeout(timers.current.say)
    timers.current.say = window.setTimeout(() => setSay(null), 4200)
  }

  useEffect(() => {
    try {
      if (sessionStorage.getItem('tf-buddy') === 'off') {
        const t = window.setTimeout(() => setHidden(true), 0)
        return () => window.clearTimeout(t)
      }
    } catch {
      /* storage unavailable: keep him visible */
    }
  }, [])

  useEffect(() => {
    if (hidden) return
    const t = timers.current
    lastY.current = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setFacing(y >= lastY.current ? 1 : -1)
      lastY.current = y
      setWalking(true)
      window.clearTimeout(t.walk)
      t.walk = window.setTimeout(() => setWalking(false), 280)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const ids = Object.keys(lines.sections)
    const seen = new Set<string>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = e.target.id
          if (e.isIntersecting && !seen.has(id)) {
            seen.add(id)
            speak(lines.sections[id]!)
          }
        }
      },
      // A section "is seen" once it crosses the middle of the viewport, however tall it is.
      { rootMargin: '-45% 0px -45% 0px' },
    )
    const found = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    found.forEach((el) => io.observe(el))
    // Pages without these sections (the blog) get one greeting instead.
    const greet = found.length ? undefined : window.setTimeout(() => speak(lines.page), 1500)

    return () => {
      window.removeEventListener('scroll', onScroll)
      io.disconnect()
      window.clearTimeout(greet)
      window.clearTimeout(t.walk)
      window.clearTimeout(t.say)
      window.clearTimeout(t.cheer)
    }
  }, [hidden, lines])

  if (hidden) return null

  return (
    <div className="pointer-events-none fixed bottom-4 start-3 z-40 flex flex-col items-start gap-2 sm:bottom-6 sm:start-5">
      {say ? (
        <p key={say} className="toast hw pointer-events-auto max-w-[13rem] rounded-2xl rounded-es-sm px-3.5 py-2.5 text-[0.85rem] font-medium leading-snug sm:max-w-[16rem] sm:text-[0.9rem]">
          {say}
        </p>
      ) : null}

      <div className="pointer-events-auto relative">
        <button
          type="button"
          aria-label={lines.label}
          onClick={() => {
            setCheer(true)
            window.clearTimeout(timers.current.cheer)
            timers.current.cheer = window.setTimeout(() => setCheer(false), 700)
            speak(lines.hi)
            unlock('buddy')
          }}
          className="block cursor-pointer rounded-xl p-1 drop-shadow-[0_3px_0_rgb(23_23_26/0.25)]"
        >
          <span className="block" style={{ transform: `scaleX(${facing})` }}>
            <TaherSprite mode={cheer ? 'cheer' : walking ? 'walk' : 'idle'} className="h-[4.5rem] w-12 sm:h-24 sm:w-16" />
          </span>
        </button>
        <button
          type="button"
          aria-label={lines.hide}
          title={lines.hide}
          onClick={() => {
            setHidden(true)
            try {
              sessionStorage.setItem('tf-buddy', 'off')
            } catch {
              /* ignore */
            }
          }}
          className="absolute -top-1 end-0 grid size-6 place-items-center rounded-full border-2 border-ink bg-surface text-[0.7rem] leading-none"
        >
          ×
        </button>
      </div>
    </div>
  )
}
