import { describe, expect, it } from "vitest";
import { averagePropertyPrice, leadConversionRate, leadStageCounts, propertyInventoryValue } from "@/lib/analytics";
import type { Lead, Property } from "@/types/domain";

const lead = (stage: Lead["stage"]): Lead => ({
  id: `lead-${stage}`,
  tenantId: "tenant-1",
  name: "Test Lead",
  phone: "+9647500000000",
  source: "Referral",
  budget: 100000,
  currency: "USD",
  interest: "Apartment",
  stage,
  score: 80,
  assignedTo: "employee-1",
  createdAt: "2026-07-01T00:00:00Z",
  lastActivityAt: "2026-07-01T00:00:00Z"
});

const property = (price: number, status: Property["status"]): Property => ({
  id: `${status}-${price}`,
  tenantId: "tenant-1",
  reference: "EF-1",
  title: "Test property",
  type: "apartment",
  purpose: "sale",
  city: "Erbil",
  area: "English Village",
  address: "Test street",
  price,
  currency: "USD",
  bedrooms: 2,
  bathrooms: 2,
  sizeSqm: 130,
  status,
  ownerName: "Owner",
  assignedTo: "employee-1",
  createdAt: "2026-07-01T00:00:00Z",
  mapX: 50,
  mapY: 50
});

describe("business analytics", () => {
  it("calculates lead conversion with one decimal place", () => {
    expect(leadConversionRate([lead("won"), lead("new"), lead("lost")])).toBe(33.3);
    expect(leadConversionRate([])).toBe(0);
  });

  it("counts every pipeline stage", () => {
    const counts = leadStageCounts([lead("new"), lead("new"), lead("viewing"), lead("won")]);
    expect(counts.new).toBe(2);
    expect(counts.viewing).toBe(1);
    expect(counts.won).toBe(1);
    expect(counts.negotiation).toBe(0);
  });

  it("excludes sold and off-market inventory from active value", () => {
    const properties = [property(100000, "available"), property(80000, "reserved"), property(300000, "sold"), property(40000, "off-market")];
    expect(propertyInventoryValue(properties)).toBe(180000);
    expect(averagePropertyPrice(properties)).toBe(130000);
  });
});
