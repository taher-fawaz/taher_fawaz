# Taher Fawaz — personal brand website

Bilingual (Arabic RTL / English LTR) portfolio and content hub. Next.js 16 App Router, TypeScript, Tailwind CSS v4, Sanity Studio at `/studio`, GSAP for scroll reveals, deployable on Vercel.

## Run locally

```bash
npm install
cp .env.example .env.local   # optional: the site works without it, using local fallback content
npm run dev                  # http://localhost:3000 → redirects to /en or /ar
```

Quality gates: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` (or `npm run check`).

## Content source

- **Without Sanity credentials** the site renders `lib/content/fallback.ts`: experience and projects from the CV, plus clearly marked *sample* articles and videos. A footer notice says the CMS is not connected.
- **With Sanity** every page reads published documents only. Drafts never appear.

## Connect Sanity (one-time)

1. Create a project at sanity.io/manage (or `npx sanity init --env`), dataset `production`.
2. Put `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` in `.env.local` (and in Vercel project settings).
3. In the Sanity project → API → CORS origins, add `http://localhost:3000` and the production URL **with credentials allowed**.
4. Open `/studio`, sign in with your Sanity account, create **Site settings**, categories, experience, projects, articles and videos.
5. Webhook for instant updates: Sanity → API → Webhooks → URL `https://<your-domain>/api/revalidate`, trigger on create/update/delete, projection `{_type}`, a secret of your choice → set the same value as `SANITY_REVALIDATE_SECRET`. Without the webhook, content still refreshes within an hour.

## YouTube videos (automatic)

Set `YOUTUBE_CHANNEL_ID` (24 characters, starts with `UC`; YouTube Studio → Settings → Channel → Advanced settings). New uploads then appear on `/videos` and Home within about 30 minutes, from YouTube's public feed (latest 15 uploads, no API key). Sanity `video` documents are optional and only add editorial choices such as "featured". Details and limitations: `docs/content-automation-plan.md`.

## Writing articles with Claude Code (drafts only)

The project registers the official Sanity MCP server in `.mcp.json` (`https://mcp.sanity.io`, OAuth). Run `/mcp` in Claude Code, pick **Sanity**, and sign in once (sessions last about 7 days). Then ask, for example: "Write an Arabic article about Clean Architecture in Flutter and save it to my website as a draft." The `sanity-blog-author` skill writes it and creates a draft `article`; review it in `/studio`, set the publish date and cover, then publish yourself or tell Claude which draft to publish. Nothing is published automatically.

For broad topics Claude proposes a 2–5 part series (a `series` document plus articles with a part number); every article gets an original SVG cover and, where useful, inline diagrams uploaded through the Sanity MCP. Series navigation on the site lists published parts only. Schema additions (`series`, image caption and credit) are local until you run `npx sanity@latest schema deploy`.

## Contact form (Resend)

Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` (a sender on a domain verified in Resend). Until all three are set, the form validates input and tells visitors honestly that it cannot send yet.

## Deploy (Vercel)

Branches, CI, Vercel setup, per-environment variables and Sanity dataset guidance: `docs/deployment-workflow.md`. In short: import the repository, set the environment variables from `.env.example` (including `NEXT_PUBLIC_SITE_URL`), deploy. Check current plan limits for Vercel, Sanity and Resend before launch.

Back up content with `npx sanity dataset export production backup.tar.gz`.
