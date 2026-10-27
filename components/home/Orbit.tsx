import Link from 'next/link'
import type { CSSProperties } from 'react'

type Body = { role: 'engineer' | 'educator' | 'builder'; href: string; label: string; cx: number; cy: number; r: number }

/**
 * Three concentric orbits, one per role. Pure SVG geometry; links lead to each role's section.
 * pathLength="1" lets CSS draw each ring without measuring it in JavaScript.
 */
export function Orbit({ bodies, label, order }: { bodies: Body[]; label: string; order: number }) {
  return (
    <svg viewBox="0 0 560 560" role="group" aria-label={label} className="mx-auto block h-auto w-full max-w-[28rem] overflow-visible" data-hero-item style={{ '--i': order } as CSSProperties}>
      {bodies.map((b, i) => (
        <circle key={b.role} className={`orbit-ring ring-${b.role}`} cx="280" cy="280" r={b.r} pathLength={1} style={{ '--i': i } as CSSProperties} />
      ))}
      <circle cx="280" cy="280" r="5" fill="var(--gold-lt)" />
      <g className="orbit-bodies">
        {bodies.map((b) => (
          <Link key={b.role} href={b.href} data-role={b.role} className={`orbit-body body-${b.role}`}>
            <circle cx={b.cx} cy={b.cy} r="9" />
            <text x={b.cx} y={b.cy - 24}>{b.label}</text>
          </Link>
        ))}
      </g>
    </svg>
  )
}
