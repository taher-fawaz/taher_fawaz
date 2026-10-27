import type { Locale } from './config'

const en = {
  meta: {
    siteName: 'Taher Fawaz',
    title: 'Taher Fawaz — Senior Mobile Application Developer',
    description:
      'Senior mobile application developer specialising in Flutter and native Android. Projects, experience, and Arabic-first articles and videos on mobile engineering and architecture.',
  },
  a11y: { skip: 'Skip to content', menu: 'Menu', closeMenu: 'Close menu', primaryNav: 'Primary', themeDark: 'Switch to dark theme', themeLight: 'Switch to light theme', switchLang: 'Switch language to Arabic' },
  nav: { home: 'Home', projects: 'Projects', experience: 'Experience', blog: 'Blog', videos: 'Videos', about: 'About', contact: 'Contact' },
  langName: 'العربية',
  common: {
    viewProject: 'View project', allProjects: 'All projects', allArticles: 'All articles', allVideos: 'All videos and Shorts',
    fullExperience: 'Full experience', readMore: 'Read article', minRead: (n: number) => `${n} min read`,
    fromCv: 'From CV', sample: 'Sample', placeholder: 'Placeholder', draft: 'Draft', underReview: 'Dates under review', present: 'Now',
    arabicOnly: 'Arabic only', bilingual: 'Arabic · English', comingSoon: 'Coming soon', back: 'Back',
    previewContent: 'Preview content — the CMS is not connected yet. Items marked “Sample” or “Placeholder” are not real.',
    imagePlaceholder: 'Placeholder — real screenshots to be supplied', related: 'Related', notFoundTitle: 'Page not found', notFoundBody: 'This page does not exist or has moved.', goHome: 'Go to the home page',
  },
  home: {
    headline: 'I build mobile apps at scale, then explain how they work.',
    now: 'Now',
    primaryCta: 'See selected work', secondaryCta: 'Read and watch',
    rolesLabel: 'Three roles, one practice', specialties: 'Specialties',
    roles: {
      engineer: { title: 'Engineer', text: 'Flutter and native Android, built on clean architecture and measured performance.' },
      educator: { title: 'Educator', text: 'Articles, videos and Shorts in Arabic about mobile engineering and the trade-offs behind it.' },
      builder: { title: 'Builder', text: 'Ideas and experiments, shared as they become working products.' },
    },
    projects: 'Selected projects', experience: 'Where I have worked', writing: 'From the blog', pillars: 'Three things I write about', videos: 'Watch',
    closeTitle: 'Hiring, building something, or want to collaborate?', closeCta: 'Get in touch',
  },
  about: { title: 'An engineer who also explains.', focus: 'Focus', architecture: 'Architecture', education: 'Education', exploring: 'Exploring now', based: 'Based in', principles: 'How I work', storyPending: 'The personal story will be written in the CMS.' },
  experience: { title: 'Work experience', lead: 'Most recent first.', skills: 'Skills, from the CV', reviewNote: 'Entries marked “Dates under review” come from a CV layout that needs a final check.' },
  projects: { title: 'Projects', lead: 'Two flagship products first. Detailed contributions and screenshots are added through the CMS.', more: 'More projects', domain: 'Domain', role: 'Role', period: 'Period', stack: 'Stack', contributions: 'Contributions', caseStudyPending: 'A detailed case study will be added later. Nothing here is invented in the meantime.', links: 'Links', screens: 'Screens' },
  blog: { title: 'Blog', lead: 'Written in Arabic first. An English version exists only where marked.', all: 'All', empty: 'No articles in this category yet.', none: 'No articles have been published yet.', languageLabel: 'Article language', translationAvailable: 'Also available in Arabic', englishAvailable: 'Read in English', arabicAvailable: 'اقرأ بالعربية', onlyArabic: 'This article is in Arabic. No English translation yet.', published: 'Published', category: 'Category' },
  empty: { articles: 'No articles yet', articlesBody: 'The first articles are on their way. They are written in Arabic first.', category: 'Nothing in this category yet', categoryBody: 'Try another category or browse all articles.', videos: 'No videos yet', videosBody: 'Videos and Shorts will appear here as soon as they are published on YouTube.' },
  series: { part: (n: number, total: number) => `Part ${n} of ${total}`, contents: 'In this series', startHere: 'Start with part 1', previous: 'Previous part', next: 'Next part', more: 'More parts are on the way.', current: 'You are here', navLabel: 'Series navigation' },
  videos: { title: 'Videos and Shorts', lead: 'Hosted on YouTube and embedded from the original URL — never re-uploaded here.', videos: 'Videos', shorts: 'Shorts', play: (t: string) => `Play video: ${t}`, openOnYouTube: 'Open on YouTube', samplePlay: 'Sample entry — the real YouTube video will load here.', empty: 'No videos published yet.', youtubeVideo: 'YouTube video', youtubeShort: 'YouTube Short', channel: 'Watch everything on YouTube', unavailable: 'The latest videos could not be loaded from YouTube right now. They will appear again automatically.', recentNote: 'The newest uploads appear here automatically from YouTube.' },
  contact: {
    title: 'Let’s talk.', lead: 'For roles, projects and collaboration.', profiles: 'Profiles', linkPending: 'Link to be added', email: 'Email', location: 'Based in', noPhone: 'No phone number or address is published.',
    form: {
      name: 'Name', email: 'Email', topic: 'What is this about?', message: 'Message', choose: 'Choose a topic', send: 'Send message', sending: 'Sending…',
      topics: { role: 'A job opportunity', project: 'A project or consulting', collab: 'Collaboration or content', other: 'Something else' },
      errors: { name: 'Please enter your name.', email: 'Enter a valid email address, like name@example.com.', topic: 'Choose a topic so the message can be routed.', message: 'Write at least 20 characters.', tooLong: 'This is too long.' },
      fixErrors: 'Please fix the highlighted fields.', success: 'Thank you — your message was sent. You will get a reply by email.',
      failed: 'The message could not be sent right now. Your text is still here; please try again in a moment.',
      notConfigured: 'The contact form is not connected to email yet, so your message was not sent. Please use one of the profiles instead.',
      spam: 'The message could not be accepted. If you are a person, wait a few seconds and try again.',
      privacy: 'Your details are used only to reply to you and are not stored on this site.',
    },
  },
  footer: { rights: 'Taher Fawaz', builtWith: 'Built with Next.js and Sanity.' },
}

export type Dictionary = typeof en

const ar: Dictionary = {
  meta: {
    siteName: 'طاهر فواز',
    title: 'طاهر فواز — مطوّر تطبيقات موبايل أول',
    description: 'مطوّر تطبيقات موبايل أول متخصص في Flutter وأندرويد الأصلي. مشاريع وخبرات ومقالات وفيديوهات بالعربية عن هندسة الموبايل والمعمارية.',
  },
  a11y: { skip: 'انتقل إلى المحتوى', menu: 'القائمة', closeMenu: 'إغلاق القائمة', primaryNav: 'التنقل الرئيسي', themeDark: 'التبديل إلى الوضع الداكن', themeLight: 'التبديل إلى الوضع الفاتح', switchLang: 'Switch language to English' },
  nav: { home: 'الرئيسية', projects: 'المشاريع', experience: 'الخبرات', blog: 'المدوّنة', videos: 'الفيديو', about: 'عنّي', contact: 'تواصل' },
  langName: 'English',
  common: {
    viewProject: 'عرض المشروع', allProjects: 'كل المشاريع', allArticles: 'كل المقالات', allVideos: 'كل الفيديوهات والشورتس',
    fullExperience: 'كل الخبرات', readMore: 'اقرأ المقال', minRead: (n: number) => `${n} دقائق للقراءة`,
    fromCv: 'من السيرة الذاتية', sample: 'تجريبي', placeholder: 'مكان مؤقت', draft: 'مسودة', underReview: 'التواريخ قيد المراجعة', present: 'الآن',
    arabicOnly: 'بالعربية فقط', bilingual: 'عربي · إنجليزي', comingSoon: 'قريبًا', back: 'رجوع',
    previewContent: 'محتوى معاينة — لوحة التحرير غير متصلة بعد. العناصر الموسومة «تجريبي» أو «مكان مؤقت» ليست حقيقية.',
    imagePlaceholder: 'مكان مؤقت — ستُضاف لقطات الشاشة الحقيقية', related: 'ذو صلة', notFoundTitle: 'الصفحة غير موجودة', notFoundBody: 'هذه الصفحة غير موجودة أو نُقلت.', goHome: 'العودة إلى الصفحة الرئيسية',
  },
  home: {
    headline: 'أبني تطبيقات موبايل واسعة النطاق، ثم أشرح كيف تعمل.',
    now: 'حاليًا',
    primaryCta: 'شاهد أعمالي المختارة', secondaryCta: 'اقرأ وشاهد',
    rolesLabel: 'ثلاثة أدوار، ممارسة واحدة', specialties: 'مجالات التخصص',
    roles: {
      engineer: { title: 'المهندس', text: 'Flutter وأندرويد الأصلي، مبنيّان على معمارية نظيفة وأداء مقيس.' },
      educator: { title: 'المعلّم', text: 'مقالات وفيديوهات وشورتس بالعربية عن هندسة الموبايل والمفاضلات وراءها.' },
      builder: { title: 'الصانع', text: 'أفكار وتجارب تتحول إلى منتجات تعمل، أشاركها أولًا بأول.' },
    },
    projects: 'مشاريع مختارة', experience: 'أين عملت', writing: 'من المدوّنة', pillars: 'ثلاثة مواضيع أكتب عنها', videos: 'شاهد',
    closeTitle: 'تبحث عن مطوّر، أو تبني شيئًا، أو ترغب بالتعاون؟', closeCta: 'تواصل معي',
  },
  about: { title: 'مهندس يشرح أيضًا.', focus: 'مجالات التركيز', architecture: 'المعمارية', education: 'التعليم', exploring: 'أستكشف حاليًا', based: 'أقيم في', principles: 'كيف أعمل', storyPending: 'ستُكتب القصة الشخصية من لوحة التحرير.' },
  experience: { title: 'الخبرات العملية', lead: 'الأحدث أولًا.', skills: 'المهارات، من السيرة الذاتية', reviewNote: 'الخانات الموسومة «التواريخ قيد المراجعة» مأخوذة من تخطيط في السيرة الذاتية يحتاج إلى مراجعة أخيرة.' },
  projects: { title: 'المشاريع', lead: 'منتجان رئيسيان أولًا. تُضاف المساهمات التفصيلية ولقطات الشاشة من لوحة التحرير.', more: 'مشاريع أخرى', domain: 'المجال', role: 'الدور', period: 'الفترة', stack: 'التقنيات', contributions: 'المساهمات', caseStudyPending: 'ستُضاف دراسة حالة تفصيلية لاحقًا. لا يوجد هنا شيء مختلق في الوقت الحالي.', links: 'روابط', screens: 'الشاشات' },
  blog: { title: 'المدوّنة', lead: 'تُكتب بالعربية أولًا. تتوفر نسخة إنجليزية فقط حيث يُشار إلى ذلك.', all: 'الكل', empty: 'لا توجد مقالات في هذا التصنيف بعد.', none: 'لم تُنشر أي مقالات بعد.', languageLabel: 'لغة المقال', translationAvailable: 'متوفر أيضًا بالإنجليزية', englishAvailable: 'Read in English', arabicAvailable: 'اقرأ بالعربية', onlyArabic: 'هذا المقال بالعربية.', published: 'نُشر', category: 'التصنيف' },
  empty: { articles: 'لا توجد مقالات بعد', articlesBody: 'المقالات الأولى في الطريق، وتُكتب بالعربية أولًا.', category: 'لا يوجد شيء في هذا التصنيف بعد', categoryBody: 'جرّب تصنيفًا آخر أو تصفّح كل المقالات.', videos: 'لا توجد فيديوهات بعد', videosBody: 'ستظهر الفيديوهات والشورتس هنا فور نشرها على يوتيوب.' },
  series: { part: (n: number, total: number) => `الجزء ${n} من ${total}`, contents: 'محتويات السلسلة', startHere: 'ابدأ من الجزء الأول', previous: 'الجزء السابق', next: 'الجزء التالي', more: 'أجزاء أخرى قادمة.', current: 'أنت هنا', navLabel: 'التنقل داخل السلسلة' },
  videos: { title: 'الفيديوهات والشورتس', lead: 'مستضافة على يوتيوب وتُضمَّن من الرابط الأصلي — دون إعادة رفعها هنا.', videos: 'فيديوهات', shorts: 'شورتس', play: (t: string) => `تشغيل الفيديو: ${t}`, openOnYouTube: 'افتح على يوتيوب', samplePlay: 'عنصر تجريبي — سيُحمَّل فيديو يوتيوب الحقيقي هنا.', empty: 'لم تُنشر فيديوهات بعد.', youtubeVideo: 'فيديو يوتيوب', youtubeShort: 'يوتيوب شورت', channel: 'شاهد كل الفيديوهات على يوتيوب', unavailable: 'تعذّر تحميل أحدث الفيديوهات من يوتيوب الآن. ستظهر مجددًا تلقائيًا.', recentNote: 'تظهر أحدث الفيديوهات هنا تلقائيًا من يوتيوب.' },
  contact: {
    title: 'لنتحدث.', lead: 'للفرص الوظيفية والمشاريع والتعاون.', profiles: 'الحسابات', linkPending: 'سيُضاف الرابط', email: 'البريد', location: 'أقيم في', noPhone: 'لا يُنشر رقم هاتف أو عنوان.',
    form: {
      name: 'الاسم', email: 'البريد الإلكتروني', topic: 'موضوع الرسالة', message: 'الرسالة', choose: 'اختر موضوعًا', send: 'أرسل الرسالة', sending: 'جارٍ الإرسال…',
      topics: { role: 'فرصة وظيفية', project: 'مشروع أو استشارة', collab: 'تعاون أو محتوى', other: 'شيء آخر' },
      errors: { name: 'يرجى إدخال اسمك.', email: 'أدخل بريدًا إلكترونيًا صحيحًا مثل name@example.com.', topic: 'اختر موضوعًا لتوجيه الرسالة.', message: 'اكتب 20 حرفًا على الأقل.', tooLong: 'النص طويل جدًا.' },
      fixErrors: 'يرجى تصحيح الحقول المحددة.', success: 'شكرًا لك — أُرسلت رسالتك. سيصلك الرد عبر البريد الإلكتروني.',
      failed: 'تعذّر إرسال الرسالة الآن. نصّك ما زال موجودًا؛ حاول مرة أخرى بعد قليل.',
      notConfigured: 'نموذج التواصل غير متصل بالبريد بعد، لذلك لم تُرسل رسالتك. يُرجى استخدام أحد الحسابات بدلًا من ذلك.',
      spam: 'تعذّر قبول الرسالة. إن كنت إنسانًا فانتظر بضع ثوانٍ وحاول مجددًا.',
      privacy: 'تُستخدم بياناتك للرد عليك فقط ولا تُخزَّن على هذا الموقع.',
    },
  },
  footer: { rights: 'طاهر فواز', builtWith: 'بُني باستخدام Next.js وSanity.' },
}

const dictionaries: Record<Locale, Dictionary> = { en, ar }
export const getDictionary = (locale: Locale) => dictionaries[locale]
