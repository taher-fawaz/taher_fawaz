'use client'

import { useEffect, useRef, useState } from 'react'
import { unlock } from '@/lib/achievements'
import { LANDMARK_H, LANDMARK_W, landmarkRuns, type LandmarkId } from '@/lib/landmarks'
import { TaherSprite } from './TaherSprite'

export type Stop = {
  id: string; company: string; short: string; role: string; years: string; place: string; note: string
  now: boolean; review: boolean; tint: string; landmark: LandmarkId; landmarkName: string
}
type Labels = { stops: string; stage: string; of: string; cleared: string; current: string; here: string; review: string }

function Landmark({ id, active }: { id: LandmarkId; active: boolean }) {
  return (
    <svg
      viewBox={`0 0 ${LANDMARK_W} ${LANDMARK_H}`}
      aria-hidden="true"
      shapeRendering="crispEdges"
      className={`h-16 w-[3.2rem] transition-[filter,opacity,transform] duration-300 ${active ? '-translate-y-1 scale-110' : 'opacity-75 saturate-[0.7]'}`}
    >
      {landmarkRuns(id).map((r, i) => <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />)}
    </svg>
  )
}

/**
 * Experience as a journey: one stop per job, oldest to newest along a path, each with a pixel
 * landmark of its city. Choosing a stop walks pixel Taher there and opens its card.
 * On narrow screens the map scrolls sideways and keeps the chosen stop in view.
 */
export function JourneyMap({ stops, labels }: { stops: Stop[]; labels: Labels }) {
  const last = stops.length - 1
  const nowIndex = stops.findIndex((s) => s.now)
  const [sel, setSel] = useState(nowIndex >= 0 ? nowIndex : last)
  const [walking, setWalking] = useState(false)
  const [arrived, setArrived] = useState(0)
  const [walkMs, setWalkMs] = useState(0)
  const timer = useRef<number | undefined>(undefined)
  const box = useRef<HTMLDivElement>(null)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  // Keep the chosen stop centred inside the map box (never scrolls the page itself).
  useEffect(() => {
    const b = box.current
    const t = buttons.current[sel]
    if (!b || !t || b.scrollWidth <= b.clientWidth) return
    const br = b.getBoundingClientRect()
    const tr = t.getBoundingClientRect()
    b.scrollBy({ left: tr.left + tr.width / 2 - (br.left + br.width / 2), behavior: arrived || walking ? 'smooth' : 'auto' })
  }, [sel, arrived, walking])
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const go = (i: number) => {
    if (i === sel) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ms = reduce ? 0 : Math.min(2200, 350 + Math.abs(i - sel) * 280)
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
      <div ref={box} className="hw relative overflow-x-auto rounded-[32px] !bg-device [scrollbar-width:thin]">
        <div className="relative px-1 pb-6 pt-8 sm:px-2" style={{ minWidth: n > 4 ? `${n * 6.75}rem` : undefined }}>
          <span aria-hidden="true" className="cloud absolute top-4 h-3 w-14 rounded-full bg-white" style={{ insetInlineStart: '12%' }} />
          <span aria-hidden="true" className="cloud cloud-slow absolute top-9 h-2.5 w-10 rounded-full bg-white" style={{ insetInlineStart: '58%' }} />
          <span aria-hidden="true" className="cloud absolute top-6 h-2.5 w-12 rounded-full bg-white" style={{ insetInlineStart: '84%' }} />

          {/* Path: dashed for the whole career, solid up to the chosen stop */}
          <div aria-hidden="true" className="absolute top-[11.05rem] h-0 border-t-[3px] border-dashed border-ink/40" style={{ insetInlineStart: `${center(0)}%`, insetInlineEnd: `${100 - center(last)}%` }} />
          <div aria-hidden="true" className="absolute top-[11.05rem] h-[3px] -translate-y-[3px] bg-orange transition-[width] ease-linear" style={{ insetInlineStart: `${center(0)}%`, width: `${center(sel) - center(0)}%`, transitionDuration: `${walkMs}ms` }} />

          {/* Pixel Taher walks between stops */}
          <div aria-hidden="true" className="pointer-events-none absolute top-[6rem] z-10 w-10 -translate-x-1/2 transition-[inset-inline-start] ease-linear rtl:translate-x-1/2" style={{ insetInlineStart: `${center(sel)}%`, transitionDuration: `${walkMs}ms` }}>
            <TaherSprite key={arrived} mode={walking ? 'walk' : arrived ? 'cheer' : 'idle'} className="h-[3.75rem] w-10" />
          </div>

          <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }} aria-label={labels.stops}>
            {stops.map((s, i) => {
              const on = i === sel
              return (
                <li key={s.id} className="stop-in flex flex-col items-center" style={{ animationDelay: `${i * 90}ms` }}>
                  <Landmark id={s.landmark} active={on} />
                  <span className="mt-[3.4rem] h-0" />
                  <button
                    ref={(el) => {
                      buttons.current[i] = el
                    }}
                    type="button"
                    aria-pressed={on}
                    onClick={() => go(i)}
                    className={`key relative z-20 mt-1 grid size-11 place-items-center rounded-full border-2 border-ink text-[0.7rem] font-bold shadow-[0_3px_0_var(--ink)] transition-colors ${on ? 'bg-yellow' : 'bg-surface hover:bg-yellow/60'}`}
                    style={on ? undefined : { background: s.tint }}
                  >
                    <span className="mono" dir="ltr">{s.years.slice(0, 4)}</span>
                    <span className="sr-only">{s.company}</span>
                  </button>
                  <span className="mt-2 max-w-[8rem] px-0.5 text-center font-[family-name:var(--font-unbounded)] text-[0.62rem] font-bold leading-tight sm:text-[0.72rem] [html[lang=ar]_&]:font-[family-name:var(--font-alexandria)]"><bdi dir="ltr">{s.short}</bdi></span>
                  {s.place ? <span className="mt-0.5 text-[0.68rem] text-muted">{s.place.split(/[،,]/).at(-2)?.trim() || s.place}</span> : null}
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
          <div className="rounded-2xl border-2 border-[#3A3A3F] px-4 py-2.5">
            <dt className="sr-only">Years</dt>
            <dd className="flex flex-wrap items-center gap-2"><span className="mono" dir="ltr">{stop.years}</span>{stop.review ? <span className="rounded-full border border-yellow px-2 text-[0.72rem] text-yellow">{labels.review}</span> : null}</dd>
          </div>
          <div className="rounded-2xl border-2 border-[#3A3A3F] px-4 py-2.5"><dt className="sr-only">Place</dt><dd>{stop.place ? <>{stop.place} · </> : null}<span className="text-[#CFCBC2]">{stop.landmarkName}</span></dd></div>
        </dl>
      </div>
    </div>
  )
}
