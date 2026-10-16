# SynAck

> A free, French-language platform for learning programming and network protocols, with in-browser exercises and a tech watch.

**Status: pre-development (document v6, decisions nearly final).** This document records the decisions made before any code is written. It evolves with the project.

---

## 1. Vision

Learn by **doing** rather than reading. The site has three pillars:

1. **Programming**: courses and coding exercises with automatic grading.
2. **Protocols and networking**: interactive modules (TCP, HTTP, DNS, TLS) to understand what really happens on the wire.
3. **Tech watch**: short articles on current technologies.

Guiding principle: **creating a course must be pleasant and possible without touching code or redeploying** (see §5).

## 2. Validated decisions

| Topic | Decision |
|---|---|
| Audience | All levels (separate paths per level) |
| Language | French only |
| Business model | 100% free |
| Accounts | Required to practice (exercises, progress, leaderboard) |
| Sign-in | GitHub and Google (OAuth) |
| Content team | One admin + a few contributors |
| Permissions | **Granular** (`resource.action`), grouped into editable **role presets** (see §5 bis) |
| Review | Driven by permissions: senior instructors publish, junior instructors go through review |
| Community | Minimal in V1: no comments |
| Articles | Tech watch, **written by hand** |
| Hosting | Vercel |
| Database | **A single Supabase database** shared with Payload (separate schemas) |
| Visual style | **Fixed** (neo-brutalist pink, Space Mono, supplied logo, no mascot): see [DESIGN.md](DESIGN.md) |
| Theme | Light + dark, chosen by the user |
| First path | **Introduction to Programming** (concepts common to all languages) |
| Mobile | Reading on mobile, **exercises on desktop** |
| SEO | **Essential**: courses and articles are public and indexable (confirmed) |
| Analytics | Vercel Analytics |
| Spaced repetition | **SM-2** (Anki-style) |
| Exercise help | **Progressive hints** + **revealable solution** |
| License | Code under **PolyForm Noncommercial** (source-available) + content under **CC BY-NC-SA 4.0**, attribution required (see §10) |
| Legal publisher | **Natural person** (the project creator) |
| Accessibility | Not a V1 priority (correct basics still apply, see §9) |
| Budget | **$0 / month**: free tiers only (see §11 bis) |
| Expected traffic | **Fewer than 100 users** at 6 months |
| Environments | Local (Docker) + Production; Vercel previews **on demand** |
| Backups | **Free scheduled export** of content + encrypted `pg_dump`, with a restore test (see §11 bis) |
| Monitoring | Uptime probe + Vercel/Supabase logs, no Sentry |
| Anti-abuse | Rate limiting on sensitive routes, via **counters in Supabase** (see §11 bis) |
| Back-office security | **Mandatory TOTP 2FA** for editorial roles |
| Dependencies | Dependabot/Renovate + CI audit + strict CSP |
| Minimum age | **15 years old** (declared at sign-up) |
| Moderation | `moderation.ban` permission to remove a nickname from the leaderboard |
| Accounts | Several providers (GitHub, Google) linked to the **same account** |
| Launch | **Public opening** with a **"beta" warning visible to everyone** (no invitations) |
| Name | **SynAck** (name and domain availability to be checked) |
| Levels | Computed from **cumulative point thresholds** |
| Scoring | Solved exercise: **10 / 20 / 40** points (easy / medium / hard), no-hint bonus **+50%** |

## 3. Tech stack

| Layer | Choice |
|---|---|
| Front end and back end | **Next.js** (App Router) + **React** + TypeScript |
| CMS | **Payload CMS** embedded in Next.js |
| Database and auth | **Supabase** (Postgres, OAuth auth, RLS) |
| Code editor | **Monaco Editor** (loaded with `dynamic`, `ssr: false`) |
| Python execution | **Pyodide** (WebAssembly) in a Web Worker |
| JavaScript execution | Isolated **Web Worker** (no Wasm) |
| UI | Tailwind + shadcn/ui, custom theme, light/dark mode |
| Tests | **Vitest** (unit), **Playwright** (end-to-end) |
| CI/CD | **GitHub Actions** (lint, types, tests, migration tests on PRs, automatic migrations on `main`) |
| Hosting and analytics | **Vercel** + Vercel Analytics |

> To verify at kickoff: current version of each tool, and Payload's compatibility with Supabase's Postgres (dedicated schema, connection pooling).

## 4. V1 scope

### Exercise languages
- **JavaScript** and **Python** only, 100% in the browser.
- **Rust and C are out of V1**: the choice is "Wasm only, even if limited", so there is no execution server. To be reconsidered later (Judge0/Piston or a managed sandbox).

### Educational content
- Courses + coding exercises
- Quizzes
- Paths / roadmaps by level
- Spaced repetition (see §4 bis)

**First path: "Introduction to Programming"** (variables, conditionals, loops, functions, data structures), with exercises available in both JS and Python.

### Exercise help
- **Progressive hints**: unlocked one by one, defined in the CMS Exercise block.
- **Revealable solution**: available after a number of failed attempts, **configurable per exercise** in the CMS (**3 by default**).
- Using a hint or the solution reduces the points earned (see §4 ter).

### Interactive protocol modules
- Animated TCP handshake (SYN, SYN-ACK, ACK, losses, retransmissions)
- HTTP playground (raw requests to a fake server simulated in a Worker)
- DNS and TLS (resolution, handshake)

### Motivation
- Progress per course (%)
- Badges and streaks
- Public leaderboard (nickname + opt-in, see §6)

### Tech watch
- Articles written by the team, tags, publication date, RSS feed.

### Out of V1
Rust/C, comments, per-lesson discussions, payments, translations, automatic feed aggregation, reminder e-mails and notifications, mascot.

### 4 bis. Spaced repetition (SM-2)
- **SM-2** algorithm: each item has an ease factor and an interval recomputed from answer quality (fail, hard, good, easy).
- Items to review are scheduled in `review_schedule`: **missed quiz questions**, **short quick coding exercises** and **key concepts of a chapter**. No flashcards in V1.
- A **"to review" dashboard** in the account lists what is due today.
- No e-mail or push notification in V1.
- The SM-2 logic must be a **pure function tested with Vitest**.

### 4 ter. Leaderboard points
Points are awarded for:
- **A solved exercise**, by difficulty as set in the CMS: **10 points** (easy), **20** (medium), **40** (hard).
- **No-hint bonus**: **+50%** of the exercise's points when solved without hints or a revealed solution.
- **Passed quizzes**, depending on the score.
- **Consecutive-day streak**: a consistency bonus.

Anti-abuse rules to finalize before the leaderboard opens: an exercise earns points **only once**, a **daily cap** (proposal: 300 points per day, to be confirmed), and server-side validation (see §6).

### 4 quater. Levels
- A user's **level** is determined by their **cumulative points**, using progressive **thresholds** (proposal: level 4 at around 300 points, to be tuned).
- Thresholds are stored in the database (`level_thresholds`) and editable without migrating users.
- The level is used to prepare feature unlocks (for example the leaderboard, see §5 bis).

## 5. No-code content creation (CMS)

Courses live in **Payload CMS**, not in versioned MDX files. A contributor writes, previews and publishes from a visual interface, with no commit or deployment (Next.js ISR revalidation).

### Collections
- **Paths**: ordered sequence of courses, with an associated level.
- **Courses**: chapters made of blocks.
- **Articles**: tech watch, tags, date, author.
- **Users**: one or more roles per user; permissions come from roles (see §5 bis).

### Blocks available in the editor
- Rich text, image, diagram
- **Exercise**: language (JS or Python), prompt, difficulty, starter code, progressive hints, solution, tests
- **Quiz**: questions and answers, explanations
- **Protocol animation**: scenario choice (TCP, HTTP, DNS, TLS) and a few parameters

### Exercise tests (two modes)
- **Simple**: an "input → expected output" table, no code.
- **Advanced**: tests written in code, reserved for technical profiles.

### Editorial workflow
- Draft → preview → publish.
- **Senior instructor**: can publish directly (`courses.publish`).
- **Junior instructor**: submits for review (`courses.submit_review`); a senior or the administrator approves (`reviews.approve`).
- Only the administrator manages configuration, users and roles.

## 5 bis. Permissions and roles

### Principle
Rights are **granular permissions** in the `resource.action` format (examples: `courses.create`, `courses.edit`, `courses.delete`, `quiz.create`, `leaderboard.see`). **Role presets** group them to simplify assignment. A user has one or more roles, and never individual permissions in V1.

### Starting presets

| Preset | Permissions (excerpt) |
|---|---|
| **Member** (default) | `exercises.run`, `progress.write_own`, `review.use`, `leaderboard.see` (subject to a level condition, see below) |
| **Junior instructor** | `courses.create`, `courses.edit_own`, `courses.submit_review`, `quiz.create`, `articles.create` |
| **Senior instructor** | everything above + `courses.edit`, `courses.publish`, `reviews.approve`, `articles.publish` |
| **Administrator** | all permissions, including `courses.delete`, `users.manage`, `roles.manage`, `moderation.ban` |

A **Moderator** preset (with `moderation.ban`, no editorial rights) can be created from the back office if needed.

Presets are **data**: the administrator can create or edit them from the back office.

### Design rules
- **Single source of truth**: permissions are stored in Postgres (Supabase) and used by both the RLS policies and Payload's access functions, to prevent any divergence between the two systems.
- **Closed list in code**: every existing permission is declared in a single file (a TypeScript type), which prevents typos and makes them testable. Only roles and their associations are stored in the database.
- **Deny by default**: without an explicit permission, access is refused.
- **Always checked server-side**: hiding a button in the UI is never a protection.
- **Audit log** of sensitive actions (deletion, role change, publication).
- **No per-user exceptions in V1**: the role and its preset are enough.

### Progression-based unlocks (planned, out of V1)
Example: "leaderboard unlocked from level 4".
- Chosen approach: a **dynamically evaluated rule** rather than a permission written at each level-up. `leaderboard.see` is granted if the role has the permission **and** the user's level is greater than or equal to the threshold.
- The threshold is a **setting editable** by the administrator, without migrating users.
- The `unlock_rules` table (permission, condition, value) allows adding other unlocks later.

### Points to test at kickoff
- Caching permissions in the JWT: they would stay stale until the next token refresh. **Decision**: short token lifetime, and **re-reading permissions from the database** for sensitive actions (publishing, deleting, moderating, managing roles).
- Integrating Payload access functions with the SQL function `has_permission(user, permission)`.

### Ruled-out roles
No "Recruiter" role: access to learner profiles is not planned. The permission system would allow adding it later, with explicit learner consent and a GDPR update.

## 6. Security and privacy

- **Student code**: runs only in the browser (Web Worker / Pyodide), never on the server. No access to the user's system or to our servers.
- **Infinite loops**: timeout, with the Worker terminated.
- **Supabase**: **RLS enabled on every table from the start**; a user reads and writes only their own data.
- **Public leaderboard**:
  - Shown by **nickname only**, never a real name.
  - **Explicit opt-in**: the user chooses to appear (off by default).
  - Scores sent by the client can be forged: points must be **recomputed or validated server-side** before the leaderboard opens. Known limit: since the code runs on the student's machine, a motivated user can cheat on an exercise; the daily cap and one-time reward per exercise limit the impact.
- **Public repository**: no secrets in the code or in Git history; environment variables managed in Vercel; an `.env.example` file is provided; the Supabase `service_role` key is never exposed to the client.
- **Iframe sandbox** for any untrusted embedded content, on a separate domain.
- **COOP/COEP headers**: enable only if `SharedArrayBuffer` is required, since they can break third-party scripts and iframes.
- **GDPR**: minimal data (GitHub/Google OAuth), privacy page, account deletion and data export to be provided. Vercel Analytics does not require a cookie banner in its standard configuration; to verify at launch.

## 7. Data (first draft)

Planned Supabase tables (all under RLS):
- `profiles`: nickname, avatar, leaderboard opt-in, sign-up date
- `progress`: user, chapter, status, date
- `exercise_attempts`: user, exercise, result, hints used, solution viewed, date
- `quiz_results`: user, quiz, score
- `badges` / `user_badges`
- `streaks`
- `review_schedule`: item, SM-2 ease factor, interval, next due date
- `points_ledger`: log of awarded points (written server-side only)
- `leaderboard`: view computed from `points_ledger`, opted-in profiles only
- `roles`: name, description (editable presets)
- `role_permissions`: role, permission (`resource.action` format)
- `user_roles`: user, role
- `unlock_rules`: permission, condition (e.g. minimum level), value (planned, out of V1)
- `audit_log`: actor, action, target, date (sensitive actions)
- `level_thresholds`: level, required cumulative points
- `rate_limits`: key (user or IP + route), window, counter (see §11 bis)

Editorial content stays in the tables managed by Payload, in a separate schema of the same database.

## 8. SEO and content access

Confirmed model:
- **Course and article pages are public**: server rendering, meta tags, sitemap, structured data, RSS feed.
- An **account is required** to run and validate exercises, save progress, access the "to review" dashboard and the leaderboard.
- Protocol animations can stay available without an account (a good acquisition lever).

## 9. Quality

- **Accessibility**: not a V1 priority, but the basics apply from the start (semantic HTML, sufficient contrast, keyboard navigation on common components), since shadcn/ui makes this easy. A full audit is to be scheduled after V1.
- **Mobile**: courses and articles are comfortable to read on a phone; exercises with Monaco are desktop-only (clear message on mobile).
- **Tests**:
  - Vitest: exercise grader, SM-2, progress logic, points computation.
  - Playwright: key journeys (sign-in, run an exercise, submit a quiz).
  - GitHub Actions: lint, types and tests on every push and pull request.
  - **Database migrations tested on every PR** (see §11 bis).

## 10. License

Stated goal: **mandatory author attribution, no commercial use, no appropriation**.

> A license that forbids commercial use is **not open source** under the OSI definition: this is **source-available** code. The repository can stay public; it just must not be called "open source".

Chosen options (not legal advice: have them validated before publishing):
- **Code**: **PolyForm Noncommercial 1.0.0** (non-commercial use only, with the copyright notice required). Creative Commons NC licenses are discouraged for software.
- **Content** (courses, articles, diagrams): **CC BY-NC-SA 4.0** (attribution, no commercial use, share-alike). This replaces the previously considered **CC BY-SA**, which allowed commercial use and contradicted the goal.
- **Name and logo**: to be protected separately (trademark), since a code license does not protect the name.
- **Contributors**: a charter states that their content is published under the same license and that the project author may redistribute it.
- Validate the final choice with a lawyer or an intellectual-property advisory service before publishing the repository.

## 11. Legal notices

- Publisher: the project creator, a **natural person**.
- Host: Vercel (and Supabase for data).
- In France, a natural person may withhold their home address provided they give their identity and contact details to the host; to verify at launch.
- Pages to provide: legal notice, privacy policy, terms of use, contribution charter.
- A free, non-commercial project is still subject to GDPR as soon as it collects personal data (OAuth accounts).

## 11 bis. Operations and going to production

Context: **$0 budget**, **fewer than 100 users**, public opening with a beta warning. Free-tier limits must be **re-checked at kickoff** (they change).

### Environments
- **Local**: Supabase in **Docker** (Supabase CLI) + Next.js + Payload; migrations versioned in the repository.
- **Production**: remote Supabase project and Vercel deployment. **`main` is the production branch.**
- **Vercel previews on demand**: disable automatic deployment of every PR to stay under the daily deployment limit. Run a preview only on request (the `preview` PR label).

### Database migrations (CI/CD)
- **On every pull request** that touches `supabase/`: a throwaway local Supabase is started in CI and the migrations are tested two ways: (1) **upgrade path**: apply `main`'s migrations (a production-like state), then apply the PR's new migrations on top; (2) **fresh replay**: rebuild the whole schema from scratch. Checks also run the database linter, verify that RLS is enabled on every `public` table, run pgTAP tests (`supabase/tests`) and flag destructive statements (`DROP`, `TRUNCATE`...) unless the PR carries the `breaking-change` label.
- **On merge to `main`**: migrations are applied to production **automatically** by the `DB migrate` workflow (dry run first, then push). No migration is ever applied from a workstation.
- Because Vercel deploys `main` in parallel, migrations must be **backward compatible** with the previous app version (expand, then contract in a later PR): add before you use, stop using before you drop.
- Payload's own migrations (`payload` schema) follow the same flow through the `db:migrate:payload` npm script, once it exists.

### Backups (choice: no paid offering)
Account data (progress, points) is considered low value, with two caveats:
- **Courses and articles** (editorial content) are the real asset of the project: losing them would be costly.
- Account data (progress, points) also falls under GDPR (security obligation).

Free approach: a **scheduled regular export** (GitHub Actions) of editorial content as JSON/Markdown to a **private** repository, plus a periodic encrypted `pg_dump` for the rest. A local restore test (Docker) validates the whole chain. **Decision: adopted.**

### Free-tier constraints
- **Supabase**: inactive projects may be **paused** automatically. The uptime probe calls `/api/health`, which runs a **light database query**: this also acts as a guard against pausing. No backups are included in the free tier.
- **Vercel (Hobby plan)**: **non-commercial use only** (consistent with the license), limits on deployments, function duration and log retention. Test Payload (admin and API) within these limits, especially on cold starts.
- **Rate limiting**: **counters in Supabase** (`rate_limits` table and SQL function), with no extra service, which is enough for fewer than 100 users. A Vercel firewall rule may be added if the Hobby plan allows it (to verify).

### Monitoring
- Free **uptime probe** (UptimeRobot or Better Stack) on the home page and a health route (`/api/health`).
- Vercel and Supabase **logs**, read by hand. No Sentry in V1: client-side errors will not be reported automatically; to be reconsidered if the beta reveals hard-to-reproduce bugs.
- Plan an e-mail alert from the probe.

### Operational security
- **Mandatory TOTP 2FA** (authenticator app) for all editorial roles and the administrator, through Supabase Auth; compatibility with OAuth sign-in and Payload access to be tested.
- **Rate limiting** on: sign-in, exercise submission, points awarding, nickname creation. Starting thresholds (to tune): sign-in 10 per 15 minutes per IP, exercise submission 30 per minute per user, nickname change 5 per hour.
- **Open registration**: without invitations, automated sign-ups are a risk. IP rate limiting and the age declaration are the V1 protections; a CAPTCHA remains an option if abuse appears.
- **CI vulnerability audit** (`npm audit` or equivalent, secret scanning) and **Dependabot/Renovate** for automatic updates.
- **Strict CSP**: first deployed in **Report-Only** mode to observe violations without blocking anything, then hardened once the policy is stable. Tensions to resolve early:
  - Monaco uses Workers and Pyodide uses WebAssembly: plan `worker-src` and `'wasm-unsafe-eval'`, limited to what is necessary.
  - **Self-host** Monaco and Pyodide (instead of a CDN) to keep a tight CSP and avoid third-party dependency.
  - Next.js CSP nonces require dynamic rendering, which can hurt the static/ISR rendering useful for SEO. Alternative: CSP based on hashes or `strict-dynamic`. To test.
- Instructors may not insert raw HTML or script into courses: only the structured block content is rendered (prevents stored XSS).

### Accounts, age and privacy
- **Minimum age 15**: age declaration checkbox at sign-up, stated in the terms of use. A user who declares being under 15 cannot create an account.
- **One account, several providers**: GitHub and Google linked to the same account (manual linking from the profile, and automatic linking only on an e-mail address verified by the provider, to prevent account takeover). To test with Supabase Auth.
- Account deletion and data export available in the profile.

### Leaderboard moderation
- A nickname can be removed from the leaderboard by a user with `moderation.ban`.
- Plan a **banned-word filter** at nickname creation and a way to reset a removed nickname (the user must pick a new one).
- Every moderation action is logged in `audit_log`.

### Launch: public opening with a beta warning
- **No closed beta or invitations**: the site is open to everyone, with a **visible "beta" warning** on every page (banner) and at sign-up: features may change, bugs are possible, **progress data may be reset**.
- Courses and articles stay public for SEO; an account is still required for exercises.
- **Minimum conditions before opening** (proposal): complete "Introduction to Programming" path, no blocking bug open, privacy policy and legal notice published, first backup export successfully restored locally, rate limiting and editorial 2FA active.
- **Removing the warning**: a manual decision, once V1 has stabilized.

### Recovery plan
- Written **rollback** procedure: redeploy the previous version on Vercel, restore content from the latest export.
- Pre-release checklist for every production release (migrations applied, environment variables, 2FA active, probe green).

## 12. Project identity

### Name
- **SynAck**: a nod to the TCP handshake (SYN, SYN-ACK, ACK), short and memorable.
- To do: check availability of the **domain name**, social media handles and any existing trademarks. Protect the name and logo separately from the code license (see §10).

### Visual direction
Typography, colors, components and logo are fixed and documented in **[DESIGN.md](DESIGN.md)**. This README does not repeat the details.

## 13. Development plan

Pace: **full time**, intermediate technical level (React / Next.js mastered). The step-by-step version with definitions of done lives in [CHECKLIST.md](CHECKLIST.md).

**Phase 1: Foundations**
1. Initialize Next.js, TypeScript, Tailwind, shadcn/ui, lint, formatting.
2. Set up GitHub Actions (lint, types, Vitest, vulnerability audit, **database migration tests**, **automatic production migrations on `main`**) and Dependabot/Renovate; local Supabase in Docker and versioned migrations.
3. Integrate Payload (Courses, Paths, Articles collections).
4. Permission system: `roles` / `role_permissions` / `user_roles` tables, `has_permission` function, starting presets, wiring to Payload access and RLS policies, Vitest tests.
5. Theme, light/dark mode, base layout.

**Phase 2: Core learning**
6. Public course rendering (SSR, SEO) and a first demo chapter.
7. Monaco editor component + JavaScript execution in a Worker + simple tests.
8. Pyodide in a Worker.
9. Supabase: GitHub/Google auth, profiles, RLS, progress.
10. Progressive hints and revealable solution.
11. Quiz block.
12. "Introduction to Programming" path (full content).

**Phase 3: Protocols and engagement**
13. Animated TCP module, then HTTP playground, then DNS/TLS.
14. Progress, badges, streaks.
15. SM-2 and "to review" dashboard.
16. Points and secure leaderboard (server validation, nickname + opt-in).
17. *(Planned, out of V1)* Level-based unlock rules (`unlock_rules`), for example leaderboard from level 4.

**Phase 4: Watch and go-live**
18. Tech watch articles, tags, RSS, sitemap.
19. Playwright tests, performance, legal notices, privacy, GDPR, CSP (Report-Only then hardening), rate limiting (Supabase counters), TOTP 2FA for editorial roles, beta warning banner.
20. Scheduled backup export, restore test, uptime probe, Supabase anti-pause job.
21. Production on Vercel, Vercel Analytics, public opening with a beta warning once the minimum conditions in §11 bis are met.

## 14. Open questions

- **Domain name** for SynAck and protection of the name and logo (availability not verified)
- **Legal validation** of the license (PolyForm Noncommercial code, CC BY-NC-SA content)
- Dark mode, theme tints, vector logo and favicon: see [DESIGN.md](DESIGN.md) §9
- **Daily points cap** (proposal: 300 per day) and exact level thresholds
- **Rate-limiting thresholds** (starting proposals in §11 bis)
- **CSP**: exact content of the final policy, compatible with Monaco, Pyodide and SEO (Report-Only first)
- Compatibility of **TOTP 2FA** with OAuth sign-in and Payload
- Verification of the current Supabase and Vercel free-tier limits
- Exact list of V1 permissions and the precise content of each preset
- **Sign-up anti-bot**: CAPTCHA not adopted for now, to reconsider if abuse appears
- Text and placement of the **beta warning**
- Strategy for Rust and C after V1

## 15. Design principles

- Start small: 1 path, 1 protocol module, 2 articles, then validate before widening.
- Alternate short explanation, exercise, quiz.
- Fast, readable on mobile, playful without being childish.
- Anything that can be configured in the CMS must not require code.
