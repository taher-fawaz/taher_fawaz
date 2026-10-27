/** Parse a YouTube watch / youtu.be / shorts / embed URL into its 11-character video ID and kind. */
export function parseYouTube(url: string | undefined): { id: string; kind: 'video' | 'short' } | null {
  if (!url) return null
  let u: URL
  try {
    u = new URL(url)
  } catch {
    return null
  }
  const host = u.hostname.replace(/^www\.|^m\./, '')
  let id: string | null = null
  let kind: 'video' | 'short' = 'video'
  if (host === 'youtu.be') id = u.pathname.slice(1)
  else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const [, first, second] = u.pathname.split('/')
    if (first === 'watch') id = u.searchParams.get('v')
    else if (first === 'shorts') {
      id = second ?? null
      kind = 'short'
    } else if (first === 'embed' || first === 'live') id = second ?? null
  }
  return id && /^[\w-]{11}$/.test(id) ? { id, kind } : null
}
