import type { ModuleKey, Plan, PlanId } from "@/types/domain";

export const ALL_MODULES: ModuleKey[] = [
  "dashboard",
  "crm",
  "properties",
  "communications",
  "operations",
  "finance",
  "people",
  "marketing",
  "reports",
  "ai",
  "administration"
];

export const PLANS: Record<PlanId, Plan> = {
  starter: {
    id: "starter",
    name: "Starter",
    description: "Essential CRM and property operations for a small agency.",
    monthlyPrice: 69,
    maxUsers: 5,
    maxProperties: 500,
    storageGb: 10,
    modules: ["dashboard", "crm", "properties", "operations", "reports", "administration"]
  },
  professional: {
    id: "professional",
    name: "Professional",
    description: "Complete sales, communications, finance, and people operations.",
    monthlyPrice: 249,
    maxUsers: 30,
    maxProperties: 5000,
    storageGb: 100,
    modules: [
      "dashboard",
      "crm",
      "properties",
      "communications",
      "operations",
      "finance",
      "people",
      "marketing",
      "reports",
      "administration"
    ]
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    description: "Unlimited scale, AI, advanced controls, and premium operations.",
    monthlyPrice: 699,
    maxUsers: 9999,
    maxProperties: 999999,
    storageGb: 1000,
    modules: ALL_MODULES
  }
};

export function hasModule(planId: PlanId, module: ModuleKey): boolean {
  return PLANS[planId].modules.includes(module);
}
