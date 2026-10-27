// Pure series helpers (no framework imports) so they can be unit-tested with `npm test`.

export type SeriesMember = { slug: string; title: string; part: number }

export type SeriesNav = {
  /** Position of the current article. */
  part: number
  /** Planned number of parts (never lower than the highest published part). */
  total: number
  /** Published parts only, in reading order. Drafts and unpublished parts never reach this list. */
  parts: SeriesMember[]
  first: SeriesMember
  prev?: SeriesMember
  next?: SeriesMember
  /** True when every planned part is published. */
  complete: boolean
}

const validPart = (n: unknown): n is number => typeof n === 'number' && Number.isInteger(n) && n >= 1

/**
 * Builds navigation for one article from the *published* members of its series.
 * Returns null when the article is not a published member (so no series UI is shown).
 * Gaps are skipped: if part 2 is still a draft, part 1 links straight to part 3.
 */
export function buildSeriesNav(members: SeriesMember[], currentSlug: string, plannedParts: number | undefined): SeriesNav | null {
  const seen = new Set<number>()
  const parts = members
    .filter((m) => m.slug && m.title && validPart(m.part) && !seen.has(m.part) && !!seen.add(m.part))
    .sort((a, b) => a.part - b.part)
  const index = parts.findIndex((m) => m.slug === currentSlug)
  const current = parts[index]
  if (!current) return null
  const total = Math.max(plannedParts && Number.isInteger(plannedParts) ? plannedParts : 0, parts[parts.length - 1]!.part)
  return {
    part: current.part,
    total,
    parts,
    first: parts[0]!,
    prev: parts[index - 1],
    next: parts[index + 1],
    complete: parts.length === total,
  }
}
