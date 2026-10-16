# SynAck

> A free, French-language platform for learning programming and network protocols, with in-browser exercises and a tech watch.

**Status: pre-development.** Project decisions, scope and plan live in [`.dev/Organisation`](.dev/Organisation):

| Document | Contents |
|---|---|
| [README.md](.dev/Organisation/README.md) | Vision, decisions, stack, scope, security, operations, plan |
| [DESIGN.md](.dev/Organisation/DESIGN.md) | Visual identity: typography, colors, components, logo |
| [CHECKLIST.md](.dev/Organisation/CHECKLIST.md) | Step-by-step checklist by phase, with definitions of done |

## Getting started

Requires Node 24 (see `.nvmrc`) and npm.

```bash
npm ci
npm run dev
```

### Environment

```bash
cp .env.example .env   # then set PAYLOAD_SECRET (openssl rand -base64 32) and DATABASE_URI
```

### Sign-in (Supabase Auth: GitHub and Discord)

The app needs `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public values: the project URL and the *publishable* key). Without them sign-in is disabled and the rest of the site keeps working.

One-time setup for a hosted project:

1. Vercel: add the two variables above (Supabase > Connect).
2. Supabase > Authentication > URL Configuration: *Site URL* = the site URL; *Redirect URLs* = `<site URL>/auth/callback` (and `http://localhost:3000/auth/callback` for local work).
3. GitHub OAuth app and Discord application: *callback URL* = `https://<project ref>.supabase.co/auth/v1/callback`; put each Client ID/secret in Supabase > Authentication > Providers.

Pages: `/sign-in` (sign-in), `/welcome` (age confirmation, 15+), `/profile` (profile, behind the header's avatar menu). After signing in you land on the home page (or on `/welcome` first for a new account).

The back office (`/admin`) has no password: it uses the same GitHub/Discord accounts and only lets in accounts holding the `cms.access` permission. To bootstrap the first administrator, sign in once on `/sign-in`, then run `select private.grant_role('<user uuid>', 'administrator');` in the Supabase SQL editor (the uuid is in Authentication > Users) and open `/admin`. Server code must read the user with `supabase.auth.getUser()`; the proxy only refreshes the session.

### Local database

Requires Docker and the [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started).

```bash
npm run db:start   # start local Supabase (applies supabase/migrations, then seed.sql)
npm run db:test    # run the pgTAP tests in supabase/tests
npm run db:reset   # rebuild the local database from scratch
npm run db:stop
```

### Protocol diagrams

Editors create animated protocol diagrams in the back office, *Protocol diagrams*: describe the two machines, then each message (sender, name, detail, a sentence of explanation, the machines' state afterwards, and whether readers can make it get lost). The page `/protocols/<slug>` is built from it, the *Preview* button shows the draft, and publishing refreshes the site. The format is documented in `.dev/Organisation/DESIGN.md` (Protocol diagrams). A course (`/paths/<slug>`) embeds a diagram with the *Protocol diagram* block of a chapter.

### Writing a course in Markdown

Typing a whole course into the CMS editor is slow, so courses can be written as Markdown files and loaded into the CMS. A course is a folder in `content/courses/<slug>/`:

- `course.md`: front matter only (`title`, `slug`, `summary`, `level`, `icon`, `tags`);
- `01-something.md`, `02-other.md`...: one file per chapter, starting with a `# Chapter title` line, then the lesson. Write section headings with `##` (they appear one level lower under the chapter title); use fenced code blocks with a language (` ```javascript `, ` ```python `, ` ```plaintext ` for an output); no tables or raw HTML (the editor cannot represent them).

```bash
npm run content:check -- content/courses/<slug>                    # runs every code sample and reports its output
npm run content:import -- content/courses/<slug> --dry-run         # reads and converts, writes nothing
npm run content:import -- content/courses/<slug>                   # creates or updates the course as a draft
npm run content:import -- content/courses/<slug> --publish         # ... and publishes it
```

The import needs `DATABASE_URI` and `PAYLOAD_SECRET` (read from `.env`), updates the course with the same slug (the Markdown is the source of truth), and acts as the operator: whoever runs it has access to the database. `npm test` checks that every chapter follows the structure of the course (an objective, a quiz, a bug to fix, an exercise, the answers).

### Content management (Payload CMS)

The back office is served at `/admin`, the REST API at `/api`. Payload stores its tables in the `payload` schema of the same Postgres database, and schema changes always go through versioned migrations (auto-push is disabled):

```bash
npm run db:migrate:payload                      # apply Payload migrations (after db:start)
npm run db:migrate:payload:create -- <name>     # generate a migration after changing a collection
npm run generate:types                          # refresh src/payload-types.ts
npm run generate:importmap                      # refresh the admin import map
```

The first visit to `/admin` asks you to create the first user. Commit the generated migration, `src/payload-types.ts` and the import map together with the collection change.

Create a database migration with `supabase migration new <name> < /dev/null`, then edit the generated file. Never edit a migration that is already on `main`: add a new one. Migrations are tested on every PR and applied to production automatically after merge (see the project README, §11 bis).

Checks run by CI: `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm test`, `npm run build`.

## Repository

- `.github/`: CI/CD workflows, labels, issue and PR templates, rulesets to import (see [rulesets/README.md](.github/rulesets/README.md))
- `docs/design/`: logo and UI kit images
- `src/`: the Next.js application (App Router); `src/collections`, `src/blocks` and `src/fields` hold the Payload CMS configuration, `src/migrations` its migrations
- `supabase/`: database migrations, seed and pgTAP tests

## Contributing

Everything goes through a pull request to `main` (the production branch). PR titles follow [Conventional Commits](https://www.conventionalcommits.org/). Report security issues privately, see [SECURITY.md](.github/SECURITY.md).

## License

Code: [PolyForm Noncommercial 1.0.0](LICENSE). Content: [CC BY-NC-SA 4.0](LICENSE-CONTENT.md). Details in the project README, §10.
