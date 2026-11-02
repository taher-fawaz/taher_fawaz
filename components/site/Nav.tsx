'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { GlobeIcon } from '@/components/ui/icons'

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
