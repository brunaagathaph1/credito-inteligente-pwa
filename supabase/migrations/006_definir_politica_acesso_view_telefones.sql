
-- Create a policy for the telefones_clientes view to be readable by authenticated users
CREATE POLICY "Authenticated users can view all telefones"
  ON public.telefones_clientes
  FOR SELECT
  TO authenticated
  USING (true);
  
-- Making sure everyone can view this view regardless of RLS policies
ALTER VIEW public.telefones_clientes SET (security_invoker = false);
