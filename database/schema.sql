-- =============================================================================
-- Baarako gèlèya bana — Schéma PostgreSQL / Supabase
-- Coller ce script dans : Supabase Dashboard → SQL Editor → New query
-- =============================================================================

-- Extensions
create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- Types énumérés
-- -----------------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('job_seeker', 'entrepreneur', 'company', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.job_offer_status as enum ('draft', 'published', 'closed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.application_status as enum ('sent', 'viewed', 'interview', 'accepted', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.project_status as enum (
    'submitted',
    'under_review',
    'accepted',
    'mentoring',
    'funded',
    'rejected'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.formation_type as enum ('employability', 'entrepreneurship');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.formation_registration_status as enum ('pending', 'confirmed', 'cancelled');
exception when duplicate_object then null; end $$;

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

-- Profils (1:1 avec auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role public.user_role not null default 'job_seeker',
  avatar_url text,
  phone text,
  bio text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  logo_url text,
  description text,
  location text,
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_offers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  description text,
  missions text,
  requirements text,
  benefits text,
  contract_type text not null default 'CDI',
  sector text,
  location text not null default 'Bamako, Mali',
  salary_min bigint,
  salary_max bigint,
  currency text not null default 'XOF',
  expires_at timestamptz,
  status public.job_offer_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_offer_id uuid not null references public.job_offers (id) on delete cascade,
  applicant_id uuid not null references public.profiles (id) on delete cascade,
  status public.application_status not null default 'sent',
  cover_letter text,
  cv_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_offer_id, applicant_id)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  sector text not null,
  short_description text,
  description text,
  status public.project_status not null default 'submitted',
  needs_mentoring boolean not null default false,
  needs_funding boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.formations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type public.formation_type not null default 'employability',
  description text,
  start_date date not null,
  end_date date,
  duration_days int not null default 1,
  location text not null default 'Bamako',
  max_places int not null default 30,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.formation_registrations (
  id uuid primary key default gen_random_uuid(),
  formation_id uuid not null references public.formations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status public.formation_registration_status not null default 'pending',
  created_at timestamptz not null default now(),
  unique (formation_id, user_id)
);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  website text,
  description text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id) on delete set null,
  action_type text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Index
-- -----------------------------------------------------------------------------
create index if not exists idx_job_offers_company on public.job_offers (company_id);
create index if not exists idx_job_offers_status on public.job_offers (status);
create index if not exists idx_job_applications_offer on public.job_applications (job_offer_id);
create index if not exists idx_job_applications_applicant on public.job_applications (applicant_id);
create index if not exists idx_projects_owner on public.projects (owner_id);
create index if not exists idx_projects_status on public.projects (status);
create index if not exists idx_formation_reg_user on public.formation_registrations (user_id);

-- -----------------------------------------------------------------------------
-- Triggers updated_at
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_companies_updated on public.companies;
create trigger trg_companies_updated before update on public.companies
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_job_offers_updated on public.job_offers;
create trigger trg_job_offers_updated before update on public.job_offers
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_job_applications_updated on public.job_applications;
create trigger trg_job_applications_updated before update on public.job_applications
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_projects_updated on public.projects;
create trigger trg_projects_updated before update on public.projects
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_formations_updated on public.formations;
create trigger trg_formations_updated before update on public.formations
for each row execute procedure public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Profil créé à l'inscription (Auth)
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
declare
  r public.user_role;
begin
  r := case lower(coalesce(new.raw_user_meta_data->>'role', 'job_seeker'))
    when 'entrepreneur' then 'entrepreneur'::public.user_role
    when 'company' then 'company'::public.user_role
    when 'admin' then 'admin'::public.user_role
    else 'job_seeker'::public.user_role
  end;
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    r
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- Helpers RLS
-- -----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.job_offers enable row level security;
alter table public.job_applications enable row level security;
alter table public.projects enable row level security;
alter table public.formations enable row level security;
alter table public.formation_registrations enable row level security;
alter table public.partners enable row level security;
alter table public.activity_logs enable row level security;

-- profiles
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (id = auth.uid() or public.is_admin());

-- companies
drop policy if exists "companies_select_public_published_jobs" on public.companies;
create policy "companies_select_public_published_jobs" on public.companies
  for select using (
    public.is_admin()
    or owner_id = auth.uid()
    or exists (
      select 1 from public.job_offers jo
      where jo.company_id = companies.id and jo.status = 'published'
    )
  );

drop policy if exists "companies_insert_owner" on public.companies;
create policy "companies_insert_owner" on public.companies
  for insert with check (owner_id = auth.uid() or public.is_admin());

drop policy if exists "companies_update_owner" on public.companies;
create policy "companies_update_owner" on public.companies
  for update using (owner_id = auth.uid() or public.is_admin());

drop policy if exists "companies_delete_owner" on public.companies;
create policy "companies_delete_owner" on public.companies
  for delete using (owner_id = auth.uid() or public.is_admin());

-- job_offers
drop policy if exists "job_offers_select_published_or_owner" on public.job_offers;
create policy "job_offers_select_published_or_owner" on public.job_offers
  for select using (
    status = 'published'
    or public.is_admin()
    or exists (
      select 1 from public.companies c
      where c.id = job_offers.company_id and c.owner_id = auth.uid()
    )
  );

drop policy if exists "job_offers_insert_company_owner" on public.job_offers;
create policy "job_offers_insert_company_owner" on public.job_offers
  for insert with check (
    public.is_admin()
    or exists (
      select 1 from public.companies c
      where c.id = company_id and c.owner_id = auth.uid()
    )
  );

drop policy if exists "job_offers_update_company_owner" on public.job_offers;
create policy "job_offers_update_company_owner" on public.job_offers
  for update using (
    public.is_admin()
    or exists (
      select 1 from public.companies c
      where c.id = job_offers.company_id and c.owner_id = auth.uid()
    )
  );

drop policy if exists "job_offers_delete_company_owner" on public.job_offers;
create policy "job_offers_delete_company_owner" on public.job_offers
  for delete using (
    public.is_admin()
    or exists (
      select 1 from public.companies c
      where c.id = job_offers.company_id and c.owner_id = auth.uid()
    )
  );

-- job_applications
drop policy if exists "job_applications_select_own_or_company_or_admin" on public.job_applications;
create policy "job_applications_select_own_or_company_or_admin" on public.job_applications
  for select using (
    applicant_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.job_offers jo
      join public.companies c on c.id = jo.company_id
      where jo.id = job_applications.job_offer_id and c.owner_id = auth.uid()
    )
  );

drop policy if exists "job_applications_insert_seeker" on public.job_applications;
create policy "job_applications_insert_seeker" on public.job_applications
  for insert with check (
    applicant_id = auth.uid()
    and exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'job_seeker'
    )
  );

drop policy if exists "job_applications_update_company_or_applicant" on public.job_applications;
create policy "job_applications_update_company_or_applicant" on public.job_applications
  for update using (
    applicant_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.job_offers jo
      join public.companies c on c.id = jo.company_id
      where jo.id = job_applications.job_offer_id and c.owner_id = auth.uid()
    )
  );

-- projects (catalogue public : projets non rejetés ; le propriétaire voit tout)
drop policy if exists "projects_select_own_or_admin" on public.projects;
drop policy if exists "projects_select_catalog" on public.projects;
create policy "projects_select_catalog" on public.projects
  for select using (
    public.is_admin()
    or owner_id = auth.uid()
    or status in ('submitted', 'under_review', 'accepted', 'mentoring', 'funded')
  );

drop policy if exists "projects_insert_entrepreneur" on public.projects;
create policy "projects_insert_entrepreneur" on public.projects
  for insert with check (
    owner_id = auth.uid()
    and exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'entrepreneur'
    )
  );

drop policy if exists "projects_update_own_or_admin" on public.projects;
create policy "projects_update_own_or_admin" on public.projects
  for update using (owner_id = auth.uid() or public.is_admin());

drop policy if exists "projects_delete_own_or_admin" on public.projects;
create policy "projects_delete_own_or_admin" on public.projects
  for delete using (owner_id = auth.uid() or public.is_admin());

-- formations (lecture publique des annonces)
drop policy if exists "formations_select_all" on public.formations;
create policy "formations_select_all" on public.formations for select using (true);

drop policy if exists "formations_write_admin" on public.formations;
create policy "formations_write_admin" on public.formations
  for all using (public.is_admin()) with check (public.is_admin());

-- formation_registrations
drop policy if exists "formation_reg_select_own_or_admin" on public.formation_registrations;
create policy "formation_reg_select_own_or_admin" on public.formation_registrations
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "formation_reg_insert_own" on public.formation_registrations;
create policy "formation_reg_insert_own" on public.formation_registrations
  for insert with check (user_id = auth.uid());

drop policy if exists "formation_reg_update_admin" on public.formation_registrations;
create policy "formation_reg_update_admin" on public.formation_registrations
  for update using (public.is_admin());

-- partners
drop policy if exists "partners_select_all" on public.partners;
create policy "partners_select_all" on public.partners for select using (true);

drop policy if exists "partners_write_admin" on public.partners;
create policy "partners_write_admin" on public.partners
  for all using (public.is_admin()) with check (public.is_admin());

-- activity_logs
drop policy if exists "activity_logs_admin" on public.activity_logs;
create policy "activity_logs_admin" on public.activity_logs
  for select using (public.is_admin());

drop policy if exists "activity_logs_insert_authenticated" on public.activity_logs;
create policy "activity_logs_insert_authenticated" on public.activity_logs
  for insert with check (auth.uid() is not null);

-- -----------------------------------------------------------------------------
-- Stockage (à créer aussi dans l'UI Storage Supabase) :
--   Buckets : cvs, business-plans, logos, avatars — public read selon besoin
-- -----------------------------------------------------------------------------

comment on table public.profiles is 'Profil utilisateur lié à auth.users';
comment on table public.job_offers is 'Offres Bourse Baarako';

-- -----------------------------------------------------------------------------
-- Premier compte administrateur (après inscription via l’app Auth)
-- -----------------------------------------------------------------------------
-- update public.profiles set role = 'admin' where email = 'ton-email@domaine.com';
