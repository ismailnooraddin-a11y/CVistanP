import { describe, expect, it } from "vitest";
import { daysBetween, isEmail, isPhone, validateRequired } from "@/lib/validation";

 describe("input validation", () => {
  it("reports required fields without rejecting valid zero values", () => {
    const result = validateRequired({ name: "", amount: 0, city: "Erbil" }, ["name", "amount", "city"]);
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual({ name: "This field is required." });
  });

  it("validates common contact formats", () => {
    expect(isEmail("agent@example.com")).toBe(true);
    expect(isEmail("not-an-email")).toBe(false);
    expect(isPhone("+964 750 123 4567")).toBe(true);
    expect(isPhone("abc")).toBe(false);
  });

  it("counts inclusive leave days and rejects reversed dates", () => {
    expect(daysBetween("2026-07-17", "2026-07-19")).toBe(3);
    expect(daysBetween("2026-07-19", "2026-07-17")).toBe(0);
    expect(daysBetween("invalid", "2026-07-17")).toBe(0);
  });
});
