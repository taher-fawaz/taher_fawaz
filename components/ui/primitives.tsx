import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowIcon } from './icons'

export function SectionHeader({ title, href, linkLabel, id }: { title: string; href?: string; linkLabel?: string; id?: string }) {
  return (
    <div data-reveal className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 md:mb-12">
      <h2 id={id} className="section-title">{title}</h2>
      {href && linkLabel ? (
        <Link href={href} className="tlink">
          {linkLabel}
          <ArrowIcon />
        </Link>
      ) : null}
    </div>
  )
}

export function PageHeader({ title, lead, children }: { title: string; lead?: ReactNode; children?: ReactNode }) {
  return (
    <header className="pb-8 pt-12 md:pb-12 md:pt-20">
      <h1 className="display-2 max-w-[18ch] [html[lang=ar]_&]:max-w-none">{title}</h1>
      {lead ? <p className="mt-5 max-w-[60ch] text-lg text-muted">{lead}</p> : null}
      {children}
    </header>
  )
}

/** A calm, intentional empty state: used when a list has nothing to show yet. */
export function EmptyState({ title, children, actions }: { title: string; children?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="rule-strong flex flex-col gap-5 pt-8 sm:flex-row sm:items-start sm:gap-8">
      <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true" className="shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="1.25">
        <circle cx="32" cy="32" r="28" strokeOpacity="0.5" />
        <circle cx="32" cy="32" r="17" strokeDasharray="2 3.5" strokeOpacity="0.7" />
        <circle cx="32" cy="32" r="3" fill="var(--gold)" stroke="none" />
      </svg>
      <div>
        <p className="font-display text-[1.5rem] leading-snug">{title}</p>
        {children ? <p className="mt-2 max-w-[52ch] text-muted">{children}</p> : null}
        {actions ? <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">{actions}</div> : null}
      </div>
    </div>
  )
}

export function Chip({ children, tone = 'mark' }: { children: ReactNode; tone?: 'cv' | 'mark' }) {
  return <span className={`chip ${tone === 'cv' ? 'chip-cv' : 'chip-mark'}`}>{children}</span>
}

/** Technology names, code and dates are always LTR, even inside Arabic text. */
export function Ltr({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <bdi dir="ltr" className={className}>{children}</bdi>
}

export function Tags({ items, label }: { items: string[]; label: string }) {
  if (!items.length) return null
  return (
    <ul className="mt-4 flex flex-wrap gap-2" aria-label={label}>
      {items.map((t) => (
        <li key={t} className="tag">{t}</li>
      ))}
    </ul>
  )
}
