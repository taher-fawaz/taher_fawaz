import Link from 'next/link'
import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale, localePath, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { getExperience, getHomeData, getProjects } from '@/lib/content'
import { pick, tr } from '@/lib/content/localize'
import { pageMetadata, siteUrl } from '@/lib/site'
import type { AchievementId } from '@/lib/achievements'
import { Handheld } from '@/components/game/Handheld'
import { ProjectCards, type CardData } from '@/components/game/ProjectCards'
import { Cartridges, type Job } from '@/components/game/Cartridges'
import { AchievementToast } from '@/components/game/Achievements'
import { VideoCard } from '@/components/content/VideoCard'
import { ContactForm } from '@/components/contact/ContactForm'
import { Ltr } from '@/components/ui/primitives'
import { ExternalIcon } from '@/components/ui/icons'

// Card and cartridge colours cycle through the palette's light tints.
const TINTS = ['#FF8A5C', '#7FA6FF', '#9FE0C4', '#FFD98A', '#D9C7FF', '#C9D2CF']

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params
  return isLocale(locale) ? pageMetadata(locale, '/') : {}
}

const enter = (i: number) => ({ 'data-hero-item': '', style: { '--i': i } as CSSProperties })

function SectionTitle({ id, label, title, hint }: { id: string; label: string; title: string; hint?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="label">{label}</p>
        <h2 id={id} className="section-title mt-2.5">{title}</h2>
      </div>
      {hint ? <p className="max-w-[36ch] text-muted">{hint}</p> : null}
    </div>
  )
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw
  const d = getDictionary(locale)
  const g = d.game
  const [{ settings, articles, videos }, projects, experience] = await Promise.all([getHomeData(locale), getProjects(), getExperience()])
  const intro = pick(settings.intro, locale)
  const current = experience.find((e) => !e.end)

  const cards: CardData[] = projects.map((p, i) => ({
    id: p.id,
    no: `#${String(i + 1).padStart(3, '0')}`,
    rarity: p.featured ? g.legendary : g.rare,
    legendary: p.featured,
    color: TINTS[i % TINTS.length]!,
    title: p.title,
    domain: tr(p.domain, locale),
    role: tr(p.role, locale),
    period: p.period,
    summary: [tr(p.summary, locale), p.contributions[0] ? tr(p.contributions[0], locale) : ''].filter(Boolean).join(' '),
    stack: p.technologies.slice(0, 5),
    cover: p.cover ? { url: p.cover.url, alt: tr(p.cover.alt, locale) } : undefined,
  }))

  const jobs: Job[] = experience.map((e, i) => ({
    id: e.id,
    short: e.employer.replace(/\s*\(.*\)$/, '').replace(/\s+Co\.$/, ''),
    company: e.employer,
    role: tr(e.role, locale),
    years: `${e.start.slice(0, 4)} – ${e.end ? e.end.slice(0, 4) : d.common.present}`,
    place: tr(e.location, locale),
    note: e.highlights[0] ? tr(e.highlights[0], locale) : tr(e.summary, locale),
    now: !e.end,
    shell: TINTS[i % TINTS.length]!,
  }))

  const skills = [...new Set([...projects.flatMap((p) => p.technologies), ...experience.flatMap((e) => e.technologies)])].slice(0, 12)
  const f = d.contact.form
  const achievements = g.ach as Record<AchievementId, [string, string]>

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Taher Fawaz',
    jobTitle: tr(settings.role, 'en'),
    url: `${siteUrl}${localePath(locale)}`,
    knowsAbout: skills,
    sameAs: settings.socials.map((s) => s.url).filter(Boolean),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c') }} />

      {/* Hero + handheld */}
      <section id="top" aria-labelledby="hero-title" className="wrap flex flex-wrap items-center gap-12 pb-24 pt-16 md:pt-20">
        <div className="min-w-0 flex-[999_1_30rem]">
          <p {...enter(0)} className="chip !gap-2.5 !px-3.5 !py-1.5 !text-[0.8rem]">
            <span aria-hidden="true" className="size-2.5 rounded-full bg-green" />
            {tr(settings.role, locale)}
          </p>
          <h1 id="hero-title" {...enter(1)} className="display-1 mt-6">
            {g.heroA} <mark className="rounded-xl bg-yellow px-[0.12em] text-ink">{g.heroHl}</mark>
            {g.heroB} <span className="text-orange-ink">{g.heroEnd}</span>
          </h1>
          <p {...enter(2)} className="mt-6 max-w-[50ch] text-[1.15rem] text-[#4A4945]" lang={intro.lang}>{intro.text}</p>
          <div {...enter(3)} className="mt-9 flex flex-wrap gap-3.5">
            <Link href="#work" className="btn">{g.seeWork} <span aria-hidden="true" className="icon-fwd">→</span></Link>
            <Link href="#play" className="btn btn-ghost"><span aria-hidden="true">▶</span> {g.play}</Link>
          </div>
          {current ? (
            <p {...enter(4)} className="mt-8 text-[0.95rem] text-muted">
              {g.nowPlaying}: <strong className="text-ink">{tr(current.role, locale)} · <Ltr>{current.employer}</Ltr></strong>
            </p>
          ) : null}
        </div>
        <div className="flex min-w-0 flex-[1_1_22rem] justify-center">
          <Handheld
            labels={g.device}
            items={[
              { label: g.menu.work, target: 'work' },
              { label: g.menu.experience, target: 'experience' },
              { label: g.menu.articles, target: 'articles' },
              { label: g.menu.play, target: 'play' },
              { label: g.menu.contact, target: 'contact' },
            ]}
          />
        </div>
      </section>

      {/* Skills strip */}
      {skills.length ? (
        <div className="marquee-wrap overflow-hidden border-y-2 border-ink bg-ink text-paper" aria-label={g.skills}>
          <ul className="marquee flex w-max gap-10 py-4 font-[family-name:var(--font-unbounded)] text-[1.15rem] font-semibold" dir="ltr">
            {[...skills, ...skills].map((s, i) => (
              <li key={i} aria-hidden={i >= skills.length} className="flex items-center gap-10 whitespace-nowrap">
                {s}
                <span aria-hidden="true" style={{ color: ['#FF5B1F', '#FFC93C', '#7FA6FF'][i % 3] }}>✦</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Work */}
      {cards.length ? (
        <section id="work" aria-labelledby="work-title" className="wrap pb-10 pt-28">
          <SectionTitle id="work-title" label={g.workLabel} title={g.workTitle} hint={g.workHint} />
          <div className="mt-12">
            <ProjectCards cards={cards} labels={{ screenshot: g.screenshot, flip: g.flip, back: g.back }} />
          </div>
        </section>
      ) : null}

      {/* Experience */}
      {jobs.length ? (
        <section id="experience" aria-labelledby="exp-title" className="wrap pb-10 pt-28">
          <SectionTitle id="exp-title" label={g.expLabel} title={g.expTitle} hint={g.expHint} />
          <div className="mt-14">
            <Cartridges jobs={jobs} labels={{ now: g.now, list: g.expList }} />
          </div>
        </section>
      ) : null}

      {/* Articles and videos */}
      <section id="articles" aria-labelledby="art-title" className="wrap pb-10 pt-28">
        <SectionTitle id="art-title" label={g.artLabel} title={g.artTitle} hint={g.artHint} />
        <ul className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] gap-6">
          {articles.map((a, i) => (
            <li key={a.id}>
              <Link href={localePath(locale, `/blog/${a.slug}`)} className="hw group block h-full rounded-[26px] p-6 no-underline transition-transform duration-150 hover:-translate-y-0.5">
                <span className="flex justify-between gap-3">
                  <span className="label">{a.category ? tr(a.category.title, locale) : d.nav.blog}</span>
                  {i === 0 ? <span className="chip !bg-green !text-ink">{g.newBadge}</span> : null}
                </span>
                <span lang={a.language} dir={a.language === 'ar' ? 'rtl' : 'ltr'} className="hover-underline mt-4 block text-start font-[family-name:var(--font-alexandria)] text-[1.45rem] font-bold leading-relaxed">
                  {a.title}
                </span>
                <span className="mono mt-4 block text-[0.8rem] text-orange-ink">{g.read} <span aria-hidden="true" className="icon-fwd inline-block">→</span></span>
              </Link>
            </li>
          ))}
          {!videos.length ? (
            <li className="flex flex-col justify-center rounded-[26px] border-2 border-dashed border-ink p-6">
              <span className="label">{g.videos}</span>
              <p className="mt-2.5 font-display text-[1.45rem] font-bold">{g.videosSoon}</p>
              <p className="mt-1.5 text-muted">{g.videosBody}</p>
            </li>
          ) : null}
        </ul>
        {videos.length ? (
          <div className="mt-10 grid grid-cols-2 items-start gap-x-4 gap-y-10 md:grid-cols-[minmax(0,32fr)_minmax(0,9fr)_minmax(0,9fr)] md:gap-x-6">
            {videos.map((v) => (
              <div key={v.id} className={v.kind === 'video' ? 'col-span-2 md:col-span-1' : ''}>
                <VideoCard video={v} locale={locale} sizes={v.kind === 'video' ? '(min-width: 768px) 60vw, 100vw' : '(min-width: 768px) 18vw, 50vw'} />
              </div>
            ))}
          </div>
        ) : null}
        <p className="mt-8">
          <Link href={localePath(locale, '/blog')} className="tlink">{d.common.allArticles} <span aria-hidden="true" className="icon-fwd inline-block">→</span></Link>
        </p>
      </section>

      {/* Contact */}
      <section id="contact" aria-labelledby="contact-title" className="wrap pb-20 pt-28">
        <div className="flex flex-wrap gap-10 rounded-[40px] border-2 border-ink bg-orange p-[clamp(1.75rem,5vw,4rem)] shadow-[0_10px_0_var(--ink)]">
          <div className="min-w-0 flex-[1_1_20rem]">
            <p className="mono text-[0.82rem]">{g.contactLabel}</p>
            <h2 id="contact-title" className="section-title mt-2.5">{g.contactTitle}</h2>
            <p className="mt-4 max-w-[34ch] text-[1.1rem]">{g.contactBody}</p>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {settings.email ? <li><a href={`mailto:${settings.email}`} className="font-semibold underline underline-offset-4"><Ltr>{settings.email}</Ltr></a></li> : null}
              {settings.socials.filter((s) => s.url).map((s) => (
                <li key={s.platform}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer me" className="inline-flex items-center gap-1.5 font-semibold underline underline-offset-4"><Ltr>{s.platform}</Ltr><ExternalIcon size={15} /></a>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[0.92rem]">{d.contact.location}: {tr(settings.location, locale)}</p>
          </div>
          <div className="min-w-0 flex-[999_1_26rem]">
            <ContactForm
              locale={locale}
              copy={{
                name: f.name, email: f.email, topic: f.topic, message: f.message, choose: f.choose, send: f.send, sending: f.sending, privacy: f.privacy,
                topics: f.topics,
                errors: f.errors,
                status: { invalid: f.fixErrors, sent: f.success, failed: f.failed, 'not-configured': f.notConfigured, rejected: f.spam },
              }}
            />
          </div>
        </div>
      </section>

      <AchievementToast heading={g.unlocked} items={achievements} />
    </>
  )
}
