## Summary

<!-- What and why, in 2-3 lines. The PR title follows the `type(scope): subject` format (e.g. `feat(cms): quiz block`). -->

Closes #

## Type of change

- [ ] Feature
- [ ] Bug fix
- [ ] Educational content
- [ ] Documentation / design
- [ ] Refactor / perf / maintenance
- [ ] Security

## Checks

- [ ] CI is green (`CI gate`)
- [ ] Tests added or updated (Vitest / Playwright / pgTAP) when logic changes
- [ ] No secret or personal data in the diff
- [ ] **Database**: versioned migration in `supabase/migrations/` (never edit an existing one), **RLS** enabled on every new table, new timestamp sorts after `main`'s latest, no migration applied by hand on production
- [ ] **Migration safety**: backward compatible with the previous app version (Vercel deploys in parallel); destructive SQL (`DROP`, `TRUNCATE`, `DELETE`) carries the `breaking-change` label and is justified below
- [ ] **Permissions**: every new sensitive action is checked server-side (`has_permission`)
- [ ] UI follows `.dev/Organisation/DESIGN.md` (Space Mono, color tokens, light and dark modes)
- [ ] Documentation / checklist (`.dev/Organisation/CHECKLIST.md`) updated if needed

## Screenshots / preview

<!-- Before/after screenshots for any visual change. Add the `preview` label to get a Vercel deployment. -->

## Notes for review

<!-- Points of attention, decisions made, planned follow-ups. Explain any destructive migration here. -->
