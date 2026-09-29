# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

Always use **bun** (never npm) — the lockfile is `bun.lock`.

- `bun run dev` — start the dev server (Next.js + Turbopack) at localhost:3000
- `bun run build` — production build; also runs `tsc` typechecking. Use this to verify changes compile.
- `bun run lint` — ESLint. Note: files under `design/` have pre-existing lint errors; ignore those.
- `bun run start` — serve the production build
- `bun install` — install dependencies

There are no tests.

## Architecture

A Next.js 16 (App Router) site for **Surplus**, a software incubator: a single-page marketing site at `/`, plus a password-gated admin dashboard at `/review`. Deployed on **Vercel** (project `manifund/surplus`) — pushes to `main` ship to production.

- **`app/page.tsx`** — the entire landing page as one server component. All copy and layout live inline here (masthead, hero, manifesto, projects, offers, timeline, FAQ, CTA, footer). `README.md` is the canonical source for the site's *content* (dates, dollar amounts, project examples, FAQ answers) — keep them in sync.
- **`app/layout.tsx`** — root layout; loads four Google fonts as CSS variables.
- **`app/welcome-popup.tsx`** — a first-visit "this is a mockup" modal (`"use client"`) gated by `localStorage`. Currently disabled (not mounted anywhere); re-enable by rendering `<WelcomePopup />` in the layout.
- **`app/globals.css`** — Tailwind v4 setup. Design tokens (colors, fonts, the `820px` `bp` breakpoint) live in the `@theme` block; bespoke print effects (`misreg*` text-shadows, `halftone` dot field, paper grain) are `@utility`/`@layer base` rules.

### Review dashboard (`/review`)

An internal tool for reviewing Surplus applications. **Airtable is the source of truth** (base `appaxqJfxht7OronH`, table `Applicant`); nothing is stored locally except localStorage drafts.

- **`lib/review/fields.ts`** — Airtable field-ID map, the normalized `Applicant` type, and `applicationText()`. Add new Airtable fields here first; everything else derives from it.
- **`lib/review/airtable.ts`** — REST client (list/get/update records, create fields via the Meta API). Gotcha: on writes, `returnFieldsByFieldId` goes in the JSON body, not the query string.
- **`lib/review/auth.ts`** + **`proxy.ts`** — shared-password auth against `REVIEW_PASSWORD`. The cookie holds a salted SHA-256 of the password; the salt string is duplicated in both files — keep in sync. `proxy.ts` (Next 16's rename of middleware) guards `/review/*` and `/api/review/*`; API routes also re-check via `requireAuth()`.
- **`app/review/`** — pages: list/kanban (`applicants-view.tsx`), detail with autosaving notes (`app/[id]/`), AI grading (`ai/`), Pangram AI detection (`pangram/`), batch email (`email/`). Shared widgets in `ui.tsx`.
- **AI pipeline** — grades via OpenRouter (`OPENROUTER_API_KEY`), one API call per applicant orchestrated client-side (3 concurrent); writes `"<label> prio"`/`"<label> notes"` fields back to Airtable, auto-creating them (needs a PAT with `schema.bases:write`). Default prompt lives in `lib/review/ai.ts`.
- **Batch email** — via Resend (`RESEND_API_KEY`), plain-text with `{{merge tag}}` rendering in `lib/review/merge.ts` (shared by client preview and server send). Sender domain `manifund.org` must be verified in Resend.
- **Arena pairwise ranking** (`/arena`, spec in `ARENA-SPEC.md`) — pairwise LLM comparisons + Bradley-Terry over applications. `lib/review/arena.ts` has the prompt, verdict parsing, pairing schedules (random perfect matchings, or sequential swiss rounds pairing similar BT scores), and the BT fit; the page (`app/arena/`, same nav/chrome as `/review`) fans out to `/api/review/arena/compare` at configurable concurrency (default 25 — the compare route takes both application texts in the body precisely so it never hits Airtable's 5 req/s limit). Verdicts append to InstantDB `arenaComparisons` only — **no Airtable writes**; standings refit client-side from all stored comparisons. Cost estimate = one live probe call reading OpenRouter's `usage: {include: true}` (~$0.012/pair on Sonnet, ~5k prompt tokens).
- **Pangram AI detection** — runs each applicant's main idea through Pangram (`PANGRAM_API_KEY`; async submit-then-poll client in `lib/review/pangram.ts`), individually from the detail page or batch from `/review/pangram` (same 3-concurrent client fan-out as AI grading). Full responses append to the InstantDB `pangramResults` table (`lib/review/instant.ts`, `@instantdb/admin`, needs `INSTANT_ADMIN_TOKEN`); the `fraction_ai` score writes to Airtable ("Pangram AI fraction", `F.pangramFractionAi`).
### Demo Day invite (`/demoday`)

An invite-only RSVP page for the cohort 1 Demo Day (Fri Oct 23 2026, Mox SF), `noindex` via metadata + an `X-Robots-Tag` header in `next.config.ts`, not linked from anywhere. Spec bundle: the build spec, content, and Airtable schema docs Jen supplied (Sept 2026).

- **`app/demoday/page.tsx`** — server page. Copy (schedule, stats, statement) is inline; the cohort comes from the same live Airtable data as `/founders` via `lib/demoday/cohort.ts` (drops the non-presenting founders, trims each description from the end only, hides Google-Docs idea links). `?i=<invite code>` and `?r=<token>` are resolved server-side and passed to the form as `Prefill` — `?i` never exposes the token.
- **`app/demoday/rsvp.tsx`** — client form, always usable; the email lookup (✓ button / blur / Enter, once per address) is an enhancement whose failure is silent. Confirmation replaces the form; calendar buttons (Google, .ics, Outlook) beacon to `POST /api/rsvp?action=calendar`. `app/demoday/styles.ts` holds the shared class strings (a server page can't import consts from a `"use client"` file).
- **`app/api/rsvp/route.ts`** — the only place the Demo Day table is touched. `GET ?lookup=<email|code:x>` → `{name,email,org,note}` or 404 (404 is the ordinary "not on the list" outcome); `GET ?token=` → saved answers; `POST` upserts (match Token, else Email; token minted on first submit) and sends the confirmation once; `POST ?action=resend` always returns 200 so it can't probe the guest list.
- **`lib/demoday/`** — `fields.ts` (table `tblWsTsbDBtYZ0QYb`, field-ID map `G`, `PATTERNS` for the three lookup keys), `airtable.ts` (formula lookups by field *name* — the one place renames bite — plus `saveRsvp`), `calendar.ts` (event facts, Google/Outlook links, `.ics` builders: `METHOD:PUBLISH` for download, `METHOD:REQUEST` with ORGANIZER/ATTENDEE for the emailed invite), `email.ts` (Resend, plain text + the `.ics` attachment; sender `DEMODAY_FROM`, default `Surplus <demoday@surplus.dev>` — surplus.dev must be verified in Resend first; manifund.org already is).
- **`lib/founders.ts`** — the `/founders` data shaping (`toPublic`, `groupFounders`, `loadPublicFounders`), shared with `/demoday`.
- Airtable gotcha: the Demo Day columns must be retyped by hand (checkboxes, UTC date-times, single selects — see the schema doc); the API can't change field types. `saveRsvp` writes only text-compatible values so the RSVP itself lands even before that; the `Confirmation sent` / `Added to calendar` ticks need the checkboxes.
- Local runs without real keys: `AIRTABLE_API_URL` / `RESEND_API_URL` point the clients at a stand-in server.

- Env vars (`.env` locally, Vercel project settings in prod): `AIRTABLE_API_KEY`, `REVIEW_PASSWORD`, `OPENROUTER_API_KEY`, `RESEND_API_KEY`, `PANGRAM_API_KEY`, `INSTANT_APP_ID`, `INSTANT_ADMIN_TOKEN`; optional `DEMODAY_FROM`, `AIRTABLE_API_URL`, `RESEND_API_URL`.

### Next.js 16 gotchas (differs from older training data)

- `middleware.ts` is now **`proxy.ts`** (root-level, Node runtime, `export function proxy`).
- `params`, `searchParams`, and `cookies()` are **async — always await them**.
- `fetch` is **uncached by default**; review pages also set `export const dynamic = "force-dynamic"` for freshness.

### Design conventions (important)

- This is a **riso/broadside print** aesthetic — paper texture, off-register ink, halftones, three "ink" colors. Match it when adding UI. The `/review` dashboard uses a toned-down version (same tokens/fonts, minimal effects) — keep it utilitarian there.
- **Styling is Tailwind-inline.** Don't add CSS to `globals.css` except bespoke print effects. Use the token utilities: `bg-paper`, `text-ink-pink/blue/yellow/dark`, `font-display/condensed/serif/mono`, and `misreg`, `halftone`.
- **Responsive uses a single max-width breakpoint:** `max-bp:` (≤820px) for the main layout, plus `max-sm:` for phone tweaks. It's max-width (desktop-first), not the usual min-width.
- The path alias `@/*` maps to the repo root.
- `/apply` redirects (via `next.config.ts`) to the live application form on Airtable; all Apply links on the page point to `/apply`.
