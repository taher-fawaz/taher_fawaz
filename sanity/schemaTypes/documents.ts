import { defineArrayMember, defineField, defineType } from 'sanity'
import { arRequired } from './objects'

const LANGS = [{ title: 'Arabic', value: 'ar' }, { title: 'English', value: 'en' }]

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [{ name: 'profile', title: 'Profile', default: true }, { name: 'contact', title: 'Contact' }, { name: 'home', title: 'Homepage' }],
  fields: [
    defineField({ name: 'name', type: 'localeString', group: 'profile', validation: arRequired('Name') }),
    defineField({ name: 'role', title: 'Professional title', type: 'localeString', group: 'profile' }),
    defineField({ name: 'headline', title: 'Hero headline', type: 'localeString', group: 'home', description: 'Leave empty to use the default headline.' }),
    defineField({ name: 'intro', title: 'Professional description', type: 'localeText', group: 'profile' }),
    defineField({ name: 'story', title: 'About — story', type: 'localeBlockContent', group: 'profile' }),
    defineField({
      name: 'principles', title: 'About — how I work', type: 'array', group: 'profile',
      of: [defineArrayMember({ type: 'object', fields: [defineField({ name: 'title', type: 'localeString' }), defineField({ name: 'text', type: 'localeText' })], preview: { select: { title: 'title.en', subtitle: 'title.ar' } } })],
    }),
    defineField({ name: 'roles', title: 'Engineer / Educator / Builder blurbs', type: 'object', group: 'home', fields: [
      defineField({ name: 'engineer', type: 'localeText' }), defineField({ name: 'educator', type: 'localeText' }), defineField({ name: 'builder', type: 'localeText' }),
    ] }),
    defineField({ name: 'email', title: 'Public email', type: 'string', group: 'contact', validation: (r) => r.email() }),
    defineField({ name: 'location', title: 'City and country only', type: 'localeString', group: 'contact', description: 'Never enter a street address.' }),
    defineField({
      name: 'socials', title: 'Social links', type: 'array', group: 'contact',
      of: [defineArrayMember({ type: 'object', fields: [
        defineField({ name: 'platform', type: 'string', options: { list: ['LinkedIn', 'GitHub', 'YouTube', 'X', 'Medium'] }, validation: (r) => r.required() }),
        defineField({ name: 'url', type: 'url', validation: (r) => r.required().uri({ scheme: ['https'] }) }),
      ], preview: { select: { title: 'platform', subtitle: 'url' } } })],
    }),
    defineField({ name: 'featuredProjects', type: 'array', group: 'home', of: [defineArrayMember({ type: 'reference', to: [{ type: 'project' }] })], validation: (r) => r.max(2) }),
    defineField({ name: 'featuredArticles', type: 'array', group: 'home', of: [defineArrayMember({ type: 'reference', to: [{ type: 'article' }] })], validation: (r) => r.max(3) }),
    defineField({ name: 'featuredVideos', title: 'Featured videos (1 video + 2 Shorts)', type: 'array', group: 'home', of: [defineArrayMember({ type: 'reference', to: [{ type: 'video' }] })], validation: (r) => r.max(3) }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
})

export const experience = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  orderings: [{ title: 'Start date, newest', name: 'startDesc', by: [{ field: 'startDate', direction: 'desc' }] }],
  fields: [
    defineField({ name: 'employer', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', type: 'localeString', validation: arRequired('Role') }),
    defineField({ name: 'location', type: 'localeString' }),
    defineField({ name: 'workMode', type: 'string', options: { list: [{ title: 'On-site', value: 'onsite' }, { title: 'Hybrid', value: 'hybrid' }, { title: 'Remote', value: 'remote' }], layout: 'radio', direction: 'horizontal' } }),
    defineField({ name: 'startDate', type: 'date', options: { dateFormat: 'MMM YYYY' }, validation: (r) => r.required() }),
    defineField({ name: 'endDate', type: 'date', description: 'Leave empty for the current role.', options: { dateFormat: 'MMM YYYY' },
      validation: (r) => r.custom((end, ctx) => {
        const start = (ctx.document as { startDate?: string } | undefined)?.startDate
        return !end || !start || end >= start ? true : 'End date must be after the start date'
      }) }),
    defineField({ name: 'summary', type: 'localeText' }),
    defineField({ name: 'highlights', type: 'array', of: [defineArrayMember({ type: 'localeText' })] }),
    defineField({ name: 'technologies', type: 'array', of: [defineArrayMember({ type: 'string' })], options: { layout: 'tags' } }),
    defineField({ name: 'visible', title: 'Show on the website', type: 'boolean', initialValue: true }),
    defineField({ name: 'needsReview', title: 'Dates still need confirmation', type: 'boolean', initialValue: false, description: 'Shows a small “dates under review” marker publicly.' }),
  ],
  preview: { select: { title: 'employer', subtitle: 'role.en', start: 'startDate' }, prepare: ({ title, subtitle, start }) => ({ title, subtitle: [subtitle, start].filter(Boolean).join(' · ') }) },
})

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  orderings: [{ title: 'Manual order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  groups: [{ name: 'main', title: 'Main', default: true }, { name: 'media', title: 'Media' }, { name: 'story', title: 'Case study' }],
  fields: [
    defineField({ name: 'title', type: 'string', group: 'main', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', group: 'main', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'summary', type: 'localeText', group: 'main', validation: arRequired('Summary') }),
    defineField({ name: 'domain', title: 'Domain · country', type: 'localeString', group: 'main' }),
    defineField({ name: 'role', type: 'localeString', group: 'main' }),
    defineField({ name: 'period', type: 'string', group: 'main', description: 'e.g. “Jul 2025 – Now”' }),
    defineField({ name: 'technologies', type: 'array', group: 'main', of: [defineArrayMember({ type: 'string' })], options: { layout: 'tags' } }),
    defineField({ name: 'contributions', type: 'array', group: 'main', of: [defineArrayMember({ type: 'localeText' })], description: 'Only real, verifiable contributions.' }),
    defineField({ name: 'links', type: 'array', group: 'main', of: [defineArrayMember({ type: 'object', fields: [defineField({ name: 'label', type: 'string' }), defineField({ name: 'url', type: 'url' })] })] }),
    defineField({ name: 'featured', type: 'boolean', group: 'main', initialValue: false }),
    defineField({ name: 'order', type: 'number', group: 'main', initialValue: 100 }),
    defineField({ name: 'cover', title: 'Cover image', type: 'figure', group: 'media', description: 'Use only approved, genuine screenshots or logos.' }),
    defineField({ name: 'gallery', type: 'array', group: 'media', of: [defineArrayMember({ type: 'figure' })] }),
    defineField({ name: 'caseStudy', title: 'Case study (optional)', type: 'localeBlockContent', group: 'story' }),
  ],
  preview: { select: { title: 'title', subtitle: 'domain.en', media: 'cover' } },
})

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'localeString', validation: arRequired('Title') }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title.en' }, validation: (r) => r.required() }),
    defineField({ name: 'description', type: 'localeText' }),
    defineField({ name: 'order', type: 'number', initialValue: 10 }),
  ],
  preview: { select: { title: 'title.en', subtitle: 'title.ar' } },
})

/** A multi-part article series. Parts are `article` documents that reference this document. */
export const series = defineType({
  name: 'series',
  title: 'Article series',
  type: 'document',
  description: 'Publish the series before publishing any of its parts. The public site shows only published parts.',
  fields: [
    defineField({ name: 'title', type: 'localeString', validation: arRequired('Title') }),
    defineField({ name: 'slug', type: 'slug', description: 'Latin characters, e.g. “flutter-architecture”.', options: { source: 'title.en' }, validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Short introduction', type: 'localeText', description: 'One or two sentences on what the series covers.' }),
    defineField({ name: 'totalParts', title: 'Planned number of parts', type: 'number', validation: (r) => r.required().integer().min(2).max(8) }),
  ],
  preview: { select: { title: 'title.ar', subtitle: 'title.en' } },
})

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  orderings: [{ title: 'Published, newest', name: 'publishedDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  fields: [
    defineField({ name: 'language', type: 'string', initialValue: 'ar', options: { list: LANGS, layout: 'radio', direction: 'horizontal' }, validation: (r) => r.required() }),
    defineField({ name: 'title', type: 'string', validation: (r) => r.required().max(120) }),
    defineField({ name: 'slug', type: 'slug', description: 'Use Latin characters, e.g. “bloc-or-riverpod”.', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'excerpt', type: 'text', rows: 3, validation: (r) => r.max(240) }),
    defineField({ name: 'cover', type: 'figure', validation: (r) => r.custom((v) => (v ? true : 'Add a cover image before review')).warning() }),
    defineField({ name: 'category', type: 'reference', to: [{ type: 'category' }] }),
    defineField({ name: 'series', title: 'Series (optional)', type: 'reference', to: [{ type: 'series' }], description: 'Leave empty for a standalone article.' }),
    defineField({
      name: 'seriesPart', title: 'Part number', type: 'number', description: 'Position inside the series, starting at 1.',
      hidden: ({ document }) => !document?.series,
      validation: (r) => r.integer().min(1).max(8).custom((v, ctx) => (ctx.document?.series && !v ? 'Part number is required for a series article' : true)),
    }),
    defineField({ name: 'publishedAt', title: 'Publish date', type: 'datetime', description: 'Articles without a date (or with a future date) are not shown on the site.' }),
    defineField({ name: 'body', type: 'blockContent' }),
    defineField({
      name: 'translationOf', title: 'Translation of', type: 'reference', to: [{ type: 'article' }],
      description: 'For an English version, select the original Arabic article. Leave empty on originals.',
      options: { filter: ({ document }) => ({ filter: '_id != $id && !defined(translationOf)', params: { id: document._id.replace(/^drafts\./, '') } }) },
    }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: { select: { title: 'title', lang: 'language', date: 'publishedAt', media: 'cover' }, prepare: ({ title, lang, date, media }) => ({ title, media, subtitle: `${String(lang).toUpperCase()} · ${date ? String(date).slice(0, 10) : 'not scheduled'}` }) },
})

export const video = defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  orderings: [{ title: 'Published, newest', name: 'publishedDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  fields: [
    defineField({
      name: 'url', title: 'YouTube URL', type: 'url', description: 'Watch, youtu.be or /shorts/ URL. Shorts are detected automatically.',
      validation: (r) => r.required().custom((v) => (!v || /(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]{11}/.test(String(v)) ? true : 'Enter a valid YouTube video or Shorts URL')),
    }),
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'language', type: 'string', initialValue: 'ar', options: { list: LANGS, layout: 'radio', direction: 'horizontal' } }),
    defineField({ name: 'description', type: 'text', rows: 3 }),
    defineField({ name: 'category', type: 'reference', to: [{ type: 'category' }] }),
    defineField({ name: 'thumbnail', title: 'Custom thumbnail (optional)', type: 'figure', description: 'If empty, the YouTube thumbnail is used.' }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
    defineField({ name: 'featured', type: 'boolean', initialValue: false }),
  ],
  preview: { select: { title: 'title', subtitle: 'url' } },
})
