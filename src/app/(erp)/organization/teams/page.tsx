import PageShell from '@/components/page-shell';import SimpleCrud from '@/components/simple-crud';import {requireMembership} from '@/lib/auth';
export default async function Page(){const {membership}=await requireMembership();return <PageShell title="Teams" subtitle="Manage teams in your organization"><SimpleCrud kind="teams" branchId={membership.branch_id}/></PageShell>}
