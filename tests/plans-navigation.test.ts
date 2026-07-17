import { describe, expect, it } from "vitest";
import { navigation } from "@/lib/navigation";
import { ALL_MODULES, PLANS, hasModule } from "@/lib/plans";

 describe("plans and navigation", () => {
  it("keeps route paths unique", () => {
    const paths = navigation.flatMap((section) => section.items.map((item) => item.href));
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("includes every module in enterprise", () => {
    expect(new Set(PLANS.enterprise.modules)).toEqual(new Set(ALL_MODULES));
    expect(hasModule("enterprise", "ai")).toBe(true);
    expect(hasModule("professional", "ai")).toBe(false);
  });

  it("makes administration available for subscription management on every plan", () => {
    expect(hasModule("starter", "administration")).toBe(true);
    expect(hasModule("professional", "administration")).toBe(true);
    expect(hasModule("enterprise", "administration")).toBe(true);
  });
});
