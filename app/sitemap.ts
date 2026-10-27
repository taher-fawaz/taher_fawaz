import type { MetadataRoute } from 'next'
import { localePath, locales } from '@/lib/i18n/config'
import { getArticles, getCategories, getProjects } from '@/lib/content'
import { siteUrl } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, articles, categories] = await Promise.all([getProjects(), getArticles(), getCategories()])
  const pair = (path: string) => ({ alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}${localePath(l, path)}`])) } })
  const staticPaths = ['/', '/about', '/experience', '/projects', '/blog', '/videos', '/contact']
  return [
    ...staticPaths.flatMap((p) => locales.map((l) => ({ url: `${siteUrl}${localePath(l, p)}`, ...pair(p) }))),
    ...projects.flatMap((p) => locales.map((l) => ({ url: `${siteUrl}${localePath(l, `/projects/${p.slug}`)}`, ...pair(`/projects/${p.slug}`) }))),
    ...categories.flatMap((c) => locales.map((l) => ({ url: `${siteUrl}${localePath(l, `/blog/category/${c.slug}`)}` }))),
    // Articles are listed once, under their own language. Samples are excluded.
    ...articles.filter((a) => !a.isSample).map((a) => ({ url: `${siteUrl}${localePath(a.language, `/blog/${a.slug}`)}`, lastModified: a.publishedAt })),
  ]
}
