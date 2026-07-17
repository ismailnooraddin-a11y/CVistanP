# EstateFlow Pro 1.0.0 Release Notes

Release date: **17 July 2026**

## What this release delivers

EstateFlow Pro 1.0.0 is a single-repository real estate SaaS workspace designed for small, medium, and multi-branch agencies. It launches immediately in demo mode and presents a coherent operational experience across sales, properties, communications, contracts, finance, people, growth, intelligence, and administration.

## Product highlights

- 48 routed workspace screens plus a dedicated sign-in experience
- Multi-company workspace switching with tenant-scoped demo data
- Role preview and permission-aware actions
- Starter, Professional, and Enterprise entitlement bundles
- Responsive desktop and mobile application shell
- Search, notifications, theme control, profile tools, import/export, and workspace reset
- Interactive lead, property, communication, task, leave, invoice, employee, and plan workflows
- Executive reporting and permission-aware AI Copilot experience
- Organization chart, branches, departments, employees, leave, attendance, onboarding, and asset registers
- Browser-local persistence for immediate product review without infrastructure secrets

## Engineering baseline

- Next.js 16 App Router
- React 19 and strict TypeScript
- pnpm 10.14.0 with a committed frozen lockfile
- ESLint, Vitest, style-reference validation, and GitHub Actions CI
- Vercel configuration that explicitly uses pnpm, avoiding fallback to npm installation
- Multi-stage Docker image
- Health endpoint and transport/browser security headers
- PostgreSQL/Supabase migration with tenant-aware relationships and row-level security
- Architecture, deployment, security, data-model, validation, and production-readiness documentation

## Deployment modes

### Immediate review mode

No environment variables are required. Import the repository into Vercel and deploy. The application uses seeded browser-local demo data.

### Live production mode

Provision and connect the production services described in `PRODUCTION-READINESS.md`. The supplied SQL migration is a foundation, but the current UI intentionally does not pretend that demo authentication or browser persistence is a secure live-data backend.

## Known product boundary

External providers—WhatsApp, email, payments, maps, listing portals, e-signature, object storage, identity, and AI—are represented as product-ready workspaces and adapter boundaries. Credentials and vendor-specific implementations are deliberately not embedded in the repository.
