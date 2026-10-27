import type { ReactNode } from 'react'

export { metadata, viewport } from 'next-sanity/studio'

// Separate root layout: the Studio is a full-screen app with its own styles.
export default function StudioRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
