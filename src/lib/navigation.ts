import { Building2, ContactRound, FileText, Gauge, GitBranch, HandCoins, ListTodo, Network, UsersRound } from "lucide-react";

export const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: Gauge },
  { label: "Contacts", href: "/dashboard?module=contacts", icon: ContactRound },
  { label: "Properties", href: "/dashboard?module=properties", icon: Building2 },
  { label: "Pipeline", href: "/dashboard?module=pipeline", icon: GitBranch },
  { label: "Tasks", href: "/dashboard?module=tasks", icon: ListTodo },
  { label: "Contracts", href: "/dashboard?module=contracts", icon: FileText },
  { label: "Finance", href: "/dashboard?module=finance", icon: HandCoins },
  { label: "Organization", href: "/organization/branches", icon: Network },
  { label: "HR", href: "/hr/employees", icon: UsersRound },
];
