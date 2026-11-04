# Taher Fawaz — Personal Brand Website: Product & Architecture Plan

Status: **draft for review. Nothing in this document is implemented.** Companion file: `prototype.html` (open directly in a browser).
All factual claims come from the CV (`Taher Fawaz.pdf`, 3 pages) or the brief. Anything else is marked **[draft]**, **[placeholder]** or **[confirm]**.

---

## 1. Executive summary and product objectives

The site is the central online home of one person's professional identity, built around three reinforcing roles:

| Role | What it proves | Where it lives |
|---|---|---|
| **Engineer** | Seven years of Flutter and native Android work, clean architecture, performance, real products used at scale | Work Experience, Projects |
| **Educator** | Practical knowledge shared in Arabic through articles, videos and Shorts | Blog, Videos |
| **Builder** | Ideas turned into working products, shown as they happen | Projects (personal/experiments, deferred), later a "Lab" collection |

**Core idea:** each role links to the others. A project links to the article that explains its architecture; an article embeds the video that walks through it; a video points back to the project. The Home page makes this loop visible instead of listing three unrelated sections.

**Objectives (in priority order)**
1. Credibility for recruiters and engineering leaders within one screen: who, what stack, where now, which flagship products.
2. A recognizable Arabic-first technical voice that grows an audience over time.
3. A low-friction way to be contacted for roles and projects.
4. Content that Taher can publish alone, without a developer, within minutes.

**Success signals (to be tracked, not promised):** contact-form submissions, clicks from Home to Sanad / My e& pages, article and video views, returning visitors. No targets are set in this plan.

---

## 2. Target audiences and primary journeys

| Audience | Wants | Journey (target ≤ 3 clicks) | Language |
|---|---|---|---|
| Recruiter / hiring manager | Fast verification of seniority, stack, current role | Home → Experience → Contact (or download CV) | Mostly English |
| Engineering leader | Depth: architecture decisions, scale, trade-offs | Home → Project (Sanad / My e&) → related article | English / Arabic |
| Developer (Arabic-speaking) | Practical, trustworthy explanations | Search or YouTube → Article or Video → related content → follow | Arabic |
| Potential client / collaborator | Evidence of delivery, easy first contact | Home → Projects → Contact | English / Arabic |
| Fellow educator / community | A voice worth following | Videos → Blog → social links | Arabic |

---

## 3. Brand positioning and messaging

**Positioning statement [draft]:** *A senior mobile engineer who builds Flutter and Android apps at scale — and explains, in Arabic, how they are built.*

**Message pillars (from the brief)**
1. **Mobile Engineering** — Flutter, and SwiftUI as a *content topic*.
2. **Software Architecture** — Clean Architecture, state management, API integration, performance.
3. **Real-World Engineering** — practical problems, trade-offs, lessons, implementation decisions.

**Voice:** direct, specific, unhyped. Prefer a named decision and its trade-off over adjectives. No invented metrics.

**Hard rule — SwiftUI:** the CV lists Flutter and Android (Kotlin/Java), with native iOS integrations via platform channels. SwiftUI appears on the site only as a topic Taher teaches/explores, never as claimed professional experience.

**Draft headline options (EN / AR)**
- "I build mobile apps at scale, then explain how they work." / «أبني تطبيقات موبايل واسعة النطاق، ثم أشرح كيف تعمل.» (used in the prototype)

---

## 4. Information architecture and sitemap

```
/                       Home
/about                  About
/experience             Work Experience
/projects               Projects listing
/projects/[slug]        Project detail  (Sanad, My Etisalat / My e& first)
/blog                   Articles listing + category filter
/blog/[slug]            Article detail
/blog/category/[slug]   Category listing (static, indexable)
/videos                 Videos + Shorts library
/contact                Contact + form
/studio                 Embedded Sanity Studio (Admin) — not linked publicly
/sitemap.xml  /robots.txt  /blog/rss.xml
```

All public routes exist under a locale prefix: `/en/...` and `/ar/...` (see §9). Primary navigation: **Work · Writing · Videos · About · Contact**, with Experience and Projects grouped under *Work* on mobile. Language switch and theme toggle sit in the header.

---

## 5. Home page: section order and purpose

| # | Section | Purpose |
|---|---|---|
| 1 | **Hero** — name, one-sentence positioning, the three-role orbit diagram, two actions | Establish identity and the Engineer/Educator/Builder model in one view; each orbiting role links to its section |
| 2 | **Currently** — one line: current role and employer (from CV) | Immediate recruiter verification |
| 3 | **Selected projects** — Sanad (large), My Etisalat / My e& (offset) | Evidence. Deliberately unequal layout; real screenshots replace placeholders later |
| 4 | **Experience ledger** — latest 4 roles, link to full history | Chronology without opening the CV |
| 5 | **Writing** — three featured articles + the three content pillars | Shows the Educator role and what topics to expect |
| 6 | **Videos** — one landscape video, two Shorts | Shows the Educator role in a second format |
| 7 | **Contact close** — one sentence and one primary action | Conversion |

The Builder role has no flagship content yet; the plan treats it as an honest, visible "coming as it becomes real" slot instead of fabricating projects.

---

## 6. Page specifications

**About** — Short story in first person (**[draft]**, Taher to write/approve), what he works on (Flutter, Android, architecture, performance, offline-first, Firebase), how he thinks (engineering philosophy: three to five principles, **[placeholder]**), background (education: B.Eng. 2018, Higher Institute for Engineering & Technology, 6th October City; earlier web/UI work), what he is exploring now (SwiftUI as a topic). *Not* a CV copy.

**Work Experience** — Reverse-chronological ledger: employer, role, dates, location/mode, 1–3 concise bullets paraphrased from the CV, technologies. Draft marks any entry whose dates need confirmation. A downloadable CV link is a deferred option (decision §14).

**Projects** — Listing sorted by `order`; featured projects first. Detail page template: summary, role, client domain, platform, stack, contributions (from CV), gallery (screenshots/logos supplied by Taher), related articles/videos, store links if any. Case-study depth is optional and added later by pasting rich text into Sanity.

**Blog** — Listing with category filter (three pillars + free categories), reading-time, publish date, language badge, "EN available" badge if a translation exists. Article page: reading column ≤ 68ch (≈ 65 Arabic chars), code blocks with LTR direction inside RTL text, table of contents for long posts, related project/video, share links.

**Videos** — Filter: All / Videos / Shorts. Cards link to the original YouTube URL or play inline through a click-to-load embed (no thumbnail-only iframe load). Each video can reference a related article or project.

**Contact** — Short statement of what to contact about (roles, consulting/projects, collaboration), the form, social links (placeholders), response-time expectation **[confirm]**. No phone number, no street address.

---

## 7. Content model and relationships

Defined here as entities and fields only; **no Sanity schema is created in this phase.**
`L` = localized pair `{ar, en}`. Arabic required unless stated; English optional where marked.

**siteSettings** (singleton): `name L`, `role L`, `headline L`, `intro L`, `email` (public address **[placeholder]**), `socialLinks[] {platform, url}`, `youtubeChannelUrl`, `cvFile` (optional), `seoDefaults {title L, description L, ogImage}`, `locationText L` ("Cairo, Egypt").

**experience**: `employer`, `role L`, `startDate`, `endDate` (empty = current), `workMode` (on-site/hybrid/remote), `location`, `summary L`, `highlights[] L`, `technologies[]`, `domain`, `order`, `datesConfirmed` (internal flag).

**project**: `title`, `slug`, `summary L`, `domain L`, `country`, `role L`, `period`, `featured`, `order`, `logo`, `heroImage`, `gallery[] {image, alt L, caption L}`, `contributions[] L`, `stack[]`, `links[] {label, url}`, `body` (portable text, optional per language), `relatedArticles[] → article`, `relatedVideos[] → video`, `status`, `seo`.

**article**: `title L` (AR required), `slug` (single, Latin), `excerpt L`, `coverImage` + `alt`, `category → category`, `tags[]`, `publishedAt`, `updatedAt`, `body` (portable text, AR), `bodyEn` (portable text, **optional translation**), `relatedProject → project`, `relatedVideo → video`, `featured`, `status` (draft/published), `seo`.

**category**: `title L`, `slug`, `description L`, `pillar` (one of three), `order`.

**video**: `title L`, `youtubeUrl` (validated; ID and kind derived), `kind` (video/short, auto-detected from URL), `description L`, `publishedAt`, `durationText`, `relatedArticle → article`, `relatedProject → project`, `featured`, `status`.

**homepage** (singleton): `featuredProjects[] → project` (max 2–3), `featuredArticles[] → article` (3), `featuredVideo → video`, `featuredShorts[] → video` (2), `heroHeadline L`, `roleBlurbs {engineer L, educator L, builder L}`.

**Relationship sketch**
```
homepage ──features──► project, article, video
project  ◄──related──► article ◄──related──► video
article  ──► category ──► pillar
experience, siteSettings: standalone
```

---

## 8. Admin / CMS workflows

The Admin is **Sanity Studio embedded at `/studio`** (the prototype's Admin view only illustrates it; it is clearly labelled as such).

| Task | Workflow |
|---|---|
| Publish an article | New Article → write Arabic title/body → pick category → (optional) add English tab → set cover + alt → Publish. Page appears after revalidation (seconds). |
| Add a YouTube video | New Video → paste URL → kind and ID auto-derived → title/description → (optional) link to article → Publish. |
| Add a project | New Project → summary, role, stack, images → featured toggle → Publish. |
| Change featured Home content | Edit the single `homepage` document → pick references → Publish. |
| Update experience / socials | Edit entries or `siteSettings`. |
| Preview before publishing | Draft Mode preview link from the Studio (planned). |
| Translations | Each field pair has Arabic and English tabs; English is optional except interface/profile content (§9). |

Access: only Taher's Sanity login. Studio is not linked from the public site.

---

## 9. Arabic / English localization and RTL / LTR strategy

**Principle:** minimal machinery, no translation duplication unless wanted.

**Routing.** Locale-prefixed routes via an `[locale]` segment: `/en/...`, `/ar/...`. `/` redirects once using the saved choice, then `Accept-Language`, falling back to a default (decision §14). Both locales are statically generated.

**Two kinds of text**
1. **Interface and profile text** (navigation, headings, About, Experience, project summaries): fully bilingual, stored as localized pairs; UI strings live in two small typed dictionaries in the repo (no i18n library at first; `next-intl` stays a fallback if complexity grows).
2. **Editorial content** (articles, videos): Arabic is the source of truth; English is optional per item. If a translation is missing, `/en/blog/[slug]` still renders the Arabic article inside the English chrome, with the content area marked `dir="rtl" lang="ar"` and a quiet "Available in Arabic" note. Its canonical URL is the Arabic one; `hreflang` alternates are emitted only for items that have both languages.

**Direction handling**
- `<html lang dir>` set per locale; CSS written with **logical properties** (`margin-inline`, `padding-inline`, `inset-inline`, `text-align: start`), so layout mirrors automatically.
- Directional icons (arrows, chevrons) flip in RTL; non-directional ones (play, check, globe) do not.
- Code blocks, URLs, dates in mono, and technology names stay `dir="ltr"` even inside Arabic text.
- Numerals: Western digits (0–9) throughout, as typical for Egyptian/Jordanian tech writing **[confirm]**.

**Typography adjustments for Arabic (recommended)**
- Never uppercase or letter-space Arabic (breaks joining); the style tile's tracked uppercase labels are dropped.
- Arabic needs ≈ 6–10 % more size and 1.8–1.9 line-height for body text.
- Pairing: Latin display stays Fraunces **[review]**; Arabic display uses a high-contrast Naskh (Amiri) to match its bookish character; Arabic body/UI uses IBM Plex Sans Arabic for screen legibility; Inter for Latin UI; JetBrains Mono only for code, dates and technical values.
- All fonts via `next/font`, self-hosted, subsetted (Latin + Arabic).

**Metadata.** Per-locale `<title>`, description, OG tags; `hreflang` pairs; `og:locale` `ar_AR`/`en_US`; sitemap lists both.

---

## 10. Recommended technology stack and rationale

| Layer | Choice | Verdict / notes |
|---|---|---|
| Framework | Next.js (App Router), React, TypeScript | **Recommended.** Mostly static pages + ISR; Server Components by default; client JS only for theme toggle, mobile menu, filters, video facade, form. Verify the current Next.js version's conventions (e.g. i18n routing/proxy file naming) at scaffold time. |
| Styling | Tailwind CSS | **Recommended** with design tokens as CSS variables so Arabic/English and light/dark share one system. No component library. |
| CMS | Sanity + embedded Studio at `/studio` | **Recommended.** Hosted content store (no database to run), strong localization patterns, image pipeline/CDN, real-time Studio, free to start (**limits require current verification**). Alternatives considered: markdown-in-repo (no admin UX for a non-developer workflow), headless CMS with self-hosting (more operations). |
| Hosting | Vercel | **Recommended.** Zero-config Next.js deploys, preview URLs, ISR. Check whether a personal brand that attracts clients falls under the free tier's terms (**verify current terms**). |
| Contact | Next.js Server Action / Route Handler + transactional email API (e.g. Resend) + Cloudflare Turnstile | **Minimal external services**: one email provider and one CAPTCHA. No database. |
| Videos | Plain YouTube embed with click-to-load facade (`youtube-nocookie`) | No player library; metadata typed in Sanity; no YouTube API key. |
| Animation | CSS only | The installed GSAP skills are not needed for the MVP; reconsider only if a measured interaction demands it. |

**Where Next.js ends and Sanity begins**
- **Sanity:** all editable content (settings, experience, projects, articles, categories, videos, homepage picks), images, drafts, publish state, editor login.
- **Next.js:** routing, layout, design system, i18n chrome, rendering Sanity content, SEO tags, contact-form endpoint, revalidation endpoint, Draft Mode.
- **Fetching:** GROQ queries on the server, in parallel (`Promise.all`), tagged for revalidation. A Sanity webhook calls a protected `/api/revalidate` route to refresh affected pages on publish. Browser never talks to Sanity except inside Studio.

**Next.js practices to apply** (from the installed `vercel-react-best-practices` skill): Server Components by default, parallel data fetching, no barrel-file imports, dynamic import for the Studio route, `next/image` with explicit sizes, minimal client components.

**Dependencies, kept short:** `next`, `react`, `typescript`, `tailwindcss`, `sanity`, `next-sanity`, `@sanity/image-url`, `@portabletext/react`, a code highlighter (`shiki`, server-side), one email SDK, and Turnstile's script. No state library, no UI kit, no separate backend.

---

## 11. SEO, accessibility, performance, responsive requirements

**SEO** — per-page metadata, canonical + `hreflang`, `sitemap.xml`, `robots.txt`, RSS for articles, Open Graph images (generated), JSON-LD (`Person`, `Article`, `VideoObject`, `BreadcrumbList`), clean slugs, one `h1` per page, descriptive link text. Video pages/sections carry `VideoObject` data referencing the original YouTube URL.

**Accessibility (target: WCAG 2.2 AA)** — real landmarks and skip link, visible focus on every control, full keyboard operation (menu, filters, form, video facade), text contrast ≥ 4.5:1 (gold is decorative only on paper), labels and error text tied via `aria-describedby`, `lang` on mixed-language content, alt text per language, `prefers-reduced-motion` honoured, touch targets ≥ 44 px.

**Performance** — static/ISR output, no client-side data fetching for public pages, fonts self-hosted with `display: swap` and Arabic subset, responsive images (AVIF/WebP) with intrinsic sizes, YouTube loaded only on click, target Core Web Vitals "good" at the 75th percentile on mobile (**measure after build, do not promise**).

**Responsive** — mobile-first; breakpoints at ≈ 640 / 900 / 1200 px; single-column reading, asymmetric layouts only from ≥ 900 px; verified in both directions at each breakpoint.

---

## 12. Security, privacy, contact form, deployment

**Contact flow:** client validation (name, email format, message length, topic) → Server Action → server re-validation → Turnstile token verification → honeypot + minimum-time check → send email through the provider → success/error state with focus management. No submission is stored; the inbox is the record. Rate limiting via the host's firewall rules or provider limits (**verify availability on the chosen plan**).

**Secrets / environment variables (planned):** `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN` (draft preview), `SANITY_REVALIDATE_SECRET`, `RESEND_API_KEY` (or equivalent), `CONTACT_TO_EMAIL`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. None committed to the repo.

**Privacy:** no phone number, address or reference contacts on the site; public email is a role-based address **[placeholder]**; privacy note on the form; analytics, if any, cookieless and privacy-first (**decision deferred**); YouTube embeds use the no-cookie domain and load only on click.

**Hardening:** security headers (CSP, `frame-ancestors`, `Referrer-Policy`), Sanity CORS limited to the site domain, Studio access restricted to named users, `revalidate` endpoint verifies a shared secret.

**Costs and dependencies (current pricing not stated here — verify before committing):** domain registration; Vercel plan; Sanity plan and its API/asset/user limits; email provider free-tier limits; Turnstile (verify current terms). No server or database to host.

**Backup:** code in Git; content exported with `sanity dataset export` on a schedule (e.g. a monthly CI job storing an archive outside Vercel); image assets included in the export; restore tested once before launch.

**Deployment:** Git → Vercel; preview deployments for each branch; production on the custom domain; environment variables set per environment.

---

## 13. MVP features and explicitly deferred features

**MVP (Option B):** Home, About, Experience, Projects (+ detail), Blog (+ detail, categories), Videos (YouTube + Shorts), Contact with real submission flow, embedded Studio, Arabic/English with RTL, light/dark theme, SEO basics, RSS.

**Deferred:** newsletter/membership, comments, on-site search, analytics dashboards, downloadable CV generator, personal-products "Lab" section beyond a placeholder slot, automatic YouTube sync via API, case-study templates with interactive demos, testimonials, translations of all articles, multi-author support, a CMS-driven page builder.

---

## 14. Assumptions and unresolved decisions

**Assumptions made in this phase**
- The CV is current. Dates and roles for Flairstech, VA Computing, Active Interactions and Utopia CO-living were read from a two-column layout and are **inferred**; the prototype flags them.
- The project role for Sanad / My e& is "Senior Flutter Developer" per the CV's project section, which may differ from the employer-level job title (e.g. Agile Technologies lists "Mobile Apps Developer").
- Sanad was developed during the Agile Technologies role (Nov 2022 – Mar 2023, **[confirm]**); My Etisalat during the current e& role.
- `taher-fawa.io` appears in the CV as a website; it is assumed to be the target domain **[confirm]**.
- Logos and screenshots of Sanad and My e& will be supplied by Taher; the prototype uses neutral placeholders, not real logos or screens.
- Metrics such as "millions of active users" are **quoted only as the CV states them** (My Etisalat, CV summary) and shown as draft.

**Decisions needed before implementation** — see §15's input list (kept to five).

---

## 15. Proposed implementation phases (after approval)

| Phase | Scope | Exit criteria |
|---|---|---|
| **1 — Foundation** | Scaffold Next.js + TS + Tailwind, tokens, fonts (Latin + Arabic), `[locale]` routing, layout shell, header/footer, theme + language switch | Both directions render the shell; Lighthouse accessibility check passes on the shell |
| **2 — Content layer** | Sanity project, schemas from §7, embedded Studio, GROQ queries, seed content derived from the CV (without private data), revalidation webhook | Taher can create/edit/publish each content type; changes appear on a preview deployment |
| **3 — Pages** | Home, About, Experience, Projects (+ detail), Blog (+ detail), Videos, using real or placeholder content | Every route works at 375 / 768 / 1280 px in AR and EN |
| **4 — Contact** | Form, validation, Turnstile, email delivery, success/error states | End-to-end test message received; abuse attempts rejected |
| **5 — Quality pass** | SEO metadata, JSON-LD, sitemap/RSS, a11y audit, performance budget, content/visual polish | Checklist in §11 verified and reported with evidence |
| **6 — Launch** | Domain, env vars, backup job, content entry (first articles/videos), handover notes | Production live; restore from backup tested once |

### Decisions I need from you
1. **Domain and default language:** is `taher-fawa.io` the production domain, and should `/` open in English or Arabic?
2. **Article URLs and fallback:** Latin slugs for Arabic articles, and an Arabic article viewed from the English UI shown as-is (my recommendation) rather than hidden?
3. **Public contact details:** the public email address, where form messages should be delivered, and real social profile URLs.
4. **CV facts to confirm:** the employer/role/date pairing for 2019–2022 (Flairstech, VA Computing, Active Interactions, Utopia CO-living) and the Sanad ↔ Agile Technologies period.
5. **Permissions:** confirm you may display Sanad and My e& names, logos and screenshots publicly (employer/client approval), since the brief says you are comfortable but assets are not yet supplied.
