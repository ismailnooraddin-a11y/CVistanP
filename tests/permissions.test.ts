import { describe, expect, it } from "vitest";
import { can, permissionsFor } from "@/lib/permissions";

 describe("role permissions", () => {
  it("gives the owner every platform permission", () => {
    expect(can("owner", "manage:subscription")).toBe(true);
    expect(can("owner", "manage:finance")).toBe(true);
    expect(can("owner", "view:audit")).toBe(true);
  });

  it("keeps sensitive permissions away from sales agents", () => {
    expect(can("agent", "manage:leads")).toBe(true);
    expect(can("agent", "manage:finance")).toBe(false);
    expect(can("agent", "manage:people")).toBe(false);
    expect(can("agent", "manage:subscription")).toBe(false);
  });

  it("returns defensive permission copies", () => {
    const first = permissionsFor("manager");
    first.length = 0;
    expect(permissionsFor("manager").length).toBeGreaterThan(0);
  });
});
