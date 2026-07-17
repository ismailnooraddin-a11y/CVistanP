import { describe, expect, it } from "vitest";
import { createSeedState } from "@/lib/seed";
import { assertTenantAccess, forTenant, tenantSnapshot } from "@/lib/tenancy";

 describe("tenant isolation", () => {
  const state = createSeedState();

  it("filters every scoped collection to the active tenant", () => {
    const snapshot = tenantSnapshot(state, "tenant-northstar");
    const scopedCollections = [
      snapshot.users,
      snapshot.branches,
      snapshot.departments,
      snapshot.employees,
      snapshot.leaveRequests,
      snapshot.leads,
      snapshot.customers,
      snapshot.properties,
      snapshot.tasks,
      snapshot.viewings,
      snapshot.reservations,
      snapshot.contracts,
      snapshot.invoices,
      snapshot.payments,
      snapshot.commissions,
      snapshot.conversations,
      snapshot.messages,
      snapshot.campaigns,
      snapshot.notifications,
      snapshot.auditEvents
    ];

    for (const collection of scopedCollections) {
      expect(collection.every((item) => item.tenantId === "tenant-northstar")).toBe(true);
    }
  });

  it("does not leak records from a second workspace", () => {
    const northstar = forTenant(state.properties, "tenant-northstar");
    const cedar = forTenant(state.properties, "tenant-cedar");
    expect(northstar.length).toBeGreaterThan(0);
    expect(cedar.length).toBeGreaterThan(0);
    expect(northstar.some((item) => cedar.some((other) => other.id === item.id))).toBe(false);
  });

  it("rejects cross-tenant record access", () => {
    const cedarProperty = state.properties.find((item) => item.tenantId === "tenant-cedar");
    expect(cedarProperty).toBeDefined();
    expect(() => assertTenantAccess(cedarProperty!, "tenant-northstar")).toThrow("Tenant isolation violation");
  });
});
