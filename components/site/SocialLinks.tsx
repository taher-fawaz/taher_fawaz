import type { SocialLink } from '@/lib/content/types'
import { SocialIcon } from '@/components/ui/icons'

type Labels = { label: string; newTab: string; email: string; blurbs: Record<string, string> }

/**
 * Social profiles from the CMS. `cards` is the big button grid in the contact block;
 * `icons` is the compact row in the footer (with the email last). Entries without a URL are skipped.
 */
export function SocialLinks({ socials, email, variant, labels }: { socials: SocialLink[]; email?: string; variant: 'cards' | 'icons'; labels: Labels }) {
  const links = socials.filter((s): s is Required<SocialLink> => Boolean(s.url))

  if (variant === 'cards') {
    if (!links.length) return null
    return (
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,10.5rem),1fr))] gap-3" aria-label={labels.label}>
        {links.map((s) => (
          <li key={s.url}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer me"
              className="flex min-h-16 items-center gap-3 rounded-[18px] border-2 border-ink bg-surface px-3.5 py-2.5 text-ink shadow-[0_5px_0_var(--ink)] transition-[transform,box-shadow,background-color] duration-150 hover:-translate-y-0.5 hover:bg-yellow hover:shadow-[0_7px_0_var(--ink)] active:translate-y-[3px] active:shadow-[0_2px_0_var(--ink)] motion-reduce:transform-none"
            >
              <span className="grid size-[2.6rem] shrink-0 place-items-center rounded-[12px] bg-ink text-yellow">
                <SocialIcon platform={s.platform} />
              </span>
              <span className="min-w-0">
                <bdi dir="ltr" className="block font-bold leading-tight">{s.platform}</bdi>
                {labels.blurbs[s.platform] ? <span className="block text-[0.85rem] leading-snug">{labels.blurbs[s.platform]}</span> : null}
              </span>
              <span className="sr-only">, {labels.newTab}</span>
            </a>
          </li>
        ))}
      </ul>
    )
  }

  if (!links.length && !email) return null
  const item = 'grid size-11 place-items-center rounded-[12px] border-2 border-ink bg-surface text-ink transition-colors duration-150 hover:bg-yellow'
  return (
    <ul className="flex flex-wrap gap-2" aria-label={labels.label}>
      {links.map((s) => (
        <li key={s.url}>
          <a href={s.url} target="_blank" rel="noopener noreferrer me" className={item} aria-label={`${s.platform}, ${labels.newTab}`}>
            <SocialIcon platform={s.platform} size={20} />
          </a>
        </li>
      ))}
      {email ? (
        <li>
          <a href={`mailto:${email}`} className={item} aria-label={`${labels.email}: ${email}`}>
            <SocialIcon platform="Email" size={20} />
          </a>
        </li>
      ) : null}
    </ul>
  )
}
