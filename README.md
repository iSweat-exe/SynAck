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

### Local database

Requires Docker and the [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started).

```bash
npm run db:start   # start local Supabase (applies supabase/migrations, then seed.sql)
npm run db:test    # run the pgTAP tests in supabase/tests
npm run db:reset   # rebuild the local database from scratch
npm run db:stop
```

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
- `supabase/`: database migrations (to be created)

## Contributing

Everything goes through a pull request to `main` (the production branch). PR titles follow [Conventional Commits](https://www.conventionalcommits.org/). Report security issues privately, see [SECURITY.md](.github/SECURITY.md).

## License

Code: [PolyForm Noncommercial 1.0.0](LICENSE). Content: [CC BY-NC-SA 4.0](LICENSE-CONTENT.md). Details in the project README, §10.
