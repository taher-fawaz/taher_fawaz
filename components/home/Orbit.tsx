import Link from 'next/link'
import type { CSSProperties } from 'react'

export type OrbitRole = 'engineer' | 'educator' | 'builder'
export type OrbitBody = { role: OrbitRole; href: string; label: string; index: string; r: number; angle: number }

const C = 280
/** Polar to SVG: `angle` is degrees clockwise from the top. Rounded so server and client always agree. */
const point = (r: number, angle: number) => {
  const a = (angle * Math.PI) / 180
  return { x: +(C + r * Math.sin(a)).toFixed(2), y: +(C - r * Math.cos(a)).toFixed(2) }
}

/** Instrument bezel: a tick every 5 degrees, longer every 30. */
const TICKS = Array.from({ length: 72 }, (_, i) => {
  const outer = point(262, i * 5)
  const inner = point(i % 6 === 0 ? 249 : 256, i * 5)
  return `M${outer.x} ${outer.y}L${inner.x} ${inner.y}`
}).join('')

/**
 * The three roles as three orbits: Engineer is the core (solid gold), Educator the shared layer (solid),
 * Builder the outer, still-exploring ring (dashed). Pure SVG geometry rendered on the server; the entrance is CSS.
 * `decorative` renders the same drawing without links or labels for small screens.
 */
export function Orbit({ bodies, label, decorative = false }: { bodies: OrbitBody[]; label: string; decorative?: boolean }) {
  return (
    <svg
      viewBox="0 0 560 560"
      {...(decorative ? { 'aria-hidden': true } : { role: 'group', 'aria-label': label })}
      className="mx-auto block h-auto w-full overflow-visible"
      style={{ direction: 'ltr' }}
    >
      <g className="orbit-bezel">
        <circle cx={C} cy={C} r="262" />
        <path d={TICKS} />
        <path d={`M${C} 18V542M18 ${C}H542`} className="orbit-axes" />
      </g>
      {bodies.map((b, i) => (
        <circle key={b.role} className={`orbit-ring ring-${b.role}`} cx={C} cy={C} r={b.r} pathLength={1} style={{ '--i': i } as CSSProperties} />
      ))}
      <circle cx={C} cy={C} r="5" className="orbit-core" />
      {bodies.map((b, i) => {
        const p = point(b.r, b.angle)
        const dir = point(1, b.angle)
        const lx = +(p.x + (dir.x - C) * 30).toFixed(2)
        const ly = +(p.y + (dir.y - C) * 30).toFixed(2)
        const anchor = dir.x - C > 0.25 ? 'start' : dir.x - C < -0.25 ? 'end' : 'middle'
        const body = (
          <>
            <circle className="orbit-halo" cx={p.x} cy={p.y} r="20" />
            <circle className="orbit-node" cx={p.x} cy={p.y} r="9" />
            {decorative ? null : (
              <text x={lx} y={ly} textAnchor={anchor}>
                <tspan className="orbit-index">{b.index}</tspan>
                <tspan dx="7">{b.label}</tspan>
              </text>
            )}
          </>
        )
        const style = { '--i': i } as CSSProperties
        return decorative ? (
          <g key={b.role} className={`orbit-body body-${b.role}`} style={style}>{body}</g>
        ) : (
          <Link key={b.role} href={b.href} data-role={b.role} className={`orbit-body body-${b.role}`} style={style}>{body}</Link>
        )
      })}
    </svg>
  )
}
