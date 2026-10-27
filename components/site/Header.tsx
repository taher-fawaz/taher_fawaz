import Link from 'next/link'
import { localePath, otherLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { Mark } from '@/components/ui/icons'
import { DesktopNav, LanguageSwitch, MobileNav, type NavItem } from './Nav'
import { ThemeToggle } from './ThemeToggle'

export function Header({ locale }: { locale: Locale }) {
  const d = getDictionary(locale)
  const keys = ['projects', 'experience', 'blog', 'videos', 'about', 'contact'] as const
  const items: NavItem[] = keys.map((k) => ({ key: k, href: localePath(locale, `/${k}`), label: d.nav[k] }))
  const target = otherLocale(locale)
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur-[6px] supports-[backdrop-filter]:bg-paper/85">
      <div className="wrap relative flex h-[4.25rem] items-center gap-3 sm:gap-5">
        <Link href={localePath(locale)} className="me-auto flex items-center gap-2.5 whitespace-nowrap font-display text-[1.15rem] leading-none sm:gap-3 [html[lang=ar]_&]:text-[1.4rem]">
          <Mark />
          <span>{d.meta.siteName}</span>
        </Link>
        <DesktopNav items={items} label={d.a11y.primaryNav} />
        <div className="flex items-center gap-1.5 sm:gap-2">
          <LanguageSwitch target={target} label={d.a11y.switchLang} name={d.langName} />
          <ThemeToggle labels={{ toDark: d.a11y.themeDark, toLight: d.a11y.themeLight }} />
          <MobileNav items={[{ key: 'home', href: localePath(locale), label: d.nav.home }, ...items]} labels={{ open: d.a11y.menu, close: d.a11y.closeMenu, nav: d.a11y.primaryNav }} />
        </div>
      </div>
    </header>
  )
}
