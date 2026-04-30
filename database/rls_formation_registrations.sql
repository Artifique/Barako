-- Politiques RLS pour formation_registrations
ALTER TABLE public.formation_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own registrations" ON public.formation_registrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own registration" ON public.formation_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all registrations" ON public.formation_registrations
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
