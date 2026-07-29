export type Role = 'super_admin'|'branch_admin'|'branch_manager'|'sales_manager'|'agent'|'hr_manager'|'finance_manager'|'viewer';
export const roleLabels: Record<Role,string> = {
  super_admin:'Super Admin', branch_admin:'Branch Admin', branch_manager:'Branch Manager',
  sales_manager:'Sales Manager', agent:'Agent', hr_manager:'HR Manager',
  finance_manager:'Finance Manager', viewer:'Viewer'
};
export type EmployeeStatus='active'|'on_hold'|'on_leave'|'terminated'|'archived';
