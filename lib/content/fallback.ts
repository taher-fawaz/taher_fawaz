/**
 * LOCAL FALLBACK CONTENT — used only when Sanity is not configured
 * (NEXT_PUBLIC_SANITY_PROJECT_ID is empty).
 *
 * Professional facts below come from Taher Fawaz's CV (Taher Fawaz.pdf).
 * Articles and videos are SAMPLES (isSample: true) that demonstrate layout only.
 * Never add phone numbers, addresses or reference contacts here.
 */
import { buildSeriesNav } from '@/lib/series'
import type { ArticleSummary, Article, Category, Experience, Project, PT, SiteSettings, Video } from './types'

let k = 0
const key = () => `fb${(k++).toString(36)}`
const span = (text: string) => ({ _type: 'span', _key: key(), text, marks: [] as string[] })
const block = (text: string, style = 'normal') => ({ _type: 'block', _key: key(), style, markDefs: [], children: [span(text)] })
const code = (codeText: string, language = 'dart') => ({ _type: 'code', _key: key(), language, code: codeText })

export const fallbackSettings: SiteSettings = {
  name: { en: 'Taher Fawaz', ar: 'طاهر فواز' },
  role: { en: 'Senior Mobile Application Developer', ar: 'مطوّر تطبيقات موبايل أول' },
  intro: {
    en: 'Seven years of Flutter and native Android, from telecom and government services to education and cybersecurity.',
    ar: 'سبع سنوات مع Flutter وأندرويد الأصلي، من الاتصالات والخدمات الحكومية إلى التعليم والأمن السيبراني.',
  },
  story: {
    en: [
      block('I am a Senior Mobile Application Developer specialising in Flutter and native Android (Kotlin and Java), with seven years of experience delivering mobile apps across telecommunications, government services, education, cybersecurity and business tools. I started in web development before moving to mobile.'),
    ],
    ar: [
      block('أنا مطوّر تطبيقات موبايل أول متخصص في Flutter وأندرويد الأصلي (Kotlin وJava)، بخبرة سبع سنوات في تسليم تطبيقات في مجالات الاتصالات والخدمات الحكومية والتعليم والأمن السيبراني وأدوات الأعمال. بدأت في تطوير الويب قبل أن أنتقل إلى الموبايل.'),
    ],
  },
  principles: [],
  location: { en: 'Cairo, Egypt', ar: 'القاهرة، مصر' },
  socials: [{ platform: 'LinkedIn' }, { platform: 'GitHub' }, { platform: 'YouTube' }],
  featuredProjectSlugs: ['sanad', 'my-etisalat'],
  featuredArticleSlugs: [],
  featuredVideoIds: [],
}

export const fallbackExperience: Experience[] = [
  {
    id: 'exp-eand', employer: 'e& Egypt (Etisalat)', start: '2025-07', workMode: 'hybrid', needsReview: false,
    role: { en: 'Senior Flutter Developer', ar: 'مطوّر Flutter أول' }, location: { en: 'Cairo, Egypt', ar: 'القاهرة، مصر' },
    technologies: ['Flutter', 'Clean Architecture', 'Bloc'],
    highlights: [
      { en: 'Contributed to My Etisalat, one of the largest telecom self-care apps in Egypt, with millions of active users.', ar: 'ساهم في تطبيق My Etisalat، أحد أكبر تطبيقات الخدمة الذاتية للاتصالات في مصر، بملايين المستخدمين النشطين.' },
      { en: 'Implemented clean, modular code with Flutter, Clean Architecture and Bloc across a large-scale codebase.', ar: 'كتب كودًا نظيفًا موزّعًا على وحدات باستخدام Flutter والمعمارية النظيفة وBloc في قاعدة كود كبيرة.' },
      { en: 'Worked on secure payment integrations including Etisalat Cash, with reliable API communication.', ar: 'عمل على تكاملات دفع آمنة منها Etisalat Cash، مع اتصال موثوق بالـ API.' },
    ],
  },
  {
    id: 'exp-ntg', employer: 'NTG Clarity Co.', start: '2024-06', end: '2025-07', workMode: 'hybrid', needsReview: false,
    role: { en: 'Senior Flutter Developer', ar: 'مطوّر Flutter أول' }, location: { en: 'Cairo, Egypt', ar: 'القاهرة، مصر' },
    technologies: ['Flutter', 'REST APIs'],
    highlights: [
      { en: 'Contributed to multiple mobile applications across different industries with responsive, reusable UI components.', ar: 'ساهم في عدة تطبيقات موبايل في مجالات مختلفة بمكوّنات واجهة متجاوبة وقابلة لإعادة الاستخدام.' },
      { en: 'Integrated complex REST APIs and optimised performance on Android and iOS; took part in feature analysis, architecture decisions and code reviews.', ar: 'ربط واجهات REST معقدة وحسّن الأداء على أندرويد وiOS، وشارك في تحليل الميزات وقرارات المعمارية ومراجعات الكود.' },
    ],
  },
  {
    id: 'exp-srs', employer: 'School of Research & Science', start: '2023-03', end: '2024-03', workMode: 'onsite', needsReview: false,
    role: { en: 'Senior Flutter Developer', ar: 'مطوّر Flutter أول' }, location: { en: 'Dubai, UAE', ar: 'دبي، الإمارات' },
    technologies: ['Flutter'],
    highlights: [
      { en: 'Led front-end development for an e-book library app, improving the reading experience, UI consistency and UX flows.', ar: 'قاد تطوير الواجهة الأمامية لتطبيق مكتبة كتب إلكترونية، مع تحسين تجربة القراءة واتساق الواجهة وتدفقات الاستخدام.' },
      { en: 'Integrated the app with external APIs and improved performance for large content datasets.', ar: 'ربط التطبيق بواجهات خارجية وحسّن الأداء مع مجموعات محتوى كبيرة.' },
    ],
  },
  {
    id: 'exp-agile', employer: 'Agile Technologies', start: '2022-11', end: '2023-03', workMode: 'onsite', needsReview: false,
    role: { en: 'Mobile Apps Developer', ar: 'مطوّر تطبيقات موبايل' }, location: { en: 'Maadi, Cairo, Egypt', ar: 'المعادي، القاهرة، مصر' },
    technologies: ['Flutter', 'Firebase'],
    highlights: [
      { en: 'Contributed to Sanad, Jordan’s official government services app: secure modules, improved UI/UX flows and compliance with government security standards.', ar: 'ساهم في تطبيق سند، تطبيق الخدمات الحكومية الرسمي في الأردن: وحدات آمنة وتدفقات واجهة أفضل والتزام بمعايير الأمن الحكومية.' },
      { en: 'Integrated Firebase for analytics, notifications and real-time updates.', ar: 'دمج Firebase للتحليلات والإشعارات والتحديثات الفورية.' },
    ],
  },
  {
    id: 'exp-flairstech', employer: 'Flairstech', start: '2022-01', end: '2022-11', workMode: 'hybrid', needsReview: true,
    role: { en: 'Mobile Apps Developer', ar: 'مطوّر تطبيقات موبايل' }, location: { en: 'Maadi, Cairo, Egypt', ar: 'المعادي، القاهرة، مصر' },
    technologies: [],
    highlights: [
      { en: 'Worked on more than four apps across industries, including Flairstech Hub, Gasco, Gasco Delivery and Outout.', ar: 'عمل على أكثر من أربعة تطبيقات في صناعات مختلفة، منها Flairstech Hub وGasco وGasco Delivery وOutout.' },
      { en: 'Built robust UI components, improved app stability, delivered frequent releases and provided post-launch support.', ar: 'بنى مكوّنات واجهة متينة، وحسّن استقرار التطبيقات، وأصدر تحديثات متكررة، وقدّم دعمًا بعد الإطلاق.' },
    ],
  },
  {
    id: 'exp-va', employer: 'VA Computing', start: '2020-12', end: '2021-12', workMode: 'remote', needsReview: true,
    role: { en: 'Mobile Apps Developer', ar: 'مطوّر تطبيقات موبايل' }, location: { en: '5th Settlement, Cairo, Egypt', ar: 'التجمع الخامس، القاهرة، مصر' },
    technologies: ['Flutter'],
    highlights: [
      { en: 'Contributed to the SafeToNet parent–child safety app with Flutter in a Scrum environment.', ar: 'ساهم في تطبيق SafeToNet لسلامة الأطفال والأهل باستخدام Flutter في بيئة Scrum.' },
      { en: 'Integrated mobile apps with AI models; improved AI-based features, app security and content-filtering modules.', ar: 'ربط التطبيقات بنماذج ذكاء اصطناعي، وحسّن الميزات المعتمدة عليه وأمان التطبيق ووحدات تصفية المحتوى.' },
    ],
  },
  {
    id: 'exp-active', employer: 'Active Interactions', start: '2019-11', end: '2020-07', workMode: 'onsite', needsReview: true,
    role: { en: 'Frontend Developer', ar: 'مطوّر واجهات أمامية' }, location: { en: 'Kuala Lumpur, Malaysia', ar: 'كوالالمبور، ماليزيا' },
    technologies: [],
    highlights: [
      { en: 'Developed and maintained web applications and internal tools, maintained live projects and contributed to game development initiatives.', ar: 'طوّر وصان تطبيقات ويب وأدوات داخلية، وصان مشاريع قائمة، وساهم في مبادرات تطوير ألعاب.' },
    ],
  },
  {
    id: 'exp-utopia', employer: 'Utopia CO-living', start: '2019-02', end: '2019-11', workMode: 'onsite', needsReview: true,
    role: { en: 'Frontend Developer', ar: 'مطوّر واجهات أمامية' }, location: { en: 'Kuala Lumpur, Malaysia', ar: 'كوالالمبور، ماليزيا' },
    technologies: ['Wix CMS'],
    highlights: [{ en: 'Responsible for the website’s UI design on the Wix CMS platform and managed its content.', ar: 'مسؤول عن تصميم واجهة الموقع على منصة Wix CMS وإدارة محتواه.' }],
  },
]

export const fallbackProjects: Project[] = [
  {
    id: 'prj-sanad', slug: 'sanad', title: 'Sanad', featured: true, period: 'Nov 2022 – Mar 2023',
    summary: { en: 'The official government services gateway in Jordan.', ar: 'البوابة الرسمية للخدمات الحكومية في الأردن.' },
    domain: { en: 'Government · Jordan', ar: 'حكومة · الأردن' },
    role: { en: 'Senior Flutter Developer', ar: 'مطوّر Flutter أول' },
    technologies: ['Flutter', 'Clean Architecture', 'MVVM', 'DIO', 'Firebase'],
    contributions: [
      { en: 'Clean Architecture and MVVM.', ar: 'المعمارية النظيفة وMVVM.' },
      { en: 'API integration with DIO.', ar: 'ربط الـ API باستخدام DIO.' },
      { en: 'UI/UX optimisation and improved UI/UX flows.', ar: 'تحسين واجهة وتجربة المستخدم وتدفقاتها.' },
      { en: 'Secure modules and security enhancements, in line with government security standards.', ar: 'وحدات آمنة وتحسينات أمنية بما يتوافق مع معايير الأمن الحكومية.' },
      { en: 'Firebase for analytics, notifications and real-time updates.', ar: 'Firebase للتحليلات والإشعارات والتحديثات الفورية.' },
    ],
    links: [], gallery: [],
  },
  {
    id: 'prj-etisalat', slug: 'my-etisalat', title: 'My Etisalat / My e&', featured: true, period: 'Jul 2025 – Now',
    summary: { en: 'A large-scale telecom self-care app for millions of users.', ar: 'تطبيق خدمة ذاتية واسع النطاق للاتصالات يخدم ملايين المستخدمين.' },
    domain: { en: 'Telecom · Egypt', ar: 'اتصالات · مصر' },
    role: { en: 'Senior Flutter Developer', ar: 'مطوّر Flutter أول' },
    technologies: ['Flutter', 'Bloc', 'Clean Architecture', 'MVVM', 'DIO'],
    contributions: [
      { en: 'Features include balance tracking, bundles, online payments, Etisalat Cash and digital services.', ar: 'من ميزاته متابعة الرصيد والباقات والدفع الإلكتروني وEtisalat Cash والخدمات الرقمية.' },
      { en: 'Bloc, local caching, Clean Architecture, modularity and MVVM across a large codebase.', ar: 'Bloc والتخزين المحلي والمعمارية النظيفة والتقسيم إلى وحدات وMVVM في قاعدة كود كبيرة.' },
      { en: 'Secure payment integrations, including Etisalat Cash, with reliable API communication.', ar: 'تكاملات دفع آمنة، منها Etisalat Cash، مع اتصال موثوق بالـ API.' },
    ],
    links: [], gallery: [],
  },
  {
    id: 'prj-safetonet', slug: 'safetonet', title: 'SafeToNet', featured: false,
    summary: { en: 'An AI-powered parental control and child-protection keyboard app.', ar: 'تطبيق لوحة مفاتيح للرقابة الأبوية وحماية الأطفال مدعوم بالذكاء الاصطناعي.' },
    domain: { en: 'Cybersecurity · UK', ar: 'أمن سيبراني · بريطانيا' },
    role: { en: 'Flutter Developer', ar: 'مطوّر Flutter' },
    technologies: ['Flutter', 'Android (Java)', 'Provider', 'Method Channel'],
    contributions: [{ en: 'Flutter and native Android, Provider, HTTP, AI model integration and method channels.', ar: 'Flutter وأندرويد الأصلي وProvider وHTTP ودمج نماذج الذكاء الاصطناعي وقنوات المنصة (Method Channel).' }],
    links: [], gallery: [],
  },
  {
    id: 'prj-hesabate', slug: 'hesabate', title: 'Hesabate', featured: false,
    summary: { en: 'An Android app for managing business operations, linked to the Hesabate ERP.', ar: 'تطبيق أندرويد لإدارة العمليات التجارية مرتبط بنظام Hesabate ERP.' },
    domain: { en: 'Accounting · GCC', ar: 'محاسبة · الخليج' },
    role: { en: 'Flutter Developer', ar: 'مطوّر Flutter' },
    technologies: ['Flutter', 'GetX', 'SQL', 'DIO'],
    contributions: [{ en: 'GetX, offline caching, location tracking, a local SQL database, MVC, DIO and performance improvements.', ar: 'GetX والتخزين المؤقت دون اتصال وتتبع الموقع وقاعدة بيانات SQL محلية وMVC وDIO وتحسينات في الأداء.' }],
    links: [], gallery: [],
  },
  {
    id: 'prj-ezeness', slug: 'ezeness', title: 'Ezeness', featured: false,
    summary: { en: 'Combines social media with e-commerce and earning tools.', ar: 'يجمع بين التواصل الاجتماعي والتجارة الإلكترونية وأدوات الربح.' },
    domain: { en: 'Social commerce · Global', ar: 'تجارة اجتماعية · عالمي' },
    role: { en: 'Flutter Developer', ar: 'مطوّر Flutter' },
    technologies: ['Flutter', 'Cubit', 'HTTP'],
    contributions: [{ en: 'Cubit, MVC and HTTP; implemented core social and business modules and feature enhancements.', ar: 'Cubit وMVC وHTTP؛ وتنفيذ الوحدات الاجتماعية والتجارية الأساسية وتحسين الميزات.' }],
    links: [], gallery: [],
  },
  {
    id: 'prj-ntg', slug: 'ntg-apps', title: 'NTG Apps', featured: false,
    summary: { en: 'A multi-module mobile interface for enterprise web systems.', ar: 'واجهة موبايل متعددة الوحدات لأنظمة ويب مؤسسية.' },
    domain: { en: 'Enterprise', ar: 'مؤسسات' },
    role: { en: 'Flutter Developer', ar: 'مطوّر Flutter' },
    technologies: ['Flutter', 'Provider', 'HTTP'],
    contributions: [{ en: 'Provider, MVC and HTTP; UX improvements, bug fixing and API integration.', ar: 'Provider وMVC وHTTP؛ وتحسينات تجربة الاستخدام وإصلاح الأخطاء وربط الـ API.' }],
    links: [], gallery: [],
  },
]

export const fallbackCategories: Category[] = [
  { slug: 'mobile-engineering', title: { en: 'Mobile Engineering', ar: 'هندسة الموبايل' }, description: { en: 'Flutter and SwiftUI.', ar: 'Flutter وSwiftUI.' } },
  { slug: 'software-architecture', title: { en: 'Software Architecture', ar: 'معمارية البرمجيات' }, description: { en: 'Clean Architecture, state management, API integration and performance.', ar: 'المعمارية النظيفة، وإدارة الحالة، وربط الـ API، والأداء.' } },
  { slug: 'real-world-engineering', title: { en: 'Real-World Engineering', ar: 'هندسة من الواقع' }, description: { en: 'Practical problems, trade-offs, lessons and implementation decisions.', ar: 'مشكلات عملية، ومفاضلات، ودروس مستفادة، وقرارات تنفيذ.' } },
]
const cat = (slug: string) => fallbackCategories.find((c) => c.slug === slug)

const sampleBodyAr: PT = [
  block('نص تجريبي لعرض تخطيط القراءة. سيُكتب المقال النهائي داخل لوحة التحرير، وهذا النص لا يحمل أي معلومة تقنية حقيقية.'),
  block('عنوان فرعي تجريبي', 'h2'),
  block('الفقرات العربية تحتاج إلى ارتفاع سطر أكبر وحجم خط مريح، مع عرض عمود لا يتجاوز نحو 65 حرفًا. المصطلحات مثل Clean Architecture وBloc تبقى بالإنجليزية داخل النص.'),
  code('// مقطع توضيحي — الكود يبقى من اليسار إلى اليمين\nabstract class AccountRepository {\n  Future<Balance> fetchBalance();\n}'),
  block('اقتباس تجريبي يوضح شكل الجمل المميزة داخل المقال.', 'blockquote'),
]
const sampleBodyEn: PT = [
  block('Sample text to show the reading layout. The final article will be written in the CMS; this text carries no real technical claim.'),
  block('Sample subheading', 'h2'),
  block('Body text keeps a comfortable measure of roughly 68 characters so long-form reading stays easy on desktop and mobile.'),
  code('// illustrative snippet\nabstract class AccountRepository {\n  Future<Balance> fetchBalance();\n}'),
  block('A sample pull quote showing how emphasis is handled inside an article.', 'blockquote'),
]

type FallbackArticle = Article
const art = (a: Omit<FallbackArticle, 'isSample' | 'translations' | 'readingMinutes'> & { readingMinutes?: number }): FallbackArticle => ({ readingMinutes: 6, ...a, isSample: true, translations: [] })

const rawArticles: FallbackArticle[] = [
  art({ id: 'a1', slug: 'split-large-flutter-app', language: 'ar', translationKey: 'a1', title: 'كيف أقسّم تطبيق Flutter كبير دون أن يتحول إلى فوضى؟', excerpt: 'مقتطف تجريبي: الطبقات والحدود وما يجب حسمه أولًا.', publishedAt: '2026-10-12', readingMinutes: 8, category: cat('software-architecture'), body: sampleBodyAr }),
  art({ id: 'a1en', slug: 'split-large-flutter-app-en', language: 'en', translationKey: 'a1', title: 'How to split a large Flutter app without it turning into a mess', excerpt: 'Sample excerpt: layers, boundaries and what to decide first.', publishedAt: '2026-10-12', readingMinutes: 8, category: cat('software-architecture'), body: sampleBodyEn }),
  art({ id: 'a2', slug: 'swiftui-for-flutter-developers', language: 'ar', translationKey: 'a2', title: 'SwiftUI لمطوّر Flutter: ما الذي يتشابه وما الذي يختلف؟', excerpt: 'مقتطف تجريبي: مقارنة أولية بين نموذجَي بناء الواجهات.', publishedAt: '2026-09-28', category: cat('mobile-engineering'), body: sampleBodyAr }),
  art({ id: 'a3', slug: 'bloc-or-riverpod', language: 'ar', translationKey: 'a3', title: 'Bloc أم Riverpod؟ قرار هندسي لا معركة أدوات', excerpt: 'مقتطف تجريبي: كيف نختار بناءً على القيود لا على الانتماءات.', publishedAt: '2026-09-10', readingMinutes: 7, category: cat('software-architecture'), body: sampleBodyAr }),
  art({ id: 'a3en', slug: 'bloc-or-riverpod-en', language: 'en', translationKey: 'a3', title: 'Bloc or Riverpod? An engineering decision, not a tool war', excerpt: 'Sample excerpt: choosing by constraints rather than by camp.', publishedAt: '2026-09-10', readingMinutes: 7, category: cat('software-architecture'), body: sampleBodyEn }),
  art({ id: 'a4', slug: 'offline-first-mobile', language: 'ar', translationKey: 'a4', title: 'عندما يفشل الطلب: تصميم تجربة offline-first لتطبيق موبايل', excerpt: 'مقتطف تجريبي: التخزين المؤقت وإعادة المحاولة وما بينهما من قرارات.', publishedAt: '2026-08-21', readingMinutes: 9, category: cat('real-world-engineering'), body: sampleBodyAr }),
]
// A sample series (3 of 4 planned parts available) so the series UI can be previewed without the CMS.
const sampleSeries = {
  title: { ar: 'سلسلة تجريبية: معمارية تطبيقات Flutter', en: 'Sample series: Flutter app architecture' },
  description: { ar: 'سلسلة تجريبية لعرض شكل التنقل بين الأجزاء. ليست محتوى حقيقيًا.', en: 'A sample series to preview part navigation. Not real content.' },
  planned: 4,
  partById: { a1: 1, a1en: 1, a3: 2, a3en: 2, a4: 3 } as Record<string, number>,
}
const sampleSeriesFor = (a: FallbackArticle): Article['series'] => {
  if (!sampleSeries.partById[a.id]) return undefined
  const members = rawArticles
    .filter((o) => o.language === a.language && sampleSeries.partById[o.id])
    .map((o) => ({ slug: o.slug, title: o.title, part: sampleSeries.partById[o.id]! }))
  const nav = buildSeriesNav(members, a.slug, sampleSeries.planned)
  return nav ? { title: sampleSeries.title, description: sampleSeries.description, nav } : undefined
}

export const fallbackArticles: FallbackArticle[] = rawArticles.map((a) => ({
  ...a,
  translations: rawArticles.filter((o) => o.translationKey === a.translationKey && o.id !== a.id).map((o) => ({ slug: o.slug, language: o.language, title: o.title })),
  series: sampleSeriesFor(a),
}))
export const fallbackArticleSummaries: ArticleSummary[] = fallbackArticles.map((a) => {
  const summary: ArticleSummary & Partial<Pick<Article, 'body' | 'seo' | 'translations' | 'series'>> = { ...a }
  delete summary.body
  delete summary.seo
  delete summary.translations
  delete summary.series
  return summary
})

export const fallbackVideos: Video[] = [
  { id: 'v1', kind: 'video', language: 'ar', featured: true, isSample: true, title: 'شرح Clean Architecture في Flutter بمثال عملي' },
  { id: 'v2', kind: 'video', language: 'ar', featured: false, isSample: true, title: 'Bloc من الصفر' },
  { id: 's1', kind: 'short', language: 'ar', featured: true, isSample: true, title: 'لا تضع منطق الأعمال داخل الـ Widget' },
  { id: 's2', kind: 'short', language: 'ar', featured: true, isSample: true, title: 'Provider أم Bloc؟ في دقيقة' },
  { id: 's3', kind: 'short', language: 'ar', featured: false, isSample: true, title: 'ما معنى offline-first؟' },
]
