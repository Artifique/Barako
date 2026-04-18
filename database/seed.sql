-- Données de démo (exécuter après schema.sql, sans utilisateurs auth requis)
-- Partenaires & formations exemples

insert into public.partners (name, description, display_order)
values
  ('Partenaire A', 'Accompagnement jeunes', 1),
  ('Partenaire B', 'Financement projets', 2);

insert into public.formations (title, type, description, start_date, end_date, duration_days, location, max_places)
values
  (
    'Employabilité digitale',
    'employability',
    'Outils bureautique, CV, entretien',
    (current_date + interval '14 days')::date,
    (current_date + interval '21 days')::date,
    5,
    'Bamako',
    25
  ),
  (
    'Entrepreneuriat agricole',
    'entrepreneurship',
    'Business model, accès marché',
    (current_date + interval '30 days')::date,
    (current_date + interval '37 days')::date,
    7,
    'Sikasso',
    20
  );
