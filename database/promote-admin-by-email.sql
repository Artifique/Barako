-- À utiliser SEULEMENT si le compte existe déjà dans Authentication
-- (mot de passe défini via l’app ou le dashboard Supabase).
-- Ne crée pas le mot de passe : voir scripts/seed-default-admin.mjs pour une création complète.

update public.profiles
set role = 'admin'
where lower(email) = lower('fombadaouda72@gmail.com');

-- Vérification (doit retourner une ligne avec role = admin) :
-- select id, email, role from public.profiles where lower(email) = lower('fombadaouda72@gmail.com');
