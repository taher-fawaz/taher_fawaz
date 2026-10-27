import 'server-only'
import { createClient, type QueryParams } from 'next-sanity'
import { apiVersion, dataset, isSanityConfigured, projectId } from './env'

// Public read client: published documents only, no token. Drafts can never leak to public pages.
const client = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: 'published' })
  : null

/** Revalidate hourly as a safety net; the Sanity webhook (/api/revalidate) refreshes tags on publish. */
export async function sanityFetch<T>(query: string, params: QueryParams = {}, tags: string[] = []): Promise<T> {
  if (!client) throw new Error('Sanity is not configured')
  return client.fetch<T>(query, params, { next: { revalidate: 3600, tags: ['sanity', ...tags] } })
}
