import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'
import { dataset, isSanityConfigured } from '@/sanity/env'

export const dynamic = 'force-static'

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 640, margin: '10vh auto', padding: '0 20px', lineHeight: 1.6 }}>
        <h1 style={{ fontSize: 24 }}>Sanity Studio is not configured yet</h1>
        <p>
          Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> (and optionally <code>NEXT_PUBLIC_SANITY_DATASET</code>, currently <code>{dataset}</code>) in{' '}
          <code>.env.local</code>, add this site’s URL as a CORS origin with credentials in the Sanity project settings, then restart the dev server.
        </p>
        <p>Until then, the public site renders the local fallback content.</p>
      </main>
    )
  }
  return <NextStudio config={config} />
}
