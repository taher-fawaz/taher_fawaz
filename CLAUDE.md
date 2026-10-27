# Taher Fawaz — personal brand site

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · Sanity 6 (Studio at `/studio`) · GSAP 3 · Vercel.
Reference only, never edit: `prototype.html`, `design/style-tile.html`, `docs/`.

## Commands
- `npm run dev` — dev server (http://localhost:3000)
- `npm run lint` · `npm run typecheck` · `npm test` · `npm run build` — run all before calling work done (`npm run check` runs them in order). Tests use Node's built-in runner (`lib/*.test.ts`); keep tested modules free of `@/` imports and `server-only`.
- Next.js ships version-matched docs in `node_modules/next/dist/docs/`; read them before using an API you are unsure of (e.g. `proxy.ts`, `revalidateTag(tag, profile)`, `PageProps<'/route'>`).

## Structure
- `app/(site)/[locale]/…` — public pages; this layout is the root layout (sets `<html lang dir>`). `app/(studio)/` — separate root layout for Sanity Studio.
- `proxy.ts` — redirects unprefixed paths to `/en` or `/ar` (cookie `tf-locale`, then `Accept-Language`).
- `lib/i18n/` — locales and the two typed UI dictionaries. Add every UI string to **both** `en` and `ar`.
- `lib/content/index.ts` — the only data entry point. Sanity when `NEXT_PUBLIC_SANITY_PROJECT_ID` is set, otherwise `lib/content/fallback.ts`.
- `sanity/` — schemas, GROQ queries, read client, env. `sanity.config.ts` — Studio config.
- `components/motion/` — GSAP setup (`gsap.ts`) and `Reveal` (scroll reveals). Hero entrance is CSS in `app/globals.css`.

## Rules
- **Server Components by default.** Add `'use client'` only for real interaction (nav, theme, language switch, video facade, form, reveals). Pass plain strings to client components, not dictionary functions.
- **Localization:** never duplicate a page per language. Use `localePath()`, `pick()/tr()` for `{ar, en}` fields, and logical CSS (`ms-/me-/ps-/pe-/start-/end-`, `text-start`). Latin terms, code, URLs and dates inside Arabic go in `<bdi dir="ltr">` or `.meta`. Never letter-space or uppercase Arabic. Articles/videos are Arabic-first; English is optional and linked via `translationOf`.
- **CMS:** public reads use the token-less, `perspective: 'published'` client in `sanity/client.ts` (server-only). Never put a token or secret in a `NEXT_PUBLIC_` variable or a client component. Every query gets a cache tag matching its `_type` so `/api/revalidate` can refresh it. No Admin link in public navigation.
- **Content truth:** professional facts come only from the CV or the CMS. Never invent metrics, screenshots, logos, testimonials or case-study details. Sample/placeholder content must be flagged (`isSample`, “Placeholder” chips) and samples are `noindex` and excluded from the sitemap. Never publish phone numbers, addresses or reference contacts.
- **Motion:** one primary system (GSAP + `@gsap/react` `useGSAP` with a scope; `gsap.matchMedia()` for reduced motion). CSS for hover/focus. Animate only transform/opacity, never hide content before JS runs (it delayed LCP), keep revealed items focusable (opacity, not visibility), no scroll hijacking, pinning or infinite decorative loops. Every animation must work with `prefers-reduced-motion: reduce` turned on.
- **Accessibility:** one `h1` per page, visible focus (`--focus` token), labelled controls, `aria-current` on active nav, form errors tied with `aria-describedby`, status messages in `role="status"`, touch targets ≥ 44px.
- **Performance:** static generation + tag revalidation; `next/image` with `sizes`; YouTube only loads after a click (`youtube-nocookie`); fonts only via `next/font` (see `lib/fonts.ts` for which are preloaded and why). Don't add dependencies without a concrete need.
- **Videos:** YouTube is the source of truth. `lib/youtube-feed.ts` (server-only fetch, 30-min cache, tag `youtube`) → `lib/youtube-feed-parser.ts` (pure) → `mergeVideos()` in `lib/video-library.ts`. Sanity `video` docs only add editorial fields. Feed failures must degrade to an "unavailable" state, never throw.
- **Content automation & LinkedIn:** see `docs/content-automation-plan.md`. The `li-*` skills draft text only; never post to LinkedIn automatically, never use browser automation or cookies for LinkedIn, and never invent experiences, metrics or code — drafts come only from real content notes.
- **Article authoring:** on request, the `sanity-blog-author` skill writes an Arabic-first article (or a 2–5 part series), creates original SVG cover/diagrams (sources in `content/illustrations/`), uploads them through the Sanity MCP and saves everything as Sanity **drafts** (OAuth, no write token). It uses the existing `article` type plus `series`, leaves `publishedAt` empty, and never publishes without an explicit, named approval. No scheduled or daily generation. Series UI (`components/content/SeriesNav.tsx`, `lib/series.ts`) shows only published parts of a published series; inline images render in `PortableBody` (`figure`: alt, caption, credit). Schema changes are local only; never deploy the schema without approval.
- **Contact form:** `app/(site)/[locale]/contact/actions.ts` validates on the server and sends via Resend's REST API. It must never report success unless the provider accepted the message.

Design guidance lives in the installed skills (`impeccable`, `make-interfaces-feel-better`, `web-design-guidelines`, `vercel-react-best-practices`, `gsap-*`); don't copy them here.
