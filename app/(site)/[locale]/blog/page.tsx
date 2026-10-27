import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { pageMetadata } from '@/lib/site'
import { BlogIndex } from '@/components/content/BlogIndex'

export async function generateMetadata({ params }: PageProps<'/[locale]/blog'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const d = getDictionary(locale)
  return pageMetadata(locale, '/blog', { title: d.blog.title, description: d.blog.lead })
}

export default async function BlogPage({ params }: PageProps<'/[locale]/blog'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return <BlogIndex locale={locale} />
}
