# Deployment workflow: GitHub, CI and Vercel

Status as of 2026-10-27. **Proposed workflow.** Nothing below is confirmed as configured on GitHub or Vercel until you complete the steps in section 3 and check them off. No push or deployment has happened yet.

Repository: <https://github.com/taher-fawaz/taher_fawaz> (public, default branch `main`).

## 1. Branches

| Branch | Purpose | Vercel |
|---|---|---|
| `main` | Production | Production deployment |
| `develop` | Ongoing work, integration | Preview deployment |
| `feature/<short-description>` | One change | Preview deployment per push and per pull request |

Flow:

1. Branch `feature/<name>` from `develop`; open a Pull Request into `develop`. CI must pass.
2. Merge (or push) to `develop`: Vercel builds a **Preview**.
3. Check the Preview: pages in `/ar` and `/en`, an article, the contact form's honest "cannot send" state, no console errors.
4. Open a Pull Request from `develop` to `main`. CI must pass again.
5. Merge into `main`: Vercel builds **Production**.

Never force-push `main` or `develop`. Prefer merge commits or squash merges; do not rewrite shared history.

Recommended GitHub settings for `main` (Settings → Branches → Branch protection rule): require a Pull Request, require the `CI / verify` status check, block force pushes and deletions. Do the same, with fewer requirements if you wish, for `develop`.

## 2. Continuous integration

`.github/workflows/ci.yml` runs on Pull Requests and pushes to `main` and `develop`: `npm ci` (lockfile), `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`. Node 24 (the repository requires `>=20.19`). Permissions are `contents: read`. It uses **no secrets** and builds with the local fallback content, so it never touches Sanity. Deployment is left to Vercel's Git integration; there are no Vercel tokens in GitHub.

## 3. Vercel: manual setup

Nothing here has been done for you. The Vercel CLI is not installed locally and the Vercel connector is not authenticated, so the project state is unknown.

1. Vercel Dashboard → **Add New… → Project** → import `taher-fawaz/taher_fawaz` (install the Vercel GitHub app for that repository if asked).
2. Framework preset **Next.js** (auto-detected). Leave Build Command (`next build`) and Install Command (`npm install` or `npm ci`) as detected. Root Directory: repository root.
3. Project Settings → **Node.js Version**: 24.x.
4. Project Settings → **Git** → Production Branch: `main`. Leave "Automatically create Preview Deployments for all branches" on so `develop` and feature branches get Previews.
5. Add environment variables (section 4) **before** the first deployment, or redeploy afterwards.
6. Keep **Deployment Protection** (Vercel Authentication) on for Preview deployments.
7. Do not promote or deploy to Production until you have reviewed the Preview and the variables. The first import of `main` creates a Production deployment; to avoid that, import while `main` contains only the initial commit (README and LICENSE), or let the first deployment come from `develop` and merge to `main` only when ready.
8. Domain: add your real domain under Project Settings → Domains when you have one, then set `NEXT_PUBLIC_SITE_URL` to it. Do not invent one.

## 4. Environment variables

The application reads exactly these (`grep process.env`): 

| Variable | Public? | Development (`.env.local`) | Preview | Production | Notes |
|---|---|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes | `http://localhost:3000` | develop preview URL (after first deploy) | real domain, no trailing slash | Canonical URLs, sitemap, OG |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | yes | yes | yes | yes | Not a secret |
| `NEXT_PUBLIC_SANITY_DATASET` | yes | `production` today | `production` until a preview dataset exists, then that dataset | `production` | See section 5 |
| `NEXT_PUBLIC_SANITY_API_VERSION` | yes | `2026-10-01` | same | same | |
| `SANITY_REVALIDATE_SECRET` | **no** | optional | leave unset | yes | Webhook signature secret |
| `YOUTUBE_CHANNEL_ID` | yes | when you have it | when you have it | when you have it | Not configured yet |
| `RESEND_API_KEY` | **no** | optional | **leave unset** | yes | Mark "Sensitive" in Vercel |
| `CONTACT_TO_EMAIL` | no | optional | **leave unset** | yes | Mark "Sensitive" |
| `CONTACT_FROM_EMAIL` | no | optional | **leave unset** | yes | Needs a Resend-verified domain |
| `SANITY_API_WRITE_TOKEN` | **no** | local import scripts only | **never** | **never** | Not read by the website |

Rules: never use a `NEXT_PUBLIC_` prefix for a secret; do not copy production secrets into Preview; leaving the contact variables unset in Preview means Preview can never send email (the form says so honestly). In Vercel you can limit a Preview variable to the `develop` branch.

## 5. Sanity: avoiding Preview writes to Production

- The website holds **no write token** and reads published content only, so no deployment of the site can change Sanity content.
- Editing happens in Sanity Studio (`/studio`, authenticated with your Sanity account) or through the Sanity MCP (OAuth). Writes go to the dataset named by `NEXT_PUBLIC_SANITY_DATASET` **of the Studio you are using**.
- **Today only the `production` dataset exists.** If Preview also uses `production`, the Preview site reads real content (fine for reading), but anyone signing in at `<preview-url>/studio` would edit Production. Mitigations: keep Vercel Authentication on, and do not use the Preview Studio.
- **Recommended when ready:** create a `staging` dataset and copy Production into it (`npx sanity dataset copy production staging`, which does not alter Production), then set `NEXT_PUBLIC_SANITY_DATASET=staging` for the Preview scope. Impact to check first: dataset count and storage limits on your Sanity plan, and that the schema is deployed per dataset if you use the MCP. This was **not** done. It needs your approval.
- Schema: the Studio uses the local schema files; no schema is deployed to the dataset (`npx sanity@latest schema deploy` is a separate decision).
- CORS (Sanity Manage → API → CORS origins): currently `http://localhost:3000` and `http://localhost:3333`. The Studio is served from the website, so add the production domain and the develop preview origin, each with **credentials allowed**. Prefer exact origins to wildcards (a `*.vercel.app` wildcard would trust every project on that domain).
- Webhook for instant updates (production only): Sanity Manage → API → Webhooks → URL `https://<production-domain>/api/revalidate`, trigger on create, update and delete, projection `{_type}`, secret = `SANITY_REVALIDATE_SECRET`. Without it, content refreshes within an hour (pages cache lists for an hour).

## 6. Repository hygiene

- Tracked: `.env.example` only (blank or safe placeholder values). Ignored: `.env`, `.env.*`, `.vercel`, `.sanity`, `.next`, `node_modules`, keys, logs, `scripts/import-*.ts`.
- The repository is **public**. Review before the first push: `docs/`, `prototype.html`, `lib/content/fallback.ts` (CV-derived text), and `.claude/skills/` (third-party skills; check their licences before publishing).
- If a secret is ever committed, rotate it first; deleting it in a later commit does not remove it from history.
