import Link from 'next/link'
import { localePath, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { contentSource } from '@/lib/content'

export function Footer({ locale }: { locale: Locale }) {
  const d = getDictionary(locale)
  return (
    <footer className="border-t border-rule py-10 text-[0.92rem] text-muted">
      <div className="wrap flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3">
        <p>
          © <span className="meta text-[1em]">{new Date().getFullYear()}</span> {d.footer.rights}
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {(['projects', 'blog', 'videos', 'contact'] as const).map((k) => (
            <li key={k}>
              <Link href={localePath(locale, `/${k}`)} className="hover:text-ink">{d.nav[k]}</Link>
            </li>
          ))}
        </ul>
      </div>
      {contentSource === 'fallback' ? (
        <p className="wrap mt-6 text-[0.85rem]" role="note">
          <span className="chip chip-mark me-2">{d.common.sample}</span>
          {d.common.previewContent}
        </p>
      ) : null}
    </footer>
  )
}
