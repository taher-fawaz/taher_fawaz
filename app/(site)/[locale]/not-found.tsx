import Link from 'next/link'
import { getDictionary } from '@/lib/i18n/dictionaries'

// Rendered inside the locale layout. The locale is not passed to not-found files,
// so the message is shown in both languages.
export default function NotFound() {
  const en = getDictionary('en')
  const ar = getDictionary('ar')
  return (
    <div className="wrap py-24 md:py-32">
      <p className="meta text-muted">404</p>
      <h1 className="display-2 mt-4">{en.common.notFoundTitle}</h1>
      <p className="mt-4 text-lg text-muted">{en.common.notFoundBody}</p>
      <p lang="ar" dir="rtl" className="mt-8 text-start font-ar text-lg text-muted">{ar.common.notFoundTitle} — {ar.common.notFoundBody}</p>
      <div className="mt-10 flex flex-wrap gap-6">
        <Link href="/en" className="btn">{en.common.goHome}</Link>
        <Link href="/ar" lang="ar" className="tlink font-ar">{ar.common.goHome}</Link>
      </div>
    </div>
  )
}
