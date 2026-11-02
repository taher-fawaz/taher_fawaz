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
  // The site is one page now; old section URLs land on the matching part of the home page.
  async redirects() {
    return [
      { source: '/:locale(en|ar)/projects/:path*', destination: '/:locale#work', permanent: true },
      { source: '/:locale(en|ar)/experience', destination: '/:locale#experience', permanent: true },
      { source: '/:locale(en|ar)/about', destination: '/:locale', permanent: true },
      { source: '/:locale(en|ar)/videos', destination: '/:locale#videos', permanent: true },
      { source: '/:locale(en|ar)/contact', destination: '/:locale#contact', permanent: true },
    ]
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
