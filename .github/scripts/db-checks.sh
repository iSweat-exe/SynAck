#!/usr/bin/env bash
# Checks run against the local Supabase database after migrations are applied.
# Used by the "DB migrations" job in .github/workflows/ci.yml (and runnable locally after `supabase start`).
set -euo pipefail

DB_URL="${DB_URL:-postgresql://postgres:postgres@127.0.0.1:54322/postgres}"

echo "::group::Migration status"
supabase migration list --db-url "$DB_URL"
echo "::endgroup::"

echo "::group::Database linter"
supabase db lint --db-url "$DB_URL" --level warning --fail-on error
echo "::endgroup::"

echo "::group::RLS enabled on every public table"
missing=$(psql "$DB_URL" -v ON_ERROR_STOP=1 -At -c "
  select format('%I.%I', n.nspname, c.relname)
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relkind in ('r', 'p')
    and not c.relrowsecurity
  order by 1;
")
if [ -n "$missing" ]; then
  echo "::error::Row Level Security is not enabled on these tables:"
  echo "$missing"
  exit 1
fi
echo "OK"
echo "::endgroup::"

if [ -d supabase/tests ]; then
  echo "::group::pgTAP tests"
  supabase test db --db-url "$DB_URL"
  echo "::endgroup::"
else
  echo "No supabase/tests directory: pgTAP tests skipped."
fi
