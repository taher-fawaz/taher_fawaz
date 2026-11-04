import type { Locale } from '@/lib/i18n/config'
import type { SeriesNav } from '@/lib/series'

/** A field that may exist in both languages. Arabic is the source language for editorial content. */
export type L = { ar?: string; en?: string }

/** Minimal Portable Text shape (what Sanity returns for block content). */
export type PTBlock = { _type: string; _key: string; [key: string]: unknown }
export type PT = PTBlock[]
export type LPT = { ar?: PT; en?: PT }

export type ImageAsset = { url: string; width: number; height: number; lqip?: string; alt?: L; caption?: L; credit?: string }

export type SocialLink = { platform: string; url?: string }

export type SiteSettings = {
  name: L
  role: L
  headline?: L
  intro: L
  story?: LPT
  principles: { title: L; text: L }[]
  email?: string
  location: L
  socials: SocialLink[]
  roles?: { engineer?: L; educator?: L; builder?: L }
  featuredProjectSlugs: string[]
  featuredArticleSlugs: string[]
  featuredVideoIds: string[]
}

export type Experience = {
  id: string
  employer: string
  role: L
  location: L
  workMode?: 'onsite' | 'hybrid' | 'remote'
  start: string // YYYY-MM
  end?: string // YYYY-MM, empty = current
  summary?: L
  highlights: L[]
  technologies: string[]
  /** Set while dates/roles still need confirmation by Taher. Shown publicly as a small marker. */
  needsReview: boolean
}

export type Project = {
  id: string
  slug: string
  title: string
  summary: L
  domain: L
  role?: L
  period?: string
  technologies: string[]
  contributions: L[]
  links: { label: string; url: string }[]
  featured: boolean
  cover?: ImageAsset
  gallery: ImageAsset[]
  caseStudy?: LPT
}

export type Category = { slug: string; title: L; description?: L }

export type ArticleSummary = {
  id: string
  slug: string
  language: Locale
  title: string
  excerpt?: string
  publishedAt: string
  readingMinutes: number
  category?: Category
  cover?: ImageAsset
  translationKey: string
  isSample?: boolean
}

/** Series membership of one article. Present only when the article and its series are published. */
export type ArticleSeries = { title: L; description?: L; nav: SeriesNav }

export type Article = ArticleSummary & {
  body: PT
  seo?: { title?: string; description?: string }
  translations: { slug: string; language: Locale; title: string }[]
  series?: ArticleSeries
}

export type Video = {
  id: string
  kind: 'video' | 'short'
  youtubeId?: string
  title: string
  language: Locale
  description?: string
  publishedAt?: string
  featured: boolean
  thumbnail?: ImageAsset
  isSample?: boolean
  /** Where the entry came from: the YouTube channel feed, a Sanity-only document, or local samples. */
  source?: 'youtube' | 'cms' | 'sample'
}

export type ContentSource = 'cms' | 'fallback'
