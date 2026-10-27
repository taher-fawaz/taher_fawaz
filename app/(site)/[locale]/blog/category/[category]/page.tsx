import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, locales } from '@/lib/i18n/config'
import { getCategories } from '@/lib/content'
import { tr } from '@/lib/content/localize'
import { pageMetadata } from '@/lib/site'
import { BlogIndex } from '@/components/content/BlogIndex'

export async function generateStaticParams() {
  const categories = await getCategories()
  return locales.flatMap((locale) => categories.map((c) => ({ locale, category: c.slug })))
}

export async function generateMetadata({ params }: PageProps<'/[locale]/blog/category/[category]'>): Promise<Metadata> {
  const { locale, category } = await params
  if (!isLocale(locale)) return {}
  const c = (await getCategories()).find((x) => x.slug === category)
  if (!c) return {}
  return pageMetadata(locale, `/blog/category/${category}`, { title: tr(c.title, locale), description: tr(c.description, locale) || undefined })
}

export default async function CategoryPage({ params }: PageProps<'/[locale]/blog/category/[category]'>) {
  const { locale, category } = await params
  if (!isLocale(locale)) notFound()
  const exists = (await getCategories()).some((c) => c.slug === category)
  if (!exists) notFound()
  return <BlogIndex locale={locale} category={category} />
}
