import { NextResponse, type NextRequest } from 'next/server'
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n/config'

/** Saved choice first, then the browser's preferred language, then English. */
function preferredLocale(request: NextRequest): Locale {
  const saved = request.cookies.get('tf-locale')?.value
  if (saved && isLocale(saved)) return saved
  const accept = request.headers.get('accept-language') ?? ''
  const ranked = accept
    .split(',')
    .map((part) => {
      const [tag = '', q] = part.trim().split(';q=')
      return { lang: tag.toLowerCase().split('-')[0] ?? '', q: q ? Number(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)
  return (ranked.find((r) => isLocale(r.lang))?.lang as Locale | undefined) ?? defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const first = pathname.split('/')[1] ?? ''
  if (isLocale(first)) return
  const url = request.nextUrl.clone()
  url.pathname = `/${preferredLocale(request)}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url, 307)
}

export const config = {
  // Everything except Next internals, the Studio, API routes and files with an extension.
  matcher: ['/((?!_next|studio|api|.*\\..*).*)'],
}
