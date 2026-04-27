-- =============================================================================
-- Baarako - Mise à jour incrémentale du Schéma
-- =============================================================================

-- 1. Mise à jour table formations (nouveaux attributs)
ALTER TABLE public.formations 
ADD COLUMN IF NOT EXISTS instructor_name text,
ADD COLUMN IF NOT EXISTS instructor_bio text,
ADD COLUMN IF NOT EXISTS level text,
ADD COLUMN IF NOT EXISTS prerequisites text,
ADD COLUMN IF NOT EXISTS image_url text;

-- 2. Mise à jour table partners (website déjà présent dans le schema précédent, ajout sécurité)
ALTER TABLE public.partners 
ADD COLUMN IF NOT EXISTS website text;

-- 3. Mise à jour table profiles (pour être sûr que tous les champs y sont)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS dob text,
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS current_situation text,
ADD COLUMN IF NOT EXISTS study_level text,
ADD COLUMN IF NOT EXISTS study_field text,
ADD COLUMN IF NOT EXISTS has_professional_experience boolean default false,
ADD COLUMN IF NOT EXISTS job_title text,
ADD COLUMN IF NOT EXISTS experience_duration int,
ADD COLUMN IF NOT EXISTS application_type text[],
ADD COLUMN IF NOT EXISTS skills text[],
ADD COLUMN IF NOT EXISTS availability text,
ADD COLUMN IF NOT EXISTS company_name text,
ADD COLUMN IF NOT EXISTS company_sector text,
ADD COLUMN IF NOT EXISTS company_address text,
ADD COLUMN IF NOT EXISTS company_phone text,
ADD COLUMN IF NOT EXISTS responsible_name text,
ADD COLUMN IF NOT EXISTS responsible_function text,
ADD COLUMN IF NOT EXISTS responsible_phone text,
ADD COLUMN IF NOT EXISTS company_type text,
ADD COLUMN IF NOT EXISTS agreement boolean default false;

-- 4. Assurer les permissions pour les nouvelles colonnes
DO $$ 
DECLARE 
    t text;
BEGIN
    FOR t IN (SELECT table_name FROM information_schema.tables WHERE table_schema = 'public') 
    LOOP
        EXECUTE format('GRANT ALL ON TABLE public.%I TO postgres, anon, authenticated, service_role', t);
    END LOOP;
END $$;
