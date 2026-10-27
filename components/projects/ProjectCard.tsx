import Link from 'next/link'
import type { Project } from '@/lib/content/types'
import { pick, tr } from '@/lib/content/localize'
import { localePath, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { ArrowIcon } from '@/components/ui/icons'
import { Tags } from '@/components/ui/primitives'
import { ProjectPlate } from './ProjectPlate'

/** Featured project: a large plate with its name set like a caption. `variant` keeps the pair deliberately unequal. */
export function ProjectCard({ project, locale, variant = 'lead', priority = false }: { project: Project; locale: Locale; variant?: 'lead' | 'second'; priority?: boolean }) {
  const d = getDictionary(locale)
  const summary = pick(project.summary, locale)
  return (
    <Link href={localePath(locale, `/projects/${project.slug}`)} data-reveal className={`group block ${variant === 'lead' ? 'md:col-span-7' : 'md:col-span-5 md:mt-28'}`}>
      <ProjectPlate
        image={project.cover}
        locale={locale}
        label={d.common.imagePlaceholder}
        shape={variant === 'lead' ? 'wide' : 'tall'}
        sizes={variant === 'lead' ? '(min-width: 768px) 58vw, 100vw' : '(min-width: 768px) 40vw, 100vw'}
        priority={priority}
      />
      <h3 className="hover-underline mt-5 text-[clamp(1.75rem,3.3vw,2.5rem)] leading-[1.1] font-[family-name:var(--font-fraunces)] font-medium"><bdi dir="ltr">{project.title}</bdi></h3>
      <p className="mt-2 text-[0.95rem] text-muted">{tr(project.domain, locale)}</p>
      <p className="mt-2 max-w-[46ch]" lang={summary.lang}>{summary.text}</p>
      <Tags items={project.technologies.slice(0, 4)} label={d.projects.stack} />
      <span className="mt-4 inline-flex items-center gap-2 font-medium text-link">
        {d.common.viewProject}
        <ArrowIcon />
      </span>
    </Link>
  )
}
