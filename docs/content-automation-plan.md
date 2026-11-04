# Content automation plan — YouTube, website, LinkedIn

Status as of 2026-10-27. This is a plan plus the parts that already exist. Nothing here publishes anything automatically.

| Piece | State today |
|---|---|
| YouTube → website video sync | **Built.** Configure `YOUTUBE_CHANNEL_ID` and new uploads appear on `/videos` and Home within ~30 minutes. |
| LinkedIn drafting skills | **Installed** (project scope): `/li-post`, `/li-plan`, `/li-repurpose`, plus `/li-human` (required by `/li-post`). Draft-only. |
| On-demand article drafting | **Built (2026-10-27).** `sanity-blog-author` skill + official Sanity MCP; drafts only, scope narrowed from the scheduled design below. |
| Daily AI article + LinkedIn draft generation | **Not built.** Designed below. No scheduler, no model credentials, no generation code exist yet. |
| LinkedIn publishing via API | **Not built.** Assessed below; recommended to stay manual for now. |

---

## 1. YouTube → website (implemented)

**How it works.** `lib/youtube-feed.ts` fetches `https://www.youtube.com/feeds/videos.xml?channel_id=…` on the server, `lib/youtube-feed-parser.ts` parses it without any XML library, and `lib/video-library.ts` merges it with Sanity video documents. The fetch is cached by Next.js for 30 minutes (tag `youtube`), so the `/videos` pages regenerate in the background (ISR) — no cron job, no API key.

- **Shorts** are detected from the feed's `/shorts/<id>` link.
- **Sanity stays optional.** A `video` document with the same YouTube URL only adds editorial choices: featured on Home, a corrected title/language, or a custom thumbnail. Sanity-only videos keep older uploads visible.
- **Failures are contained.** Timeout (8 s), HTTP errors, non-feed responses and truncated XML all resolve to an "unavailable" state: the Videos page says so honestly, Home hides its video block, and the build still succeeds.
- **Tests.** `npm test` runs parser and merge tests (Shorts, entities, duplicates, invalid IDs, empty/malformed feeds, thumbnail host checks, Home selection).

**Configure.** Set `YOUTUBE_CHANNEL_ID` in `.env.local` and in Vercel. It is the 24-character ID starting with `UC` — not the `@handle`. Find it in **YouTube Studio → Settings → Channel → Advanced settings → Channel ID**, or at <https://www.youtube.com/account_advanced>.

**Limitations of the feed (by design of YouTube's public feed).**
- Only the **15 most recent uploads** are listed. Older videos disappear from the feed; keep them visible by adding a Sanity `video` document if needed.
- Metadata is limited to title, description, publish date and a 480×360 thumbnail. No duration, view counts, captions or playlists.
- Updates can lag YouTube by up to the cache window (30 min) plus YouTube's own feed caching (the feed is served with `max-age=900`).
- Private, unlisted and scheduled videos never appear. Premieres appear when YouTube lists them.

**Future: YouTube Data API v3** (only if a complete archive or richer metadata becomes necessary). Use an API key restricted to the YouTube Data API, list the channel's uploads playlist (`UU…`, derived from the channel ID) with `playlistItems.list`, then `videos.list` for durations. The merge function already accepts any list of videos, so the API would replace only the fetcher. Requires a Google Cloud project; daily quota units are limited — verify the current quota and costs before building.

**Not in scope:** uploading to YouTube from cloud storage. Uploads continue through YouTube Studio.

---

## 2. Inputs every content cycle needs

1. **Author voice** — a single canonical file in the repo, `content/voice.md` (to create), based on the template from the LinkedIn skill pack. The `li-*` skills read `~/.claude/linkedin/voice.md`; copy the repo file there (or symlink it) so there is one source. It should contain real past posts, words used/avoided, positions, and an explicit "off limits" list (employers' confidential details, client names, NDA topics).
2. **Professional profile** — already in Sanity (Site settings, Experience, Projects). Generation reads published documents only.
3. **Content pillars** — the three Sanity categories: Mobile Engineering (Flutter, SwiftUI), Software Architecture, Real-World Engineering.
4. **Content notes (the only source of "experience")** — a maintained log of genuine things learned or encountered. Proposed Sanity type `contentNote` (not created yet), so notes can be added from the Studio on any device:

   | field | purpose |
   |---|---|
   | `title`, `date` | what and when |
   | `pillar` → category | rotation and filtering |
   | `whatHappened` (text) | the real situation, in Taher's words |
   | `whatILearned` (text) | the insight the article is built on |
   | `facts` (array of strings) | the only numbers, versions or names a draft may use |
   | `codeSnippets` (code blocks) | code Taher actually wrote or verified; generation may not invent code beyond these |
   | `publicOk` (boolean) | must be true; protects employer and client confidentiality |
   | `language` | usually `ar` |
   | `usedIn` → article, linkedinPost | prevents reuse; set automatically when a draft is created |

---

## 3. One content cycle (target design)

One cycle produces **one full Arabic-first article** and **one shorter LinkedIn adaptation** built on the article's core idea — two different texts, never the same text twice.

1. **Pick a note.** Choose the oldest unused `contentNote` with `publicOk = true`, rotating pillars. Skip any note whose topic overlaps an article or LinkedIn draft from the last 30 days (compare category, tags and titles; ask the model to confirm the angle is different). **If no eligible note exists, the cycle stops and reports "nothing to write" — it never invents a topic.**
2. **Draft the article (Arabic).** Inputs: the note, `voice.md`, the pillar, and the last 10 article titles. Rules given to the model: use only facts from the note; any number, version, metric or company detail not in `facts` is forbidden; code only from `codeSnippets`, otherwise a clearly marked "illustrative" snippet; Latin technical terms stay in English; no claims of SwiftUI professional experience (it is a learning topic).
3. **Draft the LinkedIn post.** Run the article's core idea through the `/li-post` rules: one idea, a hook, 900–1,300 characters, link in the first comment, `{{your number}}` placeholders instead of invented figures. `/li-human`'s lexicon is English-centric; for Arabic posts its typography and invisible-character passes still apply, but its slop-word list does not.
4. **Automatic checks before saving.** Every digit sequence in either draft must appear in the note's `facts`; no names from the CV references or employers unless present in the note; length and structure checks; Arabic/English direction sanity. Failures mark the draft "needs attention" rather than silently fixing it.
5. **Save as drafts only.**
   - Article → Sanity `article` **draft** (`drafts.<id>`), `language: ar`, category set, `publishedAt` empty (so it can never appear on the site by accident), plus `sourceNote` reference.
   - LinkedIn post → Sanity `linkedinPost` **draft** (new type, proposed fields below).
   - Mark the note's `usedIn`.
6. **Human review (required).** Taher edits in the Studio, sets a publish date and publishes the article. For LinkedIn, he copies the approved text from the Studio and posts it himself, then sets the status to "posted" and pastes the post URL.

**Proposed `linkedinPost` type** (not created yet): `text` (plain text), `language`, `sourceArticle` → article, `sourceVideo` → video, `hookFormula`, `firstComment` (the link), `status` (`draft` → `approved` → `posted`), `plannedFor` (date), `postedUrl`, `notes`. It is never rendered on the public site.

**Guardrails for the whole pipeline.** Do not generate when more than 5 drafts are waiting for review (prevents a growing backlog). One cycle per day at most, with an idempotency key per date. Log what was generated, from which note, and which checks passed.

---

## 4. Manual workflow vs. scheduled workflow

### Manual (works now, nothing extra to pay for beyond your Claude plan)
In a Claude Code session in this repo:
1. `/li-plan` to plan the week, or `/li-repurpose` with a video transcript or an article.
2. Ask Claude to write the Arabic article draft from a specific note, then `/li-post` for the LinkedIn version.
3. Paste the article into a new Sanity article in the Studio (or, later, let a local script save it as a draft with the write token).

This is **not automatic**: it runs only when you start it and stays under your review at every step.

### Scheduled (requires building and paying for an execution path)
Daily generation only becomes "automatic" once all of these exist. None exist today.

| Option | How it runs | You need | Notes |
|---|---|---|---|
| **A. Claude Code scheduled cloud agent (routine)** | A cron-scheduled Claude Code session clones the repo and runs a cycle prompt/skill | Repo on GitHub; a cloud environment with `SANITY_API_WRITE_TOKEN` as a secret; a plan that includes scheduled agents | Least code. Usage counts against your Claude plan — check current limits. |
| **B. GitHub Actions cron + Anthropic API** | A workflow runs a Node script daily that calls the Messages API (e.g. `claude-opus-5-5` for the article, `claude-sonnet-5-5` for checks) and writes Sanity drafts | `ANTHROPIC_API_KEY` and `SANITY_API_WRITE_TOKEN` as repository secrets; the generation script | Pay-per-token API billing — verify current pricing and set a spend limit in the Anthropic Console. Most controllable and testable. |
| **C. Vercel Cron → route handler** | Vercel calls a protected route daily | Same secrets in Vercel; `CRON_SECRET` | Function duration limits make long generations fragile; prefer A or B. |

Operational constraints for any scheduled option: secrets live only in the scheduler's secret store (never in the repo or client code); the write token should be a dedicated Editor token, separate from any import token; failures must notify you (email or GitHub notification) and must not retry endlessly; generation must stop when notes run out or the review backlog is full; costs scale with draft length and model choice — measure the first week and set a monthly cap.

**Recommendation:** start manual for 2–3 weeks to tune `voice.md` and the note format, then build option B (or A if you prefer no code) with the checks in §3.

---

## 5. LinkedIn publishing — assessment (no automatic posting)

The `li-*` skills are explicitly **draft-only**: they print copy-ready text and never post. Unofficial routes (browser automation, scraping, cookie-based posting) are excluded; they can violate LinkedIn's User Agreement.

**Official path, per LinkedIn's documentation on Microsoft Learn (checked 2026-10-27):**
- **App:** create an app in the LinkedIn Developer Portal (it must be associated with a LinkedIn Page), then add the **Share on LinkedIn** product (grants `w_member_social`) and **Sign In with LinkedIn using OpenID Connect** (scopes `openid profile`, used to obtain the member ID for the author URN `urn:li:person:{id}`). Share on LinkedIn is listed as self-serve; confirm it is granted on your app's Products tab.
- **OAuth:** 3-legged authorization code flow — `https://www.linkedin.com/oauth/v2/authorization` → `https://www.linkedin.com/oauth/v2/accessToken`, HTTPS redirect URL registered in the app, `state` checked against CSRF. Access tokens last **60 days**; programmatic refresh tokens are available only to a limited set of partners, so expect to re-authorize roughly every 60 days.
- **Endpoint:** `POST https://api.linkedin.com/rest/posts` (the Posts API, which replaces `ugcPosts`), headers `Authorization: Bearer …`, `Linkedin-Version: YYYYMM` (versions are sunset on a schedule and must be updated), `X-Restli-Protocol-Version: 2.0.0`. A text post needs `author`, `commentary`, `visibility`, `distribution`, `lifecycleState: PUBLISHED`. Success is `201` with the post URN in `x-restli-id`. Link previews are not scraped; article posts must supply title/description/thumbnail.
- **Limits:** the legacy Share on LinkedIn guide lists 150 requests per member per day. Reading your own posts back (`r_member_social`) is restricted to approved partners.
- **Secrets:** the Client Secret and access token are server-only (environment variables or an encrypted store), never sent to the browser or committed. Because the token changes every ~60 days, it needs a small persistent store and a re-authorization page — new infrastructure this site does not have today.

**Recommendation:** keep LinkedIn manual (approve in Studio, copy, post). If posting volume grows, the safest future design is a **"Post to LinkedIn" document action in the Studio** that calls a protected server route only after an explicit human click on an approved `linkedinPost` — never from the scheduler.

---

## 6. What remains to be done (in order)

1. Set `YOUTUBE_CHANNEL_ID` locally and in Vercel.
2. Fill in `content/voice.md` and copy it to `~/.claude/linkedin/voice.md` for the `li-*` skills.
3. Add the `contentNote` and `linkedinPost` schemas (small, no public UI) and start logging notes.
4. Run the manual workflow for a few cycles.
5. Choose scheduled option A or B, create the secrets, build the generation script with the §3 checks, and measure cost.
6. Only then, if wanted, apply the LinkedIn app/OAuth steps in §5.
