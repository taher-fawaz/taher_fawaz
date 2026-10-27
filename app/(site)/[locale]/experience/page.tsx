import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { getExperience } from '@/lib/content'
import { pageMetadata } from '@/lib/site'
import { PageHeader } from '@/components/ui/primitives'
import { Reveal } from '@/components/motion/Reveal'
import { ExperienceList } from '@/components/content/ExperienceList'

export async function generateMetadata({ params }: PageProps<'/[locale]/experience'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return pageMetadata(locale, '/experience', { title: getDictionary(locale).experience.title })
}

const SKILLS = [
  ['Flutter', { en: 'Widgets, animations, state management, navigation and performance optimisation.', ar: 'الـ Widgets والحركة وإدارة الحالة والتنقل وتحسين الأداء.' }],
  ['Android', { en: 'Native Android with Kotlin and Java; platform-specific integrations for Android and iOS.', ar: 'أندرويد الأصلي بـ Kotlin وJava؛ وتكاملات خاصة بالمنصة لأندرويد وiOS.' }],
  ['APIs', { en: 'RESTful APIs, JSON handling, error management and offline-first experiences (caching, retry logic).', ar: 'واجهات REST وJSON ومعالجة الأخطاء وتجارب offline-first (التخزين المؤقت وإعادة المحاولة).' }],
  ['Firebase', { en: 'Authentication, Firestore / Realtime DB, push notifications (FCM), Crashlytics, App Distribution.', ar: 'المصادقة وFirestore / Realtime DB والإشعارات (FCM) وCrashlytics وApp Distribution.' }],
  ['Workflow', { en: 'Git, GitHub, GitLab, Bitbucket; CI/CD familiarity; Figma, Adobe XD and Sketch with designers; Agile/Scrum.', ar: 'Git وGitHub وGitLab وBitbucket؛ وإلمام بـ CI/CD؛ وFigma وAdobe XD وSketch مع المصممين؛ وAgile/Scrum.' }],
] as const

export default async function ExperiencePage({ params }: PageProps<'/[locale]/experience'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const d = getDictionary(locale)
  const items = await getExperience()
  const anyReview = items.some((e) => e.needsReview)
  return (
    <div className="wrap pb-20 md:pb-28">
      <PageHeader title={d.experience.title} lead={anyReview ? `${d.experience.lead} ${d.experience.reviewNote}` : d.experience.lead} />
      <Reveal>
        <ExperienceList items={items} locale={locale} detailed />
      </Reveal>
      <section className="mt-20" aria-labelledby="skills">
        <h2 id="skills" className="section-title mb-6">{d.experience.skills}</h2>
        <dl className="rule-strong max-w-4xl">
          {SKILLS.map(([name, text]) => (
            <div key={name} className="grid gap-1 border-b border-rule py-4 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-8">
              <dt className="font-semibold"><bdi dir="ltr">{name}</bdi></dt>
              <dd className="text-muted">{text[locale]}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
