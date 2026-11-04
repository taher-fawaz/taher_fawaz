import { defineArrayMember, defineField, defineType, type Rule } from 'sanity'

/** Arabic is required by default for bilingual fields; English is optional. */
const arRequired = (label: string) => (rule: Rule) =>
  rule.custom((v) => ((v as { ar?: string } | undefined)?.ar?.trim() ? true : `${label}: Arabic is required`))

export const localeString = defineType({
  name: 'localeString',
  title: 'Localized text',
  type: 'object',
  fieldsets: [{ name: 'translations', title: 'Translations', options: { columns: 2 } }],
  fields: [
    defineField({ name: 'ar', title: 'Arabic', type: 'string', fieldset: 'translations' }),
    defineField({ name: 'en', title: 'English (optional)', type: 'string', fieldset: 'translations' }),
  ],
})

export const localeText = defineType({
  name: 'localeText',
  title: 'Localized paragraph',
  type: 'object',
  fields: [
    defineField({ name: 'ar', title: 'Arabic', type: 'text', rows: 3 }),
    defineField({ name: 'en', title: 'English (optional)', type: 'text', rows: 3 }),
  ],
})

export const code = defineType({
  name: 'code',
  title: 'Code',
  type: 'object',
  fields: [
    defineField({ name: 'language', type: 'string', initialValue: 'dart', options: { list: ['dart', 'kotlin', 'swift', 'java', 'typescript', 'json', 'yaml', 'bash'] } }),
    defineField({ name: 'filename', type: 'string' }),
    defineField({ name: 'code', type: 'text', rows: 10, validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'filename', subtitle: 'language' }, prepare: ({ title, subtitle }) => ({ title: title || 'Code block', subtitle }) },
})

export const figure = defineType({
  name: 'figure',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({ name: 'alt', title: 'Alternative text', type: 'localeString', description: 'Describe the image for people who cannot see it.', validation: arRequired('Alt text') }),
    defineField({ name: 'caption', title: 'Caption (optional)', type: 'localeString', description: 'Shown under the image in the article.' }),
    defineField({ name: 'credit', title: 'Attribution / source (optional)', type: 'string', description: 'Needed for any image that is not original. Leave empty for original diagrams.' }),
  ],
})

export const blockContent = defineType({
  name: 'blockContent',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' },
        ],
        annotations: [
          defineArrayMember({
            name: 'link', type: 'object', title: 'Link',
            fields: [defineField({ name: 'href', type: 'url', validation: (r) => r.uri({ scheme: ['http', 'https', 'mailto'], allowRelative: true }) })],
          }),
        ],
      },
    }),
    defineArrayMember({ type: 'figure' }),
    defineArrayMember({ type: 'code' }),
  ],
})

export const localeBlockContent = defineType({
  name: 'localeBlockContent',
  title: 'Localized rich text',
  type: 'object',
  fields: [
    defineField({ name: 'ar', title: 'Arabic', type: 'blockContent' }),
    defineField({ name: 'en', title: 'English (optional)', type: 'blockContent' }),
  ],
})

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.max(70).warning('Keep titles under ~70 characters') }),
    defineField({ name: 'description', type: 'text', rows: 2, validation: (r) => r.max(170).warning('Keep descriptions under ~170 characters') }),
  ],
})

export { arRequired }
