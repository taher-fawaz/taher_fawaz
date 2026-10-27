'use client'

import { useRef, type ElementType, type ReactNode } from 'react'
import { gsap, motion, MOTION_OK, ScrollTrigger, useGSAP } from './gsap'

/**
 * Reveals children marked data-reveal as they scroll into view, in small staggered batches.
 * Progressive: nothing is hidden on the server, without JS, with reduced motion,
 * or if it is already on screen when this mounts. Only opacity/transform are animated,
 * and elements stay focusable (opacity only, never visibility) so keyboard users are never blocked.
 */
export function Reveal({ children, as: Tag = 'div', className }: { children: ReactNode; as?: ElementType; className?: string }) {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = scope.current
      if (!root) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const fold = window.innerHeight * 0.92
        const pending = gsap.utils.toArray<HTMLElement>('[data-reveal]', root).filter((el) => el.getBoundingClientRect().top > fold)
        if (!pending.length) return
        gsap.set(pending, { opacity: 0, y: motion.rise })
        ScrollTrigger.batch(pending, {
          start: 'top 90%',
          once: true,
          interval: 0.08,
          onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: motion.base, stagger: motion.stagger, overwrite: true, clearProps: 'transform' }),
        })
        // A keyboard user tabbing ahead of the scroll position reveals the item immediately.
        const onFocus = (e: FocusEvent) => {
          const target = (e.target as HTMLElement).closest<HTMLElement>('[data-reveal]')
          if (target && pending.includes(target)) gsap.to(target, { opacity: 1, y: 0, duration: motion.fast, overwrite: true })
        }
        root.addEventListener('focusin', onFocus)
        return () => root.removeEventListener('focusin', onFocus)
      })
      return () => mm.revert()
    },
    { scope },
  )

  return (
    <Tag ref={scope} className={className}>
      {children}
    </Tag>
  )
}
