import type { Role } from "@/types/domain";

export type Permission =
  | "view:dashboard"
  | "manage:leads"
  | "manage:customers"
  | "manage:properties"
  | "manage:communications"
  | "manage:contracts"
  | "manage:finance"
  | "manage:people"
  | "approve:leave"
  | "view:reports"
  | "manage:marketing"
  | "manage:settings"
  | "manage:subscription"
  | "view:audit";

const rolePermissions: Record<Role, Permission[]> = {
  owner: [
    "view:dashboard",
    "manage:leads",
    "manage:customers",
    "manage:properties",
    "manage:communications",
    "manage:contracts",
    "manage:finance",
    "manage:people",
    "approve:leave",
    "view:reports",
    "manage:marketing",
    "manage:settings",
    "manage:subscription",
    "view:audit"
  ],
  admin: [
    "view:dashboard",
    "manage:leads",
    "manage:customers",
    "manage:properties",
    "manage:communications",
    "manage:contracts",
    "manage:finance",
    "manage:people",
    "approve:leave",
    "view:reports",
    "manage:marketing",
    "manage:settings",
    "view:audit"
  ],
  manager: [
    "view:dashboard",
    "manage:leads",
    "manage:customers",
    "manage:properties",
    "manage:communications",
    "manage:contracts",
    "approve:leave",
    "view:reports",
    "manage:marketing"
  ],
  agent: [
    "view:dashboard",
    "manage:leads",
    "manage:customers",
    "manage:properties",
    "manage:communications",
    "manage:contracts"
  ],
  finance: ["view:dashboard", "manage:contracts", "manage:finance", "view:reports"],
  people: ["view:dashboard", "manage:people", "approve:leave", "view:reports"],
  marketing: ["view:dashboard", "manage:leads", "manage:marketing", "view:reports"],
  viewer: ["view:dashboard", "view:reports"]
};

export function can(role: Role, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}

export function permissionsFor(role: Role): Permission[] {
  return [...rolePermissions[role]];
}
