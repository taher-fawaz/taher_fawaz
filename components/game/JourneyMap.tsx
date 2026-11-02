'use client'

import { useEffect, useRef, useState } from 'react'
import { unlock } from '@/lib/achievements'
import { TaherSprite } from './TaherSprite'

export type Landmark = 'pyramid' | 'tower' | 'twin' | 'building'
export type Stop = { id: string; company: string; short: string; role: string; years: string; place: string; note: string; now: boolean; tint: string; landmark: Landmark }
type Labels = { stops: string; stage: string; of: string; cleared: string; current: string; here: string }

// Small pixel landmarks for the city of each job (8×10 grids as one path each).
const LANDMARKS: Record<Landmark, string> = {
  pyramid: 'M4 2h1v1h-1zM3 3h3v1h-3zM3 4h3v1h-3zM2 5h5v1h-5zM2 6h5v1h-5zM1 7h7v1h-7zM1 8h7v1h-7zM0 9h9v1h-9z',
  tower: 'M4 0h1v2h-1zM3 2h3v2h-3zM3 4h3v2h-3zM2 6h5v2h-5zM1 8h7v2h-7z',
  twin: 'M2 0h1v1h-1zM6 0h1v1h-1zM1 1h3v9h-3zM5 1h3v9h-3zM4 5h1v1h-1z',
  building: 'M1 1h7v9h-7zM2 2h1v1h-1z',
}

/**
 * Experience as a journey: one stop per job, oldest to newest along a path. Choosing a stop
 * walks pixel Taher there (logical inset, so it runs the right way in Arabic) and opens its card.
 */
export function JourneyMap({ stops, labels }: { stops: Stop[]; labels: Labels }) {
  const last = stops.length - 1
  const nowIndex = stops.findIndex((s) => s.now)
  const [sel, setSel] = useState(nowIndex >= 0 ? nowIndex : last)
  const [walking, setWalking] = useState(false)
  const [arrived, setArrived] = useState(0)
  const [walkMs, setWalkMs] = useState(0)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const go = (i: number) => {
    if (i === sel) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ms = reduce ? 0 : 350 + Math.abs(i - sel) * 320
    setWalkMs(ms)
    setSel(i)
    setWalking(ms > 0)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setWalking(false)
      setArrived((n) => n + 1)
    }, ms)
    if (!stops[i]?.now) unlock('cart')
  }

  const stop = stops[sel]
  if (!stop) return null
  const n = stops.length
  const center = (i: number) => ((i + 0.5) / n) * 100

  return (
    <div>
      <div className="hw relative overflow-x-auto rounded-[32px] !bg-device">
        <div className="relative px-1 pb-6 pt-8 sm:px-2" style={{ minWidth: n > 4 ? `${n * 6.5}rem` : undefined }}>
          {/* Drifting clouds: decoration only */}
          <span aria-hidden="true" className="cloud absolute top-4 h-3 w-14 rounded-full bg-white" style={{ insetInlineStart: '12%' }} />
          <span aria-hidden="true" className="cloud cloud-slow absolute top-10 h-2.5 w-10 rounded-full bg-white" style={{ insetInlineStart: '62%' }} />

          {/* Path: dashed for the whole career, solid up to the chosen stop */}
          <div aria-hidden="true" className="absolute top-[10.3rem] h-0 border-t-[3px] border-dashed border-ink/40" style={{ insetInlineStart: `${center(0)}%`, insetInlineEnd: `${100 - center(last)}%` }} />
          <div aria-hidden="true" className="absolute top-[10.3rem] h-[3px] -translate-y-[3px] bg-orange transition-[width] ease-linear" style={{ insetInlineStart: `${center(0)}%`, width: `${center(sel) - center(0)}%`, transitionDuration: `${walkMs}ms` }} />

          {/* Pixel Taher walks between stops */}
          <div aria-hidden="true" className="pointer-events-none absolute top-[5.3rem] z-10 w-10 -translate-x-1/2 transition-[inset-inline-start] ease-linear rtl:translate-x-1/2" style={{ insetInlineStart: `${center(sel)}%`, transitionDuration: `${walkMs}ms` }}>
            <TaherSprite key={arrived} mode={walking ? 'walk' : arrived ? 'cheer' : 'idle'} className="h-[3.75rem] w-10" />
          </div>

          <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }} aria-label={labels.stops}>
            {stops.map((s, i) => {
              const on = i === sel
              return (
                <li key={s.id} className="stop-in flex flex-col items-center" style={{ animationDelay: `${i * 120}ms` }}>
                  <svg viewBox="0 0 9 10" aria-hidden="true" shapeRendering="crispEdges" className={`h-14 w-12 transition-transform duration-300 ${on ? '-translate-y-1 scale-110' : 'opacity-60'}`}>
                    <path d={LANDMARKS[s.landmark]} fill={on ? '#17171A' : '#5F5E59'} />
                  </svg>
                  <span className="mt-[3.25rem] h-0" />
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => go(i)}
                    className={`key relative z-20 mt-1 grid size-11 place-items-center rounded-full border-2 border-ink text-[0.7rem] font-bold shadow-[0_3px_0_var(--ink)] transition-colors ${on ? 'bg-yellow' : 'bg-surface hover:bg-yellow/60'}`}
                    style={on ? undefined : { background: s.tint }}
                  >
                    <span className="mono" dir="ltr">{s.years.slice(0, 4)}</span>
                    <span className="sr-only">{s.company}</span>
                  </button>
                  <span className="mt-2 max-w-[8rem] px-0.5 text-center font-[family-name:var(--font-unbounded)] text-[0.62rem] sm:text-[0.72rem] font-bold leading-tight [html[lang=ar]_&]:font-[family-name:var(--font-alexandria)]"><bdi dir="ltr">{s.short}</bdi></span>
                  <span className="mt-0.5 text-[0.68rem] text-muted">{s.place.split(/[،,]/).at(-2)?.trim() || s.place}</span>
                  {s.now ? <span className="flag mono mt-1 rounded-full border-2 border-ink bg-orange px-2 py-px text-[0.6rem]">{labels.here}</span> : null}
                </li>
              )
            })}
          </ol>
        </div>
      </div>

      {/* The chosen stop's card */}
      <div key={stop.id} className="insert mt-6 flex flex-wrap items-stretch gap-5 rounded-[28px] bg-ink p-6 text-paper shadow-[0_8px_0_var(--orange)] md:p-8" aria-live="polite">
        <div className="min-w-0 flex-[999_1_22rem]">
          <p className="mono text-[0.75rem] text-yellow">
            {labels.stage} {sel + 1} {labels.of} {n} · {stop.now ? labels.current : labels.cleared}
          </p>
          <p className="mt-2 font-[family-name:var(--font-unbounded)] text-[1.7rem] font-bold leading-tight [html[lang=ar]_&]:font-[family-name:var(--font-alexandria)]"><bdi dir="ltr">{stop.company}</bdi></p>
          {stop.note ? <p className="mt-3 max-w-[60ch] text-[0.98rem] leading-relaxed text-[#CFCBC2]">{stop.note}</p> : null}
        </div>
        <dl className="grid min-w-0 flex-[1_1_14rem] content-start gap-3 text-[0.92rem]">
          <div className="rounded-2xl border-2 border-[#3A3A3F] px-4 py-2.5"><dt className="sr-only">Role</dt><dd>{stop.role}</dd></div>
          <div className="rounded-2xl border-2 border-[#3A3A3F] px-4 py-2.5"><dt className="sr-only">Years</dt><dd className="mono" dir="ltr">{stop.years}</dd></div>
          <div className="rounded-2xl border-2 border-[#3A3A3F] px-4 py-2.5"><dt className="sr-only">Place</dt><dd>{stop.place}</dd></div>
        </dl>
      </div>
    </div>
  )
}
