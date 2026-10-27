export const locales = ['en', 'ar'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value)
export const dirOf = (locale: Locale) => (locale === 'ar' ? 'rtl' : 'ltr')
export const otherLocale = (locale: Locale): Locale => (locale === 'ar' ? 'en' : 'ar')

/** Build a locale-prefixed internal path: localePath('ar', '/blog') → '/ar/blog'. */
export function localePath(locale: Locale, path = '/') {
  const clean = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`
  return `/${locale}${clean}`
}

export const ogLocale: Record<Locale, string> = { en: 'en_US', ar: 'ar_EG' }
