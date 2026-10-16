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

Checks run by CI: `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm test`, `npm run build`.

## Repository

- `.github/`: CI/CD workflows, labels, issue and PR templates, rulesets to import (see [rulesets/README.md](.github/rulesets/README.md))
- `docs/design/`: logo and UI kit images
- `src/`: the Next.js application (App Router)
- `supabase/`: database migrations (to be created)

## Contributing

Everything goes through a pull request to `main` (the production branch). PR titles follow [Conventional Commits](https://www.conventionalcommits.org/). Report security issues privately, see [SECURITY.md](.github/SECURITY.md).

## License

Code: [PolyForm Noncommercial 1.0.0](LICENSE). Content: [CC BY-NC-SA 4.0](LICENSE-CONTENT.md). Details in the project README, §10.
