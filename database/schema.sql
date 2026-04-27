-- =============================================================================
-- Baarako - Schéma complet (Version corrigée Supabase)
-- =============================================================================

-- 1. Nettoyage (SANS supprimer le schema public)
drop table if exists public.job_applications cascade;
drop table if exists public.job_offers cascade;
drop table if exists public.companies cascade;
drop table if exists public.projects cascade;
drop table if exists public.formations cascade;
drop table if exists public.avantages cascade;
drop table if exists public.partners cascade;
drop table if exists public.profiles cascade;

drop type if exists public.user_role cascade;
drop type if exists public.job_offer_status cascade;
drop type if exists public.application_status cascade;
drop type if exists public.project_status cascade;
drop type if exists public.formation_type cascade;

-- 2. Extensions
create extension if not exists "pgcrypto";

-- 3. Types
create type public.user_role as enum ('job_seeker', 'entrepreneur', 'company', 'admin');
create type public.job_offer_status as enum ('draft', 'published', 'closed');
create type public.application_status as enum ('sent', 'viewed', 'interview', 'accepted', 'rejected');
create type public.project_status as enum ('submitted', 'under_review', 'accepted', 'mentoring', 'funded', 'rejected');
create type public.formation_type as enum ('employability', 'entrepreneurship');

-- 4. Tables
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role public.user_role not null default 'job_seeker',
  avatar_url text,
  phone text,
  bio text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Candidat
  dob text,
  gender text,
  location text,
  current_situation text,
  study_level text,
  study_field text,
  has_professional_experience boolean default false,
  job_title text,
  experience_duration int,
  application_type text[],
  skills text[],
  availability text,

  -- Entreprise
  company_name text,
  company_sector text,
  company_address text,
  company_phone text,
  responsible_name text,
  responsible_function text,
  responsible_phone text,
  company_type text,
  agreement boolean default false
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  logo_url text,
  description text,
  location text,
  website text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.job_offers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies (id) on delete cascade,
  title text not null,
  description text,
  missions text,
  requirements text,
  benefits text,
  contract_type text default 'CDI',
  sector text,
  location text default 'Bamako, Mali',
  salary_min bigint,
  salary_max bigint,
  currency text default 'XOF',
  expires_at timestamptz,
  status public.job_offer_status default 'draft',
  type_bourse text not null default 'regular',
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_offer_id uuid not null references public.job_offers (id) on delete cascade,
  applicant_id uuid not null references public.profiles (id) on delete cascade,
  status public.application_status default 'sent',
  cover_letter text,
  cv_url text,
  has_activity_idea boolean,
  has_exercised_before boolean,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (job_offer_id, applicant_id)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  sector text not null,
  description text,
  short_description text,
  status public.project_status default 'submitted',
  needs_mentoring boolean default false,
  needs_funding boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.formations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type public.formation_type default 'employability',
  description text,
  start_date date not null,
  end_date date,
  duration_days int default 1,
  location text default 'Bamako',
  max_places int default 30,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.avantages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon text,
  display_order int default 0,
  created_at timestamptz default now()
);

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  description text,
  website text,
  display_order int default 0,
  created_at timestamptz default now()
);

-- 5. Permissions (IMPORTANT)
grant usage on schema public to anon, authenticated, service_role;
grant all on schema public to postgres;

-- Permissions sur toutes les tables
do $$ 
declare 
    t text;
begin
    for t in (select table_name from information_schema.tables where table_schema = 'public') 
    loop
        execute format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', t);
        execute format('GRANT ALL ON TABLE public.%I TO anon, authenticated, service_role', t);
    end loop;
end $$;

-- 6. Trigger Inscription
create or replace function public.handle_new_user() 
returns trigger 
language plpgsql 
security definer
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'job_seeker')
  );
  return new;
exception
  when others then return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();