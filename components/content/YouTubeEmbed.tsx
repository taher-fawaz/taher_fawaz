'use client'

import Image from 'next/image'
import { useState } from 'react'
import { PlayIcon } from '@/components/ui/icons'

/**
 * Click-to-load YouTube facade: only a thumbnail is fetched until the visitor presses play,
 * then the privacy-enhanced (youtube-nocookie) player replaces it.
 */
export function YouTubeEmbed({ id, title, kind, playLabel, thumbnailUrl, sizes }: {
  id: string
  title: string
  kind: 'video' | 'short'
  playLabel: string
  thumbnailUrl?: string
  sizes: string
}) {
  const [active, setActive] = useState(false)
  const aspect = kind === 'short' ? 'aspect-[9/16]' : 'aspect-video'
  const src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`

  if (active) {
    return (
      <div className={`relative w-full overflow-hidden bg-night ${aspect}`}>
        <iframe
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    )
  }

  return (
    <button type="button" onClick={() => setActive(true)} aria-label={playLabel} className={`group relative block w-full cursor-pointer overflow-hidden bg-night ${aspect}`}>
      <Image
        src={thumbnailUrl ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        fill
        sizes={sizes}
        className="object-cover opacity-90 transition-[opacity,scale] duration-300 group-hover:scale-[1.02] group-hover:opacity-100"
      />
      <PlayBadge />
    </button>
  )
}

export function PlayBadge() {
  return (
    <span className="absolute inset-0 grid place-items-center" aria-hidden="true">
      <span className="grid size-14 place-items-center rounded-full border-[1.5px] border-gold-lt bg-night/40 text-gold-lt transition-[background-color,color,scale] duration-200 group-hover:scale-105 group-hover:bg-gold-lt group-hover:text-night">
        <PlayIcon size={22} />
      </span>
    </span>
  )
}
