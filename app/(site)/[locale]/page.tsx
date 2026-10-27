import Link from 'next/link'
import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, localePath, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { getHomeData } from '@/lib/content'
import { pick, tr } from '@/lib/content/localize'
import { pageMetadata, siteUrl } from '@/lib/site'
import { Reveal } from '@/components/motion/Reveal'
import { Orbit, type OrbitBody } from '@/components/home/Orbit'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ExperienceList } from '@/components/content/ExperienceList'
import { ArticleList } from '@/components/content/ArticleList'
import { VideoCard } from '@/components/content/VideoCard'
import { SectionHeader, Chip, EmptyState } from '@/components/ui/primitives'
import { ArrowIcon } from '@/components/ui/icons'

// From the CV: the same list feeds the structured data below.
const SPECIALTIES = ['Flutter', 'Android', 'Kotlin', 'Clean Architecture']

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params
  return isLocale(locale) ? pageMetadata(locale, '/') : {}
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw
  const d = getDictionary(locale)
  const { settings, featuredProjects, experience, articles, videos, categories } = await getHomeData(locale)
  const current = experience.find((e) => !e.end)
  const headline = tr(settings.headline, locale) || d.home.headline
  const intro = pick(settings.intro, locale)
  const roles = (['engineer', 'educator', 'builder'] as const).map((role) => ({
    role,
    title: d.home.roles[role].title,
    text: tr(settings.roles?.[role], locale) || d.home.roles[role].text,
    href: localePath(locale, role === 'educator' ? '/blog' : '/projects'),
  }))

  const orbitBodies: OrbitBody[] = [
    { role: 'engineer', href: roles[0]!.href, label: roles[0]!.title, index: '01', r: 96, angle: -52 },
    { role: 'educator', href: roles[1]!.href, label: roles[1]!.title, index: '02', r: 166, angle: 52 },
    { role: 'builder', href: roles[2]!.href, label: roles[2]!.title, index: '03', r: 236, angle: 148 },
  ]

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Taher Fawaz',
    jobTitle: tr(settings.role, 'en'),
    url: `${siteUrl}${localePath(locale)}`,
    knowsAbout: [...SPECIALTIES, 'Mobile application development'],
    sameAs: settings.socials.map((s) => s.url).filter(Boolean),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c') }} />

      {/* 1–2. Hero + the three roles */}
      <section className="hero on-field bg-field text-field-ink" aria-labelledby="hero-title">
        {/* Small screens: the same drawing, decorative and cropped behind the copy so the first screen stays text-first. */}
        <div aria-hidden="true" className="pointer-events-none absolute -end-24 -top-4 w-[22rem] opacity-[0.28] sm:-end-16 sm:w-[28rem] lg:hidden">
          <Orbit decorative bodies={orbitBodies} label={d.home.rolesLabel} />
        </div>
        <div className="wrap relative pt-10 md:pt-16">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,6.3fr)_minmax(0,5.7fr)] lg:gap-10">
            <div>
              <p data-hero-item style={{ '--i': 0 } as CSSProperties} className="eyebrow">
                <span className="whitespace-nowrap">{tr(settings.name, locale)}</span>
                <span aria-hidden="true" className="text-field-muted max-sm:hidden">/</span>
                <span className="whitespace-nowrap">{tr(settings.role, locale)}</span>
              </p>
              <h1 id="hero-title" data-hero-item style={{ '--i': 1 } as CSSProperties} className="display-1 mt-6 max-w-[16ch] [html[lang=ar]_&]:max-w-[18ch]">{headline}</h1>
              <p data-hero-item style={{ '--i': 2 } as CSSProperties} className="mt-6 max-w-[54ch] text-[1.02rem] text-field-muted md:mt-7 md:text-[1.12rem]" lang={intro.lang}>
                {intro.text}
              </p>
              <div data-hero-item style={{ '--i': 3 } as CSSProperties} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link href={localePath(locale, '/projects')} className="btn btn-on-field">
                  {d.home.primaryCta}
                  <ArrowIcon />
                </Link>
                <Link href={localePath(locale, '/blog')} className="tlink">{d.home.secondaryCta}</Link>
              </div>
              <div data-hero-item style={{ '--i': 4 } as CSSProperties} className="mt-9 flex max-w-[62ch] flex-col gap-4 border-t border-field-rule pt-4 text-[0.95rem] text-field-muted">
                {current ? (
                  <p className="flex flex-wrap items-center gap-3">
                    <span className="chip">{d.home.now}</span>
                    <span>
                      {tr(current.role, locale)} · <bdi dir="ltr">{current.employer}</bdi>
                    </span>
                  </p>
                ) : null}
                <ul className="flex flex-wrap gap-2" aria-label={d.home.specialties}>
                  {SPECIALTIES.map((t) => (
                    <li key={t} className="tag border-field-rule text-field-muted">{t}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div data-hero-item style={{ '--i': 3 } as CSSProperties} className="hidden lg:block">
              <div className="mx-auto w-full max-w-[37rem]">
                <Orbit bodies={orbitBodies} label={d.home.rolesLabel} />
              </div>
            </div>
          </div>

          <h2 className="sr-only">{d.home.rolesLabel}</h2>
          <ul className="mt-12 grid border-t border-field-rule md:mt-14 md:grid-cols-3">
            {roles.map((r, i) => (
              <li key={r.role} className={i > 0 ? 'border-t border-field-rule md:border-s md:border-t-0' : ''}>
                <Link href={r.href} data-role={r.role} className="role-link group block px-0 py-6 md:px-6 md:py-8">
                  <span className="meta mb-3 flex items-center gap-3 text-field-muted">
                    <svg viewBox="0 0 28 8" aria-hidden="true" className="role-key">
                      <line x1="0" y1="4" x2="28" y2="4" stroke={r.role === 'engineer' ? 'var(--gold-lt)' : 'var(--field-ink)'} strokeOpacity={r.role === 'engineer' ? 1 : 0.6} strokeDasharray={r.role === 'builder' ? '3 3' : undefined} />
                    </svg>
                    0{i + 1}
                  </span>
                  <h3 className="flex items-center gap-2.5 text-[1.6rem] [html[lang=ar]_&]:text-[1.85rem]">
                    {r.title}
                    <ArrowIcon />
                  </h3>
                  <p className="mt-2 max-w-[36ch] text-[0.96rem] text-field-muted">
                    {r.text}
                    {r.role === 'builder' ? <span className="chip ms-2 align-middle">{d.common.comingSoon}</span> : null}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Selected projects */}
      {featuredProjects.length ? (
        <section className="wrap py-16 md:py-24" aria-labelledby="projects-title">
          <Reveal className="contents"><SectionHeader id="projects-title" title={d.home.projects} href={localePath(locale, '/projects')} linkLabel={d.common.allProjects} /></Reveal>
          <Reveal className="grid gap-y-14 md:grid-cols-12 md:gap-x-10">
            {featuredProjects.map((p, i) => (
              <ProjectCard key={p.id} project={p} locale={locale} variant={i === 0 ? 'lead' : 'second'} />
            ))}
          </Reveal>
        </section>
      ) : null}

      {/* 4. Experience highlights */}
      {experience.length ? (
        <section className="rule-top" aria-labelledby="exp-title">
          <div className="wrap py-16 md:py-24">
            <Reveal className="contents"><SectionHeader id="exp-title" title={d.home.experience} href={localePath(locale, '/experience')} linkLabel={d.common.fullExperience} /></Reveal>
            <Reveal>
              <ExperienceList items={experience} locale={locale} />
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* 5–6. Featured articles + content pillars */}
      <section className="rule-top" aria-labelledby="writing-title">
        <div className="wrap py-16 md:py-24">
          <Reveal className="contents"><SectionHeader id="writing-title" title={d.home.writing} href={localePath(locale, '/blog')} linkLabel={d.common.allArticles} /></Reveal>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-20">
            <Reveal>
              {articles.length ? <ArticleList items={articles} locale={locale} /> : <EmptyState title={d.empty.articles}>{d.empty.articlesBody}</EmptyState>}
            </Reveal>
            <div>
              <h3 className="mb-4 text-[1.35rem]">{d.home.pillars}</h3>
              <Reveal as="ul" className="rule-strong">
                {categories.map((c) => (
                  <li key={c.slug} data-reveal className="border-b border-rule">
                    <Link href={localePath(locale, `/blog/category/${c.slug}`)} className="group block py-5">
                      <span className="flex items-center gap-2 hover-underline font-display text-[1.3rem] [html[lang=ar]_&]:text-[1.45rem]">
                        {tr(c.title, locale)}
                        <ArrowIcon size={16} />
                      </span>
                      {c.description ? <span className="mt-1 block text-[0.95rem] text-muted">{tr(c.description, locale)}</span> : null}
                    </Link>
                  </li>
                ))}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Videos and Shorts */}
      {videos.length ? (
        <section className="rule-top" aria-labelledby="videos-title">
          <div className="wrap py-16 md:py-24">
            <Reveal className="contents"><SectionHeader id="videos-title" title={d.home.videos} href={localePath(locale, '/videos')} linkLabel={d.common.allVideos} /></Reveal>
            <Reveal className="grid grid-cols-2 items-start gap-x-4 gap-y-10 md:grid-cols-[minmax(0,32fr)_minmax(0,9fr)_minmax(0,9fr)] md:gap-x-6">
              {videos.map((v) => (
                <div key={v.id} className={v.kind === 'video' ? 'col-span-2 md:col-span-1' : ''}>
                  <VideoCard video={v} locale={locale} sizes={v.kind === 'video' ? '(min-width: 768px) 60vw, 100vw' : '(min-width: 768px) 18vw, 50vw'} />
                </div>
              ))}
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* 8. Contact */}
      <section className="on-night bg-night text-night-ink" aria-labelledby="close-title">
        <div className="wrap py-20 md:py-28">
          <h2 id="close-title" className="max-w-[20ch] text-[clamp(2rem,5vw,3.6rem)] leading-[1.1] tracking-[-0.015em] [html[lang=ar]_&]:max-w-none [html[lang=ar]_&]:leading-[1.4] [html[lang=ar]_&]:tracking-normal">
            {d.home.closeTitle}
          </h2>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link href={localePath(locale, '/contact')} className="btn btn-on-night">
              {d.home.closeCta}
              <ArrowIcon />
            </Link>
            {settings.socials.filter((s) => s.url).map((s) => (
              <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer me" className="text-night-muted underline underline-offset-4 hover:text-night-ink">{s.platform}</a>
            ))}
            {settings.socials.every((s) => !s.url) ? <Chip>{d.contact.linkPending}</Chip> : null}
          </div>
        </div>
      </section>
    </>
  )
}
