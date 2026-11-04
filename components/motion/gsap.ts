'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// Register once for every client component that animates.
gsap.registerPlugin(useGSAP, ScrollTrigger)
gsap.defaults({ ease: 'power3.out', duration: 0.6 })

/** Shared motion tokens (seconds). Keep UI details short; reserve longer timings for the hero. */
export const motion = { fast: 0.18, base: 0.5, hero: 0.8, stagger: 0.07, rise: 16 } as const

export const MOTION_OK = '(prefers-reduced-motion: no-preference)'

export { gsap, ScrollTrigger, useGSAP }
