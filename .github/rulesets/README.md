# GitHub rulesets

To import via *Settings → Rules → Rulesets → New ruleset → Import a ruleset*. Everything targets `main` (`~DEFAULT_BRANCH`), the production branch.

| File | Role |
|---|---|
| `main-protection.json` | No deletion or force-push, linear history, **mandatory PR** (squash only, conversations resolved, 0 required approvals since it is a one-person team) |
| `main-required-checks.json` | Merging is blocked without the **CI gate**, **PR title** and **Secret scan (gitleaks)** checks, and the branch must be up to date with `main` |

`CI gate` aggregates every CI job, including **DB migrations** (migration tests) when a PR touches `supabase/`. The two rulesets are separate so the checks can be set to *Evaluate* or *Disabled* independently of the PR rules (useful during bootstrap).

## Recommended order

1. Push the first commit to `main` (before importing: a protected branch refuses direct pushes).
2. Import `main-protection.json`.
3. Open a first PR containing `.github/`: the workflows run and the checks appear.
4. Import `main-required-checks.json` once the three checks have been seen at least once (they are then offered in the UI).

## Notes

- **Bypass**: the *Repository admin* role (`actor_id: 5`) can bypass **only through a PR** (`pull_request`), never by direct push. To remove any bypass, empty `bypass_actors`.
- Check names match the `name:` field of the jobs in `.github/workflows/`; renaming one requires updating this file.
- To also require CodeQL results, add a `code_scanning` rule once the analysis is active (needs JS/TS code).
- To require a review, set `required_approving_review_count` to `1` (and add a second reviewer, otherwise the author cannot merge their own PR).
- If the import reports an unknown parameter after a GitHub change, recreate the rule in the UI then use *Export ruleset* to get the up-to-date format.
