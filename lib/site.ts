import type { Metadata } from 'next'
import { localePath, locales, ogLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

/** Metadata for a locale-prefixed page, with canonical and hreflang alternates. */
export function pageMetadata(
  locale: Locale,
  path: string,
  opts: { title?: string; description?: string; languages?: Partial<Record<Locale, string>>; noindex?: boolean; type?: 'website' | 'article' } = {},
): Metadata {
  const dict = getDictionary(locale)
  const url = localePath(locale, path)
  const languages = Object.fromEntries(
    locales.map((l) => [l, opts.languages ? opts.languages[l] : localePath(l, path)]).filter(([, v]) => v),
  ) as Record<string, string>
  const title = opts.title ?? dict.meta.title
  const description = opts.description ?? dict.meta.description
  return {
    title: opts.title ? { absolute: `${opts.title} — ${dict.meta.siteName}` } : { absolute: dict.meta.title },
    description,
    alternates: { canonical: url, languages: { ...languages, 'x-default': languages.en ?? url } },
    openGraph: { type: opts.type ?? 'website', url, title, description, siteName: dict.meta.siteName, locale: ogLocale[locale] },
    twitter: { card: 'summary_large_image', title, description },
    robots: opts.noindex ? { index: false, follow: true } : undefined,
  }
}
