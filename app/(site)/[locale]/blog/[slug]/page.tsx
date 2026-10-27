import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, localePath, locales, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { getArticle, getArticles } from '@/lib/content'
import { formatDate, tr } from '@/lib/content/localize'
import { pageMetadata, siteUrl } from '@/lib/site'
import { BackIcon } from '@/components/ui/icons'
import { Chip } from '@/components/ui/primitives'
import { PortableBody } from '@/components/content/PortableBody'
import { SeriesBadge, SeriesNav } from '@/components/content/SeriesNav'

export async function generateStaticParams() {
  const articles = await getArticles()
  return locales.flatMap((locale) => articles.map((a) => ({ locale, slug: a.slug })))
}

/** Each language version has its own URL; alternates point at real translations only. */
function alternates(article: { slug: string; language: Locale; translations: { slug: string; language: Locale }[] }) {
  const map: Partial<Record<Locale, string>> = { [article.language]: localePath(article.language, `/blog/${article.slug}`) }
  for (const t of article.translations) map[t.language] = localePath(t.language, `/blog/${t.slug}`)
  return map
}

export async function generateMetadata({ params }: PageProps<'/[locale]/blog/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const a = await getArticle(slug)
  if (!a) return {}
  const base = pageMetadata(locale, `/blog/${slug}`, { title: a.seo?.title || a.title, description: a.seo?.description || a.excerpt, languages: alternates(a), type: 'article', noindex: a.isSample })
  // Canonical is the article in its own language, even when viewed inside the other UI language.
  return { ...base, alternates: { ...base.alternates, canonical: localePath(a.language, `/blog/${a.slug}`) } }
}

export default async function ArticlePage({ params }: PageProps<'/[locale]/blog/[slug]'>) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const article = await getArticle(slug)
  if (!article) notFound()
  const d = getDictionary(locale)
  const isAr = article.language === 'ar'
  const other = article.translations.find((t) => t.language !== article.language)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    inLanguage: article.language,
    datePublished: article.publishedAt,
    author: { '@type': 'Person', name: 'Taher Fawaz' },
    mainEntityOfPage: `${siteUrl}${localePath(article.language, `/blog/${article.slug}`)}`,
  }

  return (
    <article className="wrap pb-20 md:pb-28">
      {!article.isSample ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} /> : null}
      <header className="pb-8 pt-10 md:pt-16">
        <Link href={localePath(locale, '/blog')} className="tlink">
          <BackIcon />
          {d.common.allArticles}
        </Link>
        <h1
          lang={article.language}
          dir={isAr ? 'rtl' : 'ltr'}
          className={`mt-6 text-start text-[clamp(2rem,4.8vw,3.4rem)] ${article.language === locale ? 'max-w-[26ch]' : ''} ${isAr ? 'font-ar-display font-bold leading-[1.45]' : 'font-[family-name:var(--font-fraunces)] font-medium leading-[1.12] tracking-[-0.015em]'}`}
        >
          {article.title}
        </h1>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.92rem] text-muted">
          {article.category ? (
            <Link href={localePath(locale, `/blog/category/${article.category.slug}`)} className="underline-offset-4 hover:underline">{tr(article.category.title, locale)}</Link>
          ) : null}
          <time dateTime={article.publishedAt} className={locale === 'en' ? 'meta' : ''}>{formatDate(article.publishedAt, locale)}</time>
          <span>{d.common.minRead(article.readingMinutes)}</span>
          {article.isSample ? <Chip>{d.common.sample}</Chip> : null}
        </div>
        {article.series ? <SeriesBadge series={article.series} locale={locale} /> : null}
        <p className="mt-4 text-[0.92rem] text-muted">
          {other ? (
            <Link href={localePath(other.language, `/blog/${other.slug}`)} hrefLang={other.language} lang={other.language} className="tlink">
              {other.language === 'en' ? d.blog.englishAvailable : d.blog.arabicAvailable}
            </Link>
          ) : isAr && locale === 'en' ? (
            d.blog.onlyArabic
          ) : null}
        </p>
      </header>
      {article.cover ? (
        <Image src={article.cover.url} alt={tr(article.cover.alt, locale)} width={article.cover.width} height={article.cover.height} priority sizes="(min-width: 1200px) 1100px, 100vw" className="mb-10 h-auto w-full" placeholder={article.cover.lqip ? 'blur' : 'empty'} blurDataURL={article.cover.lqip} />
      ) : null}
      <div className={`flex ${isAr && locale === 'en' ? 'justify-end' : ''} ${!isAr && locale === 'ar' ? 'justify-end' : ''}`}>
        <PortableBody value={article.body} lang={article.language} />
      </div>
      {article.series ? (
        <div className={`flex ${isAr && locale === 'en' ? 'justify-end' : ''} ${!isAr && locale === 'ar' ? 'justify-end' : ''}`}>
          <SeriesNav series={article.series} locale={locale} articleLang={article.language} />
        </div>
      ) : null}
    </article>
  )
}
