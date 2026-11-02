'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { unlock } from '@/lib/achievements'

export type HandheldLabels = {
  region: string; power: string; boot: string; menu: string; hint: string; gameHint: string
  bugs: string; best: string; ready: string; over: string; select: string; start: string
  up: string; down: string; a: string; b: string; bug: string; empty: string
}
type Item = { label: string; target: string }
type Game = { playing: boolean; over: boolean; time: number; score: number; best: number; bug: number }

const ROUND = 15
const CELLS = 12
const BUG_PATH = 'M1 0h1v1h-1zM6 0h1v1h-1zM2 1h1v1h-1zM5 1h1v1h-1zM1 2h6v1h-6zM0 3h2v1h-2zM3 3h2v1h-2zM6 3h2v1h-2zM0 4h8v1h-8zM1 5h6v1h-6zM0 6h1v1h-1zM2 6h1v1h-1zM5 6h1v1h-1zM7 6h1v1h-1zM0 7h1v1h-1zM7 7h1v1h-1z'

/**
 * The hero handheld: boots, shows a menu that navigates the page (D-pad + A, or tap an item),
 * and runs a 15-second "squash the bug" game on its screen. Any link to "#play" starts the game.
 * Timers are cleared on unmount; nothing runs until someone plays.
 */
export function Handheld({ labels, items }: { labels: HandheldLabels; items: Item[] }) {
  const [screen, setScreen] = useState<'boot' | 'menu' | 'game'>('boot')
  const [sel, setSel] = useState(0)
  const [game, setGame] = useState<Game>({ playing: false, over: false, time: ROUND, score: 0, best: 0, bug: -1 })
  const timers = useRef<{ tick?: number; spawn?: number }>({})
  const root = useRef<HTMLDivElement>(null)

  const stop = useCallback(() => {
    window.clearInterval(timers.current.tick)
    window.clearInterval(timers.current.spawn)
  }, [])

  const start = useCallback(() => {
    stop()
    setScreen('game')
    setGame((g) => ({ ...g, playing: true, over: false, time: ROUND, score: 0, bug: -1 }))
    timers.current.tick = window.setInterval(() => {
      setGame((g) => {
        if (!g.playing) return g
        if (g.time > 1) return { ...g, time: g.time - 1 }
        return { ...g, time: 0, playing: false, over: true, bug: -1, best: Math.max(g.best, g.score) }
      })
    }, 1000)
    timers.current.spawn = window.setInterval(() => {
      setGame((g) => (g.playing ? { ...g, bug: Math.floor(Math.random() * CELLS) } : g))
    }, 700)
  }, [stop])

  // Round over: stop the timers and reward a good run.
  useEffect(() => {
    if (!game.over) return
    stop()
    if (game.score >= 8) unlock('gamer')
  }, [game.over, game.score, stop])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const t = window.setTimeout(() => setScreen((s) => (s === 'boot' ? 'menu' : s)), reduce ? 200 : 1900)
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest('a[href$="#play"]')
      if (a) start()
    }
    document.addEventListener('click', onClick)
    // Arriving at /#play (e.g. from the header on another page) starts a round right away.
    const autoplay = window.location.hash === '#play' ? window.setTimeout(start, 0) : undefined
    return () => {
      window.clearTimeout(t)
      window.clearTimeout(autoplay)
      document.removeEventListener('click', onClick)
      stop()
    }
  }, [start, stop])

  const open = (i: number) => {
    const target = items[i]?.target
    if (!target) return
    if (target === 'play') return start()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(target)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }
  const up = () => screen === 'menu' && setSel((s) => (s + items.length - 1) % items.length)
  const down = () => screen === 'menu' && setSel((s) => (s + 1) % items.length)
  const pressA = () => (screen === 'menu' ? open(sel) : screen === 'game' ? start() : undefined)
  const pressB = () => {
    stop()
    setGame((g) => ({ ...g, playing: false }))
    setScreen('menu')
  }
  const hit = (i: number) => setGame((g) => (g.playing && g.bug === i ? { ...g, score: g.score + 1, bug: -1 } : g))
  const status = game.playing ? `${game.time}s` : game.over ? labels.over : labels.ready

  return (
    <div ref={root} id="play" className="device-in w-full max-w-[25rem]" role="group" aria-label={labels.region}>
      <div className="idle rounded-[36px_36px_36px_80px] border-2 border-ink bg-device px-6 pb-8 pt-6 shadow-[0_10px_0_var(--ink),0_30px_60px_rgb(23_23_26/0.18)] rtl:rounded-[36px_36px_80px_36px]">
        <div className="mb-3 flex items-center justify-between" dir="ltr">
          <span className="mono text-[0.7rem] text-muted">TF·OS</span>
          <span className="flex items-center gap-1.5">
            <span className={`size-2 rounded-full ${screen === 'boot' ? 'bg-yellow' : 'bg-green'}`} />
            <span className="mono text-[0.7rem] text-muted">{labels.power}</span>
          </span>
        </div>

        {/* Screen */}
        <div className="rounded-2xl bg-[#2A2A2E] p-3.5">
          <div className="relative flex aspect-[4/3.7] flex-col overflow-hidden rounded-md bg-screen text-screen-ink" aria-live="polite">
            {screen === 'boot' ? (
              <div className="grid flex-1 place-items-center text-center" dir="ltr">
                <div>
                  <svg className="boot-logo mx-auto" width="72" height="72" viewBox="0 0 12 12" aria-hidden="true" shapeRendering="crispEdges">
                    <path d="M1 1h10v10h-10z" fill="#FF5B1F" />
                    <path d="M3 3h6v1h-2v5h-2v-5h-2z" fill="#1C1C1F" />
                    <path d="M8 7h1v1h-1z" fill="#FFC93C" />
                  </svg>
                  <p className="px mt-3 text-[0.8rem]">{labels.boot}</p>
                  <div className="mx-auto mt-2.5 h-2 w-36 border-2 border-screen-ink p-px">
                    <div className="load h-full w-full bg-yellow" />
                  </div>
                </div>
              </div>
            ) : null}

            {screen === 'menu' ? (
              <div className="flex flex-1 flex-col px-4 py-3">
                <p className="text-[0.72rem] font-bold text-yellow">{labels.menu}</p>
                <ul className="mt-2 flex flex-col gap-0.5">
                  {items.map((it, i) => (
                    <li key={it.target}>
                      <button
                        type="button"
                        onClick={() => {
                          setSel(i)
                          open(i)
                        }}
                        className={`flex w-full items-center gap-2 rounded px-2 py-1 text-start text-[0.92rem] font-bold ${sel === i ? 'bg-yellow text-screen' : 'text-screen-ink hover:bg-white/10'}`}
                      >
                        <span aria-hidden="true" className="w-3">{sel === i ? (/[؀-ۿ]/.test(it.label) ? '◀' : '▶') : ''}</span>
                        {it.label}
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="mt-auto text-[0.62rem] text-[#8A877D]">
                  {labels.hint}
                  <span className="blink" aria-hidden="true"> _</span>
                </p>
              </div>
            ) : null}

            {screen === 'game' ? (
              <div className="flex flex-1 flex-col gap-2 px-3 py-2.5" dir="ltr">
                <div className="px flex justify-between text-[0.7rem]">
                  <span className="text-yellow">{labels.bugs} {game.score}</span>
                  <span>{status}</span>
                  <span>{labels.best} {game.best}</span>
                </div>
                <div className="grid flex-1 grid-cols-4 gap-1">
                  {Array.from({ length: CELLS }, (_, i) => (
                    <button key={i} type="button" onClick={() => hit(i)} aria-label={game.bug === i ? labels.bug : labels.empty} className="scell grid cursor-crosshair place-items-center rounded bg-[#26262A]">
                      {game.bug === i ? (
                        <svg key={`${i}-${game.score}`} className="pop" width="26" height="26" viewBox="0 0 8 8" aria-hidden="true" shapeRendering="crispEdges">
                          <path d={BUG_PATH} fill="#FF5B1F" />
                        </svg>
                      ) : null}
                    </button>
                  ))}
                </div>
                <p className="text-[0.62rem] text-[#8A877D]">{labels.gameHint}</p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Controls (hardware stays left-to-right in both languages) */}
        <div className="mt-6 flex items-center justify-between" dir="ltr">
          <div className="relative size-28">
            <button type="button" onClick={up} aria-label={labels.up} className="key absolute left-[38px] top-0 h-10 w-9 rounded-t-lg border-2 border-b-0 border-ink bg-[#2A2A2E]" />
            <button type="button" onClick={down} aria-label={labels.down} className="key absolute bottom-0 left-[38px] h-10 w-9 rounded-b-lg border-2 border-t-0 border-ink bg-[#2A2A2E]" />
            <span aria-hidden="true" className="absolute left-0 top-[38px] h-9 w-28 rounded-lg border-2 border-ink bg-[#2A2A2E]" />
            <span aria-hidden="true" className="absolute left-[38px] top-[38px] size-9 bg-[#2A2A2E]" />
          </div>
          <div className="flex -rotate-[20deg] items-center gap-3.5">
            <button type="button" onClick={pressB} aria-label={labels.b} className="key size-14 rounded-full border-2 border-ink bg-blue font-[family-name:var(--font-unbounded)] text-base font-bold text-white shadow-[0_4px_0_var(--ink)]">B</button>
            <button type="button" onClick={pressA} aria-label={labels.a} className="key -mt-7 size-14 rounded-full border-2 border-ink bg-orange font-[family-name:var(--font-unbounded)] text-base font-bold text-ink shadow-[0_4px_0_var(--ink)]">A</button>
          </div>
        </div>
        <div className="mt-4 flex items-end justify-between" dir="ltr">
          <div className="flex gap-2.5">
            {[labels.select, labels.start].map((t) => (
              <span key={t} className="mono flex flex-col items-center gap-1 text-[0.62rem] text-muted">
                <span className="h-3 w-11 rounded-full border-2 border-ink bg-[#CFCBC2]" />
                {t}
              </span>
            ))}
          </div>
          <span aria-hidden="true" className="h-11 w-16 -rotate-[20deg] bg-[radial-gradient(circle,var(--ink)_2px,transparent_2.5px)] bg-[length:10px_10px] opacity-80" />
        </div>
      </div>
    </div>
  )
}
