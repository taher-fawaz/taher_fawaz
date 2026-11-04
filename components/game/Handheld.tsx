'use client'

import { useCallback, useEffect, useReducer, useRef, useState, type KeyboardEvent } from 'react'
import { unlock } from '@/lib/achievements'
import { catchReducer, initialCatch, LANES, LIVES, ROWS, secondsLeft, TICK_MS } from '@/lib/catch-game'
import { TaherSprite } from './TaherSprite'

export type HandheldLabels = {
  region: string; power: string; boot: string; menu: string; hint: string; gameHint: string
  score: string; best: string; lives: string; ready: string; over: string; again: string; select: string; start: string
  up: string; down: string; left: string; right: string; a: string; b: string; lane: string; player: string
}
type Item = { label: string; target: string }

const BUG_PATH = 'M1 0h1v1h-1zM6 0h1v1h-1zM2 1h1v1h-1zM5 1h1v1h-1zM1 2h6v1h-6zM0 3h2v1h-2zM3 3h2v1h-2zM6 3h2v1h-2zM0 4h8v1h-8zM1 5h6v1h-6zM0 6h1v1h-1zM2 6h1v1h-1zM5 6h1v1h-1zM7 6h1v1h-1zM0 7h1v1h-1zM7 7h1v1h-1z'
const DPAD = 'key absolute border-2 border-ink bg-[#2A2A2E]'

/**
 * The hero handheld. It boots, shows a menu that navigates the page (D-pad + A, tap, or arrow keys
 * while focused), and plays "catch the bugs" starring pixel Taher. Any link to "#play" starts a round.
 * The game timer only runs while a round is on; it is cleared on unmount.
 */
export function Handheld({ labels, items }: { labels: HandheldLabels; items: Item[] }) {
  const [screen, setScreen] = useState<'boot' | 'menu' | 'game'>('boot')
  const [sel, setSel] = useState(0)
  const [game, dispatch] = useReducer(catchReducer, undefined, () => initialCatch())
  const [walking, setWalking] = useState(false)
  const walkTimer = useRef<number | undefined>(undefined)

  const start = useCallback(() => {
    setScreen('game')
    dispatch({ type: 'start' })
  }, [])

  // Game loop: only while playing.
  useEffect(() => {
    if (game.status !== 'playing') return
    const id = window.setInterval(() => dispatch({ type: 'tick', roll: Math.random(), lane: Math.random() }), TICK_MS)
    return () => window.clearInterval(id)
  }, [game.status])

  useEffect(() => {
    if (game.status === 'over' && game.score >= 10) unlock('gamer')
  }, [game.status, game.score])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const boot = window.setTimeout(() => setScreen((s) => (s === 'boot' ? 'menu' : s)), reduce ? 200 : 2000)
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest('a[href$="#play"]')) start()
    }
    document.addEventListener('click', onClick)
    // Arriving at /#play (e.g. from the header on another page) starts a round right away.
    const autoplay = window.location.hash === '#play' ? window.setTimeout(start, 0) : undefined
    return () => {
      window.clearTimeout(boot)
      window.clearTimeout(autoplay)
      window.clearTimeout(walkTimer.current)
      document.removeEventListener('click', onClick)
    }
  }, [start])

  const step = (move: () => void) => {
    move()
    setWalking(true)
    window.clearTimeout(walkTimer.current)
    walkTimer.current = window.setTimeout(() => setWalking(false), 260)
  }
  const open = (i: number) => {
    const target = items[i]?.target
    if (!target) return
    if (target === 'play') return start()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(target)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }
  const up = () => screen === 'menu' && setSel((s) => (s + items.length - 1) % items.length)
  const down = () => screen === 'menu' && setSel((s) => (s + 1) % items.length)
  const left = () => screen === 'game' && step(() => dispatch({ type: 'move', dir: -1 }))
  const right = () => screen === 'game' && step(() => dispatch({ type: 'move', dir: 1 }))
  const pressA = () => (screen === 'menu' ? open(sel) : screen === 'game' && game.status !== 'playing' ? start() : undefined)
  const pressB = () => {
    dispatch({ type: 'stop' })
    setScreen('menu')
  }
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, () => unknown> = { ArrowUp: up, ArrowDown: down, ArrowLeft: left, ArrowRight: right, Escape: pressB }
    const fn = map[e.key]
    if (fn) {
      e.preventDefault()
      fn()
    }
  }

  const pose = game.cheer > 0 || screen === 'boot' ? 'cheer' : walking ? 'walk' : 'idle'
  const status = game.status === 'playing' ? `${secondsLeft(game)}s` : game.status === 'over' ? labels.over : labels.ready

  return (
    <div id="play" className="device-in w-full max-w-[25rem]" role="group" aria-label={labels.region} onKeyDown={onKey}>
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
          <div className="relative flex aspect-[4/3.7] flex-col overflow-hidden rounded-md bg-screen text-screen-ink">
            {screen === 'boot' ? (
              <div className="grid flex-1 place-items-center text-center" dir="ltr">
                <div>
                  <TaherSprite mode="cheer" className="boot-logo mx-auto h-24 w-16" />
                  <p className="px mt-2 text-[0.8rem]">{labels.boot}</p>
                  <div className="mx-auto mt-2 h-2 w-36 border-2 border-screen-ink p-px">
                    <div className="load h-full w-full bg-yellow" />
                  </div>
                </div>
              </div>
            ) : null}

            {screen === 'menu' ? (
              <div className="relative flex flex-1 flex-col px-4 py-3">
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
                <TaherSprite className="absolute bottom-3 end-3 h-[4.5rem] w-12" />
                <p className="mt-auto text-[0.62rem] text-[#8A877D]">
                  {labels.hint}
                  <span className="blink" aria-hidden="true"> _</span>
                </p>
              </div>
            ) : null}

            {screen === 'game' ? (
              <div className="flex flex-1 flex-col px-3 py-2" dir="ltr">
                <div className="px flex items-center justify-between text-[0.68rem]">
                  <span className="text-yellow">{labels.score} {game.score}</span>
                  <span aria-label={`${labels.lives}: ${game.lives}`}>{'♥'.repeat(game.lives)}<span className="opacity-30">{'♥'.repeat(LIVES - game.lives)}</span></span>
                  <span>{status}</span>
                </div>
                {/* Playfield: tap a lane to walk there */}
                <div className="relative mt-1.5 flex-1">
                  <div className="absolute inset-0 grid grid-cols-4">
                    {Array.from({ length: LANES }, (_, l) => (
                      <button key={l} type="button" aria-label={`${labels.lane} ${l + 1}`} onClick={() => step(() => dispatch({ type: 'goto', lane: l }))} className="border-x border-white/5 hover:bg-white/5" />
                    ))}
                  </div>
                  {game.bugs.map((b) => (
                    <svg
                      key={b.id}
                      viewBox="0 0 8 8"
                      aria-hidden="true"
                      shapeRendering="crispEdges"
                      className="pointer-events-none absolute h-[14%] w-[14%] transition-[top] ease-linear"
                      style={{ left: `${b.lane * 25 + 5.5}%`, top: `${(b.row / (ROWS + 1)) * 100}%`, transitionDuration: `${TICK_MS}ms` }}
                    >
                      <path d={BUG_PATH} fill="#FF5B1F" />
                    </svg>
                  ))}
                  <div className="pointer-events-none absolute bottom-0 h-[30%] w-1/4 transition-[left] duration-150" style={{ left: `${game.lane * 25}%` }}>
                    <TaherSprite mode={pose} title={labels.player} className="mx-auto h-full w-auto" />
                  </div>
                  <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-screen-ink/40" />
                  {game.status !== 'playing' ? (
                    <div className="absolute inset-0 grid place-items-center bg-screen/80 text-center">
                      <div>
                        {game.status === 'over' ? <p className="px text-[0.8rem] text-yellow">{labels.over} · {game.score} · {labels.best} {game.best}</p> : null}
                        <button type="button" onClick={start} className="px mt-2 rounded border-2 border-screen-ink px-3 py-1.5 text-[0.75rem] hover:bg-screen-ink hover:text-screen">▶ {game.status === 'over' ? labels.again : labels.start}</button>
                      </div>
                    </div>
                  ) : null}
                </div>
                <p className="mt-1.5 text-[0.6rem] text-[#8A877D]">{labels.gameHint}</p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Controls (hardware stays left-to-right in both languages) */}
        <div className="mt-6 flex items-center justify-between" dir="ltr">
          <div className="relative size-28">
            <button type="button" onClick={up} aria-label={labels.up} className={`${DPAD} left-[38px] top-0 h-10 w-9 rounded-t-lg border-b-0`} />
            <button type="button" onClick={down} aria-label={labels.down} className={`${DPAD} bottom-0 left-[38px] h-10 w-9 rounded-b-lg border-t-0`} />
            <button type="button" onClick={left} aria-label={labels.left} className={`${DPAD} left-0 top-[38px] h-9 w-10 rounded-s-lg border-e-0`} />
            <button type="button" onClick={right} aria-label={labels.right} className={`${DPAD} right-0 top-[38px] h-9 w-10 rounded-e-lg border-s-0`} />
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
