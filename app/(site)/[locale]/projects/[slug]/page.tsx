import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, localePath, locales } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { contentSource, getProject, getProjects } from '@/lib/content'
import { pick, pickBlocks, tr } from '@/lib/content/localize'
import { pageMetadata } from '@/lib/site'
import { BackIcon, ExternalIcon } from '@/components/ui/icons'
import { Chip, Tags } from '@/components/ui/primitives'
import { ProjectPlate } from '@/components/projects/ProjectPlate'
import { PortableBody } from '@/components/content/PortableBody'

export async function generateStaticParams() {
  const projects = await getProjects()
  return locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })))
}

export async function generateMetadata({ params }: PageProps<'/[locale]/projects/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const project = await getProject(slug)
  if (!project) return {}
  return pageMetadata(locale, `/projects/${slug}`, { title: project.title, description: tr(project.summary, locale) })
}

export default async function ProjectPage({ params }: PageProps<'/[locale]/projects/[slug]'>) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const project = await getProject(slug)
  if (!project) notFound()
  const d = getDictionary(locale)
  const summary = pick(project.summary, locale)
  const caseStudy = pickBlocks(project.caseStudy, locale)
  const shots = project.gallery.length ? project.gallery : null
  const meta: [string, React.ReactNode][] = [
    [d.projects.domain, tr(project.domain, locale)],
    ...(project.role ? [[d.projects.role, tr(project.role, locale)] as [string, React.ReactNode]] : []),
    ...(project.period ? [[d.projects.period, <span key="p" className="meta text-[0.95em]">{project.period}</span>] as [string, React.ReactNode]] : []),
  ]

  return (
    <article className="wrap pb-20 md:pb-28">
      <header className="pt-10 md:pt-16">
        <Link href={localePath(locale, '/projects')} className="tlink">
          <BackIcon />
          {d.common.allProjects}
        </Link>
        <h1 className="display-2 mt-6 font-[family-name:var(--font-fraunces)] font-medium [html[lang=ar]_&]:leading-[1.1]"><bdi dir="ltr">{project.title}</bdi></h1>
        <p className="mt-5 max-w-[60ch] text-lg text-muted" lang={summary.lang}>{summary.text}</p>
        <dl className="rule-strong mt-8 grid gap-x-8 gap-y-4 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          {meta.map(([label, value]) => (
            <div key={label}>
              <dt className="text-[0.85rem] text-muted">{label}</dt>
              <dd className="mt-0.5 font-medium">{value}</dd>
            </div>
          ))}
          <div>
            <dt className="text-[0.85rem] text-muted">{d.projects.stack}</dt>
            <dd><Tags items={project.technologies} label={d.projects.stack} /></dd>
          </div>
        </dl>
      </header>

      <section aria-label={d.projects.screens} className="my-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
        {(shots ?? [undefined, undefined, undefined]).map((img, i) => (
          <div key={i} className={`${i === 1 ? 'md:mt-10' : ''} ${i === 2 ? 'hidden md:block' : ''}`}>
            <ProjectPlate image={img} locale={locale} label={d.common.imagePlaceholder} shape="phone" sizes="(min-width: 768px) 30vw, 50vw" priority={i === 0} />
          </div>
        ))}
      </section>

      <div className="grid gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-20">
        <div>
          {project.contributions.length ? (
            <section aria-labelledby="contrib">
              <h2 id="contrib" className="section-title mb-5 flex flex-wrap items-center gap-3">
                {d.projects.contributions}
                {contentSource === 'fallback' ? <Chip tone="cv">{d.common.fromCv}</Chip> : null}
              </h2>
              <ul className="max-w-[68ch] list-disc space-y-2 ps-5">
                {project.contributions.map((c, i) => {
                  const t = pick(c, locale)
                  return <li key={i} lang={t.lang}>{t.text}</li>
                })}
              </ul>
            </section>
          ) : null}
          {caseStudy ? (
            <div className="mt-12"><PortableBody value={caseStudy.blocks} lang={caseStudy.lang} /></div>
          ) : (
            <p className="mt-10 max-w-[62ch] border border-dashed border-muted p-5 text-[0.95rem] text-muted">
              <span className="chip chip-mark me-2">{d.common.placeholder}</span>
              {d.projects.caseStudyPending}
            </p>
          )}
        </div>
        {project.links.length ? (
          <aside>
            <h2 className="mb-3 text-[1.3rem]">{d.projects.links}</h2>
            <ul className="space-y-2">
              {project.links.map((l) => (
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className="tlink">{l.label}<ExternalIcon size={16} /></a>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </div>
    </article>
  )
}
