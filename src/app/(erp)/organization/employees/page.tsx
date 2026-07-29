import PageShell from '@/components/page-shell';import SimpleCrud from '@/components/simple-crud';import {requireMembership} from '@/lib/auth';
export default async function Page(){const {membership}=await requireMembership();return <PageShell title="Employees" subtitle="Manage employees in your organization"><SimpleCrud kind="employees" branchId={membership.branch_id}/></PageShell>}
