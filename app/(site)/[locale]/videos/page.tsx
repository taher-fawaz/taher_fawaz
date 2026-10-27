import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { isLocale, localePath } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { getVideoLibrary } from '@/lib/content'
import { pageMetadata } from '@/lib/site'
import { EmptyState, PageHeader } from '@/components/ui/primitives'
import { ExternalIcon } from '@/components/ui/icons'
import { Reveal } from '@/components/motion/Reveal'
import { VideoCard } from '@/components/content/VideoCard'

export async function generateMetadata({ params }: PageProps<'/[locale]/videos'>): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const d = getDictionary(locale)
  return pageMetadata(locale, '/videos', { title: d.videos.title, description: d.videos.lead })
}

export default async function VideosPage({ params }: PageProps<'/[locale]/videos'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const d = getDictionary(locale)
  const { videos, feedStatus, channelUrl } = await getVideoLibrary()
  const long = videos.filter((v) => v.kind === 'video')
  const shorts = videos.filter((v) => v.kind === 'short')
  const lead = feedStatus === 'ok' ? `${d.videos.lead} ${d.videos.recentNote}` : d.videos.lead
  return (
    <div className="wrap pb-20 md:pb-28">
      <PageHeader title={d.videos.title} lead={lead}>
        {channelUrl ? (
          <a href={channelUrl} target="_blank" rel="noopener noreferrer me" className="tlink mt-6">
            {d.videos.channel}
            <ExternalIcon size={16} />
          </a>
        ) : null}
      </PageHeader>
      {feedStatus === 'unavailable' ? (
        <p role="status" className="mb-10 max-w-[62ch] border border-rule px-4 py-3 text-[0.95rem] text-muted">{d.videos.unavailable}</p>
      ) : null}
      {!videos.length && feedStatus !== 'unavailable' ? <EmptyState title={d.empty.videos} actions={<Link href={localePath(locale, '/blog')} className="tlink">{d.home.secondaryCta}</Link>}>{d.empty.videosBody}</EmptyState> : null}
      {long.length ? (
        <section aria-labelledby="long" className="rule-strong pt-8">
          <h2 id="long" className="section-title mb-8">{d.videos.videos}</h2>
          <Reveal className="grid gap-x-8 gap-y-12 md:grid-cols-2">
            {long.map((v) => <VideoCard key={v.id} video={v} locale={locale} sizes="(min-width: 768px) 50vw, 100vw" />)}
          </Reveal>
        </section>
      ) : null}
      {shorts.length ? (
        <section aria-labelledby="shorts" className="rule-strong mt-16 pt-8 md:mt-24">
          <h2 id="shorts" className="section-title mb-8">{d.videos.shorts}</h2>
          <Reveal className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {shorts.map((v) => <VideoCard key={v.id} video={v} locale={locale} sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw" />)}
          </Reveal>
        </section>
      ) : null}
    </div>
  )
}
