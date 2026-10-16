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
- [ ] Import the rulesets: *Settings → Rules → Rulesets → New ruleset → Import a ruleset*, files in [.github/rulesets/](../../.github/rulesets/) (`main-protection.json`, then `main-required-checks.json`; see its README for the order). **Blocked while the repository is private on the Free plan** (GitHub requires a public repository or Pro): do it as soon as the repository is made public
- [x] Sync the labels: run the **Labels** workflow (`workflow_dispatch`) or push to `main`; it reads [.github/labels.yml](../../.github/labels.yml)
- [x] Enabled: Dependabot alerts + security updates
- [ ] Enable when the repository is public: Secret scanning + **Push protection**, Private vulnerability reporting, Code scanning (CodeQL through the workflow; the CodeQL and dependency-review jobs need a public repository or GitHub Advanced Security)
- [x] Create the **`production`** environment (*Settings → Environments*) restricted to the `main` branch (*Deployment branches*). No required reviewer: production migrations are automatic after the PR tests (see §Governance)
- [x] Open a first test PR: **CI gate** must pass with no application code

### P0.3 Accounts and services ($0) `area: infra`
- [ ] **Supabase** project (free tier) + note the project ref; check the current limits (README §14)
- [ ] **Vercel** project (Hobby, linked to the repository); disable automatic previews for non-`main` branches (see P0.4)
- [ ] OAuth: a **GitHub** application and a **Google Cloud** project (consent screen) for sign-in
- [ ] Uptime probe (UptimeRobot or Better Stack): to wire up in P4.4
- [ ] **Private** repository for backups (for [backup.yml](../../.github/workflows/backup.yml))

### P0.4 GitHub secrets and variables `area: infra`
| Name | Type | Used by |
|---|---|---|
| `SUPABASE_ACCESS_TOKEN` | secret (env `production`) | `db-migrate.yml` |
| `SUPABASE_DB_PASSWORD` | secret (env `production`) | `db-migrate.yml` |
| `SUPABASE_PROJECT_REF` | variable (env `production`) | `db-migrate.yml` |
| `PRODUCTION_DATABASE_URL` | secret (env `production`), Supabase **session pooler** URL (IPv4) | `db-migrate.yml` (Payload migrations) |
| `PAYLOAD_SECRET` | secret (env `production`; also a repository secret if `backup:content` exists) | `db-migrate.yml`, `backup.yml` |
| `BACKUP_DATABASE_URL` | repository secret, Supabase **session pooler** URL (IPv4) | `backup.yml` |
| `BACKUP_PASSPHRASE` | repository secret (also keep it outside GitHub: without it the backups are unreadable) | `backup.yml` |
| `BACKUP_REPO_TOKEN` | repository secret, fine-grained PAT limited to the backup repository (Contents: write) | `backup.yml` |
| `BACKUP_REPO` | variable, `owner/private-repo` | `backup.yml` |
| `PRODUCTION_URL` | variable, `https://…` | `keepalive.yml`, `db-migrate.yml` (health check) |
| `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` | secrets | `preview.yml` (on-demand previews) |

- [ ] Secrets created; no secret in the repository, the `service_role` key is never exposed to the client
- [ ] Vercel: *Settings → Git → Ignored Build Step* = `bash -c '[ "$VERCEL_GIT_COMMIT_REF" = "main" ] && exit 1 || exit 0'` (build only `main`, previews through the `preview` label)

### P0.5 Decisions to make early `[BLOCKING]`
- [ ] Package manager: **npm** (the workflows' assumption, `npm ci` + `package-lock.json`). If pnpm/yarn, adapt [ci.yml](../../.github/workflows/ci.yml)
- [ ] Domain name and availability of "SynAck" (trademark, social handles)
- [ ] Legal validation of the license (can wait until the repository is published)
- [ ] Check **Payload ↔ Supabase Postgres** compatibility (dedicated schema, pooling): to validate in P1.3 before going further

---

## Phase 1: Foundations

*Exit: `npm run dev` starts the app with local Supabase and Payload; the full CI is green; the permission system is tested.*

### P1.1 Initialize the application `area: ui`
- [ ] Next.js (App Router) + React + strict TypeScript, Node **24** (`.nvmrc`)
- [ ] ESLint, Prettier, scripts `lint`, `typecheck`, `format:check`, `test`, `build` (required by CI)
- [ ] Tailwind + shadcn/ui
- [ ] **Done when**: `npm run lint && npm run typecheck && npm run build` pass locally

### P1.2 CI, security and local Supabase `area: infra`
- [ ] Check that [ci.yml](../../.github/workflows/ci.yml) runs lint, types, Vitest, build and e2e (as soon as the scripts exist)
- [ ] [security.yml](../../.github/workflows/security.yml): `npm audit`, gitleaks, CodeQL, dependency review
- [ ] Dependabot active ([dependabot.yml](../../.github/dependabot.yml))
- [ ] Supabase CLI: `supabase init`, `supabase start` (Docker), versioned migrations in `supabase/migrations/`, `supabase/seed.sql`, `supabase/tests/` (pgTAP)
- [ ] Add a first **pgTAP test** and verify the PR job **DB migrations** runs the full pipeline (upgrade path from `main`, fresh replay, linter, RLS check)
- [ ] Add `CI gate` to the required checks of the ruleset (already in `main-required-checks.json`)
- [ ] **Done when**: a test PR with a migration passes CI, and a PR that edits an existing migration, creates a table without RLS or uses `DROP` without the `breaking-change` label is **rejected**

### P1.3 Payload CMS `area: cms`
- [ ] Integrate Payload into Next.js, Supabase Postgres database, **separate schema** (`payload`)
- [ ] Collections **Paths**, **Courses** (chapters as blocks), **Articles**, **Users**
- [ ] npm script `db:migrate:payload` (wraps `payload migrate`): used by CI (PR tests) and by the production migration workflow
- [ ] Test pooling, cold starts and Vercel Hobby limits (README §11 bis)
- [ ] Forbid raw HTML/script in blocks (stored XSS)
- [ ] **Done when**: a course created in the local Payload admin shows up in the database

### P1.4 Permissions and roles `area: auth` `area: db`
- [ ] Single permissions file (closed TypeScript type, `resource.action` format)
- [ ] Tables `roles`, `role_permissions`, `user_roles`, `audit_log`, SQL function `has_permission(user, permission)`
- [ ] Starting presets: Member, Junior instructor, Senior instructor, Administrator
- [ ] Wiring to Payload `access` and **RLS** policies (RLS enabled on **every** table from the start)
- [ ] Short-lived JWT; re-read from the database for sensitive actions (publish, delete, moderate, manage roles)
- [ ] Tests: Vitest (deny by default, preset inheritance, sensitive actions) and pgTAP (policies)
- [ ] **Done when**: a test proves a role without a permission is refused by RLS **and** by Payload

### P1.5 Theme and layout `area: ui`
- [ ] DESIGN.md §4 tokens as CSS variables + Tailwind theme (primary / neutral / semantic palette)
- [ ] **Space Mono** (4 variants, `font-synthesis: none`, self-hosted, accents tested)
- [ ] Restyled components: Button (Primary/Secondary), Switch, then Card, Input, Tabs, Badge, Alert
- [ ] Light/dark mode (user's choice); decide the shadow color in dark mode
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
- [ ] Supabase Auth: GitHub + Google; link several providers to one account (verified e-mail only)
- [ ] `profiles` (nickname, avatar, leaderboard opt-in), **minimum age 15** declaration at sign-up
- [ ] RLS: everyone reads/writes only their own data
- [ ] `progress`, `exercise_attempts`, `quiz_results`; progress per course (%)
- [ ] Account deletion and data export in the profile
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
- [ ] Vercel environment variables, domain, production OAuth, Vercel Analytics
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
| Domain name, SynAck trademark | P4.5 | ☐ |
| Legal validation of the licenses | Repository publication | ☐ |
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
