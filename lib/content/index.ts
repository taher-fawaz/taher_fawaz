import 'server-only'
import { cache } from 'react'
import { isSanityConfigured } from '@/sanity/env'
import { sanityFetch } from '@/sanity/client'
import * as q from '@/sanity/queries'
import { parseYouTube } from '@/lib/youtube'
import { getChannelFeed, type FeedStatus } from '@/lib/youtube-feed'
import { mergeVideos, pickHomeVideos } from '@/lib/video-library'
import type { Locale } from '@/lib/i18n/config'
import * as fb from './fallback'
import { buildSeriesNav, type SeriesMember } from '@/lib/series'
import type { Article, ArticleSummary, Category, ContentSource, Experience, L, Project, SiteSettings, Video } from './types'

/**
 * Single entry point for content. When Sanity is configured every function reads
 * published documents from the CMS; otherwise it returns the clearly marked local fallback.
 * A configured-but-unreachable CMS throws instead of silently showing fallback data.
 */
export const contentSource: ContentSource = isSanityConfigured ? 'cms' : 'fallback'

export const getSettings = cache(async (): Promise<SiteSettings> => {
  if (!isSanityConfigured) return fb.fallbackSettings
  const s = await sanityFetch<Partial<SiteSettings> | null>(q.settingsQuery, {}, ['siteSettings'])
  // A brand-new dataset has no settings document yet: keep the CV-based defaults until one is published.
  if (!s) return fb.fallbackSettings
  return {
    ...fb.fallbackSettings,
    ...s,
    principles: s.principles ?? [],
    socials: s.socials?.length ? s.socials : fb.fallbackSettings.socials,
    featuredProjectSlugs: s.featuredProjectSlugs ?? [],
    featuredArticleSlugs: s.featuredArticleSlugs ?? [],
    featuredVideoIds: s.featuredVideoIds ?? [],
  } as SiteSettings
})

export const getExperience = cache(async (): Promise<Experience[]> =>
  isSanityConfigured ? sanityFetch<Experience[]>(q.experienceQuery, {}, ['experience']) : fb.fallbackExperience,
)

export const getProjects = cache(async (): Promise<Project[]> =>
  isSanityConfigured ? sanityFetch<Project[]>(q.projectsQuery, {}, ['project']) : fb.fallbackProjects,
)

export const getProject = cache(async (slug: string): Promise<Project | null> => {
  if (!isSanityConfigured) return fb.fallbackProjects.find((p) => p.slug === slug) ?? null
  return sanityFetch<Project | null>(q.projectQuery, { slug }, ['project'])
})

export const getCategories = cache(async (): Promise<Category[]> =>
  isSanityConfigured ? sanityFetch<Category[]>(q.categoriesQuery, {}, ['category']) : fb.fallbackCategories,
)

const withMinutes = <T extends { readingMinutes: number | null }>(a: T) => ({ ...a, readingMinutes: Math.max(1, a.readingMinutes ?? 1) })

export const getArticles = cache(async (): Promise<ArticleSummary[]> => {
  if (!isSanityConfigured) return fb.fallbackArticleSummaries
  const rows = await sanityFetch<ArticleSummary[]>(q.articlesQuery, {}, ['article', 'category'])
  return rows.map(withMinutes)
})

type RawArticle = Omit<Article, 'series'> & {
  series?: { id: string; title: L; description?: L; totalParts?: number } | null
}

export const getArticle = cache(async (slug: string): Promise<Article | null> => {
  if (!isSanityConfigured) return fb.fallbackArticles.find((a) => a.slug === slug) ?? null
  const raw = await sanityFetch<RawArticle | null>(q.articleQuery, { slug }, ['article', 'category', 'series'])
  if (!raw) return null
  // Series navigation is built only from published parts, so drafts never leak titles or links.
  let series: Article['series']
  if (raw.series?.id) {
    const members = await sanityFetch<SeriesMember[]>(q.seriesMembersQuery, { seriesId: raw.series.id, language: raw.language }, ['article', 'series'])
    const nav = buildSeriesNav(members, raw.slug, raw.series.totalParts)
    if (nav) series = { title: raw.series.title, description: raw.series.description, nav }
  }
  return withMinutes({ ...raw, series, body: raw.body ?? [], translations: raw.translations ?? [] })
})

type RawVideo = Omit<Video, 'kind' | 'youtubeId'> & { url?: string }
const getCmsVideos = async (): Promise<Video[]> => {
  if (!isSanityConfigured) return []
  const rows = await sanityFetch<RawVideo[]>(q.videosQuery, {}, ['video'])
  return rows.flatMap(({ url, ...v }) => {
    const parsed = parseYouTube(url)
    return parsed ? [{ ...v, youtubeId: parsed.id, kind: parsed.kind }] : []
  })
}

/**
 * Videos = the channel's recent uploads (YouTube feed) merged with any Sanity video documents.
 * Local sample entries appear only when neither a channel nor the CMS is configured.
 */
export const getVideoLibrary = cache(async (): Promise<{ videos: Video[]; feedStatus: FeedStatus; channelUrl?: string }> => {
  const [feed, cms] = await Promise.all([getChannelFeed(), getCmsVideos()])
  if (feed.status === 'not-configured' && !isSanityConfigured) {
    return { videos: fb.fallbackVideos.map((v) => ({ ...v, source: 'sample' as const })), feedStatus: feed.status }
  }
  return { videos: mergeVideos(feed.videos, cms), feedStatus: feed.status, channelUrl: feed.channelUrl }
})

export const getVideos = cache(async (): Promise<Video[]> => (await getVideoLibrary()).videos)

/**
 * Articles shown in one UI language: one entry per translation group,
 * preferring the version written in that language, otherwise the original (usually Arabic).
 */
export function articlesForLocale(articles: ArticleSummary[], locale: Locale) {
  const groups = new Map<string, ArticleSummary[]>()
  for (const a of articles) groups.set(a.translationKey, [...(groups.get(a.translationKey) ?? []), a])
  return [...groups.values()]
    .map((versions) => {
      const shown = versions.find((v) => v.language === locale) ?? versions.find((v) => v.language === 'ar') ?? versions[0]!
      return { ...shown, languages: [...new Set(versions.map((v) => v.language))] }
    })
    .sort((x, y) => (x.publishedAt < y.publishedAt ? 1 : -1))
}
export type LocalizedArticle = ReturnType<typeof articlesForLocale>[number]

/** Homepage selections from Site settings, falling back to `featured` flags and recency. */
export async function getHomeData(locale: Locale) {
  const [settings, projects, experience, articles, videos, categories] = await Promise.all([
    getSettings(), getProjects(), getExperience(), getArticles(), getVideos(), getCategories(),
  ])
  const bySlug = (slugs: string[]) => slugs.map((s) => projects.find((p) => p.slug === s)).filter((p): p is Project => !!p)
  const featuredProjects = (settings.featuredProjectSlugs.length ? bySlug(settings.featuredProjectSlugs) : projects.filter((p) => p.featured)).slice(0, 2)
  const localized = articlesForLocale(articles, locale)
  const picked = settings.featuredArticleSlugs.length
    ? localized.filter((a) => articles.some((o) => settings.featuredArticleSlugs.includes(o.slug) && o.translationKey === a.translationKey))
    : localized
  return { settings, featuredProjects, experience: experience.slice(0, 4), articles: picked.slice(0, 3), videos: pickHomeVideos(videos, settings.featuredVideoIds), categories }
}
