import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import '../../globals.css'
import { dirOf, isLocale, locales } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { fontVariables } from '@/lib/fonts'
import { siteUrl } from '@/lib/site'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { Buddy } from '@/components/game/Buddy'
import { AchievementToast } from '@/components/game/Achievements'
import type { AchievementId } from '@/lib/achievements'

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
      {/* Browser extensions (e.g. ColorZilla adds cz-shortcut-listen) edit <body> attributes before React loads. */}
      <body className="flex min-h-dvh flex-col" suppressHydrationWarning>
        <a href="#main" className="fixed start-3 top-[-4rem] z-50 rounded-full border-2 border-ink bg-yellow px-4 py-2.5 font-semibold text-ink transition-[top] focus:top-3">
          {d.a11y.skip}
        </a>
        <Header locale={locale} />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <Footer locale={locale} />
        <Buddy lines={d.game.buddy} />
        <AchievementToast heading={d.game.unlocked} items={d.game.ach as Record<AchievementId, [string, string]>} />
        {/* Cookieless page views and Core Web Vitals; both only send data on Vercel deployments. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
