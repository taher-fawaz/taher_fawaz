import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function base({ size = 18, ...rest }: IconProps) {
  return { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, focusable: false, ...rest }
}

/** Points forward in the reading direction (flipped in RTL via .icon-fwd). */
export const ArrowIcon = ({ className = '', ...p }: IconProps) => (
  <svg {...base(p)} className={`icon-fwd shrink-0 ${className}`}><path d="M4 12h16M14 6l6 6-6 6" /></svg>
)
export const BackIcon = ({ className = '', ...p }: IconProps) => (
  <svg {...base(p)} className={`icon-back shrink-0 ${className}`}><path d="M20 12H4M10 6l-6 6 6 6" /></svg>
)
export const ExternalIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
)
export const GlobeIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.7 3.9 5.7 3.9 9s-1.3 6.3-3.9 9c-2.6-2.7-3.9-5.7-3.9-9S9.4 5.7 12 3z" /></svg>
)
export const MoonIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" /></svg>
)
export const SunIcon = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
)
export const MenuIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
)
export const CloseIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M6 6l12 12M18 6L6 18" /></svg>
)
export const PlayIcon = (p: IconProps) => (
  <svg {...base(p)}><path d="M9 6.5v11l9-5.5z" fill="currentColor" stroke="none" /></svg>
)

/** Outline brand marks for the social links (Tabler icon paths, MIT). Keys match the CMS platform list. */
const socialPaths: Record<string, string[]> = {
  LinkedIn: ['M8 11v5', 'M8 8v.01', 'M12 16v-5', 'M16 16v-3a2 2 0 1 0-4 0', 'M3 7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z'],
  YouTube: ['M2 8a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z', 'M10 9l5 3-5 3z'],
  TikTok: ['M21 7.917v4.034a9.948 9.948 0 0 1-5-1.951v4.5a6.5 6.5 0 1 1-8-6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083A6.005 6.005 0 0 0 21 7.917z'],
  Facebook: ['M7 10v4h3v7h4v-7h3l1-4h-4V8a1 1 0 0 1 1-1h3V3h-3a5 5 0 0 0-5 5v2z'],
  Instagram: ['M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z', 'M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0', 'M16.5 7.5v.01'],
  GitHub: ['M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21'],
  X: ['M4 4l11.733 16H20L8.267 4z', 'M4 20l6.768-6.768m2.46-2.46L20 4'],
  Medium: ['M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z', 'M8 9h1l3 3 3-3h1', 'M8 15h2', 'M14 15h2', 'M9 9v6', 'M15 9v6'],
  Email: ['M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M3 7l9 6 9-6'],
}
export const SocialIcon = ({ platform, ...p }: IconProps & { platform: string }) => (
  <svg {...base({ size: 22, strokeWidth: 1.8, ...p })}>
    {(socialPaths[platform] ?? ['M10 14a3.5 3.5 0 0 0 5 0l4-4a3.5 3.5 0 0 0-5-5l-.5.5', 'M14 10a3.5 3.5 0 0 0-5 0l-4 4a3.5 3.5 0 0 0 5 5l.5-.5']).map((d) => <path key={d} d={d} />)}
  </svg>
)

/** The site mark: an orbit with one gold body. */
export const Mark = ({ size = 30 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 30 30" aria-hidden="true" focusable="false" className="shrink-0">
    <circle cx="15" cy="15" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="15" cy="15" r="13" fill="none" stroke="currentColor" strokeWidth="1" opacity=".45" />
    <circle cx="24.2" cy="5.8" r="2.4" fill="var(--gold)" />
  </svg>
)
