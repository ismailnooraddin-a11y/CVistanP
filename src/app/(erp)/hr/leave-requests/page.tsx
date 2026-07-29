import PageShell from '@/components/page-shell';import LeaveManager from '@/components/leave-manager';import {requireMembership} from '@/lib/auth';
export default async function Page(){const {membership}=await requireMembership();return <PageShell title="Leave Requests" subtitle="Request and approve employee leave"><LeaveManager branchId={membership.branch_id}/></PageShell>}
