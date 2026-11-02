import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import '../../globals.css'
import { dirOf, isLocale, locales } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { fontVariables } from '@/lib/fonts'
import { siteUrl } from '@/lib/site'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const d = getDictionary(locale)
  return {
    metadataBase: new URL(siteUrl),
    title: { default: d.meta.title, template: `%s — ${d.meta.siteName}` },
    description: d.meta.description,
    applicationName: d.meta.siteName,
    authors: [{ name: 'Taher Fawaz' }],
  }
}

export const viewport: Viewport = {
  themeColor: '#EDEBE6',
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const d = getDictionary(locale)
  return (
    <html lang={locale} dir={dirOf(locale)} className={fontVariables}>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="fixed start-3 top-[-4rem] z-50 rounded-full border-2 border-ink bg-yellow px-4 py-2.5 font-semibold text-ink transition-[top] focus:top-3">
          {d.a11y.skip}
        </a>
        <Header locale={locale} />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer locale={locale} />
      </body>
    </html>
  )
}
