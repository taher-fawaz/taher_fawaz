---
name: sanity-blog-author
description: Write a technical article, or a multi-part series, for Taher Fawaz's website on request, create original cover and inline diagrams, and save everything to Sanity as DRAFTS through the official Sanity MCP. Use when the user asks to write, draft or save an article, post, blog entry or series about a topic (Arabic by default). Never publishes without explicit, named approval.
---

# Sanity blog author

On-demand only. When asked for an article, you decide single article vs series, write it, create original visuals, and save drafts. Do not return only text to copy, unless the CMS is unreachable (see Failure handling).

## 0. Hard rules

- Create **drafts only**. Never call `publish_documents`, `unpublish_documents` or `discard_drafts`, and never change a published document's publication status, unless the user explicitly says to publish **and** names the draft(s). Revising an already published article means patching it so Sanity creates a **draft revision** (the published version stays live until the user publishes it).
- Use the existing `article`, `series` and `category` types. Never create competing types. Never call `deploy_schema`, `undeploy_schema` or `deploy_studio`.
- No scheduling, no daily generation, no LinkedIn posting.
- Never invent Taher's personal experience, employer details, project specifics, performance numbers, benchmarks, quotes or achievements. No confidential work information. Write explanatory, first-principles articles; if a personal angle would help, ask for the real story instead of making one up.
- Verify version-specific or current facts (APIs, versions, deprecations) against official docs (WebSearch/WebFetch) before stating them.
- Visuals: only original diagrams or conceptual illustrations. Never invent company logos, product screenshots, real app UIs or benchmark charts; never hotlink or reuse copyrighted images. No paid image API without asking first.
- Do not create test or filler content. Only write what was requested.

## 1. Decide: single article or series

Before writing, estimate scope: list the distinct technical chapters the topic needs and the likely Arabic word count.

- **Single article**: one focused question or technique; roughly up to 2,000-2,500 Arabic words; one coherent result. Keep it single.
- **Series (2 to 5 parts, rarely more)**: several substantial, independently useful subtopics, or more than roughly 2,000-2,500 Arabic words, or distinct chapters that would make one article exhausting. Judgment beats word count.
- Never split just to create more pages; no padding, no repetition between parts. Each part must deliver a complete, useful result on its own, with a short recap of earlier parts instead of re-explaining them.
- State the decision and the outline to the user in 3-6 lines (title per part and why a series, or why single), then proceed. Ask only if the topic is truly ambiguous.

For a series, plan first: series title, short introduction, ordered outline, and per part: title, slug, excerpt, category, intended part number, total part count, cover concept, and which concepts get inline diagrams.

## 2. Language and pillars

Default **Arabic** (`language: "ar"`): natural, technically accurate Egyptian-friendly Modern Standard Arabic; keep Latin technical terms (Flutter, Bloc, Clean Architecture, API) in English. English only if asked; an English version is a separate article with `translationOf` pointing at the Arabic original. No translation is required.

Pick exactly one category per article:

| Category | Document ID | Slug |
|---|---|---|
| Mobile Engineering | `cv-category-mobile-engineering` | `mobile-engineering` |
| Software Architecture | `cv-category-software-architecture` | `software-architecture` |
| Real-World Engineering | `cv-category-real-world-engineering` | `real-world-engineering` |

Use a plain reference `{_type: "reference", _ref: "<id>"}`. Verify the IDs with a query first.

## 3. Check the CMS before creating anything

Sanity MCP tools appear as `mcp__plugin_sanity_Sanity__*` (plugin) or `mcp__Sanity__*` (`.mcp.json`); load them with ToolSearch. Project `s8jz28zs`, dataset `production`.

1. `get_schema`: currently **no schema is deployed** to the dataset, so `get_schema` and `documents_validate` fail with "No Sanity schema has been deployed". Treat `sanity/schemaTypes/documents.ts` and `objects.ts` as the source of truth and validate lengths and required fields yourself. Do not deploy; the user decides (`npx sanity@latest schema deploy`).
2. Duplicate check, covering published and draft versions:
   `*[_type=="article"]{_id,title,"slug":slug.current,language,publishedAt,"series":series._ref,seriesPart}` and `*[_type=="series"]{_id,"slug":slug.current,title}`.
   Slugs must be unique across all articles (and series slugs across series). Stop and ask if an existing article covers the same topic and angle.

## 4. Write

Substantial and specific: concrete code, trade-offs, failure modes, a decision rule. Structure: short opening (problem and audience), `h2` sections, closing takeaway. No filler, no emoji, no unexplained buzzwords. Official sources only; list what you checked in your report, never put invented citations in the article. Do not copy source text. In a series, the last paragraph of each part (except the last) names what the next part covers, without hard-coding URLs (the site renders previous/next links itself).

## 5. Schema mapping (actual fields)

**article**

| Field | Rule |
|---|---|
| `language` | `"ar"` or `"en"` |
| `title` | required, max 120 |
| `slug` | `{_type:"slug", current}`, lowercase Latin, unique |
| `excerpt` | max 240, in the article language |
| `category` | reference to a category document |
| `cover` | `figure` (see section 6); expected before review (Studio shows a warning without it) |
| `series` | reference to a **series** document (series articles only) |
| `seriesPart` | integer 1..8, required when `series` is set |
| `publishedAt` | **leave unset** (no date = never shown on the site); the user sets it when publishing |
| `body` | Portable Text, see below |
| `translationOf` | only for English versions |
| `seo` | `{title <= 70, description <= 170}` |

**series** (create one document per series, as a draft): `title` `{_type:"localeString", ar, en?}` (Arabic required), `slug`, `description` `{_type:"localeText", ar, en?}`, `totalParts` integer 2..8.

Publishing order matters for the user: the series must be published **before** its parts (a published article cannot reference an unpublished document). The site shows series UI only when the series and the part are published, and lists only published parts.

**body** blocks (each needs a unique `_key`):
- Paragraph: `{_type:"block", _key, style:"normal", markDefs:[], children:[{_type:"span", _key, text, marks:[]}]}`; styles `normal`, `h2`, `h3`, `blockquote`; decorators `strong`, `em`, `code`; link annotation `link` with `href`. No lists.
- Code: `{_type:"code", _key, language, filename?, code}`; language in `dart, kotlin, swift, java, typescript, json, yaml, bash`.
- Inline image: `{_type:"figure", _key, asset:{_type:"reference", _ref:"image-..."}, alt:{_type:"localeString", ar, en?}, caption:{_type:"localeString", ar?, en?}, credit?}`. `alt.ar` is required. `credit` only for non-original images (leave empty for your own diagrams).

## 6. Visuals (every article gets a cover; add inline diagrams only when they explain)

1. **Cover**: required for every article. In a series, keep one visual style across parts and make each cover distinguishable (part-specific concept or label).
2. **Inline diagrams**: only where they materially help: architecture layers, request/data flow, state-management relationships, component hierarchies, comparisons. Typically 0-3 per article; never one per paragraph.
3. **Create originals as SVG** (no image-generation tool is configured; do not add one without approval). Save sources in `content/illustrations/<article-slug>/` (`cover.svg`, `<name>.svg`). Style tokens: paper `#f6f1e7`, paper-2 `#ede6d6`, ink `#11171a`, muted `#4a5654`, forest `#1f4d3a`, forest-deep `#173a2b`, gold `#d4ac55`. Give every SVG an opaque background (it must read in both light and dark themes), explicit `width`/`height` plus `viewBox`, a `<title>`, and a `markerUnits="userSpaceOnUse"` arrow marker. Use **Latin labels only** inside images (class names, layer names); Arabic text belongs in `alt` and `caption`, because SVG-as-image cannot rely on Arabic fonts. Covers: 1600x900; diagrams: about 1200 wide. Use separate `<path>`s per arrow (a marker applies only to the last subpath).
4. Preview before uploading: `node -e "require('sharp')(file).png().toFile(out)"` then Read the PNG; fix overlaps and clipped text.
5. **Upload through the Sanity MCP**: `dataset_assets_upload_from_file` (assetType `image`, `filename`, `title`, `description`) returns a one-use `uploadUrl`; then `curl -s -X POST -H "Content-Type: image/svg+xml" --data-binary @file.svg "<uploadUrl>"` (Bash). The response contains `reference.asset._ref` (use it as `asset._ref`) and the CDN URL. The URL is single use; if it fails, prepare a new one. Never claim an image was saved unless that response succeeded.
6. Write meaningful Arabic `alt` (describe what the diagram shows, with its labels and arrows) and a short `caption` that states the takeaway. Add English alt/caption only for English articles.
7. If upload is impossible, keep the files locally, say so honestly, and leave `cover` empty.

## 7. Create the drafts

- Series: create the `series` draft first, then each article draft with `series: {_type:"reference", _ref:"<series published id>"}` (use the id of the series draft without the `drafts.` prefix; Sanity resolves it on publish) and `seriesPart`. Omit `_id` and let Sanity generate it, then read back the generated IDs.
- Single article: one `article` draft.
- `create_documents` with `projectId`, `dataset`, never a `releaseId`. For large bodies, create one article per call (100 kB request limit). Attach images by patching the draft (`patch_documents` with `set`/`insert`) or include the references in the initial content.
- Revising a published article: `patch_documents` on its published `_id` (Sanity creates `drafts.<id>` from the published revision). Never patch to change `publishedAt`/publication status unless the user asked. Insert figures with `{"insert": {"after": "body[_key==\"<key>\"]", "items": [...]}}`.

## 8. Verify and report

1. Query each draft: `_id`, `_type`, slug, language, category title, `series`/`seriesPart`, block counts, and that `cover.asset` and every `body[_type=="figure"].asset` resolves (`asset->url`, `asset->metadata.dimensions`). Check `length(alt.ar)` and captions.
2. Confirm no published copy was created for new articles, and that a revised article's published version is unchanged (no figures, same block count).
3. Report: title, slug, language, category, draft ID, series membership ("Part N of M"), Studio review path `/studio/structure/article;<id>`, public URL after publishing (`/ar/blog/<slug>`), what each image shows, sources checked, anything unverified, and the publishing order for a series (series first, then parts in order, each with a `publishedAt` date).

## 9. Publishing (only on explicit request)

Restate "Publish `<title>` (`<slug>`)?" unless the user already named the drafts in the same message. A new article needs `publishedAt` set (ask for the date or use the one given); for a series publish the series first. Use `publish_documents` for exactly the named drafts, then verify with a published-perspective query. Never batch-publish unnamed drafts.

## Failure handling

If the Sanity MCP is not authenticated or a call fails: say so plainly, do **not** claim anything was saved, give the finished article as text (title, slug, category, excerpt, SEO, body in Markdown) and keep any generated images locally. Tell the user to authenticate with `/mcp` and ask again. Never ask for a token in chat and never fall back to a write token.
