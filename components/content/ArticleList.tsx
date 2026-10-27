import Link from 'next/link'
import type { LocalizedArticle } from '@/lib/content'
import { formatDate, tr } from '@/lib/content/localize'
import { localePath, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Chip } from '@/components/ui/primitives'

/** Editorial list, not cards. Titles render in the article's own language and direction. */
export function ArticleList({ items, locale }: { items: LocalizedArticle[]; locale: Locale }) {
  const d = getDictionary(locale)
  return (
    <ul className="rule-strong">
      {items.map((a) => {
        const foreign = a.language !== locale
        return (
          <li key={a.id} data-reveal className="border-b border-rule">
            <Link href={localePath(locale, `/blog/${a.slug}`)} className="group grid gap-x-6 gap-y-2 py-6 md:grid-cols-[8.5rem_minmax(0,1fr)]">
              <span className="pt-1 text-[0.9rem] text-muted">
                <time dateTime={a.publishedAt} className={locale === 'en' ? 'meta' : ''}>{formatDate(a.publishedAt, locale)}</time>
              </span>
              <div>
                <h3
                  lang={a.language}
                  dir={a.language === 'ar' ? 'rtl' : 'ltr'}
                  className={`text-start text-[clamp(1.3rem,2.4vw,1.75rem)] transition-colors duration-150 group-hover:text-link ${a.language === 'ar' ? 'font-ar-display font-bold leading-[1.55]' : 'font-[family-name:var(--font-fraunces)] leading-tight'}`}
                >
                  {a.title}
                </h3>
                {a.excerpt ? (
                  <p lang={a.language} dir={a.language === 'ar' ? 'rtl' : 'ltr'} className={`mt-1.5 max-w-[62ch] text-start text-[0.97rem] text-muted ${a.language === 'ar' ? 'font-ar' : ''}`}>
                    {a.excerpt}
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.88rem] text-muted">
                  {a.category ? <span>{tr(a.category.title, locale)}</span> : null}
                  <span>{d.common.minRead(a.readingMinutes)}</span>
                  {a.languages.length > 1 ? <Chip tone="cv">{d.common.bilingual}</Chip> : foreign && a.language === 'ar' ? <Chip tone="cv">{d.common.arabicOnly}</Chip> : null}
                  {a.isSample ? <Chip>{d.common.sample}</Chip> : null}
                </div>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
