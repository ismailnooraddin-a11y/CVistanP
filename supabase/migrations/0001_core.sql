-- EstateFlow Pro core schema for Supabase/PostgreSQL
-- Apply with the Supabase CLI or through a reviewed migration pipeline.
-- This schema enforces tenant isolation with row-level security. Application
-- services must additionally enforce module entitlements, permissions, scope,
-- validation, rate limits, and workflow rules.

begin;

create extension if not exists pgcrypto;

create type public.estateflow_plan as enum ('starter', 'professional', 'enterprise');
create type public.estateflow_role as enum ('owner', 'admin', 'manager', 'agent', 'finance', 'people', 'marketing', 'viewer');
create type public.entity_status as enum ('active', 'inactive', 'archived');
create type public.lead_stage as enum ('new', 'qualified', 'viewing', 'negotiation', 'reserved', 'won', 'lost');
create type public.property_status as enum ('available', 'reserved', 'sold', 'off-market');
create type public.leave_status as enum ('pending', 'approved', 'rejected');
create type public.priority_level as enum ('low', 'medium', 'high', 'urgent');
create type public.money_currency as enum ('USD', 'IQD');
create type public.channel_type as enum ('whatsapp', 'email', 'sms');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  city text not null,
  country text not null,
  plan_id public.estateflow_plan not null default 'starter',
  accent text not null default '#5b5bd6',
  status public.entity_status not null default 'active',
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz,
  unique (id, plan_id)
);

create trigger tenants_set_updated_at
before update on public.tenants
for each row execute function public.set_updated_at();

create table public.tenant_memberships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  employee_id uuid,
  role public.estateflow_role not null default 'viewer',
  status public.entity_status not null default 'active',
  invited_by uuid references auth.users(id) on delete set null,
  joined_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, user_id),
  unique (tenant_id, id)
);

create trigger tenant_memberships_set_updated_at
before update on public.tenant_memberships
for each row execute function public.set_updated_at();

create or replace function public.is_tenant_member(target_tenant uuid)
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.tenant_memberships membership
    where membership.tenant_id = target_tenant
      and membership.user_id = auth.uid()
      and membership.status = 'active'
  );
$$;

create or replace function public.has_tenant_role(target_tenant uuid, allowed_roles public.estateflow_role[])
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.tenant_memberships membership
    where membership.tenant_id = target_tenant
      and membership.user_id = auth.uid()
      and membership.status = 'active'
      and membership.role = any(allowed_roles)
  );
$$;

create or replace function public.current_employee_id(target_tenant uuid)
returns uuid
language sql
stable
security definer
set search_path = public, auth
as $$
  select membership.employee_id
  from public.tenant_memberships membership
  where membership.tenant_id = target_tenant
    and membership.user_id = auth.uid()
    and membership.status = 'active'
  limit 1;
$$;

revoke all on function public.is_tenant_member(uuid) from public;
revoke all on function public.has_tenant_role(uuid, public.estateflow_role[]) from public;
revoke all on function public.current_employee_id(uuid) from public;
grant execute on function public.is_tenant_member(uuid) to authenticated;
grant execute on function public.has_tenant_role(uuid, public.estateflow_role[]) to authenticated;
grant execute on function public.current_employee_id(uuid) to authenticated;

create table public.branches (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  code text not null,
  city text not null,
  country text,
  address text not null default '',
  manager_employee_id uuid,
  phone text not null default '',
  email text,
  timezone text not null default 'Asia/Baghdad',
  status public.entity_status not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz,
  unique (tenant_id, id),
  unique (tenant_id, code)
);

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  branch_id uuid,
  name text not null,
  lead_employee_id uuid,
  status public.entity_status not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, id),
  unique (tenant_id, branch_id, name),
  foreign key (tenant_id, branch_id) references public.branches(tenant_id, id) on delete set null
);

create table public.employees (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  employee_number text not null,
  first_name text not null,
  last_name text not null,
  work_email text not null,
  phone text not null,
  job_title text not null,
  branch_id uuid not null,
  department_id uuid not null,
  manager_id uuid,
  employment_type text not null check (employment_type in ('full-time', 'part-time', 'contractor', 'intern')),
  contract_type text not null check (contract_type in ('permanent', 'fixed-term', 'commission-only')),
  start_date date not null,
  end_date date,
  status text not null default 'active' check (status in ('active', 'on-leave', 'inactive')),
  annual_leave_allowance numeric(6,2) not null default 0 check (annual_leave_allowance >= 0),
  annual_leave_used numeric(6,2) not null default 0 check (annual_leave_used >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz,
  unique (tenant_id, id),
  unique (tenant_id, employee_number),
  unique (tenant_id, work_email),
  foreign key (tenant_id, branch_id) references public.branches(tenant_id, id) on delete restrict,
  foreign key (tenant_id, department_id) references public.departments(tenant_id, id) on delete restrict,
  foreign key (tenant_id, manager_id) references public.employees(tenant_id, id) on delete set null,
  check (end_date is null or end_date >= start_date),
  check (annual_leave_used <= annual_leave_allowance + 365)
);

create table public.employee_private_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  employee_id uuid not null,
  personal_email text,
  personal_phone text,
  home_address jsonb not null default '{}'::jsonb,
  emergency_contact jsonb not null default '{}'::jsonb,
  identity_profile jsonb not null default '{}'::jsonb,
  compensation_minor bigint check (compensation_minor is null or compensation_minor >= 0),
  compensation_currency public.money_currency,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, id),
  unique (tenant_id, employee_id),
  foreign key (tenant_id, employee_id) references public.employees(tenant_id, id) on delete cascade
);

alter table public.branches
  add constraint branches_manager_same_tenant_fk
  foreign key (tenant_id, manager_employee_id)
  references public.employees(tenant_id, id)
  on delete set null;

alter table public.departments
  add constraint departments_lead_same_tenant_fk
  foreign key (tenant_id, lead_employee_id)
  references public.employees(tenant_id, id)
  on delete set null;

alter table public.tenant_memberships
  add constraint memberships_employee_same_tenant_fk
  foreign key (tenant_id, employee_id)
  references public.employees(tenant_id, id)
  on delete set null;

create table public.leave_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  employee_id uuid not null,
  leave_type text not null check (leave_type in ('annual', 'sick', 'unpaid', 'personal', 'business-trip')),
  start_date date not null,
  end_date date not null,
  days numeric(6,2) not null check (days > 0),
  reason text not null default '',
  status public.leave_status not null default 'pending',
  approver_employee_id uuid,
  decision_note text,
  submitted_at timestamptz not null default timezone('utc', now()),
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, id),
  foreign key (tenant_id, employee_id) references public.employees(tenant_id, id) on delete cascade,
  foreign key (tenant_id, approver_employee_id) references public.employees(tenant_id, id) on delete set null,
  check (end_date >= start_date),
  check ((status = 'pending' and reviewed_at is null) or status <> 'pending')
);

create table public.attendance_entries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  employee_id uuid not null,
  work_date date not null,
  check_in timestamptz,
  check_out timestamptz,
  status text not null check (status in ('present', 'absent', 'late', 'remote', 'leave', 'holiday')),
  source text not null default 'manual' check (source in ('manual', 'web', 'mobile', 'device', 'import')),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, id),
  unique (tenant_id, employee_id, work_date),
  foreign key (tenant_id, employee_id) references public.employees(tenant_id, id) on delete cascade,
  check (check_out is null or check_in is null or check_out >= check_in)
);

create table public.employee_assets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  employee_id uuid,
  asset_tag text not null,
  asset_type text not null,
  name text not null,
  serial_number text,
  assigned_at timestamptz,
  returned_at timestamptz,
  status text not null default 'available' check (status in ('available', 'assigned', 'repair', 'retired', 'lost')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, id),
  unique (tenant_id, asset_tag),
  foreign key (tenant_id, employee_id) references public.employees(tenant_id, id) on delete set null
);

create table public.onboarding_tasks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  employee_id uuid not null,
  title text not null,
  owner_employee_id uuid,
  due_date date,
  status text not null default 'open' check (status in ('open', 'in-progress', 'done', 'cancelled')),
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, id),
  foreign key (tenant_id, employee_id) references public.employees(tenant_id, id) on delete cascade,
  foreign key (tenant_id, owner_employee_id) references public.employees(tenant_id, id) on delete set null
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  phone text not null,
  email text,
  customer_type text not null check (customer_type in ('buyer', 'tenant', 'investor', 'owner', 'company')),
  preferred_language text not null default 'English' check (preferred_language in ('English', 'Arabic', 'Kurdish')),
  assigned_to_user_id uuid,
  status public.entity_status not null default 'active',
  tags text[] not null default '{}',
  profile jsonb not null default '{}'::jsonb,
  consent jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz,
  unique (tenant_id, id),
  foreign key (tenant_id, assigned_to_user_id) references public.tenant_memberships(tenant_id, user_id) on delete set null
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  customer_id uuid,
  name text not null,
  phone text not null,
  email text,
  source text not null,
  campaign_id uuid,
  budget_minor bigint not null default 0 check (budget_minor >= 0),
  currency public.money_currency not null default 'USD',
  interest text not null default '',
  stage public.lead_stage not null default 'new',
  score smallint not null default 0 check (score between 0 and 100),
  assigned_to_user_id uuid not null,
  next_follow_up_at timestamptz,
  lost_reason text,
  last_activity_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz,
  unique (tenant_id, id),
  foreign key (tenant_id, customer_id) references public.customers(tenant_id, id) on delete set null,
  foreign key (tenant_id, assigned_to_user_id) references public.tenant_memberships(tenant_id, user_id) on delete restrict
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  developer_name text,
  city text not null,
  area text not null default '',
  address text not null default '',
  status text not null default 'active' check (status in ('planning', 'active', 'completed', 'on-hold', 'archived')),
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz,
  unique (tenant_id, id)
);

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  project_id uuid,
  owner_customer_id uuid,
  reference text not null,
  title text not null,
  property_type text not null check (property_type in ('apartment', 'villa', 'office', 'land', 'retail')),
  purpose text not null check (purpose in ('sale', 'rent')),
  city text not null,
  area text not null,
  address text not null,
  price_minor bigint not null check (price_minor >= 0),
  currency public.money_currency not null default 'USD',
  bedrooms smallint not null default 0 check (bedrooms >= 0),
  bathrooms smallint not null default 0 check (bathrooms >= 0),
  size_sqm numeric(12,2) not null default 0 check (size_sqm >= 0),
  status public.property_status not null default 'available',
  assigned_to_user_id uuid not null,
  latitude numeric(10,7),
  longitude numeric(10,7),
  featured boolean not null default false,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz,
  unique (tenant_id, id),
  unique (tenant_id, reference),
  foreign key (tenant_id, project_id) references public.projects(tenant_id, id) on delete set null,
  foreign key (tenant_id, owner_customer_id) references public.customers(tenant_id, id) on delete set null,
  foreign key (tenant_id, assigned_to_user_id) references public.tenant_memberships(tenant_id, user_id) on delete restrict,
  check (latitude is null or latitude between -90 and 90),
  check (longitude is null or longitude between -180 and 180)
);

create table public.project_units (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  project_id uuid not null,
  property_id uuid,
  phase text,
  building text,
  floor text,
  unit_number text not null,
  status public.property_status not null default 'available',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, id),
  unique (tenant_id, project_id, unit_number),
  foreign key (tenant_id, project_id) references public.projects(tenant_id, id) on delete cascade,
  foreign key (tenant_id, property_id) references public.properties(tenant_id, id) on delete set null
);

create table public.listing_publications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  property_id uuid not null,
  portal text not null,
  external_id text,
  external_url text,
  status text not null default 'draft' check (status in ('draft', 'queued', 'published', 'failed', 'paused', 'removed')),
  last_synced_at timestamptz,
  error_message text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, id),
  unique (tenant_id, property_id, portal),
  foreign key (tenant_id, property_id) references public.properties(tenant_id, id) on delete cascade
);

create table public.maintenance_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  property_id uuid not null,
  title text not null,
  description text,
  priority public.priority_level not null default 'medium',
  status text not null default 'open' check (status in ('open', 'assigned', 'in-progress', 'completed', 'cancelled')),
  assigned_vendor text,
  estimated_cost_minor bigint check (estimated_cost_minor >= 0),
  actual_cost_minor bigint check (actual_cost_minor >= 0),
  currency public.money_currency not null default 'USD',
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, id),
  foreign key (tenant_id, property_id) references public.properties(tenant_id, id) on delete cascade
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  title text not null,
  description text,
  due_at timestamptz not null,
  assigned_to_user_id uuid not null,
  priority public.priority_level not null default 'medium',
  status text not null default 'open' check (status in ('open', 'done')),
  related_type text check (related_type in ('lead', 'property', 'contract', 'employee', 'customer', 'reservation')),
  related_id uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, id),
  foreign key (tenant_id, assigned_to_user_id) references public.tenant_memberships(tenant_id, user_id) on delete cascade
);

create table public.viewings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  property_id uuid not null,
  customer_id uuid,
  customer_name text not null,
  agent_user_id uuid not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled', 'no-show')),
  outcome text check (outcome in ('interested', 'not-interested', 'follow-up')),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, id),
  foreign key (tenant_id, property_id) references public.properties(tenant_id, id) on delete cascade,
  foreign key (tenant_id, customer_id) references public.customers(tenant_id, id) on delete set null,
  foreign key (tenant_id, agent_user_id) references public.tenant_memberships(tenant_id, user_id) on delete restrict,
  check (ends_at is null or ends_at > starts_at)
);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  property_id uuid not null,
  customer_id uuid,
  customer_name text not null,
  agent_user_id uuid not null,
  deposit_minor bigint not null default 0 check (deposit_minor >= 0),
  currency public.money_currency not null default 'USD',
  expires_at timestamptz not null,
  status text not null default 'active' check (status in ('active', 'converted', 'expired', 'cancelled')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, id),
  foreign key (tenant_id, property_id) references public.properties(tenant_id, id) on delete restrict,
  foreign key (tenant_id, customer_id) references public.customers(tenant_id, id) on delete set null,
  foreign key (tenant_id, agent_user_id) references public.tenant_memberships(tenant_id, user_id) on delete restrict
);

create unique index reservations_one_active_property_idx
on public.reservations (tenant_id, property_id)
where status = 'active';

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  customer_id uuid,
  customer_name text not null,
  channel public.channel_type not null,
  assigned_to_user_id uuid not null,
  unread_count integer not null default 0 check (unread_count >= 0),
  last_message text not null default '',
  provider_thread_id text,
  updated_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, id),
  foreign key (tenant_id, customer_id) references public.customers(tenant_id, id) on delete set null,
  foreign key (tenant_id, assigned_to_user_id) references public.tenant_memberships(tenant_id, user_id) on delete restrict
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  conversation_id uuid not null,
  direction text not null check (direction in ('inbound', 'outbound')),
  sender_name text not null,
  body text not null,
  provider_message_id text,
  sent_at timestamptz not null default timezone('utc', now()),
  status text not null default 'sent' check (status in ('queued', 'sent', 'delivered', 'read', 'failed')),
  metadata jsonb not null default '{}'::jsonb,
  unique (tenant_id, id),
  unique (tenant_id, provider_message_id),
  foreign key (tenant_id, conversation_id) references public.conversations(tenant_id, id) on delete cascade
);

create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  reference text not null,
  title text not null,
  customer_id uuid,
  customer_name text not null,
  property_id uuid,
  value_minor bigint not null default 0 check (value_minor >= 0),
  currency public.money_currency not null default 'USD',
  status text not null default 'draft' check (status in ('draft', 'review', 'sent', 'signed', 'expired', 'cancelled')),
  owner_user_id uuid not null,
  signed_at timestamptz,
  expires_at timestamptz,
  version integer not null default 1 check (version > 0),
  terms jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz,
  unique (tenant_id, id),
  unique (tenant_id, reference),
  foreign key (tenant_id, customer_id) references public.customers(tenant_id, id) on delete set null,
  foreign key (tenant_id, property_id) references public.properties(tenant_id, id) on delete set null,
  foreign key (tenant_id, owner_user_id) references public.tenant_memberships(tenant_id, user_id) on delete restrict
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  file_name text not null,
  object_key text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes >= 0),
  checksum_sha256 text,
  version integer not null default 1 check (version > 0),
  classification text not null default 'internal' check (classification in ('public', 'internal', 'confidential', 'restricted')),
  uploaded_by_user_id uuid not null,
  malware_scan_status text not null default 'pending' check (malware_scan_status in ('pending', 'clean', 'blocked', 'failed')),
  expires_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz,
  unique (tenant_id, id),
  unique (tenant_id, object_key),
  foreign key (tenant_id, uploaded_by_user_id) references public.tenant_memberships(tenant_id, user_id) on delete restrict
);

create table public.inspections (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  property_id uuid not null,
  inspector_user_id uuid not null,
  scheduled_at timestamptz not null,
  completed_at timestamptz,
  status text not null default 'scheduled' check (status in ('scheduled', 'in-progress', 'completed', 'cancelled')),
  checklist jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, id),
  foreign key (tenant_id, property_id) references public.properties(tenant_id, id) on delete cascade,
  foreign key (tenant_id, inspector_user_id) references public.tenant_memberships(tenant_id, user_id) on delete restrict
);

create table public.handovers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  property_id uuid not null,
  contract_id uuid,
  customer_id uuid,
  scheduled_at timestamptz,
  completed_at timestamptz,
  status text not null default 'planned' check (status in ('planned', 'ready', 'completed', 'cancelled')),
  checklist jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, id),
  foreign key (tenant_id, property_id) references public.properties(tenant_id, id) on delete restrict,
  foreign key (tenant_id, contract_id) references public.contracts(tenant_id, id) on delete set null,
  foreign key (tenant_id, customer_id) references public.customers(tenant_id, id) on delete set null
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  reference text not null,
  customer_id uuid,
  customer_name text not null,
  amount_minor bigint not null check (amount_minor >= 0),
  tax_minor bigint not null default 0 check (tax_minor >= 0),
  currency public.money_currency not null default 'USD',
  due_date date not null,
  status text not null default 'draft' check (status in ('draft', 'sent', 'partial', 'paid', 'overdue', 'void')),
  issued_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, id),
  unique (tenant_id, reference),
  foreign key (tenant_id, customer_id) references public.customers(tenant_id, id) on delete set null
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  invoice_id uuid not null,
  amount_minor bigint not null check (amount_minor > 0),
  currency public.money_currency not null,
  method text not null check (method in ('cash', 'bank', 'card', 'cheque')),
  paid_at timestamptz not null,
  reference text,
  provider_event_id text,
  idempotency_key text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, id),
  unique (tenant_id, idempotency_key),
  unique (tenant_id, provider_event_id),
  foreign key (tenant_id, invoice_id) references public.invoices(tenant_id, id) on delete restrict
);

create table public.installments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  invoice_id uuid not null,
  sequence_number integer not null check (sequence_number > 0),
  amount_minor bigint not null check (amount_minor > 0),
  currency public.money_currency not null,
  due_date date not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'paid', 'overdue', 'waived')),
  paid_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, id),
  unique (tenant_id, invoice_id, sequence_number),
  foreign key (tenant_id, invoice_id) references public.invoices(tenant_id, id) on delete cascade
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  branch_id uuid,
  category text not null,
  vendor text,
  description text not null,
  amount_minor bigint not null check (amount_minor > 0),
  currency public.money_currency not null,
  incurred_on date not null,
  status text not null default 'submitted' check (status in ('draft', 'submitted', 'approved', 'paid', 'rejected')),
  submitted_by_user_id uuid not null,
  approved_by_user_id uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, id),
  foreign key (tenant_id, branch_id) references public.branches(tenant_id, id) on delete set null,
  foreign key (tenant_id, submitted_by_user_id) references public.tenant_memberships(tenant_id, user_id) on delete restrict,
  foreign key (tenant_id, approved_by_user_id) references public.tenant_memberships(tenant_id, user_id) on delete restrict
);

create table public.commissions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  employee_id uuid not null,
  contract_id uuid not null,
  amount_minor bigint not null check (amount_minor >= 0),
  currency public.money_currency not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'paid', 'cancelled')),
  earned_at timestamptz not null,
  paid_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, id),
  unique (tenant_id, employee_id, contract_id),
  foreign key (tenant_id, employee_id) references public.employees(tenant_id, id) on delete restrict,
  foreign key (tenant_id, contract_id) references public.contracts(tenant_id, id) on delete restrict
);

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  channel text not null check (channel in ('Meta', 'Google', 'Email', 'Portal', 'Organic')),
  budget_minor bigint not null default 0 check (budget_minor >= 0),
  spend_minor bigint not null default 0 check (spend_minor >= 0),
  currency public.money_currency not null default 'USD',
  lead_count integer not null default 0 check (lead_count >= 0),
  conversion_count integer not null default 0 check (conversion_count >= 0),
  status text not null default 'draft' check (status in ('draft', 'active', 'paused', 'completed')),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, id),
  check (ends_at >= starts_at),
  check (conversion_count <= lead_count or lead_count = 0)
);

alter table public.leads
  add constraint leads_campaign_same_tenant_fk
  foreign key (tenant_id, campaign_id)
  references public.campaigns(tenant_id, id)
  on delete set null;

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  recipient_user_id uuid,
  title text not null,
  body text not null,
  notification_type text not null check (notification_type in ('info', 'success', 'warning', 'danger')),
  read_at timestamptz,
  href text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, id),
  foreign key (tenant_id, recipient_user_id) references public.tenant_memberships(tenant_id, user_id) on delete cascade
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.tenants(id) on delete cascade,
  provider text not null default 'manual',
  provider_customer_id text,
  provider_subscription_id text,
  plan_id public.estateflow_plan not null,
  status text not null default 'trialing' check (status in ('trialing', 'active', 'past-due', 'paused', 'cancelled')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (provider, provider_subscription_id)
);

create table public.tenant_entitlements (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  key text not null check (key ~ '^[a-z][a-z0-9_.-]*$'),
  enabled boolean not null default true,
  limit_value bigint,
  usage_value bigint not null default 0 check (usage_value >= 0),
  source text not null default 'plan' check (source in ('plan', 'addon', 'override', 'trial')),
  valid_from timestamptz not null default timezone('utc', now()),
  valid_until timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, key),
  check (limit_value is null or limit_value >= 0),
  check (valid_until is null or valid_until > valid_from)
);

create table public.integration_connections (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  provider text not null,
  name text not null,
  status text not null default 'disconnected' check (status in ('disconnected', 'connected', 'degraded', 'error', 'disabled')),
  encrypted_secret_reference text,
  settings jsonb not null default '{}'::jsonb,
  last_synced_at timestamptz,
  last_error text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, id),
  unique (tenant_id, provider, name)
);

create table public.workflow_definitions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  event_key text not null,
  enabled boolean not null default true,
  definition jsonb not null,
  version integer not null default 1 check (version > 0),
  created_by_user_id uuid not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, id),
  unique (tenant_id, name),
  foreign key (tenant_id, created_by_user_id) references public.tenant_memberships(tenant_id, user_id) on delete restrict
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  actor_user_id uuid,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  summary text not null,
  request_id text,
  ip_hash text,
  user_agent text,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  unique (tenant_id, id),
  foreign key (tenant_id, actor_user_id) references public.tenant_memberships(tenant_id, user_id) on delete set null
);

create or replace function public.prevent_audit_event_mutation()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  raise exception 'audit events are immutable';
end;
$$;

create trigger audit_events_immutable_update
before update on public.audit_events
for each row execute function public.prevent_audit_event_mutation();

create trigger audit_events_immutable_delete
before delete on public.audit_events
for each row execute function public.prevent_audit_event_mutation();

-- Updated-at triggers for mutable tables.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'branches', 'departments', 'employees', 'employee_private_profiles', 'leave_requests', 'attendance_entries',
    'employee_assets', 'onboarding_tasks', 'customers', 'leads', 'projects',
    'properties', 'project_units', 'listing_publications', 'maintenance_requests',
    'tasks', 'viewings', 'reservations', 'conversations', 'contracts', 'inspections',
    'handovers', 'invoices', 'installments', 'expenses', 'commissions', 'campaigns',
    'subscriptions', 'tenant_entitlements', 'integration_connections', 'workflow_definitions'
  ]
  loop
    execute format(
      'create trigger %I_set_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      table_name,
      table_name
    );
  end loop;
end;
$$;

-- High-value tenant-scoped indexes.
create index tenant_memberships_user_idx on public.tenant_memberships (user_id, status);
create index employees_org_idx on public.employees (tenant_id, branch_id, department_id, manager_id) where deleted_at is null;
create index leave_requests_approval_idx on public.leave_requests (tenant_id, status, start_date);
create index customers_search_idx on public.customers (tenant_id, lower(name), phone) where deleted_at is null;
create index leads_pipeline_idx on public.leads (tenant_id, stage, assigned_to_user_id, next_follow_up_at) where deleted_at is null;
create index properties_inventory_idx on public.properties (tenant_id, status, city, property_type, purpose) where deleted_at is null;
create index properties_price_idx on public.properties (tenant_id, currency, price_minor) where deleted_at is null;
create index viewings_schedule_idx on public.viewings (tenant_id, starts_at, agent_user_id);
create index reservations_expiry_idx on public.reservations (tenant_id, status, expires_at);
create index conversations_recency_idx on public.conversations (tenant_id, updated_at desc);
create index messages_thread_idx on public.messages (tenant_id, conversation_id, sent_at);
create index contracts_status_idx on public.contracts (tenant_id, status, updated_at desc) where deleted_at is null;
create index documents_entity_idx on public.documents (tenant_id, entity_type, entity_id) where deleted_at is null;
create index invoices_due_idx on public.invoices (tenant_id, status, due_date);
create index payments_invoice_idx on public.payments (tenant_id, invoice_id, paid_at desc);
create index notifications_recipient_idx on public.notifications (tenant_id, recipient_user_id, read_at, created_at desc);
create index audit_events_lookup_idx on public.audit_events (tenant_id, entity_type, entity_id, created_at desc);
create index audit_events_actor_idx on public.audit_events (tenant_id, actor_user_id, created_at desc);

-- Row-level security is mandatory for all tenant-owned tables.
alter table public.tenants enable row level security;
alter table public.tenant_memberships enable row level security;

create policy tenants_select_member on public.tenants
for select to authenticated
using (public.is_tenant_member(id));

create policy tenants_update_admin on public.tenants
for update to authenticated
using (public.has_tenant_role(id, array['owner', 'admin']::public.estateflow_role[]))
with check (public.has_tenant_role(id, array['owner', 'admin']::public.estateflow_role[]));

create policy memberships_select_member on public.tenant_memberships
for select to authenticated
using (public.is_tenant_member(tenant_id));

create policy memberships_manage_admin on public.tenant_memberships
for all to authenticated
using (public.has_tenant_role(tenant_id, array['owner', 'admin']::public.estateflow_role[]))
with check (public.has_tenant_role(tenant_id, array['owner', 'admin']::public.estateflow_role[]));

-- Read policies for ordinary operational data. Mutations are intentionally
-- server-mediated; the authenticated browser role receives no direct insert,
-- update, or delete grants except for marking its own notifications as read.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'branches', 'departments', 'employees', 'customers', 'leads', 'projects',
    'properties', 'project_units', 'listing_publications', 'maintenance_requests',
    'tasks', 'viewings', 'reservations', 'conversations', 'messages', 'contracts',
    'documents', 'inspections', 'handovers', 'campaigns'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format(
      'create policy %I_member_read on public.%I for select to authenticated using (public.is_tenant_member(tenant_id))',
      table_name,
      table_name
    );
  end loop;
end;
$$;

alter table public.employee_private_profiles enable row level security;
create policy employee_private_profiles_authorized_read on public.employee_private_profiles
for select to authenticated
using (
  public.has_tenant_role(tenant_id, array['owner', 'admin', 'people']::public.estateflow_role[])
  or employee_id = public.current_employee_id(tenant_id)
);

alter table public.leave_requests enable row level security;
create policy leave_requests_authorized_read on public.leave_requests
for select to authenticated
using (
  public.has_tenant_role(tenant_id, array['owner', 'admin', 'manager', 'people']::public.estateflow_role[])
  or employee_id = public.current_employee_id(tenant_id)
);

alter table public.attendance_entries enable row level security;
create policy attendance_entries_authorized_read on public.attendance_entries
for select to authenticated
using (
  public.has_tenant_role(tenant_id, array['owner', 'admin', 'manager', 'people']::public.estateflow_role[])
  or employee_id = public.current_employee_id(tenant_id)
);

alter table public.employee_assets enable row level security;
create policy employee_assets_authorized_read on public.employee_assets
for select to authenticated
using (
  public.has_tenant_role(tenant_id, array['owner', 'admin', 'people']::public.estateflow_role[])
  or employee_id = public.current_employee_id(tenant_id)
);

alter table public.onboarding_tasks enable row level security;
create policy onboarding_tasks_authorized_read on public.onboarding_tasks
for select to authenticated
using (
  public.has_tenant_role(tenant_id, array['owner', 'admin', 'people']::public.estateflow_role[])
  or employee_id = public.current_employee_id(tenant_id)
  or owner_employee_id = public.current_employee_id(tenant_id)
);

-- Finance is not visible to ordinary sales or people-directory users.
do $$
declare
  table_name text;
begin
  foreach table_name in array array['invoices', 'payments', 'installments', 'expenses', 'commissions']
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format(
      'create policy %I_finance_read on public.%I for select to authenticated using (public.has_tenant_role(tenant_id, array[''owner'', ''admin'', ''finance'']::public.estateflow_role[]))',
      table_name,
      table_name
    );
  end loop;
end;
$$;

-- Subscription, entitlement, integration, and workflow configuration is
-- restricted to company owners and administrators.
do $$
declare
  table_name text;
begin
  foreach table_name in array array['subscriptions', 'tenant_entitlements', 'integration_connections', 'workflow_definitions']
  loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format(
      'create policy %I_admin_read on public.%I for select to authenticated using (public.has_tenant_role(tenant_id, array[''owner'', ''admin'']::public.estateflow_role[]))',
      table_name,
      table_name
    );
  end loop;
end;
$$;

alter table public.notifications enable row level security;
create policy notifications_recipient_read on public.notifications
for select to authenticated
using (
  public.is_tenant_member(tenant_id)
  and (recipient_user_id is null or recipient_user_id = auth.uid())
);
create policy notifications_recipient_mark_read on public.notifications
for update to authenticated
using (
  public.is_tenant_member(tenant_id)
  and recipient_user_id = auth.uid()
)
with check (
  public.is_tenant_member(tenant_id)
  and recipient_user_id = auth.uid()
);

alter table public.audit_events enable row level security;
create policy audit_events_select_privileged on public.audit_events
for select to authenticated
using (public.has_tenant_role(tenant_id, array['owner', 'admin']::public.estateflow_role[]));

-- Audit inserts and all domain mutations should be performed by trusted server
-- services after validating the authenticated actor, tenant, entitlement,
-- permission, record scope, and business rule. Never accept tenant_id directly
-- from an untrusted request body as the authorization source.
revoke all on all tables in schema public from anon, authenticated;
alter default privileges in schema public revoke all on tables from anon, authenticated;
grant usage on schema public to authenticated;
grant select on all tables in schema public to authenticated;
grant update (read_at) on public.notifications to authenticated;
revoke insert, update, delete on public.audit_events from authenticated;

commit;
