-- Ajout des champs identité entreprise basés sur b.txt
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS sector text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS responsible_name text,
ADD COLUMN IF NOT EXISTS responsible_function text,
ADD COLUMN IF NOT EXISTS responsible_phone text,
ADD COLUMN IF NOT EXISTS company_type text;

-- Ajout du champ maintenance dans la table settings
-- Note : Comme les paramètres sont stockés dans un JSONB 'data', on peut simplement gérer cela dans le contrôleur ou ajouter une colonne.
-- Pour plus de flexibilité, on ajoute une colonne dédiée ou on met à jour le JSONB.
-- Ajoutons une colonne 'maintenance_mode' à la table settings pour simplifier.
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS maintenance_mode boolean DEFAULT false;
ALTER TABLE public.avantages RENAME COLUMN icon TO image_url;
ALTER TABLE public.partners DROP COLUMN display_order;
