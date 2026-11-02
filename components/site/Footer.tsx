import Link from 'next/link'
import { localePath, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { contentSource } from '@/lib/content'

export function Footer({ locale }: { locale: Locale }) {
  const d = getDictionary(locale)
  return (
    <footer className="wrap pb-10 pt-6 text-[0.9rem] text-muted">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p>
          © <span className="meta text-[1em]">{new Date().getFullYear()}</span> {d.footer.rights}
        </p>
        <Link href={`${localePath(locale)}#top`} className="tlink">{d.game.backTop} ↑</Link>
      </div>
      {contentSource === 'fallback' ? (
        <p className="mt-4 text-[0.85rem]" role="note">
          <span className="chip chip-mark me-2">{d.common.sample}</span>
          {d.common.previewContent}
        </p>
      ) : null}
    </footer>
  )
}
