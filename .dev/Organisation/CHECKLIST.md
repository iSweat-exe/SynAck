# SynAck: delivery checklist

Operational checklist derived from [README.md](README.md) (decisions, §13 development plan) and [DESIGN.md](DESIGN.md). It does not replace them: it says **what to do, in which order, and when it is done**.

**How to use it**
- Each `Px.y` line is a unit of work: one issue, one PR (or a few), one `phase: *` label and one or more `area: *` labels (see [.github/labels.yml](../../.github/labels.yml)).
- Everything goes through a PR to `main` (see §Governance). A box is checked only when its **definition of done** is true.
- `[BLOCKING]` = decide or do before moving on. `[post-V1]` = out of V1, do not start.

## Overview

| Phase | Goal | Exit criterion |
|---|---|---|
| **0. Kickoff** | Repository, GitHub, accounts, blocking decisions | Protected repository, CI green on an empty PR, accounts created |
| **1. Foundations** | Technical base, CMS, permissions, theme | Next.js + Payload + local Supabase app starts, full CI, permissions tested |
| **2. Core learning** | Read a course, code, get graded | A signed-in user does a JS and a Python exercise and a quiz, progress is saved |
| **3. Protocols and engagement** | Network modules, motivation, review | TCP/HTTP/DNS/TLS playable, badges, SM-2, leaderboard validated server-side |
| **4. Watch and go-live** | Articles, legal, security, operations, launch | Opening gate (§Gate) met, production live with beta banner |
| **After V1** | Level-based unlocks, Rust/C, accessibility audit | Out of V1 scope |

V1 scope in one line: **1 path** ("Introduction to Programming", JS + Python), **at least 1 protocol module** (TCP), **2 articles**, $0 / month, fewer than 100 users.

---

## Phase 0: Kickoff

*Goal: a clean, protected repository with CI in place before the first line of code.*

### P0.1 Repository and hygiene `area: infra`
- [x] Initialize Git in `C:\Users\iswea\Desktop\SynAck` (`git init -b main`), make the first commit, create the **public** GitHub repository (`iSweat-exe` account), push `main`
- [x] Replace `.env.exemple` (misspelled) with **`.env.example`**: `.gitignore` ignores `.env*` except `.env.example`, so the misspelled file would never be committed
- [x] Add the licenses: `LICENSE` (PolyForm Noncommercial 1.0.0) and `LICENSE-CONTENT.md` (CC BY-NC-SA 4.0), see README §10
- [x] Missing palette images (`palette-*.png`) could not be recovered: references removed from DESIGN.md §1 (all palette values are documented as text in §3)
- [x] Empty folders `.dev/Philosophy` and `.dev/Rules` deleted (Git cannot track empty folders anyway); recreate them when there is content

### P0.2 GitHub: governance `area: infra` (everything on `main`, see §Governance)
- [x] Repository settings: **squash merge only**, "Automatically delete head branches", squash commit title = **PR title**, "Always suggest updating pull request branches"
- [x] Import the rulesets: *Settings → Rules → Rulesets → New ruleset → Import a ruleset*, files in [.github/rulesets/](../../.github/rulesets/) (`main-protection.json`, then `main-required-checks.json`; see its README for the order). (GitHub requires a public repository or Pro for rulesets)
- [x] Sync the labels: run the **Labels** workflow (`workflow_dispatch`) or push to `main`; it reads [.github/labels.yml](../../.github/labels.yml)
- [x] Enabled: Dependabot alerts + security updates
- [x] Enabled: Secret scanning + **Push protection**, Private vulnerability reporting; Code scanning runs through the CodeQL job of `security.yml` (the repository is public, so these are free)
- [x] Create the **`production`** environment (*Settings → Environments*) restricted to the `main` branch (*Deployment branches*). No required reviewer: production migrations are automatic after the PR tests (see §Governance)
- [x] Open a first test PR: **CI gate** must pass with no application code

### P0.3 Accounts and services ($0) `area: infra`
- [x] **Supabase** project (free tier) + note the project ref; check the current limits (README §14)
- [x] **Vercel** project (Hobby, linked to the repository); automatic previews for non-`main` branches still to disable (see P0.4)
- [x] OAuth: a **GitHub** OAuth app and a **Discord** application for sign-in (client ID/secret go into the Supabase dashboard, not into GitHub secrets). Google (Cloud project + consent screen) is deferred until later
- [ ] Uptime probe (UptimeRobot or Better Stack): to wire up in P4.4
- [ ] **Private** repository for backups (for [backup.yml](../../.github/workflows/backup.yml))

### P0.4 GitHub secrets and variables `area: infra`
| Name | Type | Used by |
|---|---|---|
| `SUPABASE_ACCESS_TOKEN` | repository secret | `db-migrate.yml` |
| `SUPABASE_DB_PASSWORD` | repository secret | `db-migrate.yml` |
| `SUPABASE_PROJECT_REF` | repository variable | `db-migrate.yml` |
| `PRODUCTION_DATABASE_URL` | repository secret, Supabase **session pooler** URL (IPv4) | `db-migrate.yml` (Payload migrations) |
| `PAYLOAD_SECRET` | repository secret (same value as in Vercel) | `db-migrate.yml`, `backup.yml` |
| `BACKUP_DATABASE_URL` | repository secret, Supabase **session pooler** URL (IPv4) | `backup.yml` |
| `BACKUP_PASSPHRASE` | repository secret (also keep it outside GitHub: without it the backups are unreadable) | `backup.yml` |
| `BACKUP_REPO_TOKEN` | repository secret, fine-grained PAT limited to the backup repository (Contents: write) | `backup.yml` |
| `BACKUP_REPO` | variable, `owner/private-repo` | `backup.yml` |
| `BACKUP_ENABLED` | variable, set to `true` once the four `BACKUP_*` values above exist (until then the scheduled run is skipped) | `backup.yml` |
| `PRODUCTION_URL` | variable, `https://…` | `keepalive.yml`, `db-migrate.yml` (health check) |
| `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` | secrets | `preview.yml` (on-demand previews) |

- [x] Secrets created for Phase 1 (`SUPABASE_*`, `PRODUCTION_DATABASE_URL`, `PAYLOAD_SECRET`, `VERCEL_TOKEN`, `PRODUCTION_URL`, `SUPABASE_PROJECT_REF`); `BACKUP_*`, `BACKUP_ENABLED`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` come later. No secret in the repository, the `service_role` key is never exposed to the client
- [x] Vercel: *Settings → Git → Ignored Build Step* = `bash -c '[ "$VERCEL_GIT_COMMIT_REF" = "main" ] && exit 1 || exit 0'` (build only `main`, previews through the `preview` label)

### P0.5 Decisions to make early `[BLOCKING]`
- [x] Package manager: **npm** (decided; `npm ci` + `package-lock.json`)
- [x] Domain: the **Vercel-provided domain** for now (custom domain later). Still to check: "SynAck" trademark and social handles
- [x] Licenses validated by the project creator
- [ ] Check **Payload ↔ Supabase Postgres** compatibility (dedicated schema, pooling): to validate in P1.3 before going further

---

## Phase 1: Foundations

*Exit: `npm run dev` starts the app with local Supabase and Payload; the full CI is green; the permission system is tested.*

### P1.1 Initialize the application `area: ui`
- [x] Next.js 16 (App Router) + React 19 + strict TypeScript, Node **24** (`.nvmrc`, `engines`)
- [x] ESLint, Prettier (code only: docs, YAML and licenses are excluded), scripts `lint`, `typecheck`, `format:check`, `test` (Vitest), `build` (required by CI)
- [x] Tailwind v4 + shadcn/ui (default theme, restyled in P1.5)
- [x] Minimal `/api/health` route (JSON `ok`); the database query is added in P4.4 (until then it does not keep Supabase from pausing)
- [x] **Done when**: `npm run lint && npm run typecheck && npm run build` pass locally

### P1.2 CI, security and local Supabase `area: infra`
- [x] [ci.yml](../../.github/workflows/ci.yml) runs lint, types, Vitest and build (verified on `main`); the e2e job starts running once Playwright is added (P4.4)
- [x] [security.yml](../../.github/workflows/security.yml): `npm audit`, gitleaks, CodeQL, dependency review (all running on PRs)
- [x] Dependabot active ([dependabot.yml](../../.github/dependabot.yml))
- [x] Supabase CLI: `supabase init`, `supabase start` (Docker), versioned migrations in `supabase/migrations/`, `supabase/seed.sql`, `supabase/tests/` (pgTAP); npm scripts `db:start`, `db:stop`, `db:reset`, `db:test`
- [x] First **pgTAP test** added; the PR job **DB migrations** runs on CI (fresh replay, linter, RLS check, pgTAP). The upgrade path (from `main`'s migrations) starts running with the next migration PR, since `main` had no migration before
- [x] `CI gate` is in the required checks of the ruleset (`main-required-checks.json`)
- [x] **Done when**: a test PR with a migration passes CI, and a PR that creates a table without RLS or uses `DROP` without the `breaking-change` label is **rejected** (verified on PR #4, and the label lets a destructive migration through)
- [ ] Verify on the next migration PR: editing an already-merged migration, or adding one older than `main`'s latest, is rejected (these rules need a migration on `main` to compare against)

### P1.3 Payload CMS `area: cms`
- [x] Integrate Payload 3.91 into Next.js 16, Supabase Postgres database, **separate schema** (`payload`), versioned migrations only (`push: false`)
- [x] Collections **Paths**, **Courses** (chapters as blocks; Exercise, Quiz and Protocol animation blocks come in P2.2, P2.6, P3.1), **Articles**, **Users**. Drafts enabled; visitors read published documents only (access rules are replaced by permission checks in P1.4)
- [x] npm script `db:migrate:payload` (wraps `payload migrate`): used by CI (PR tests) and by the production migration workflow, which also checks that `anon`/`authenticated` have no access to Payload tables
- [x] Pooling, cold starts and Vercel Hobby limits tested on the Vercel deployment (Supabase transaction pooler, port 6543): `/admin` and `/api/*` respond in about 0.7-0.8 s on a cold start and 0.3 s warm, far below the Hobby function limits; anonymous writes and `/api/users` return 403
- [x] Forbid raw HTML/script in blocks (stored XSS): rich text is an explicit allow-list of Lexical features (no HTML feature), stored as JSON; links accept only `http(s)`, `mailto` and relative URLs (`javascript:` is rejected, tested)
- [x] **Done when**: a course created in the local Payload admin shows up in the database (verified with the Local API and REST against a local Supabase: published/draft visibility, slug generation, rejected anonymous writes; create one by hand in `/admin` as a final check)

### P1.4 Permissions and roles `area: auth` `area: db`
Delivered in three PRs: (1) database, (2) app sign-in (P2.4), (3) Payload wired to the same accounts. **Decision: the back office is SSO only** (GitHub and Discord through Supabase Auth, same accounts as the app, no Payload password).
- [x] **PR 1, database**: single permissions file `src/lib/permissions.ts` (closed list of 20, `resource.action` format); tables `roles`, `role_permissions`, `user_roles`, `audit_log`; `private.has_permission(user, permission)` plus `public.has_permission(permission)` for the signed-in user; starting presets (Member, Junior instructor, Senior instructor, Administrator) with a test that the migration matches the TypeScript list; every new account becomes a Member; `private.grant_role` / `private.revoke_role` (service role only, audited, last administrator protected); RLS on all four tables, read-only through the API; new `public` tables closed to the API roles by default; pgTAP tests (RLS, deny by default, immediate effect of a revocation)
- [x] **PR 2, app sign-in** (see P2.4): Supabase Auth with GitHub and Discord (`/sign-in`, `/auth/callback`, sign-out), session refresh in `src/proxy.ts`, `/account` and the age gate `/welcome`. Code verified locally with real sessions; the OAuth round trip itself is validated on Vercel (see the setup list in the root README)
- [x] **PR 3, Payload on the same accounts**: custom auth strategy (`src/lib/payload-auth.ts`) reading the Supabase session; local email/password strategy disabled; `/admin` reserved for accounts with `cms.access` (Payload user created on first sign-in, linked by `supabaseId`); permissions read from Postgres on every request through `public.my_permissions()` and used by the Payload `access` functions and publish hooks instead of "any signed-in user"; GitHub/Discord buttons on the admin login page and a sign-out that ends the Supabase session. Unit-tested with mocks; the real OAuth round trip into `/admin` is still to validate on Vercel
- [ ] Bootstrap: sign in once with GitHub, then grant yourself `administrator` with `select private.grant_role('<user uuid>', 'administrator');` in the Supabase SQL editor; then retire the first email/password Payload account
- [ ] Short-lived JWT (Supabase settings); sensitive actions (publish, delete, moderate, manage roles) re-read permissions from the database, which `has_permission` already does
- [x] Tests: Vitest (deny by default, strategy behaviour); pgTAP for `my_permissions()`
- [ ] **Done when**: a test proves a role without a permission is refused by RLS **and** by Payload (RLS part proven by pgTAP in PR 1)

### P1.5 Theme and layout `area: ui`
- [x] DESIGN.md §3 tokens as CSS variables + Tailwind theme (primary / neutral / semantic palette, `bg-primary-400`...), role tokens (`--bg`, `--ink`, `--outline`, `--shadow`) with a light and a dark set; a Vitest test checks that the palette matches the document
- [x] **Space Mono** (4 variants, `font-synthesis: none`, self-hosted through `next/font`, accents shown on `/design-system`). Not applied to the Payload admin, which keeps its own UI
- [x] Button restyled: Primary / Secondary, 3 sizes, icon-only, hover / pressed / focus / disabled states, inline link
- [x] Switch: off / on / indeterminate, disabled, hover / pressed / focus (native checkbox with `role="switch"`)
- [ ] Restyled components: Card, Input, Tabs, Badge, Alert (add each to `/design-system` with all its variants)
- [ ] Light/dark mode (user's choice, toggle only scoped to `/design-system` for now); dark-mode shadow stays black (decided)
- [ ] Single `Logo` component (variants), base layout (header, footer, beta banner), 404/error pages
- [ ] Produce SVG logo, dark variant, favicon, Open Graph image (DESIGN.md §5)
- [ ] **Done when**: a "UI kit" page visually matches `docs/design/ui-kit.png` in both modes

---

## Phase 2: Core learning

*Exit: a visitor reads a public course; a signed-in user runs a JS and a Python exercise, uses hints, takes a quiz; their progress is saved.*

### P2.1 Public course rendering `area: ui` `area: seo`
- [ ] Path / Course / Chapter pages server-rendered, ISR with revalidation on publish
- [ ] Meta tags, Open Graph, structured data, `sitemap.xml`, `robots.txt`
- [ ] A first demo chapter readable on mobile (16–18 px body, ~65 characters wide)

### P2.2 Editor and JavaScript execution `area: exercises`
- [ ] Monaco (`dynamic`, `ssr: false`), Space Mono font, **self-hosted**
- [ ] Isolated JS Web Worker, **timeout** + Worker termination (infinite loop)
- [ ] Payload Exercise block (language, prompt, difficulty, starter code, "input → output" tests)
- [ ] Clear message on mobile (exercises are desktop-only)
- [ ] Vitest tests for the grader

### P2.3 Pyodide `area: exercises`
- [ ] Pyodide in a Worker, self-hosted, lazy-loaded, with timeout
- [ ] Same grading interface as JS
- [ ] Check weight and cold start

### P2.4 Authentication and profiles `area: auth` `area: db`
- [x] Supabase Auth: GitHub + Discord sign-in (Google added later). Still to test: linking several providers to one account (verified e-mail only)
- [x] `profiles` (nickname, avatar, leaderboard opt-in), created with the account; **minimum age 15** declaration recorded server-side (`declare_age()`), enforced by the `/welcome` gate (declining deletes the account). The nickname chooser UI comes with the leaderboard (P3.4)
- [x] RLS: everyone reads/writes only their own profile, and cannot write the age declaration directly (pgTAP)
- [ ] `progress`, `exercise_attempts`, `quiz_results`; progress per course (%)
- [ ] Account deletion and data export in the profile: `delete_my_account()` exists (used by the age refusal); a button in `/account` and the data export are still to build
- [ ] Sign-in rate limiting (`rate_limits` table + SQL function)

### P2.5 Hints and solution `area: exercises` `area: cms`
- [ ] Progressive hints unlocked one by one (defined in the CMS)
- [ ] Solution revealable after N failures (3 by default, configurable per exercise)
- [ ] Record hints used and solution viewed (affects points later)

### P2.6 Quiz block `area: cms` `area: exercises`
- [ ] Payload Quiz block (questions, answers, explanations), result recorded

### P2.7 "Introduction to Programming" path `area: content`
- [ ] Variables, conditionals, loops, functions, data structures
- [ ] Alternate short explanation, exercise, quiz; exercises in **JS and Python**
- [ ] Senior instructor review (draft → review → publish workflow tested end to end)
- [ ] **Done when**: the whole path can be published from Payload without touching code

---

## Phase 3: Protocols and engagement

*Exit: protocol modules playable without an account; badges, streaks, SM-2 reviews and a leaderboard secured server-side.*

### P3.1 Protocol modules `area: protocols`
- [ ] Payload "Protocol animation" block (scenario + parameters)
- [ ] **TCP**: SYN / SYN-ACK / ACK handshake, losses, retransmissions
- [ ] **HTTP playground**: raw requests to a fake server simulated in a Worker
- [ ] **DNS** then **TLS** (resolution, handshake)
- [ ] Available without an account (acquisition lever)

### P3.2 Badges and streaks `area: gamification`
- [ ] Tables `badges`, `user_badges`, `streaks`
- [ ] Earning rules tested (Vitest)

### P3.3 SM-2 spaced repetition `area: gamification`
- [ ] **Pure SM-2 function** tested (Vitest): fail, hard, good, easy
- [ ] `review_schedule` table; sources: missed quizzes, short exercises, key concepts
- [ ] "To review today" dashboard in the account (no e-mail or notification)

### P3.4 Points and leaderboard `area: gamification` `area: security`
- [ ] `points_ledger` written **server-side only**; scoring 10 / 20 / 40, no-hint bonus +50%, quizzes, streaks
- [ ] Anti-abuse: an exercise earns points once, **daily cap** (300 proposed), server validation
- [ ] `level_thresholds` and level computation
- [ ] `leaderboard` view: nickname only, **opt-in**, off by default
- [ ] Moderation: `moderation.ban` permission, banned-word filter, audit log
- [ ] Rate limiting: exercise submission, points awarding, nickname
- [ ] **Done when**: a forged client cannot give itself points

### P3.5 [post-V1] Level-based unlocks `area: gamification`
- [ ] `unlock_rules` table (e.g. leaderboard from level 4). **Do not start in V1.**

---

## Phase 4: Watch and go-live

*Exit: every condition in "Public opening gate" is met; public site in production with the beta banner.*

### P4.1 Watch `area: content` `area: seo`
- [ ] Articles: tags, date, author, **RSS** feed, up-to-date sitemap
- [ ] 2 articles written

### P4.2 Legal and privacy `area: legal`
- [ ] Legal notice, privacy policy, terms of use, contribution charter
- [ ] GDPR: account deletion, export, check whether Vercel Analytics requires a banner
- [ ] **Beta warning banner** on every page and at sign-up (text to write)

### P4.3 Security `area: security`
- [ ] Mandatory **TOTP 2FA** for editorial roles and admin (OAuth + Payload compatibility tested)
- [ ] **CSP** in Report-Only then hardened: `worker-src`, `'wasm-unsafe-eval'`, self-hosted Monaco and Pyodide; decide nonces vs hashes vs `strict-dynamic` (ISR/SEO impact)
- [ ] Tuned rate-limiting thresholds (sign-in 10/15 min/IP, exercise 30/min, nickname 5/h)
- [ ] COOP/COEP only if `SharedArrayBuffer` is needed

### P4.4 Quality and operations `area: infra`
- [ ] **Playwright** tests: sign-in, run an exercise, submit a quiz (add `e2e` to the required checks)
- [ ] Performance (Lighthouse), mobile rendering check
- [ ] `/api/health` (light database query); probe wired; [keepalive.yml](../../.github/workflows/keepalive.yml) active (Supabase anti-pause)
- [ ] npm script `backup:content` (export Payload editorial content as JSON/Markdown to `$BACKUP_OUT_DIR`)
- [ ] [backup.yml](../../.github/workflows/backup.yml) active; editorial content export + encrypted `pg_dump`; **local restore test (Docker)** successful
- [ ] Written rollback procedure (redeploy the previous version, restore the export) and pre-release checklist

### P4.5 Production and launch `area: infra`
- [ ] Production Supabase schema created by merging the existing migrations to `main` (the [db-migrate.yml](../../.github/workflows/db-migrate.yml) workflow applies them automatically; first run: trigger it manually as a dry run)
- [ ] Vercel environment variables, `*.vercel.app` domain, production OAuth (GitHub + Discord redirect URLs), Vercel Analytics
- [ ] Gate validated, then **public opening** with the beta warning

---

## Public opening gate

Everything must be true (README §11 bis):
- [ ] "Introduction to Programming" path complete
- [ ] No blocking bug open (label `priority: critical`)
- [ ] Privacy policy and legal notice published
- [ ] First backup export **restored** successfully locally
- [ ] Rate limiting active
- [ ] Editorial 2FA active
- [ ] Beta banner visible everywhere
- [ ] Probe green, migrations applied, environment variables verified

Issues that condition this gate carry the **`gate: beta-launch`** label.

## Governance (everything on `main`)

- **A single long-lived branch: `main`**, always deployable (trunk-based) and **the production branch**. No `develop`.
- Work in short-lived `type/topic` branches (e.g. `feat/quiz-block`), **mandatory PR**, never a direct push.
- **Squash merge** only, linear history; the **PR title** becomes the commit: *Conventional Commits* format (`feat(cms): quiz block`), checked by CI.
- Merging is blocked until **`CI gate`** is green and conversations are resolved. No mandatory review (one-person team), but the administrator may bypass **only through a PR**.
- **Database migrations, automatic**:
  - On the PR: the **DB migrations** job tests them on a throwaway local Supabase (upgrade path from `main`, fresh replay, linter, RLS on every public table, pgTAP, Payload migrations). Existing migrations cannot be edited, new ones must sort after `main`'s, and destructive SQL needs the `breaking-change` label.
  - On merge to `main`: **DB migrate** applies them to production (dry run, push, verification, health check). No migration is applied from a workstation.
  - Vercel deploys `main` in parallel: migrations must be **backward compatible** (expand now, contract in a later PR).
- Vercel previews **on demand**: `preview` label on the PR.
- Labels: one `type: *`, one or more `area: *`, one `phase: *` and one `priority: *` per issue (see [labels.yml](../../.github/labels.yml)).

## Open decisions (README §14)

| Decision | Decide before | Status |
|---|---|---|
| Custom domain (Vercel domain used for now), SynAck trademark | after launch | ☐ |
| Legal validation of the licenses | Repository publication | ☑ done |
| Google sign-in | after launch | ☐ |
| Payload ↔ Supabase compatibility (schema, pooling) | P1.3 | ☐ |
| Dark mode: hard shadow color, theme tints (or drop in V1) | P1.5 | ☐ |
| Exact V1 permission list and preset contents | P1.4 | ☐ |
| Daily points cap (300?) and level thresholds | P3.4 | ☐ |
| Rate-limiting thresholds | P4.3 | ☐ |
| Final CSP (nonces vs hashes) | P4.3 | ☐ |
| TOTP 2FA with OAuth and Payload | P4.3 | ☐ |
| Current Supabase / Vercel free-tier limits | P0.3 | ☐ |
| Text and placement of the beta banner | P4.2 | ☐ |
| CAPTCHA at sign-up | if abuse | ☐ |
| Rust / C strategy | after V1 | ☐ |
