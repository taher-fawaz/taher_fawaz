'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, type PointerEvent } from 'react'
import { unlock } from '@/lib/achievements'
import { ArrowIcon } from '@/components/ui/icons'

export type CardData = {
  id: string; no: string; rarity: string; legendary: boolean; color: string
  title: string; domain: string; role: string; period?: string; summary: string; stack: string[]
  cover?: { url: string; alt: string }
  links: { label: string; url: string }[]
  /** Case-study page, when the project has a written story. */
  story?: string
}

/** Short platform name for narrow cards, from the store URL. */
const platform = (url: string, label: string) => (/apple\.com/.test(url) ? 'iOS' : /play\.google/.test(url) ? 'Android' : label)

const PHONE = 'M2 0h6v1h-6zM1 1h1v14h-1zM8 1h1v14h-1zM2 15h6v1h-6zM4 2h2v1h-2zM4 13h2v1h-2z'

/**
 * Projects as collectible cards: tilt toward the pointer (fine pointers, motion allowed),
 * click or press Enter to flip and read the back. Both faces are real text for screen readers.
 */
export function ProjectCards({ cards, labels }: { cards: CardData[]; labels: { screenshot: string; flip: string; back: string; openOn: string; newTab: string; readStory: string } }) {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({})
  const [tilt, setTilt] = useState<{ id: string; rx: number; ry: number } | null>(null)
  const canTilt = useRef<boolean | null>(null)

  const onMove = (id: string) => (e: PointerEvent<HTMLButtonElement>) => {
    if (canTilt.current === null) canTilt.current = matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!canTilt.current || flipped[id]) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    setTilt({ id, rx: +((0.5 - y) * 12).toFixed(1), ry: +((x - 0.5) * 14).toFixed(1) })
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:gap-7 md:grid-cols-[repeat(auto-fill,minmax(15rem,1fr))]">
      {cards.map((c) => {
        const isFlipped = !!flipped[c.id]
        const t = tilt?.id === c.id ? tilt : null
        // Footer rows on the back: the story link and/or the store links.
        const rows = (c.story ? 1 : 0) + (c.links.length ? 1 : 0)
        return (
          <li key={c.id} className="card-wrap relative [perspective:1000px]">
            <button
              type="button"
              aria-pressed={isFlipped}
              onClick={() => {
                setFlipped((f) => ({ ...f, [c.id]: !f[c.id] }))
                unlock('flip')
              }}
              onPointerMove={onMove(c.id)}
              onPointerLeave={() => setTilt(null)}
              className="card3d block w-full cursor-pointer text-start"
              style={{ transform: t ? `rotateX(${t.rx}deg) rotateY(${t.ry}deg)` : undefined }}
            >
              <span className="sr-only">{isFlipped ? labels.back : labels.flip}: </span>
              <div className="flip relative aspect-[5/7]" style={{ transform: isFlipped ? 'rotateY(180deg)' : undefined }}>
                {/* Front */}
                <div className="face hw absolute inset-0 flex flex-col overflow-hidden rounded-[22px] p-2.5 !shadow-[0_6px_0_var(--ink)] sm:p-3.5" aria-hidden={isFlipped}>
                  <div className="flex items-center justify-between">
                    <span className="mono text-[0.7rem]" dir="ltr">{c.no}</span>
                    <span className={`chip !text-[0.7rem] ${c.legendary ? '!bg-yellow' : '!bg-[#D8F5E8]'}`}>{c.rarity}</span>
                  </div>
                  <div className="relative mt-2.5 grid flex-1 place-items-center overflow-hidden rounded-[14px] border-2 border-ink" style={{ background: c.color }}>
                    {c.cover ? (
                      <Image src={c.cover.url} alt={c.cover.alt} fill sizes="(min-width: 768px) 25vw, 90vw" className="object-cover" />
                    ) : (
                      <>
                        <svg viewBox="0 0 10 16" aria-hidden="true" shapeRendering="crispEdges" className="-mt-4 h-16 w-10 sm:mt-0 sm:h-[90px] sm:w-14">
                          <path d={PHONE} fill="#17171A" />
                          <path d="M3 4h4v7h-4z" fill="#FFFFFF" opacity=".7" />
                        </svg>
                        <span className="mono absolute bottom-2 start-2 rounded-full bg-surface px-2 py-0.5 text-[0.6rem] sm:start-2.5 sm:text-[0.65rem]">{labels.screenshot}</span>
                      </>
                    )}
                    <span aria-hidden="true" className="sheen absolute inset-0" />
                  </div>
                  <p className="mt-2.5 font-[family-name:var(--font-unbounded)] text-[0.95rem] font-bold sm:mt-3.5 sm:text-[1.3rem] leading-tight tracking-[-0.02em]"><bdi dir="ltr">{c.title}</bdi></p>
                  <p className="mt-1 text-[0.75rem] text-muted sm:text-[0.88rem]">{c.domain}</p>
                </div>
                {/* Back */}
                <div className={`face absolute inset-0 flex flex-col overflow-hidden rounded-[22px] border-2 border-ink bg-ink p-3.5 text-paper sm:p-5 shadow-[0_6px_0_var(--orange)] [transform:rotateY(180deg)] ${rows === 2 ? 'pb-[7.6rem] sm:pb-[8.3rem]' : rows === 1 ? 'pb-[4.4rem] sm:pb-[5.1rem]' : ''}`} aria-hidden={!isFlipped}>
                  <p className="mono text-[0.7rem] text-yellow">{c.role}{c.period ? <> · <bdi dir="ltr">{c.period}</bdi></> : null}</p>
                  <p className="mt-2 hidden font-[family-name:var(--font-unbounded)] text-[1.15rem] font-bold leading-tight sm:block"><bdi dir="ltr">{c.title}</bdi></p>
                  <p className={`mt-2 text-[0.78rem] leading-relaxed text-[#CFCBC2] sm:mt-2.5 sm:text-[0.9rem] ${rows === 2 ? 'line-clamp-2 sm:line-clamp-3' : rows === 1 ? 'line-clamp-3 sm:line-clamp-4' : 'line-clamp-6 sm:line-clamp-none'}`}>{c.summary}</p>
                  <ul className={`mb-2 mt-auto hidden ${rows === 2 ? 'max-h-[1.9rem]' : 'max-h-[4.1rem]'} flex-wrap gap-1.5 overflow-hidden pt-3 sm:flex`} dir="ltr">
                    {c.stack.map((s) => (
                      <li key={s} className="mono rounded-full border-[1.5px] border-[#4A4945] px-2.5 py-0.5 text-[0.68rem]">{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </button>
            {rows ? (
              // Links sit outside the flip button (a link cannot live inside a button) and line up with the back face's footer.
              <div className={`absolute inset-x-0 bottom-[6px] z-10 px-3.5 pb-3.5 transition-opacity duration-200 sm:px-5 sm:pb-5 ${isFlipped ? 'opacity-100 [transition-delay:300ms]' : 'pointer-events-none opacity-0'}`}>
                <div className="grid gap-2 border-t border-dashed border-[#4A4945] pt-3">
                  {c.story ? (
                    <Link
                      href={c.story}
                      tabIndex={isFlipped ? 0 : -1}
                      className="flex min-h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-yellow px-3 text-[0.78rem] font-bold text-ink shadow-[0_3px_0_var(--orange)] transition-[transform,background-color] hover:bg-[#FFD666] active:translate-y-[2px] active:shadow-[0_1px_0_var(--orange)] sm:text-[0.86rem]"
                    >
                      {labels.readStory}
                      <ArrowIcon size={16} />
                      <span className="sr-only">: {c.title}</span>
                    </Link>
                  ) : null}
                  {c.links.length ? (
                    <div className={`grid gap-2 ${c.links.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      {c.links.map((l) => (
                        <a
                          key={l.url}
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          tabIndex={isFlipped ? 0 : -1}
                          className={`grid min-h-11 place-items-center whitespace-nowrap rounded-full px-2 text-[0.72rem] font-bold transition-[transform,background-color,color,border-color] active:translate-y-[2px] sm:text-[0.8rem] ${
                            c.story
                              ? 'border-[1.5px] border-[#6B6A64] text-paper hover:border-yellow hover:text-yellow'
                              : 'bg-yellow text-ink shadow-[0_3px_0_var(--orange)] hover:bg-[#FFD666] active:shadow-[0_1px_0_var(--orange)]'
                          }`}
                        >
                          <bdi dir="ltr">
                            <span className="sm:hidden">{platform(l.url, l.label)}</span>
                            <span className="hidden sm:inline">{l.label}</span>
                          </bdi>
                          <span className="sr-only">: {labels.openOn} {c.title}, {labels.newTab}</span>
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}
