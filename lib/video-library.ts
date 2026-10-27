import type { FeedVideo } from './youtube-feed-parser'
import type { Video } from './content/types'

/** Arabic script anywhere in the title marks the video as Arabic; otherwise English. */
export const guessLanguage = (text: string): Video['language'] => (/[؀-ۿ]/.test(text) ? 'ar' : 'en')

export function feedToVideo(v: FeedVideo): Video {
  return {
    id: `yt-${v.youtubeId}`,
    kind: v.kind,
    youtubeId: v.youtubeId,
    title: v.title,
    language: guessLanguage(v.title),
    description: v.description,
    publishedAt: v.publishedAt,
    featured: false,
    // The feed's hqdefault thumbnail is 480×360.
    thumbnail: v.thumbnailUrl ? { url: v.thumbnailUrl, width: 480, height: 360 } : undefined,
    source: 'youtube',
  }
}

/**
 * YouTube is the source of truth for recent uploads. A Sanity video document with the same
 * YouTube ID only adds editorial choices (featured flag, title/language override, custom
 * thumbnail). Sanity-only videos keep older uploads visible beyond the feed's window.
 * Result is de-duplicated by YouTube ID and sorted newest first.
 */
export function mergeVideos(feed: FeedVideo[], cms: Video[]): Video[] {
  const byId = new Map<string, Video>()
  for (const f of feed) if (!byId.has(f.youtubeId)) byId.set(f.youtubeId, feedToVideo(f))
  for (const c of cms) {
    if (!c.youtubeId) continue
    const base = byId.get(c.youtubeId)
    byId.set(
      c.youtubeId,
      base
        ? { ...base, id: c.id, title: c.title || base.title, language: c.language || base.language, description: c.description || base.description, featured: c.featured, thumbnail: c.thumbnail ?? base.thumbnail, kind: c.kind, source: 'youtube' }
        : { ...c, source: 'cms' },
    )
  }
  return [...byId.values()].sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
}

/** One regular video plus two Shorts for the homepage: featured first, then the newest. */
export function pickHomeVideos(videos: Video[], featuredIds: string[]): Video[] {
  const chosen = featuredIds.length ? videos.filter((v) => featuredIds.includes(v.id)) : videos.filter((v) => v.featured)
  const pick = (kind: Video['kind'], n: number) => {
    const first = chosen.filter((v) => v.kind === kind)
    const rest = videos.filter((v) => v.kind === kind && !first.includes(v))
    return [...first, ...rest].slice(0, n)
  }
  return [...pick('video', 1), ...pick('short', 2)]
}
