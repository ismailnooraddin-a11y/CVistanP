import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const migration = readFileSync(join(process.cwd(), "supabase/migrations/0001_core.sql"), "utf8");

const tenantOwnedTables = [
  "tenant_memberships",
  "branches",
  "departments",
  "employees",
  "employee_private_profiles",
  "leave_requests",
  "customers",
  "leads",
  "projects",
  "properties",
  "project_units",
  "conversations",
  "messages",
  "contracts",
  "documents",
  "invoices",
  "payments",
  "commissions",
  "campaigns",
  "audit_events"
];

describe("production database foundation", () => {
  it("tenant-scopes every principal business table", () => {
    for (const table of tenantOwnedTables) {
      const tablePattern = new RegExp(
        `create table public\\.${table} \\([\\s\\S]*?tenant_id uuid not null`,
        "i"
      );
      expect(migration, `${table} must have a required tenant_id`).toMatch(tablePattern);
    }
  });

  it("enables row-level security and membership-based isolation", () => {
    expect(migration).toContain("create or replace function public.is_tenant_member");
    expect(migration).toContain("alter table public.tenants enable row level security");
    expect(migration).toContain("public.is_tenant_member(tenant_id)");
    expect(migration).toContain("revoke all on all tables in schema public from anon, authenticated");
  });

  it("keeps browser mutations server-mediated", () => {
    expect(migration).toContain("grant select on all tables in schema public to authenticated");
    expect(migration).not.toContain("grant insert, update, delete on all tables");
    expect(migration).toContain("grant update (read_at) on public.notifications to authenticated");
  });

  it("uses integer minor units for money and idempotent payment events", () => {
    expect(migration).toContain("amount_minor bigint");
    expect(migration).toContain("price_minor bigint");
    expect(migration).toContain("idempotency_key text not null");
    expect(migration).toContain("unique (tenant_id, idempotency_key)");
  });

  it("separates private employee information from the public directory", () => {
    expect(migration).toContain("create table public.employee_private_profiles");
    expect(migration).toContain("employee_private_profiles_authorized_read");
    expect(migration).toContain("or employee_id = public.current_employee_id(tenant_id)");
  });

  it("makes the audit stream immutable to normal clients", () => {
    expect(migration).toContain("audit events are immutable");
    expect(migration).toContain("audit_events_immutable_update");
    expect(migration).toContain("audit_events_immutable_delete");
    expect(migration).toContain("revoke insert, update, delete on public.audit_events from authenticated");
  });
});
