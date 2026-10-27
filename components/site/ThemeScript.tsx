'use client'

// Runs before first paint and applies the saved or system theme, so there is no flash of the wrong theme.
// Per the Next.js "preventing flash" guide: executable on the server render, inert (text/plain) when React
// renders it on the client, which avoids React's dev warning about <script> tags during client rendering.
export const applyThemeScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem('tf-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.setAttribute('data-theme',t)}catch(e){d.setAttribute('data-theme','light')}})()`

export function ThemeScript() {
  return (
    <script
      type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: applyThemeScript }}
    />
  )
}
