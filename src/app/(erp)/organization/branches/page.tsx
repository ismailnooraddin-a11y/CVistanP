import PageShell from '@/components/page-shell';import SimpleCrud from '@/components/simple-crud';import {requireMembership} from '@/lib/auth';
export default async function Page(){const {membership}=await requireMembership();return <PageShell title="Branches" subtitle="Manage branches in your organization"><SimpleCrud kind="branches" branchId={membership.branch_id}/></PageShell>}
