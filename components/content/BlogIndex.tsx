import Link from 'next/link'
import { articlesForLocale, getArticles, getCategories } from '@/lib/content'
import { tr } from '@/lib/content/localize'
import { localePath, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { EmptyState, PageHeader } from '@/components/ui/primitives'
import { Reveal } from '@/components/motion/Reveal'
import { ArticleList } from './ArticleList'

/** Shared by /blog and /blog/category/[category]. Category filters are plain links, so they work without JS and are indexable. */
export async function BlogIndex({ locale, category }: { locale: Locale; category?: string }) {
  const d = getDictionary(locale)
  const [articles, categories] = await Promise.all([getArticles(), getCategories()])
  const list = articlesForLocale(articles, locale).filter((a) => !category || a.category?.slug === category)
  const active = categories.find((c) => c.slug === category)
  const filters = [{ slug: undefined as string | undefined, label: d.blog.all }, ...categories.map((c) => ({ slug: c.slug, label: tr(c.title, locale) }))]
  return (
    <div className="wrap pb-20 md:pb-28">
      <PageHeader title={active ? tr(active.title, locale) : d.blog.title} lead={active?.description ? tr(active.description, locale) : d.blog.lead} />
      <nav aria-label={d.blog.category} className="mb-8">
        <ul className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const current = f.slug === category
            return (
              <li key={f.slug ?? 'all'}>
                <Link
                  href={localePath(locale, f.slug ? `/blog/category/${f.slug}` : '/blog')}
                  aria-current={current ? 'page' : undefined}
                  className="inline-flex min-h-11 items-center rounded-[2px] border border-rule px-4 transition-colors hover:border-forest aria-[current=page]:border-forest aria-[current=page]:bg-forest aria-[current=page]:text-[#f6f1e7] dark:aria-[current=page]:border-gold-lt dark:aria-[current=page]:bg-gold-lt dark:aria-[current=page]:text-night"
                >
                  {f.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      {list.length ? (
        <Reveal>
          <ArticleList items={list} locale={locale} />
        </Reveal>
      ) : (
        <EmptyState
          title={category ? d.empty.category : d.empty.articles}
          actions={category ? <Link href={localePath(locale, '/blog')} className="tlink">{d.blog.all}</Link> : undefined}
        >
          {category ? d.empty.categoryBody : d.empty.articlesBody}
        </EmptyState>
      )}
    </div>
  )
}
