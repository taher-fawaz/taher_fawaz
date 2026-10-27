import type { Video } from '@/lib/content/types'
import type { Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { formatDate } from '@/lib/content/localize'
import { Chip } from '@/components/ui/primitives'
import { ExternalIcon, PlayIcon } from '@/components/ui/icons'
import { YouTubeEmbed } from './YouTubeEmbed'

export function VideoCard({ video, locale, sizes }: { video: Video; locale: Locale; sizes: string }) {
  const d = getDictionary(locale)
  const short = video.kind === 'short'
  const kindLabel = short ? d.videos.youtubeShort : d.videos.youtubeVideo
  const watchUrl = video.youtubeId ? (short ? `https://www.youtube.com/shorts/${video.youtubeId}` : `https://www.youtube.com/watch?v=${video.youtubeId}`) : null
  return (
    <figure data-reveal className="min-w-0">
      {video.youtubeId ? (
        <YouTubeEmbed id={video.youtubeId} title={video.title} kind={video.kind} playLabel={d.videos.play(video.title)} thumbnailUrl={video.thumbnail?.url} sizes={sizes} />
      ) : (
        // Sample entry: no real video exists yet, so nothing is loaded from YouTube.
        <div role="img" aria-label={d.videos.samplePlay} className={`relative grid w-full place-items-center bg-night text-night-muted ${short ? 'aspect-[9/16]' : 'aspect-video'}`}>
          <span className="grid size-14 place-items-center rounded-full border-[1.5px] border-gold-lt/70 text-gold-lt/80" aria-hidden="true"><PlayIcon size={22} /></span>
          <span className="absolute inset-x-0 bottom-0 flex justify-between gap-2 px-3.5 py-3 text-[0.75rem]">
            <span>{kindLabel}</span>
            <span>{d.common.sample}</span>
          </span>
        </div>
      )}
      <figcaption className="mt-3">
        <p lang={video.language} dir={video.language === 'ar' ? 'rtl' : 'ltr'} className={`text-start font-medium leading-snug ${video.language === 'ar' ? 'font-ar' : ''}`}>{video.title}</p>
        <p className="mt-1 flex flex-wrap items-center gap-2 text-[0.85rem] text-muted">
          <span>{kindLabel}</span>
          {video.publishedAt ? <time dateTime={video.publishedAt} className={locale === 'en' ? 'meta' : ''}>{formatDate(video.publishedAt, locale)}</time> : null}
          {video.isSample ? <Chip>{d.common.sample}</Chip> : null}
          {watchUrl ? (
            <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-ink">
              {d.videos.openOnYouTube}
              <ExternalIcon size={14} />
            </a>
          ) : null}
        </p>
      </figcaption>
    </figure>
  )
}
