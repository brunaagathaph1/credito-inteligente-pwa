
-- Create system_settings table for admin settings
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users NOT NULL,
  updated_by UUID REFERENCES auth.users
);

-- Add new app_role for admin users
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE app_role AS ENUM ('user', 'admin');
  END IF;
END $$;

-- Add unique constraint to nome in configuracoes_financeiras
ALTER TABLE IF EXISTS public.configuracoes_financeiras
ADD CONSTRAINT configuracoes_financeiras_nome_key UNIQUE (nome);

-- Enable row level security
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for selecting system settings
CREATE POLICY "Anyone can select system settings"
  ON public.system_settings FOR SELECT
  USING (true);

-- Create policy for inserting system settings (admin only)
CREATE POLICY "Only admins can insert system settings"
  ON public.system_settings FOR INSERT
  WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Create policy for updating system settings (admin only)
CREATE POLICY "Only admins can update system settings"
  ON public.system_settings FOR UPDATE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Create policy for deleting system settings (admin only)
CREATE POLICY "Only admins can delete system settings"
  ON public.system_settings FOR DELETE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Create table for agendamentos if it doesn't exist
CREATE TABLE IF NOT EXISTS public.agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  evento TEXT NOT NULL,
  dias_antes INTEGER NOT NULL DEFAULT 0,
  template_id UUID REFERENCES public.templates_mensagens,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users NOT NULL
);

-- Enable row level security
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- Create policy for selecting agendamentos
CREATE POLICY "Anyone can select agendamentos"
  ON public.agendamentos FOR SELECT
  USING (true);

-- Create policy for inserting agendamentos
CREATE POLICY "Authenticated users can insert agendamentos"
  ON public.agendamentos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create policy for updating agendamentos
CREATE POLICY "Authenticated users can update agendamentos"
  ON public.agendamentos FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create policy for deleting agendamentos
CREATE POLICY "Authenticated users can delete agendamentos"
  ON public.agendamentos FOR DELETE
  USING (auth.role() = 'authenticated');
