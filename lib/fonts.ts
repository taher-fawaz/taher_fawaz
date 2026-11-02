import { Alexandria, Instrument_Sans, JetBrains_Mono, Silkscreen, Unbounded } from 'next/font/google'

/*
 * Self-hosted at build time by next/font (no runtime request to Google).
 * Unbounded: English display. Instrument Sans: English UI and body. Alexandria: all Arabic text.
 * JetBrains Mono: small labels. Silkscreen: the pixel text on the handheld's screen only.
 * The three text faces are preloaded; the two small decorative ones are not (metric-adjusted fallbacks).
 */
export const unbounded = Unbounded({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-unbounded', display: 'swap' })
export const instrument = Instrument_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-instrument', display: 'swap' })
export const alexandria = Alexandria({ subsets: ['arabic', 'latin'], weight: ['400', '500', '700', '800'], variable: '--font-alexandria', display: 'swap' })
export const jetbrains = JetBrains_Mono({ subsets: ['latin'], weight: ['500'], variable: '--font-jetbrains', display: 'swap', preload: false })
export const silkscreen = Silkscreen({ subsets: ['latin'], weight: ['400'], variable: '--font-silkscreen', display: 'swap', preload: false })

export const fontVariables = [unbounded, instrument, alexandria, jetbrains, silkscreen].map((f) => f.variable).join(' ')
