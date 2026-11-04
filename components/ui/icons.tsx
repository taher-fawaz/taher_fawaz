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

/** The site mark: an orbit with one gold body. */
export const Mark = ({ size = 30 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 30 30" aria-hidden="true" focusable="false" className="shrink-0">
    <circle cx="15" cy="15" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="15" cy="15" r="13" fill="none" stroke="currentColor" strokeWidth="1" opacity=".45" />
    <circle cx="24.2" cy="5.8" r="2.4" fill="var(--gold)" />
  </svg>
)
