import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
  async headers() {
    return [
      // The Studio is an app of its own; keep it out of iframes on other sites.
      { source: '/studio/:path*', headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }] },
      { source: '/:path*', headers: securityHeaders },
    ]
  },
}

export default nextConfig
