import Link from 'next/link'
import { localePath, otherLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { AchievementBadge } from '@/components/game/Achievements'
import { LanguageSwitch } from './Nav'

/** Floating pill bar: plain-word anchors to the home sections, achievements, language, contact. */
export function Header({ locale }: { locale: Locale }) {
  const d = getDictionary(locale)
  const g = d.game
  const home = localePath(locale)
  const anchors = [
    { id: 'work', label: g.menu.work },
    { id: 'experience', label: g.menu.experience },
    { id: 'articles', label: g.menu.articles },
    { id: 'skills', label: g.menu.skills },
    { id: 'play', label: g.menu.play },
  ]
  return (
    <header className="sticky top-3.5 z-40 px-3 sm:px-5">
      <div className="mx-auto flex max-w-[75rem] items-center gap-2 rounded-full border-2 border-ink bg-surface py-2 pe-2 ps-2.5 shadow-[0_4px_0_var(--ink)] sm:gap-2.5">
        <Link href={home} className="me-auto flex items-center gap-2.5 whitespace-nowrap text-ink no-underline">
          <span aria-hidden="true" className="grid size-10 place-items-center rounded-full border-2 border-ink bg-orange font-[family-name:var(--font-unbounded)] text-[0.8rem] font-bold">TF</span>
          <span className="font-display text-[0.95rem] font-semibold [html[lang=ar]_&]:text-[1.05rem]">{d.meta.siteName}</span>
        </Link>
        <nav aria-label={d.a11y.primaryNav} className="hidden lg:block">
          <ul className="flex gap-0.5">
            {anchors.map((a) => (
              <li key={a.id}>
                <Link href={`${home}#${a.id}`} className="pill !px-3 text-ink xl:!px-4">{a.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <AchievementBadge label={g.achievements} />
        <LanguageSwitch target={otherLocale(locale)} label={d.a11y.switchLang} name={d.langName} />
        <Link href={`${home}#contact`} className="btn btn-dark !min-h-11 !px-4 !text-[0.95rem] !shadow-none sm:!px-5">{d.nav.contact}</Link>
      </div>
    </header>
  )
}
