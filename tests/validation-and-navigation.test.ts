import { describe, expect, it } from "vitest";
import { navigation, routeMeta } from "@/lib/navigation";
import { daysBetween, isEmail, isPhone, validateRequired } from "@/lib/validation";

describe("input validation", () => {
  it("identifies missing required values", () => {
    const result = validateRequired({ name: "", phone: "+964 750 000 0000" }, ["name", "phone"]);
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBe("This field is required.");
    expect(result.errors.phone).toBeUndefined();
  });

  it("validates common email and phone formats", () => {
    expect(isEmail("agent@example.com")).toBe(true);
    expect(isEmail("invalid-email")).toBe(false);
    expect(isPhone("+964 750 123 4567")).toBe(true);
    expect(isPhone("abc")).toBe(false);
  });

  it("counts inclusive leave days and rejects invalid ranges", () => {
    expect(daysBetween("2026-07-20", "2026-07-24")).toBe(5);
    expect(daysBetween("2026-07-24", "2026-07-20")).toBe(0);
  });
});

describe("application navigation", () => {
  it("has unique routes and route metadata for every navigation item", () => {
    const routes = navigation.flatMap((section) => section.items.map((item) => item.href));
    expect(new Set(routes).size).toBe(routes.length);
    expect(routes.every((route) => routeMeta.has(route))).toBe(true);
  });

  it("contains all top-level operating areas", () => {
    const labels = navigation.map((section) => section.label);
    expect(labels).toEqual(expect.arrayContaining(["Sales", "Properties", "Organization & People", "Administration"]));
  });
});
