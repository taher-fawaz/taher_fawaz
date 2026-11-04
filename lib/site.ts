import type { Metadata } from 'next'
import { localePath, locales, ogLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

/** Metadata for a locale-prefixed page, with canonical and hreflang alternates. */
export function pageMetadata(
  locale: Locale,
  path: string,
  opts: { title?: string; description?: string; languages?: Partial<Record<Locale, string>>; noindex?: boolean; type?: 'website' | 'article'; image?: { url: string; alt: string; width: number; height: number } } = {},
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
    openGraph: { type: opts.type ?? 'website', url, title, description, siteName: dict.meta.siteName, locale: ogLocale[locale], ...(opts.image ? { images: [opts.image] } : {}) },
    twitter: { card: 'summary_large_image', title, description, ...(opts.image ? { images: [opts.image.url] } : {}) },
    robots: opts.noindex ? { index: false, follow: true } : undefined,
  }
}

/**
 * Social share image for a Sanity cover: LinkedIn and others need a raster image at about 1.91:1,
 * so ask the Sanity image CDN for a 1200×630 PNG (it rasterises SVG covers too).
 */
export function shareImage(cover: { url: string } | undefined, alt: string) {
  if (!cover || !cover.url.startsWith('https://cdn.sanity.io/')) return undefined
  return { url: `${cover.url}?fm=png&w=1200&h=630&fit=crop&q=90`, alt, width: 1200, height: 630 }
}
