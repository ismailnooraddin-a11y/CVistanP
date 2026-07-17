# Data Model and Tenant Safety

## Purpose

`supabase/migrations/0001_core.sql` is a production-oriented PostgreSQL/Supabase starting point for EstateFlow Pro. It is intentionally broader than the browser demo and covers the major commercial domains needed to connect the interface to persistent services.

## Domain groups

| Domain | Principal tables |
|---|---|
| SaaS platform | `tenants`, `tenant_memberships`, `subscriptions`, `tenant_entitlements` |
| Organization & People | `branches`, `departments`, `employees`, `leave_requests`, `attendance_entries`, `employee_assets`, `onboarding_tasks` |
| CRM & Sales | `customers`, `leads`, `tasks`, `viewings`, `reservations` |
| Property inventory | `projects`, `project_units`, `properties`, `listing_publications`, `maintenance_requests` |
| Communications | `conversations`, `messages`, `notifications` |
| Operations | `contracts`, `documents`, `inspections`, `handovers` |
| Finance | `invoices`, `payments`, `installments`, `expenses`, `commissions` |
| Marketing | `campaigns` |
| Platform operations | `integration_connections`, `workflow_definitions`, `audit_events` |

## Tenant isolation

Every customer-owned table includes `tenant_id`. Relationships between tenant-owned records use composite foreign keys such as `(tenant_id, property_id)`, preventing a record from referencing an entity belonging to another tenant even when application code is defective.

Row-level security uses authenticated tenant memberships as the mandatory isolation boundary. Direct authenticated table access is read-only, except that a user may mark their own notifications as read. Tenant creation, domain mutations, and audit insertion are intended to be trusted server operations. Application APIs must still check:

```text
active user session
+ active tenant membership
+ purchased entitlement
+ role permission
+ own/team/branch/company scope
+ domain validation
```

The browser must never be allowed to choose a trusted tenant context without server verification.

## Money

Financial amounts use integer minor units (`*_minor`) rather than floating-point values. For USD, `125000` represents USD 1,250.00. IQD configuration must define whether the business treats the currency as zero-decimal or uses an internal subunit policy. That policy should be centralized and reviewed with local accounting specialists.

## Files

The `documents` table stores metadata and an object-storage key, not file bytes. Production storage should use:

- tenant-prefixed object keys;
- signed uploads and downloads;
- content-type and size validation;
- malware scanning before availability;
- encryption at rest;
- immutable access logs for sensitive documents.

## Audit integrity

`audit_events` is append-only for normal application users. Database triggers reject updates and deletes, and authenticated clients are not granted write access. A trusted server process should write events after successful domain transactions.

## Migration workflow

Use versioned, reviewed migrations and separate databases for development, staging, and production. Prefer backward-compatible expand/migrate/contract changes:

1. Add new nullable columns or tables.
2. Deploy code that writes both old and new structures where necessary.
3. Backfill and validate.
4. Switch reads.
5. Remove obsolete structures in a later release.

Do not edit a migration after it has been applied to a shared environment.

## Mutation boundary

The migration deliberately does not grant browser clients direct insert, update, or delete access to business tables. Production mutations should pass through reviewed server-side domain services (or narrowly scoped database RPC functions) that derive the tenant from the authenticated membership, enforce permissions and entitlements, validate inputs, and write audit events in the same transaction. A service-role credential must never be exposed to the browser.
