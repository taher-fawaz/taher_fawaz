import type { Locale } from '@/lib/i18n/config'
import type { L, LPT, PT } from './types'

/** Pick the requested language, falling back to the other one. Returns the language actually used. */
export function pick(value: L | undefined, locale: Locale): { text: string; lang: Locale } {
  const own = value?.[locale]?.trim()
  if (own) return { text: own, lang: locale }
  const other: Locale = locale === 'ar' ? 'en' : 'ar'
  return { text: value?.[other]?.trim() ?? '', lang: other }
}

export const tr = (value: L | undefined, locale: Locale) => pick(value, locale).text

export function pickBlocks(value: LPT | undefined, locale: Locale): { blocks: PT; lang: Locale } | null {
  if (value?.[locale]?.length) return { blocks: value[locale]!, lang: locale }
  const other: Locale = locale === 'ar' ? 'en' : 'ar'
  if (value?.[other]?.length) return { blocks: value[other]!, lang: other }
  return null
}

const MONTHS: Record<Locale, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
}

/** "2025-07" → "Jul 2025" / "يوليو 2025" (Western digits in both languages). */
export function formatMonth(ym: string | undefined, locale: Locale) {
  if (!ym) return ''
  const [y, m] = ym.split('-')
  const month = MONTHS[locale][Number(m) - 1]
  return month ? `${month} ${y}` : (y ?? '')
}

/** ISO date → "12 Oct 2026" / "12 أكتوبر 2026". */
export function formatDate(iso: string | undefined, locale: Locale) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getUTCDate()} ${MONTHS[locale][d.getUTCMonth()]} ${d.getUTCFullYear()}`
}
