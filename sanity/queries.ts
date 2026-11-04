import { defineQuery } from 'next-sanity'

const image = `{ "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, "lqip": asset->metadata.lqip, alt }`
const category = `category->{ "slug": slug.current, title, description }`
// Resolve image assets inside rich text so the page can render them without extra requests.
const rich = (field: string) => `${field}[]{ ..., _type == "figure" => { ..., "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, "lqip": asset->metadata.lqip } }`
const articleSummary = `
  _id, "id": _id, "slug": slug.current, language, title, excerpt, publishedAt,
  "readingMinutes": round(length(pt::text(body)) / 1000),
  "category": ${category},
  "cover": cover${image},
  "translationKey": coalesce(translationOf._ref, _id)
`

export const settingsQuery = defineQuery(`*[_id == "siteSettings"][0]{
  name, role, headline, intro, "story": { "ar": ${rich('story.ar')}, "en": ${rich('story.en')} }, principles[]{title, text}, email, location,
  socials[]{platform, url},
  roles,
  "featuredProjectSlugs": coalesce(featuredProjects[]->slug.current, []),
  "featuredArticleSlugs": coalesce(featuredArticles[]->slug.current, []),
  "featuredVideoIds": coalesce(featuredVideos[]._ref, [])
}`)

export const experienceQuery = defineQuery(`*[_type == "experience" && visible != false] | order(startDate desc){
  "id": _id, employer, role, location, workMode,
  "start": string::split(startDate, "-")[0] + "-" + string::split(startDate, "-")[1],
  "end": select(defined(endDate) => string::split(endDate, "-")[0] + "-" + string::split(endDate, "-")[1]),
  summary, "highlights": coalesce(highlights, []), "technologies": coalesce(technologies, []),
  "needsReview": coalesce(needsReview, false)
}`)

const projectFields = `
  "id": _id, "slug": slug.current, title, summary, domain, role, period,
  "technologies": coalesce(technologies, []), "contributions": coalesce(contributions, []),
  "links": coalesce(links[]{label, url}, []), "featured": coalesce(featured, false),
  "cover": cover${image}, "gallery": coalesce(gallery[]${image}, [])
`
export const projectsQuery = defineQuery(`*[_type == "project" && defined(slug.current)] | order(featured desc, order asc, _createdAt desc){ ${projectFields} }`)
export const projectQuery = defineQuery(`*[_type == "project" && slug.current == $slug][0]{ ${projectFields}, "caseStudy": { "ar": ${rich('caseStudy.ar')}, "en": ${rich('caseStudy.en')} } }`)

export const categoriesQuery = defineQuery(`*[_type == "category" && defined(slug.current)] | order(order asc, title.en asc){ "slug": slug.current, title, description }`)

export const articlesQuery = defineQuery(`*[_type == "article" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc){ ${articleSummary} }`)

// A series that is not published resolves to null here, so its articles show no series UI.
export const articleQuery = defineQuery(`*[_type == "article" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0]{
  ${articleSummary}, "body": ${rich('body')}, seo,
  "series": select(defined(series->_id) => { "id": series->_id, "title": series->title, "description": series->description, "totalParts": series->totalParts, "part": seriesPart }),
  "translations": *[_type == "article" && _id != ^._id && defined(publishedAt) && publishedAt <= now()
    && coalesce(translationOf._ref, _id) == coalesce(^.translationOf._ref, ^._id)]{ "slug": slug.current, language, title }
}`)

/** Published parts of one series in one language; drafts and future-dated parts are excluded. */
export const seriesMembersQuery = defineQuery(`*[_type == "article" && series._ref == $seriesId && language == $language && defined(slug.current) && defined(seriesPart) && defined(publishedAt) && publishedAt <= now()] | order(seriesPart asc){
  "slug": slug.current, title, "part": seriesPart
}`)

export const videosQuery = defineQuery(`*[_type == "video" && defined(url)] | order(publishedAt desc){
  "id": _id, url, title, language, description, publishedAt, "featured": coalesce(featured, false),
  "thumbnail": thumbnail${image}
}`)
