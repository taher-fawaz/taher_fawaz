# Personal Brand Site — Proposal (for validation, nothing built yet)

Repo state: empty folder, not a git repo, no CLAUDE.md, no `.claude/` skills. Node 24.19 / npm 11.17 available.

## 1. Visual direction — "Observatory notebook"
An editorial field-notebook for a mobile engineer who looks up. Space shows up as *instrumentation*, not wallpaper: thin star-chart coordinates, mission-log numbering (`Log 014`), orbit-line dividers, a single small constellation mark.

- **Surfaces:** warm paper (light), deep ink (dark sections used sparingly: hero footer, video wall).
- **Accents:** forest green for links/actions, gold only for one-per-view highlights (numerals, active marker).
- **Imagery:** real device screenshots/mockups framed as plates with captions; no stock art.
- **Avoid:** gradient heroes, glassmorphism, big-radius card grids, parallax, floating blobs.
- **Motion:** 150–200ms hover/focus states, one hero reveal, `prefers-reduced-motion` respected.

## 2. Design tokens (Tailwind v4 `@theme`)
| Token | Light | Dark |
|---|---|---|
| paper | #F6F1E7 | #0E1512 |
| paper-2 (panels) | #EDE6D6 | #15201B |
| ink | #11171A | #EDE7D8 |
| ink-muted | #4A5654 | #9AA59F |
| forest | #1F4D3A | #6FB38F |
| gold | #B38A2E | #D4AC55 |
| rule | #11171A @ 14% | #EDE7D8 @ 16% |

- **Type:** Fraunces (display, optical size) + Inter (UI/body) + JetBrains Mono (labels, code, log numbers), via `next/font`, self-hosted.
- **Scale:** 12 / 14 / 16 / 18 / 24 / 36 / 56 / 88 px, display tracking −2%; 68ch max measure for prose.
- **Spacing:** 4px base; 12-col grid, 1200 max, generous section rhythm (96/128px).
- **Radius:** 2–4px only. Hairline rules instead of shadows.

## 3. Sitemap
`/` Home · `/work` · `/work/[slug]` · `/writing` · `/writing/[slug]` · `/videos` (Videos + Shorts tabs) · `/about` · `/contact` · `/studio` (embedded Sanity) · `sitemap.xml`, `robots.txt`, RSS `/writing/rss.xml`, OG images.

## 4. Core journeys
1. **Hiring manager:** Home → featured work → case study → contact (≤3 clicks).
2. **Developer from search:** Article → code-rich reading → related article/video → follow.
3. **Video viewer:** Videos → play inline (click-to-load YouTube facade) → related article.
4. **Collaborator:** About → story/principles → contact.

## 5. Content models (Sanity)
- `siteSettings` (singleton): name, role, tagline, bio short, social links, email, YouTube channel ID, default SEO.
- `project`: title, slug, summary, role, year, platforms[] (iOS/Android/Flutter/RN), stack[], hero image, gallery[], store links, body (portable text), outcomes[] (optional), featured, order.
- `article`: title, slug, excerpt, cover, publishedAt, tags[], body (portable text + code block + image), related videos/projects (refs), SEO.
- `video`: title, YouTube URL/ID, kind (video|short), description, publishedAt, related article (ref), featured.
- `profile` blocks for About: story sections, principles, timeline (all placeholders until real content).

## 6. Technical decisions (minimal deps)
- Next.js App Router + TS + Tailwind v4; React Server Components by default, client JS only for theme toggle, video facade, nav.
- Data: `next-sanity` + GROQ; ISR with tag revalidation via a Sanity webhook → `/api/revalidate` (a route handler on Vercel, no separate backend).
- Videos: `lite` facade built by hand (thumbnail + click-to-iframe, `youtube-nocookie`) — no player library. Metadata is stored in Sanity (no YouTube API key needed); optional later auto-sync.
- Portable text via `@portabletext/react`; code highlighting with `shiki` on the server.
- Images: Sanity CDN through `next/image`.
- Planned dependencies: next, react, tailwindcss, sanity, next-sanity, @sanity/image-url, @portabletext/react, shiki. No UI kit, no state library.
- Quality gates: ESLint, `tsc`, axe/Lighthouse checks, `next build`.

## 7. Phases (each ends with a checkpoint for you)
0. **Direction validation** — static HTML style tile of hero + project row + article row at desktop/mobile, using placeholders. *← next, after your sign-off*
1. Scaffold, tokens, fonts, layout, nav/footer, theme.
2. Sanity schema + seeded placeholder content (clearly marked `PLACEHOLDER`).
3. Pages: Home, Work, Writing, Videos, About, Contact.
4. SEO/metadata/OG/sitemap/RSS, a11y pass, responsive pass.
5. Production build, rendered review in browser, refinement; Vercel deploy notes.

## Placeholders policy
No career history, employers, projects, or metrics invented. Every placeholder is visibly tagged `[PLACEHOLDER]` and lives in the seed file only.
