-- =============================================================================
-- Instructions SQL pour mise à jour Supabase (Baarako)
-- =============================================================================

-- 1. Mise à jour de la table public.profiles
-- Ajout des champs pour Candidats et Entreprises
alter table public.profiles add column if not exists dob text;
alter table public.profiles add column if not exists gender text;
alter table public.profiles add column if not exists location text;
alter table public.profiles add column if not exists current_situation text;
alter table public.profiles add column if not exists study_level text;
alter table public.profiles add column if not exists study_field text;
alter table public.profiles add column if not exists has_professional_experience boolean default false;
alter table public.profiles add column if not exists job_title text;
alter table public.profiles add column if not exists experience_duration int;
alter table public.profiles add column if not exists application_type text[];
alter table public.profiles add column if not exists skills text[];
alter table public.profiles add column if not exists availability text;

alter table public.profiles add column if not exists company_name text;
alter table public.profiles add column if not exists company_sector text;
alter table public.profiles add column if not exists company_address text;
alter table public.profiles add column if not exists company_phone text;
alter table public.profiles add column if not exists responsible_name text;
alter table public.profiles add column if not exists responsible_function text;
alter table public.profiles add column if not exists responsible_phone text;
alter table public.profiles add column if not exists company_type text;
alter table public.profiles add column if not exists agreement boolean default false;

-- 2. Création de la table public.avantages
create table if not exists public.avantages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon text,
  display_order int default 0,
  created_at timestamptz not null default now()
);

-- RLS pour avantages
alter table public.avantages enable row level security;
create policy "avantages_select_all" on public.avantages for select using (true);
create policy "avantages_write_admin" on public.avantages for all using (public.is_admin()) with check (public.is_admin());

-- 3. Mise à jour de la table public.job_offers
-- Rendre company_id facultatif et ajouter le type de bourse
alter table public.job_offers alter column company_id drop not null;
alter table public.job_offers add column if not exists type_bourse text not null default 'regular';

-- 4. Mise à jour de la table public.job_applications
-- Ajout des champs spécifiques pour la bourse Tchakèda
alter table public.job_applications add column if not exists has_activity_idea boolean;
alter table public.job_applications add column if not exists has_exercised_before boolean;
