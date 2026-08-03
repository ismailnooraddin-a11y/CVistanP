import {
  LayoutDashboard,
  ContactRound,
  Building2,
  Handshake,
  CalendarDays,
  ListTodo,
  FileText,
  DollarSign,
  Network,
  UsersRound,
  UserRoundCog,
  GitBranch,
  FolderHeart,
  CalendarClock,
  Files,
  Settings,
} from 'lucide-react';

export const nav = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Contacts', href: '/contacts', icon: ContactRound },
  { label: 'Properties', href: '/properties', icon: Building2 },
  { label: 'Deals', href: '/deals', icon: Handshake },
  { label: 'Meetings', href: '/meetings', icon: CalendarDays },
  { label: 'Tasks', href: '/tasks', icon: ListTodo },
  { label: 'Contracts', href: '/contracts', icon: FileText },
  { label: 'Finance', href: '#', icon: DollarSign, disabled: true, badge: 'Later' },
  {
    label: 'Organization', icon: Network, children: [
      { label: 'Branches', href: '/organization/branches', icon: GitBranch },
      { label: 'Teams', href: '/organization/teams', icon: UsersRound },
      { label: 'Employees', href: '/organization/employees', icon: UserRoundCog },
    ],
  },
  {
    label: 'HR', icon: FolderHeart, children: [
      { label: 'Leave Balances', href: '/hr/leave-balances', icon: CalendarClock },
      { label: 'Leave Requests', href: '/hr/leave-requests', icon: CalendarDays },
      { label: 'Documents', href: '/hr/documents', icon: Files },
    ],
  },
  { label: 'Company Settings', href: '/settings/company', icon: Settings },
];
