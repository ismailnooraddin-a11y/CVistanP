import { describe, expect, it } from "vitest";
import { can, permissionsFor } from "@/lib/permissions";
import { ALL_MODULES, hasModule, PLANS } from "@/lib/plans";
import { createSeedState } from "@/lib/seed";
import { assertTenantAccess, forTenant, tenantSnapshot } from "@/lib/tenancy";

describe("authorization and plan entitlements", () => {
  it("keeps subscription billing changes owner-only", () => {
    expect(can("owner", "manage:subscription")).toBe(true);
    expect(can("admin", "manage:subscription")).toBe(false);
    expect(can("agent", "manage:finance")).toBe(false);
  });

  it("returns defensive permission arrays", () => {
    const ownerPermissions = permissionsFor("owner");
    ownerPermissions.pop();
    expect(permissionsFor("owner").length).toBeGreaterThan(ownerPermissions.length);
  });

  it("ships all modules in enterprise and gates AI elsewhere", () => {
    expect(PLANS.enterprise.modules).toEqual(ALL_MODULES);
    expect(hasModule("enterprise", "ai")).toBe(true);
    expect(hasModule("professional", "ai")).toBe(false);
    expect(hasModule("starter", "communications")).toBe(false);
  });
});

describe("tenant isolation helpers", () => {
  const state = createSeedState();
  const [firstTenant, secondTenant] = state.tenants;

  it("filters collections by authenticated tenant", () => {
    expect(firstTenant).toBeDefined();
    const records = forTenant(state.leads, firstTenant!.id);
    expect(records.length).toBeGreaterThan(0);
    expect(records.every((record) => record.tenantId === firstTenant!.id)).toBe(true);
  });

  it("throws when a record crosses a tenant boundary", () => {
    expect(firstTenant).toBeDefined();
    expect(secondTenant).toBeDefined();
    const foreignRecord = state.users.find((user) => user.tenantId === secondTenant!.id);
    expect(foreignRecord).toBeDefined();
    expect(() => assertTenantAccess(foreignRecord!, firstTenant!.id)).toThrow("Tenant isolation violation");
  });

  it("creates a tenant-scoped snapshot", () => {
    expect(firstTenant).toBeDefined();
    const snapshot = tenantSnapshot(state, firstTenant!.id);
    expect(snapshot.properties.every((property) => property.tenantId === firstTenant!.id)).toBe(true);
    expect(snapshot.employees.every((employee) => employee.tenantId === firstTenant!.id)).toBe(true);
  });
});
