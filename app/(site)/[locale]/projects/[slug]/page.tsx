import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { isLocale, localePath, locales } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { getProject, getProjects } from '@/lib/content'
import { pick, pickBlocks, tr } from '@/lib/content/localize'
import { pageMetadata, shareImage } from '@/lib/site'
import { BackIcon, ExternalIcon } from '@/components/ui/icons'
import { PortableBody } from '@/components/content/PortableBody'

/** Only projects with a written case study get a page; the rest live as cards on the home page. */
export async function generateStaticParams() {
  const projects = await getProjects()
  return locales.flatMap((locale) => projects.filter((p) => p.hasStory).map((p) => ({ locale, slug: p.slug })))
}

export async function generateMetadata({ params }: PageProps<'/[locale]/projects/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const p = await getProject(slug)
  if (!p || !pickBlocks(p.caseStudy, locale)) return {}
  return pageMetadata(locale, `/projects/${slug}`, {
    title: p.title,
    description: tr(p.summary, locale),
    type: 'article',
    image: shareImage(p.cover, tr(p.cover?.alt, locale) || p.title),
  })
}

const platform = (url: string, label: string) => (/apple\.com/.test(url) ? 'App Store' : /play\.google/.test(url) ? 'Google Play' : label)

export default async function ProjectPage({ params }: PageProps<'/[locale]/projects/[slug]'>) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const project = await getProject(slug)
  if (!project) notFound()
  const story = pickBlocks(project.caseStudy, locale)
  // No story yet: the card on the home page is the project's home.
  if (!story) redirect(`${localePath(locale, '/')}#work`)

  const d = getDictionary(locale)
  const summary = pick(project.summary, locale)
  const role = tr(project.role, locale)
  const domain = tr(project.domain, locale)
  const links = project.links.filter((l) => l.label && l.url)
  const facts: [string, React.ReactNode][] = [
    ...(domain ? [[d.projects.domain, domain] as [string, React.ReactNode]] : []),
    ...(role ? [[d.projects.role, role] as [string, React.ReactNode]] : []),
    ...(project.period ? [[d.projects.period, <bdi key="p" dir="ltr" className="meta">{project.period}</bdi>] as [string, React.ReactNode]] : []),
  ]

  return (
    <article className="wrap pb-20 md:pb-28">
      <header className="pb-10 pt-10 md:pt-16">
        <Link href={`${localePath(locale, '/')}#work`} className="tlink">
          <BackIcon />
          {d.common.allProjects}
        </Link>
        <p className="label mt-8">{d.projects.story}</p>
        <h1 className="mt-3 font-[family-name:var(--font-unbounded)] text-[clamp(2.1rem,5.6vw,4rem)] font-bold leading-[1.05] tracking-[-0.03em] text-balance">
          <bdi dir="ltr">{project.title}</bdi>
        </h1>
        <p className="mt-5 max-w-[56ch] text-[1.15rem] text-muted text-pretty" lang={summary.lang}>{summary.text}</p>

        <div className="hw mt-9 grid gap-6 rounded-[22px] p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-3">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt className="mono text-[0.72rem] text-muted">{label}</dt>
                <dd className="mt-1 font-semibold">{value}</dd>
              </div>
            ))}
            {project.technologies.length ? (
              <div className="sm:col-span-3">
                <dt className="mono text-[0.72rem] text-muted">{d.projects.stack}</dt>
                <dd className="mt-2">
                  <ul className="flex flex-wrap gap-1.5" dir="ltr">
                    {project.technologies.map((t) => (
                      <li key={t} className="mono rounded-full border-[1.5px] border-ink bg-surface px-2.5 py-0.5 text-[0.72rem]">{t}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ) : null}
          </dl>
          {links.length ? (
            <ul className="flex flex-wrap gap-2.5" aria-label={d.projects.links}>
              {links.map((l) => (
                <li key={l.url}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full border-2 border-ink bg-yellow px-4 text-[0.9rem] font-bold text-ink shadow-[0_3px_0_var(--ink)] transition-[transform,box-shadow] active:translate-y-[2px] active:shadow-[0_1px_0_var(--ink)]"
                  >
                    <bdi dir="ltr">{platform(l.url, l.label)}</bdi>
                    <ExternalIcon size={16} />
                    <span className="sr-only">, {d.game.newTab}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </header>

      <div className={`flex ${story.lang !== locale ? 'justify-end' : ''}`}>
        <PortableBody value={story.blocks} lang={story.lang} />
      </div>

      <p className="mt-14">
        <Link href={`${localePath(locale, '/')}#work`} className="tlink">
          <BackIcon />
          {d.common.allProjects}
        </Link>
      </p>
    </article>
  )
}
