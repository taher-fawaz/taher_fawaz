'use client'

import { useLayoutEffect, useSyncExternalStore } from 'react'
import { MoonIcon, SunIcon } from '@/components/ui/icons'

type Theme = 'light' | 'dark'

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => observer.disconnect()
}
const getTheme = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

export function ThemeToggle({ labels }: { labels: { toDark: string; toLight: string } }) {
  // Re-apply the theme if React reset <html> attributes (dev Strict Mode remount). No-op in production.
  useLayoutEffect(() => {
    if (document.documentElement.dataset.theme) return
    let t: string | null = null
    try {
      t = localStorage.getItem('tf-theme')
    } catch {
      /* storage unavailable */
    }
    document.documentElement.dataset.theme = t === 'dark' || t === 'light' ? t : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }, [])
  const theme = useSyncExternalStore(subscribe, getTheme, () => 'light' as Theme)
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      className="tool-btn"
      aria-label={dark ? labels.toLight : labels.toDark}
      onClick={() => {
        const next: Theme = dark ? 'light' : 'dark'
        document.documentElement.dataset.theme = next
        try {
          localStorage.setItem('tf-theme', next)
        } catch {
          /* storage unavailable: theme still applies for this visit */
        }
      }}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
