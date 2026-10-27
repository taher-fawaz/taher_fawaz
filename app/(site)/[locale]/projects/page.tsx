import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, localePath } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { getProjects } from '@/lib/content'
import { pick, tr } from '@/lib/content/localize'
import { pageMetadata } from '@/lib/site'
import { PageHeader } from '@/components/ui/primitives'
import { ArrowIcon } from '@/components/ui/icons'
import { Reveal } from '@/components/motion/Reveal'
import { ProjectCard } from '@/components/projects/ProjectCard'

export async function generateMetadata({ params }: PageProps<'/[locale]/projects'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return pageMetadata(locale, '/projects', { title: getDictionary(locale).projects.title })
}

export default async function ProjectsPage({ params }: PageProps<'/[locale]/projects'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const d = getDictionary(locale)
  const projects = await getProjects()
  const featured = projects.filter((p) => p.featured).slice(0, 2)
  const rest = projects.filter((p) => !featured.includes(p))
  return (
    <div className="wrap pb-20 md:pb-28">
      <PageHeader title={d.projects.title} lead={d.projects.lead} />
      <Reveal className="grid gap-y-14 md:grid-cols-12 md:gap-x-10">
        {featured.map((p, i) => (
          <ProjectCard key={p.id} project={p} locale={locale} variant={i === 0 ? 'lead' : 'second'} priority={i === 0} />
        ))}
      </Reveal>
      {rest.length ? (
        <section className="mt-20 md:mt-28" aria-labelledby="more">
          <h2 id="more" className="section-title mb-8">{d.projects.more}</h2>
          <Reveal as="ul" className="rule-strong">
            {rest.map((p) => {
              const summary = pick(p.summary, locale)
              return (
                <li key={p.id} data-reveal className="border-b border-rule">
                  <Link href={localePath(locale, `/projects/${p.slug}`)} className="group grid gap-x-8 gap-y-1 py-5 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_auto] md:items-baseline">
                    <span className="font-[family-name:var(--font-fraunces)] text-[1.35rem] transition-colors group-hover:text-link"><bdi dir="ltr">{p.title}</bdi></span>
                    <span className="text-muted" lang={summary.lang}>{summary.text}</span>
                    <span className="flex items-center gap-2 text-[0.9rem] text-muted">
                      {tr(p.domain, locale)}
                      <ArrowIcon size={16} />
                    </span>
                  </Link>
                </li>
              )
            })}
          </Reveal>
        </section>
      ) : null}
    </div>
  )
}
