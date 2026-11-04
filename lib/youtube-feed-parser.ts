/**
 * Parser for YouTube's public channel Atom feed:
 *   https://www.youtube.com/feeds/videos.xml?channel_id=UC…
 * Pure and dependency-free (no DOM, no XML library) so it runs in Server Components,
 * route handlers and plain `node --test`. Unknown or malformed entries are skipped, never thrown.
 */

export type FeedVideo = {
  youtubeId: string
  kind: 'video' | 'short'
  title: string
  url: string
  publishedAt?: string
  description?: string
  thumbnailUrl?: string
}

export type FeedParseResult = { ok: true; channelTitle?: string; videos: FeedVideo[] } | { ok: false; reason: 'not-a-feed' }

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }

/** Decode the XML entities YouTube emits (named, decimal and hex). */
export function decodeXml(text: string) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === '#') {
      const n = code[1]?.toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10)
      return Number.isFinite(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : match
    }
    return ENTITIES[code.toLowerCase()] ?? match
  })
}

const stripCdata = (s: string) => s.replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, '$1')
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function tagText(xml: string, tag: string) {
  const m = xml.match(new RegExp(`<${escapeRe(tag)}(?:\\s[^>]*)?>([\\s\\S]*?)</${escapeRe(tag)}>`, 'i'))
  return m?.[1] !== undefined ? decodeXml(stripCdata(m[1])).trim() : undefined
}

function attr(xml: string, tag: string, name: string, where?: (tagSource: string) => boolean) {
  const re = new RegExp(`<${escapeRe(tag)}\\b[^>]*>`, 'gi')
  for (const m of xml.matchAll(re)) {
    if (where && !where(m[0])) continue
    const a = m[0].match(new RegExp(`\\s${escapeRe(name)}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'))
    if (a) return decodeXml(a[2] ?? a[3] ?? '')
  }
  return undefined
}

const VIDEO_ID = /^[\w-]{11}$/

/** Valid channel IDs start with "UC" followed by 22 URL-safe characters. */
export const isChannelId = (id: string | undefined): id is string => !!id && /^UC[\w-]{22}$/.test(id)

export function parseYouTubeFeed(xml: string): FeedParseResult {
  if (typeof xml !== 'string' || !/<feed[\s>]/i.test(xml)) return { ok: false, reason: 'not-a-feed' }
  const head = xml.split(/<entry[\s>]/i)[0] ?? ''
  const channelTitle = tagText(head, 'title')

  const seen = new Set<string>()
  const videos: FeedVideo[] = []
  for (const m of xml.matchAll(/<entry(?:\s[^>]*)?>([\s\S]*?)<\/entry>/gi)) {
    const entry = m[1] ?? ''
    const youtubeId = tagText(entry, 'yt:videoId')
    const title = tagText(entry, 'title') ?? tagText(entry, 'media:title')
    if (!youtubeId || !VIDEO_ID.test(youtubeId) || !title || seen.has(youtubeId)) continue
    seen.add(youtubeId)

    const href = attr(entry, 'link', 'href', (t) => /rel\s*=\s*["']alternate["']/i.test(t)) ?? attr(entry, 'link', 'href')
    // Shorts are linked as /shorts/<id> in the feed; everything else is a regular video.
    const kind: FeedVideo['kind'] = href && /\/shorts\//.test(href) ? 'short' : 'video'
    const url = kind === 'short' ? `https://www.youtube.com/shorts/${youtubeId}` : `https://www.youtube.com/watch?v=${youtubeId}`
    const published = tagText(entry, 'published')
    const publishedAt = published && !Number.isNaN(Date.parse(published)) ? new Date(published).toISOString() : undefined
    const thumb = attr(entry, 'media:thumbnail', 'url')
    const thumbnailUrl = thumb && /^https:\/\/i\d?\.ytimg\.com\//.test(thumb) ? thumb.replace(/^https:\/\/i\d\.ytimg\.com\//, 'https://i.ytimg.com/') : undefined

    videos.push({ youtubeId, kind, title, url, publishedAt, description: tagText(entry, 'media:description') || undefined, thumbnailUrl })
  }
  videos.sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
  return { ok: true, channelTitle, videos }
}
