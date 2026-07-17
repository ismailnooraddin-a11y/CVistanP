# Production Readiness Checklist

The repository is immediately deployable as a complete interactive SaaS product demonstration. The items below are mandatory before processing real customer, financial, identity, or employee data.

## Identity and access

- Replace simulated sign-in with a production identity provider.
- Require email verification and MFA for privileged users.
- Add invitation, suspension, recovery, and device/session management.
- Enforce server-side role and record-scope checks.
- Add enterprise SSO and SCIM only after the core identity model is stable.

## Data and tenancy

- Connect PostgreSQL.
- Apply the supplied migration or an equivalent reviewed schema.
- Enable and test row-level security.
- Add database constraints, indexes, migrations, and rollback procedures.
- Create automated cross-tenant isolation tests.
- Define retention, export, and deletion policies.

## Files and documents

- Store media in tenant-prefixed object storage.
- Use signed uploads/downloads.
- Scan uploads for malware.
- Validate MIME type, extension, and file size.
- Generate thumbnails asynchronously.
- Track versions, access, download events, and retention.

## Workflows and integrations

- Add a durable queue for notifications, PDF generation, portal sync, AI extraction, and scheduled jobs.
- Validate webhook signatures.
- Make jobs idempotent.
- Add retries, backoff, dead-letter queues, and replay tooling.
- Keep tenant credentials encrypted and separated.

## Finance

- Use integer minor units or a decimal library for money.
- Never use browser-calculated totals as the accounting source of truth.
- Add immutable payment and ledger events.
- Reconcile payment provider webhooks server-side.
- Obtain local tax and accounting review for every supported country.

## People data

- Restrict salary, identification, medical, and emergency-contact fields separately.
- Define lawful retention and employee access policies.
- Audit profile/document views and exports.
- Configure country-specific leave and employment rules rather than hard-coding one jurisdiction.

## AI

- Call models from the server only.
- Filter context by tenant, role, and record scope before model access.
- Redact secrets and highly sensitive fields.
- Add user-visible AI disclosures and confirmation for consequential actions.
- Log model, prompt category, data classes, token usage, result, and actor.
- Add quotas, cost controls, abuse monitoring, and provider fallback.

## Reliability

- Separate development, staging, and production.
- Add centralized logs, traces, metrics, and error tracking.
- Define service-level objectives and alert thresholds.
- Automate encrypted backups.
- Perform recurring restore tests.
- Document incident response, customer communication, and rollback.

## Security validation

- Run static analysis and secret scanning in CI.
- Enable automated dependency update pull requests.
- Perform threat modeling for tenant isolation, document access, integrations, and support impersonation.
- Commission an independent penetration test before launch.
- Add a strict Content Security Policy once external origins are finalized.
- Review privacy notices, data processing agreements, terms, and cookie behavior with counsel.

## Commercial SaaS controls

- Connect subscription checkout and webhook-driven entitlements.
- Handle trials, upgrades, downgrades, grace periods, payment failure, and cancellation.
- Meter users, storage, messages, portal listings, and AI credits server-side.
- Build an internal support console with time-bound, reason-coded, audited impersonation.
