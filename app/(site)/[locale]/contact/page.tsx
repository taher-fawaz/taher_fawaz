import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { getSettings } from '@/lib/content'
import { tr } from '@/lib/content/localize'
import { pageMetadata } from '@/lib/site'
import { Chip, PageHeader } from '@/components/ui/primitives'
import { ExternalIcon } from '@/components/ui/icons'
import { ContactForm } from '@/components/contact/ContactForm'

export async function generateMetadata({ params }: PageProps<'/[locale]/contact'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const d = getDictionary(locale)
  return pageMetadata(locale, '/contact', { title: d.nav.contact, description: d.contact.lead })
}

export default async function ContactPage({ params }: PageProps<'/[locale]/contact'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const d = getDictionary(locale)
  const settings = await getSettings()
  const f = d.contact.form
  return (
    <div className="wrap pb-20 md:pb-28">
      <PageHeader title={d.contact.title} lead={d.contact.lead} />
      <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        <div>
          <h2 className="mb-3 text-[1.3rem]">{d.contact.profiles}</h2>
          <ul className="rule-strong">
            {settings.socials.map((s) => (
              <li key={s.platform} className="flex flex-wrap items-center justify-between gap-3 border-b border-rule py-4">
                <span className="font-medium"><bdi dir="ltr">{s.platform}</bdi></span>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer me" className="tlink">
                    <bdi dir="ltr">{s.url.replace(/^https?:\/\/(www\.)?/, '')}</bdi>
                    <ExternalIcon size={16} />
                  </a>
                ) : (
                  <Chip>{d.contact.linkPending}</Chip>
                )}
              </li>
            ))}
            <li className="flex flex-wrap items-center justify-between gap-3 border-b border-rule py-4">
              <span className="font-medium">{d.contact.email}</span>
              {settings.email ? <a href={`mailto:${settings.email}`} className="tlink"><bdi dir="ltr">{settings.email}</bdi></a> : <Chip>{d.contact.linkPending}</Chip>}
            </li>
          </ul>
          <p className="mt-6 text-[0.92rem] text-muted">
            {d.contact.location}: {tr(settings.location, locale)}. {d.contact.noPhone}
          </p>
        </div>
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
  )
}
