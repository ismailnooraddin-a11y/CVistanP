# EstateFlow Pro 1.0.0 Release Manifest

Release date: **17 July 2026**

## Repository contents

- `app/` — Next.js routing, layout, global styles, and health endpoint
- `src/` — application shell, shared components, feature workspaces, typed domain model, permissions, tenancy, validation, analytics, and state
- `tests/` — 32 automated tests across 8 suites
- `supabase/migrations/0001_core.sql` — tenant-aware PostgreSQL/Supabase foundation
- `public/` — application metadata and icons
- `docs/` — architecture, data model, deployment, release, validation, and launch hardening guidance
- `.github/` — CI and automated dependency update configuration
- `Dockerfile` and `docker-compose.yml` — container deployment path
- `vercel.json` — pnpm-based Vercel installation and build configuration
- `pnpm-lock.yaml` — deterministic dependency graph

## Validated release properties

- Clean frozen pnpm installation
- Zero ESLint warnings
- Strict TypeScript pass
- Static CSS-reference pass
- 32/32 automated tests
- Optimized Next.js production build
- 49-route HTTP smoke test
- Seven critical browser workflow tests
- Desktop and mobile browser layout validation
- PostgreSQL migration parse validation
- Production dependency audit with zero known vulnerabilities
- Security-header verification
- No embedded production secrets or private keys

Detailed evidence is recorded in [`docs/VALIDATION_REPORT.md`](docs/VALIDATION_REPORT.md).

## Deployment boundary

This archive deploys immediately in zero-configuration demo mode. Live customer operation requires the production services and controls listed in [`docs/PRODUCTION-READINESS.md`](docs/PRODUCTION-READINESS.md).
