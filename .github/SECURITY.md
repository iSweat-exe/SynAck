# Security policy

## Reporting a vulnerability

**Do not open a public issue** for a security flaw.

Use GitHub's private reporting: **Security → Report a vulnerability** tab of this repository. Describe what you observed, how to reproduce it and the estimated impact.

We acknowledge receipt within a few days and keep you informed about the fix. SynAck is a free, non-commercial project with no bounty program.

## Scope

- The SynAck site and API, the Payload back office, the Supabase access policies (RLS), the CI/CD pipeline.
- Exercise code runs only in the user's browser (Web Worker / Pyodide); an escape from this sandbox is in scope.

## Out of scope

- Load or denial-of-service testing, social engineering, physical attacks.
- Flaws in third-party services (Vercel, Supabase, GitHub): report them directly to the vendor.
