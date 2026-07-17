import type { Lead, LeadStage, Property } from "@/types/domain";

export function leadConversionRate(leads: Lead[]): number {
  if (leads.length === 0) return 0;
  const won = leads.filter((lead) => lead.stage === "won").length;
  return Math.round((won / leads.length) * 1000) / 10;
}

export function leadStageCounts(leads: Lead[]): Record<LeadStage, number> {
  const result: Record<LeadStage, number> = {
    new: 0,
    qualified: 0,
    viewing: 0,
    negotiation: 0,
    reserved: 0,
    won: 0,
    lost: 0
  };
  for (const lead of leads) result[lead.stage] += 1;
  return result;
}

export function propertyInventoryValue(properties: Property[]): number {
  return properties
    .filter((property) => property.status === "available" || property.status === "reserved")
    .reduce((sum, property) => sum + property.price, 0);
}

export function averagePropertyPrice(properties: Property[]): number {
  if (properties.length === 0) return 0;
  return Math.round(properties.reduce((sum, property) => sum + property.price, 0) / properties.length);
}
