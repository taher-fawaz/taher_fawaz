// Public, non-secret Sanity identifiers. Safe in browser bundles (the Studio needs them).
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-10-01'

/** True only when a syntactically valid project ID is present. */
export const isSanityConfigured = /^[a-z0-9][a-z0-9-]*$/.test(projectId)
