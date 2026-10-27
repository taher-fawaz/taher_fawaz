import { Amiri, Fraunces, IBM_Plex_Sans_Arabic, Inter, JetBrains_Mono } from 'next/font/google'

/*
 * Self-hosted at build time by next/font (no runtime request to Google).
 * Preloaded: Inter, Fraunces and the Arabic body face (two weights, ~34 KB each),
 * because a late Arabic body font re-wraps whole paragraphs (measured CLS 0.26 on
 * throttled mobile without it). Not preloaded: JetBrains Mono (small labels only)
 * and Amiri (98 KB, display headings only) — both swap in with metric-adjusted fallbacks.
 */
export const fraunces = Fraunces({ subsets: ['latin'], axes: ['opsz'], variable: '--font-fraunces', display: 'swap' })
export const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
export const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap', preload: false })
export const plexArabic = IBM_Plex_Sans_Arabic({ subsets: ['arabic'], weight: ['400', '600'], variable: '--font-plex-ar', display: 'swap' })
// Amiri is used only for Arabic display headings, so only the bold cut is loaded.
export const amiri = Amiri({ subsets: ['arabic'], weight: ['700'], variable: '--font-amiri', display: 'swap', preload: false })

export const fontVariables = [fraunces, inter, jetbrains, plexArabic, amiri].map((f) => f.variable).join(' ')
