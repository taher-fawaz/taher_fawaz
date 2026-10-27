import Image from 'next/image'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { ImageAsset, PT } from '@/lib/content/types'
import type { Locale } from '@/lib/i18n/config'
import { tr } from '@/lib/content/localize'

const SOURCE_LABEL: Record<Locale, string> = { ar: 'المصدر', en: 'Source' }

type CodeBlock ={ code?: string; language?: string; filename?: string }
type Figure = { asset?: ImageAsset } & ImageAsset

/** Rich text from Sanity, laid out for reading in the content's own language and direction. */
export function PortableBody({ value, lang }: { value: PT; lang: Locale }) {
  const components: PortableTextComponents = {
    types: {
      code: ({ value: v }: { value: CodeBlock }) => (
        <figure>
          {v.filename ? <figcaption className="meta mb-1 text-muted">{v.filename}</figcaption> : null}
          <pre dir="ltr" lang="en"><code data-language={v.language}>{v.code}</code></pre>
        </figure>
      ),
      // Inline image: width/height come from the asset so the box is reserved before it loads (no layout shift).
      figure: ({ value: v }: { value: Figure }) => {
        if (!v.url || !v.width || !v.height) return null
        const caption = tr(v.caption, lang)
        const credit = v.credit?.trim()
        return (
          <figure>
            <Image src={v.url} alt={tr(v.alt, lang)} width={v.width} height={v.height} loading="lazy" sizes="(min-width: 768px) 68ch, 100vw" className="h-auto w-full border border-rule" placeholder={v.lqip ? 'blur' : 'empty'} blurDataURL={v.lqip} />
            {caption || credit ? (
              <figcaption>
                {caption}
                {caption && credit ? ' · ' : ''}
                {credit ? <bdi className="text-muted">{SOURCE_LABEL[lang]}: {credit}</bdi> : null}
              </figcaption>
            ) : null}
          </figure>
        )
      },
    },
    marks: {
      link: ({ children, value: v }) => {
        const href = String((v as { href?: string })?.href ?? '')
        const external = /^https?:\/\//.test(href)
        return <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{children}</a>
      },
    },
  }
  return (
    <div lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} className={`prose w-full min-w-0 ${lang === 'ar' ? 'prose-ar' : 'prose-en'}`}>
      <PortableText value={value} components={components} />
    </div>
  )
}
