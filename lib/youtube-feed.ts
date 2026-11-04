import 'server-only'
import { isChannelId, parseYouTubeFeed, type FeedVideo } from './youtube-feed-parser'

/**
 * Recent uploads from the configured channel's public Atom feed (no API key needed).
 * Limitation: YouTube's feed lists only the ~15 most recent uploads, with title, link,
 * thumbnail, description and publish date. Older videos stay visible when they also exist
 * as Sanity video documents; a full archive would need the YouTube Data API (see docs).
 */
export type FeedStatus = 'not-configured' | 'invalid-config' | 'ok' | 'unavailable'
export type ChannelFeed = { status: FeedStatus; videos: FeedVideo[]; channelUrl?: string }

/** Refresh at most every 30 minutes; pages using it are regenerated in the background (ISR). */
export const YOUTUBE_REVALIDATE_SECONDS = 1800

export const youtubeChannelId = process.env.YOUTUBE_CHANNEL_ID?.trim() || undefined

export async function getChannelFeed(): Promise<ChannelFeed> {
  if (!youtubeChannelId) return { status: 'not-configured', videos: [] }
  if (!isChannelId(youtubeChannelId)) {
    console.warn('YOUTUBE_CHANNEL_ID is set but is not a valid channel ID (expected "UC" + 22 characters).')
    return { status: 'invalid-config', videos: [] }
  }
  const channelUrl = `https://www.youtube.com/channel/${youtubeChannelId}`
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${youtubeChannelId}`, {
      next: { revalidate: YOUTUBE_REVALIDATE_SECONDS, tags: ['youtube'] },
      signal: AbortSignal.timeout(8000),
      headers: { Accept: 'application/atom+xml, application/xml;q=0.9' },
    })
    if (!res.ok) {
      console.warn(`YouTube feed returned HTTP ${res.status}`)
      return { status: 'unavailable', videos: [], channelUrl }
    }
    const parsed = parseYouTubeFeed(await res.text())
    if (!parsed.ok) {
      console.warn('YouTube feed response was not a valid Atom feed')
      return { status: 'unavailable', videos: [], channelUrl }
    }
    return { status: 'ok', videos: parsed.videos, channelUrl }
  } catch (err) {
    console.warn('YouTube feed request failed:', err instanceof Error ? err.message : 'unknown error')
    return { status: 'unavailable', videos: [], channelUrl }
  }
}
