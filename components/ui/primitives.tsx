import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowIcon } from './icons'

export function SectionHeader({ title, href, linkLabel, id }: { title: string; href?: string; linkLabel?: string; id?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 md:mb-12">
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
