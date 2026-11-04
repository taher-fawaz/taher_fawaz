// Run with: npm test  (Node's built-in test runner; no extra dependencies)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { decodeXml, isChannelId, parseYouTubeFeed } from './youtube-feed-parser.ts'
import { mergeVideos, pickHomeVideos } from './video-library.ts'
import type { Video } from './content/types.ts'

// Shape mirrors YouTube's channel Atom feed. IDs and titles are test fixtures, not real videos.
const entry = (id: string, title: string, published: string, opts: { short?: boolean; thumbHost?: string; noThumb?: boolean } = {}) => `
  <entry>
    <id>yt:video:${id}</id>
    <yt:videoId>${id}</yt:videoId>
    <yt:channelId>UCaaaaaaaaaaaaaaaaaaaaaa</yt:channelId>
    <title>${title}</title>
    <link rel="alternate" href="https://www.youtube.com/${opts.short ? `shorts/${id}` : `watch?v=${id}`}"/>
    <author><name>Test Channel</name></author>
    <published>${published}</published>
    <updated>${published}</updated>
    <media:group>
      <media:title>${title}</media:title>
      <media:content url="https://www.youtube.com/v/${id}?version=3" type="application/x-shockwave-flash" width="640" height="390"/>
      ${opts.noThumb ? '' : `<media:thumbnail url="https://${opts.thumbHost ?? 'i1.ytimg.com'}/vi/${id}/hqdefault.jpg" width="480" height="360"/>`}
      <media:description>Description for ${title}</media:description>
    </media:group>
  </entry>`

const feed = (...entries: string[]) => `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
  <link rel="self" href="http://www.youtube.com/feeds/videos.xml?channel_id=UCaaaaaaaaaaaaaaaaaaaaaa"/>
  <id>yt:channel:aaaaaaaaaaaaaaaaaaaaaa</id>
  <title>Test Channel</title>
  ${entries.join('\n')}
</feed>`

test('parses regular videos and Shorts, newest first, with normalised thumbnails', () => {
  const r = parseYouTubeFeed(feed(
    entry('AAAAAAAAAA1', 'Older video', '2026-09-01T10:00:00+00:00'),
    entry('BBBBBBBBBB2', 'A short', '2026-10-01T10:00:00+00:00', { short: true }),
  ))
  assert.equal(r.ok, true)
  if (!r.ok) return
  assert.equal(r.channelTitle, 'Test Channel')
  assert.deepEqual(r.videos.map((v) => [v.youtubeId, v.kind]), [['BBBBBBBBBB2', 'short'], ['AAAAAAAAAA1', 'video']])
  assert.equal(r.videos[0]!.url, 'https://www.youtube.com/shorts/BBBBBBBBBB2')
  assert.equal(r.videos[1]!.url, 'https://www.youtube.com/watch?v=AAAAAAAAAA1')
  assert.equal(r.videos[1]!.thumbnailUrl, 'https://i.ytimg.com/vi/AAAAAAAAAA1/hqdefault.jpg')
  assert.equal(r.videos[1]!.publishedAt, '2026-09-01T10:00:00.000Z')
  assert.equal(r.videos[1]!.description, 'Description for Older video')
})

test('decodes XML entities and keeps Arabic titles intact', () => {
  const r = parseYouTubeFeed(feed(entry('CCCCCCCCCC3', 'Bloc &amp; Riverpod &#8211; &quot;شرح&quot; &#x2764;', '2026-10-02T00:00:00Z')))
  assert.equal(r.ok && r.videos[0]!.title, 'Bloc & Riverpod – "شرح" ❤')
  assert.equal(decodeXml('&lt;b&gt; &apos;x&apos; &unknown;'), "<b> 'x' &unknown;")
})

test('drops duplicate entries and entries with invalid or missing IDs', () => {
  const dup = entry('DDDDDDDDDD4', 'Same video', '2026-10-03T00:00:00Z')
  const r = parseYouTubeFeed(feed(dup, dup, entry('bad id!', 'Broken', '2026-10-03T00:00:00Z'), '<entry><title>No id</title></entry>'))
  assert.equal(r.ok && r.videos.length, 1)
})

test('handles empty feeds, non-feed responses and truncated XML without throwing', () => {
  assert.deepEqual(parseYouTubeFeed(feed()), { ok: true, channelTitle: 'Test Channel', videos: [] })
  assert.deepEqual(parseYouTubeFeed('<!doctype html><html><body>Not found</body></html>'), { ok: false, reason: 'not-a-feed' })
  assert.deepEqual(parseYouTubeFeed(''), { ok: false, reason: 'not-a-feed' })
  const truncated = feed(entry('EEEEEEEEEE5', 'Complete', '2026-10-04T00:00:00Z')).replace('</feed>', '') + '<entry><yt:videoId>FFFFFFFFFF6</yt:videoId><title>Cut off'
  const r = parseYouTubeFeed(truncated)
  assert.equal(r.ok && r.videos.map((v) => v.youtubeId).join(), 'EEEEEEEEEE5')
})

test('ignores thumbnails from unexpected hosts and tolerates missing ones', () => {
  const r = parseYouTubeFeed(feed(
    entry('GGGGGGGGGG7', 'Evil thumb', '2026-10-05T00:00:00Z', { thumbHost: 'example.com' }),
    entry('HHHHHHHHHH8', 'No thumb', '2026-10-04T00:00:00Z', { noThumb: true }),
  ))
  assert.equal(r.ok && r.videos.every((v) => v.thumbnailUrl === undefined), true)
})

test('validates channel IDs', () => {
  assert.equal(isChannelId('UCaaaaaaaaaaaaaaaaaaaaaa'), true)
  assert.equal(isChannelId('@taherfawaz'), false)
  assert.equal(isChannelId('UCshort'), false)
  assert.equal(isChannelId(undefined), false)
})

test('merges feed and CMS videos: feed is the source, CMS adds editorial fields, no duplicates', () => {
  const r = parseYouTubeFeed(feed(
    entry('IIIIIIIIII9', 'Feed title', '2026-10-06T00:00:00Z'),
    entry('JJJJJJJJJJ0', 'شورت جديد', '2026-10-07T00:00:00Z', { short: true }),
  ))
  assert.ok(r.ok)
  const cms: Video[] = [
    { id: 'sanity-1', youtubeId: 'IIIIIIIIII9', kind: 'video', title: 'Edited title', language: 'en', featured: true },
    { id: 'sanity-2', youtubeId: 'KKKKKKKKKK1', kind: 'video', title: 'Old archive video', language: 'ar', featured: false, publishedAt: '2025-01-01T00:00:00Z' },
  ]
  const merged = mergeVideos(r.videos, cms)
  assert.deepEqual(merged.map((v) => [v.youtubeId, v.source]), [['JJJJJJJJJJ0', 'youtube'], ['IIIIIIIIII9', 'youtube'], ['KKKKKKKKKK1', 'cms']])
  const edited = merged.find((v) => v.youtubeId === 'IIIIIIIIII9')!
  assert.equal(edited.title, 'Edited title')
  assert.equal(edited.featured, true)
  assert.equal(edited.id, 'sanity-1')
  assert.equal(edited.thumbnail?.url, 'https://i.ytimg.com/vi/IIIIIIIIII9/hqdefault.jpg')
  assert.equal(merged[0]!.language, 'ar')
})

test('home picks one video and two Shorts, featured first then newest', () => {
  const v = (id: string, kind: Video['kind'], featured = false, day = 1): Video => ({ id, kind, youtubeId: id.padEnd(11, 'x'), title: id, language: 'en', featured, publishedAt: `2026-10-${String(day).padStart(2, '0')}T00:00:00Z` })
  const all = [v('v-new', 'video', false, 9), v('v-feat', 'video', true, 1), v('s1', 'short', false, 8), v('s2', 'short', false, 7), v('s3', 'short', false, 6)]
  assert.deepEqual(pickHomeVideos(all, []).map((x) => x.id), ['v-feat', 's1', 's2'])
  assert.deepEqual(pickHomeVideos(all, ['s3']).map((x) => x.id), ['v-new', 's3', 's1'])
  assert.deepEqual(pickHomeVideos([], []), [])
})
