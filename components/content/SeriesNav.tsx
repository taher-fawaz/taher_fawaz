import Link from 'next/link'
import { localePath, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { tr } from '@/lib/content/localize'
import type { ArticleSeries } from '@/lib/content/types'
import { ArrowIcon, BackIcon } from '@/components/ui/icons'

/** "Part 2 of 4 · Series title" shown in the article header. */
export function SeriesBadge({ series, locale }: { series: ArticleSeries; locale: Locale }) {
  const d = getDictionary(locale)
  return (
    <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.95rem]">
      <span className="font-semibold">{d.series.part(series.nav.part, series.nav.total)}</span>
      <span aria-hidden="true" className="text-muted">·</span>
      <span className="text-muted">{tr(series.title, locale)}</span>
    </p>
  )
}

/**
 * Contents, previous/next and a link to the first part.
 * Only published parts are in `series.nav`, so unpublished titles can never appear here.
 */
export function SeriesNav({ series, locale, articleLang }: { series: ArticleSeries; locale: Locale; articleLang: Locale }) {
  const d = getDictionary(locale)
  const { nav } = series
  const href = (slug: string) => localePath(locale, `/blog/${slug}`)
  const titleAttrs = { lang: articleLang, dir: articleLang === 'ar' ? ('rtl' as const) : ('ltr' as const) }
  const intro = tr(series.description, locale)
  return (
    <aside aria-labelledby="series-heading" className="rule-strong mt-14 w-full max-w-[68ch] pt-6">
      <h2 id="series-heading" className="section-title mb-1">{d.series.contents}</h2>
      <p className="text-muted">{tr(series.title, locale)}</p>
      {intro ? <p className="mt-2 text-[0.95rem] text-muted">{intro}</p> : null}
      <ol className="mt-5 grid gap-1">
        {nav.parts.map((p) => {
          const current = p.part === nav.part
          return (
            <li key={p.slug} className="flex min-h-11 items-center gap-3 py-1">
              <span className="meta w-6 shrink-0 text-muted">{p.part}</span>
              {current ? (
                <span aria-current="page" className="font-semibold" {...titleAttrs}>
                  {p.title} <span className="sr-only">({d.series.current})</span>
                </span>
              ) : (
                <Link href={href(p.slug)} className="tlink" {...titleAttrs}>{p.title}</Link>
              )}
            </li>
          )
        })}
      </ol>
      {!nav.complete ? <p role="note" className="mt-3 text-[0.92rem] text-muted">{d.series.more}</p> : null}
      {nav.first.part !== nav.part ? (
        <p className="mt-5">
          <Link href={href(nav.first.slug)} className="tlink min-h-11">{d.series.startHere}</Link>
        </p>
      ) : null}
      {nav.prev || nav.next ? (
        <nav aria-label={d.series.navLabel} className="mt-8 grid gap-4 border-t border-rule pt-6 sm:grid-cols-2">
          {nav.prev ? (
            <Link href={href(nav.prev.slug)} rel="prev" className="group block min-h-11 py-1">
              <span className="tlink"><BackIcon />{d.series.previous}</span>
              <span className="mt-1 block text-[0.95rem] text-muted group-hover:text-ink" {...titleAttrs}>{nav.prev.title}</span>
            </Link>
          ) : <span />}
          {nav.next ? (
            <Link href={href(nav.next.slug)} rel="next" className="group block min-h-11 py-1 sm:text-end">
              <span className="tlink">{d.series.next}<ArrowIcon /></span>
              <span className="mt-1 block text-[0.95rem] text-muted group-hover:text-ink" {...titleAttrs}>{nav.next.title}</span>
            </Link>
          ) : null}
        </nav>
      ) : null}
    </aside>
  )
}
