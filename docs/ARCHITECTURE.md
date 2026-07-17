# EstateFlow Pro Architecture

## Architectural goal

EstateFlow is designed as one modular SaaS product, not separate Basic, Professional, and AI codebases. Plans are entitlement bundles over a shared application and domain model.

```text
Browser / PWA
    │
    ▼
Next.js application shell
    ├── Route and module guard
    ├── Role and permission guard
    ├── Feature workspaces
    └── Command/search experience
    │
    ▼
Service boundary
    ├── Identity and tenant context
    ├── Domain services
    ├── Workflow/event processing
    ├── Integrations
    └── AI gateway
    │
    ▼
PostgreSQL + object storage + queue + cache
```

The repository runs in `demo` data mode by default. The browser state layer mirrors the future service boundaries so the UI can be connected incrementally rather than rewritten.

## Technical domains

1. Platform Core
2. Identity & Access
3. CRM & Sales
4. Property Inventory
5. Communications
6. Contracts & Operations
7. Finance & Commissions
8. Organization & People
9. Marketing
10. Analytics
11. AI & Integrations
12. SaaS Administration

## Multi-tenancy

Every business record carries a `tenantId`. The helper layer filters all workspace collections by the authenticated tenant and includes an assertion utility that fails closed on cross-tenant access.

In production, isolation must also be enforced server-side:

- Resolve the tenant from the authenticated membership, never from an untrusted request body.
- Include `tenant_id` in every tenant-owned table, index, storage path, cache key, job payload, and audit event.
- Apply PostgreSQL row-level security or an equivalent mandatory repository filter.
- Test negative cross-tenant access at API and database levels.
- Use dedicated databases or schemas for enterprise customers that require physical isolation.

An optional RLS-enabled PostgreSQL foundation is provided in `supabase/migrations/0001_core.sql`.

## Roles and permissions

Plans answer **which modules the company owns**. Roles answer **what a user can do inside those modules**.

The demo includes:

- Owner
- Administrator
- Manager
- Sales Agent
- Finance
- People Operations
- Marketing
- Viewer

Production authorization should combine:

```text
Authenticated user
+ active tenant membership
+ role permission
+ record scope (own/team/branch/company)
+ module entitlement
+ business-rule validation
```

UI visibility is never a security boundary. API handlers and database access must repeat the authorization check.

## Plans and entitlements

The plan catalog is defined in `src/lib/plans.ts`.

- Starter: CRM, properties, core operations, reports, administration
- Professional: full operations, communications, finance, people, marketing
- Enterprise: all modules, including AI

Internally, modules are stable entitlement keys such as `communications`, `people`, and `ai`. Plan labels can change without scattering billing logic throughout the application.

## State and data strategy

### Demo mode

- Seeded typed records
- Tenant switching
- Role preview
- Browser-local persistence
- Export/import/reset
- No sensitive information leaves the browser

### Production mode

Recommended boundaries:

- Identity: managed OIDC/SAML provider or Supabase/Auth.js/Clerk
- Database: PostgreSQL
- Object storage: S3-compatible or Azure Blob
- Cache/rate limits: Redis
- Background jobs: managed queue and idempotent workers
- Search: PostgreSQL full text initially; dedicated search service at scale
- Observability: structured logs, traces, metrics, error tracking
- Billing: Stripe or region-appropriate subscription provider
- AI: private server-side gateway with redaction, permission filtering, quotas, and audit logging

## Event-driven workflows

Business actions should publish durable events, for example:

- `lead.created`
- `lead.stage.changed`
- `property.status.changed`
- `reservation.expiring`
- `leave.submitted`
- `leave.approved`
- `contract.signed`
- `invoice.overdue`
- `message.received`

Workers can then send notifications, update external portals, generate PDFs, or trigger approvals without slowing the user request.

## Integration boundaries

All external services should be accessed through server-side adapters:

- WhatsApp Cloud API
- Email providers
- Maps and geocoding
- Payment gateways
- Accounting systems
- E-signature providers
- Listing portals
- AI model providers

Adapters need retry policies, idempotency keys, webhook signature validation, rate limits, dead-letter handling, and tenant-specific credentials.

## Security baseline

The current Next.js layer applies transport and browser security headers, strict TypeScript, entitlement guards, role simulation, audit-domain modeling, and tenant-aware data helpers.

Production security additionally requires:

- Real authentication, MFA, session rotation, and recovery controls
- Server-side authorization
- RLS or equivalent mandatory tenant filtering
- Secret management
- CSRF strategy for cookie-authenticated mutations
- Input schemas at every API boundary
- File scanning and signed URLs
- Encryption at rest
- Backup and restore tests
- Dependency monitoring
- Centralized audit retention
- Security review and penetration testing
