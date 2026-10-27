import type { Experience } from '@/lib/content/types'
import { formatMonth, pick, tr } from '@/lib/content/localize'
import type { Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Chip, Ltr } from '@/components/ui/primitives'

export function ExperienceList({ items, locale, detailed = false }: { items: Experience[]; locale: Locale; detailed?: boolean }) {
  const d = getDictionary(locale)
  return (
    <ol className="rule-strong">
      {items.map((e) => {
        const role = pick(e.role, locale)
        return (
          <li key={e.id} data-reveal className="grid gap-x-8 gap-y-2 border-b border-rule py-6 md:grid-cols-[13rem_minmax(0,1fr)_auto] md:items-baseline">
            <p className="text-[0.95rem] text-muted">
              <span className={locale === 'en' ? 'meta text-[0.9em]' : ''}>
                {formatMonth(e.start, locale)} – {e.end ? formatMonth(e.end, locale) : d.common.present}
              </span>
              {e.needsReview ? <span className="mt-2 block"><Chip>{d.common.underReview}</Chip></span> : null}
            </p>
            <div>
              <h3 className="text-[1.35rem] leading-snug [html[lang=ar]_&]:text-[1.45rem]">
                <Ltr>{e.employer}</Ltr>
              </h3>
              <p className="text-muted" lang={role.lang}>{role.text}</p>
              {detailed && e.highlights.length ? (
                <ul className="mt-3 max-w-[68ch] list-disc space-y-1.5 ps-5 text-[0.97rem]">
                  {e.highlights.map((h, i) => {
                    const p = pick(h, locale)
                    return <li key={i} lang={p.lang}>{p.text}</li>
                  })}
                </ul>
              ) : null}
            </div>
            <p className="text-[0.92rem] text-muted md:text-end">{tr(e.location, locale)}</p>
          </li>
        )
      })}
    </ol>
  )
}
