import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { getSettings } from '@/lib/content'
import { pick, pickBlocks, tr } from '@/lib/content/localize'
import { pageMetadata } from '@/lib/site'
import { PageHeader } from '@/components/ui/primitives'
import { PortableBody } from '@/components/content/PortableBody'

export async function generateMetadata({ params }: PageProps<'/[locale]/about'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return pageMetadata(locale, '/about', { title: getDictionary(locale).nav.about })
}

// Facts below are taken from the CV; they are presentation, not CMS content.
const FACTS = {
  focus: { en: 'Flutter · Native Android (Kotlin, Java) · Architecture · API integration and offline-first · Firebase', ar: 'Flutter · أندرويد الأصلي (Kotlin وJava) · المعمارية · ربط الـ API وتجارب offline-first · Firebase' },
  architecture: { en: 'Clean Architecture, MVVM and layered architecture; Bloc, Provider, Cubit, GetX and Riverpod.', ar: 'المعمارية النظيفة وMVVM والمعمارية الطبقية؛ وBloc وProvider وCubit وGetX وRiverpod.' },
  education: { en: 'Bachelor of Engineering, 2018 — Higher Institute for Engineering & Technology, 6th October City.', ar: 'بكالوريوس هندسة، 2018 — المعهد العالي للهندسة والتكنولوجيا، مدينة 6 أكتوبر.' },
  exploring: { en: 'SwiftUI — a topic I am learning and teaching, not a claim of professional experience.', ar: 'SwiftUI — موضوع أتعلّمه وأشرحه، وليس ادعاءً بخبرة مهنية.' },
}

export default async function AboutPage({ params }: PageProps<'/[locale]/about'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const d = getDictionary(locale)
  const settings = await getSettings()
  const story = pickBlocks(settings.story, locale)
  const rows: [string, { en: string; ar: string }][] = [
    [d.about.focus, FACTS.focus],
    [d.about.architecture, FACTS.architecture],
    [d.about.education, FACTS.education],
    [d.about.exploring, FACTS.exploring],
  ]
  return (
    <div className="wrap">
      <PageHeader title={d.about.title} />
      <div className="grid gap-14 pb-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-20 md:pb-28">
        <div>
          {story ? <PortableBody value={story.blocks} lang={story.lang} /> : <p className="text-muted">{d.about.storyPending}</p>}
          {settings.principles.length ? (
            <section className="mt-14" aria-labelledby="principles">
              <h2 id="principles" className="section-title mb-6">{d.about.principles}</h2>
              <ol className="rule-strong">
                {settings.principles.map((p, i) => {
                  const text = pick(p.text, locale)
                  return (
                    <li key={i} className="border-b border-rule py-5">
                      <h3 className="text-[1.3rem]">{tr(p.title, locale)}</h3>
                      <p className="mt-1 max-w-[62ch] text-muted" lang={text.lang}>{text.text}</p>
                    </li>
                  )
                })}
              </ol>
            </section>
          ) : null}
        </div>
        <aside>
          <dl className="rule-strong">
            {rows.map(([label, value]) => (
              <div key={label} className="border-b border-rule py-4">
                <dt className="font-semibold">{label}</dt>
                <dd className="mt-1 text-[0.96rem] text-muted">{value[locale]}</dd>
              </div>
            ))}
            <div className="border-b border-rule py-4">
              <dt className="font-semibold">{d.about.based}</dt>
              <dd className="mt-1 text-[0.96rem] text-muted">{tr(settings.location, locale)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  )
}
