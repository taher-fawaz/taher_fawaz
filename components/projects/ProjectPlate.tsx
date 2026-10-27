import Image from 'next/image'
import type { ImageAsset } from '@/lib/content/types'
import type { Locale } from '@/lib/i18n/config'
import { tr } from '@/lib/content/localize'

/**
 * Real project imagery when the CMS provides it; otherwise a neutral, clearly labelled
 * placeholder drawn as plain device outlines. It never imitates a real app screen or logo.
 */
export function ProjectPlate({ image, locale, label, shape = 'wide', sizes, priority = false }: {
  image?: ImageAsset
  locale: Locale
  label: string
  shape?: 'wide' | 'tall' | 'phone'
  sizes: string
  priority?: boolean
}) {
  const aspect = shape === 'wide' ? 'aspect-[16/10]' : shape === 'tall' ? 'aspect-[4/5]' : 'aspect-[9/16]'
  if (image) {
    return (
      <div className={`plate ${aspect}`}>
        <Image
          src={image.url}
          alt={tr(image.alt, locale)}
          fill
          sizes={sizes}
          priority={priority}
          placeholder={image.lqip ? 'blur' : 'empty'}
          blurDataURL={image.lqip}
          className="plate-art object-cover"
        />
      </div>
    )
  }
  return (
    <div className={`plate ${aspect}`} role="img" aria-label={label}>
      <svg viewBox={shape === 'wide' ? '0 0 700 440' : shape === 'tall' ? '0 0 400 500' : '0 0 300 534'} className="plate-art absolute inset-0 h-full w-full" aria-hidden="true">
        <g fill="none" stroke="var(--ink)" strokeWidth="1.5" opacity=".55">
          {shape === 'wide' ? (
            <>
              <rect x="170" y="56" width="160" height="300" rx="18" />
              <rect x="372" y="86" width="160" height="300" rx="18" />
            </>
          ) : shape === 'tall' ? (
            <rect x="110" y="48" width="180" height="360" rx="20" />
          ) : (
            <rect x="60" y="44" width="180" height="400" rx="20" />
          )}
        </g>
      </svg>
      <span className="absolute inset-x-0 bottom-0 px-3.5 py-2.5 text-[0.75rem] text-muted">{label}</span>
    </div>
  )
}
