'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import { CloseIcon, GlobeIcon, MenuIcon } from '@/components/ui/icons'

export type NavItem = { key: string; href: string; label: string }

/** Section of the site a path belongs to: /en/blog/x → "blog". */
const sectionOf = (pathname: string) => pathname.split('/')[2] ?? ''

export function DesktopNav({ items, label }: { items: NavItem[]; label: string }) {
  const pathname = usePathname()
  const current = sectionOf(pathname)
  return (
    <nav aria-label={label} className="hidden lg:block">
      <ul className="flex gap-7 text-[0.95rem]">
        {items.map((item) => (
          <li key={item.key}>
            <Link href={item.href} className="nav-link" aria-current={current === item.key ? 'page' : undefined}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function MobileNav({ items, labels }: { items: NavItem[]; labels: { open: string; close: string; nav: string } }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const current = sectionOf(pathname)
  const panelId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        className="tool-btn"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? labels.close : labels.open}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>
      <nav id={panelId} aria-label={labels.nav} hidden={!open} className="absolute inset-x-0 top-full border-y border-rule bg-paper shadow-[0_12px_24px_-16px_rgb(0_0_0/0.35)]">
        <ul className="wrap py-2">
          {items.map((item) => (
            <li key={item.key} className="border-b border-rule last:border-b-0">
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={current === item.key || (item.key === 'home' && current === '') ? 'page' : undefined}
                className="block py-4 text-lg aria-[current=page]:font-semibold aria-[current=page]:text-link"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

/**
 * Switches the locale prefix of the current path. On article pages the target is
 * taken from the hreflang alternate, so a translated article opens its own slug.
 */
export function LanguageSwitch({ target, label, name }: { target: 'en' | 'ar'; label: string; name: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const swapped = pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${target}`)
  return (
    <Link
      href={swapped}
      hrefLang={target}
      lang={target}
      className="tool-btn gap-2 px-3"
      title={label}
      onClick={(e) => {
        document.cookie = `tf-locale=${target}; path=/; max-age=31536000; samesite=lax`
        const alt = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${target}"]`)
        if (alt) {
          const url = new URL(alt.href)
          if (url.pathname !== swapped) {
            e.preventDefault()
            router.push(url.pathname)
          }
        }
      }}
    >
      <GlobeIcon />
      <span className={target === 'ar' ? 'font-ar' : 'font-sans'}>{name}</span>
    </Link>
  )
}
