-- Add new app_role for admin users if it doesn't exist yet
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('user', 'admin');
  END IF;
END $$;

-- Add unique constraint to nome in configuracoes_financeiras (corrected syntax)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'configuracoes_financeiras' 
    AND constraint_type = 'UNIQUE' 
    AND constraint_name = 'configuracoes_financeiras_nome_key'
  ) THEN
    ALTER TABLE public.configuracoes_financeiras 
    ADD CONSTRAINT configuracoes_financeiras_nome_key UNIQUE (nome);
  END IF;
END $$;

-- Create system_settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users NOT NULL,
  updated_by UUID REFERENCES auth.users
);

-- Create table for agendamentos
CREATE TABLE IF NOT EXISTS public.agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('automatico', 'recorrente')),
  evento TEXT NOT NULL,
  dias_antes INTEGER NOT NULL DEFAULT 0,
  template_id UUID REFERENCES public.templates_mensagens(id),
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users NOT NULL
);

-- Enable row level security
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can select system settings" ON public.system_settings;
DROP POLICY IF EXISTS "Only admins can insert system settings" ON public.system_settings;
DROP POLICY IF EXISTS "Only admins can update system settings" ON public.system_settings;
DROP POLICY IF EXISTS "Only admins can delete system settings" ON public.system_settings;
DROP POLICY IF EXISTS "Anyone can select agendamentos" ON public.agendamentos;
DROP POLICY IF EXISTS "Authenticated users can insert agendamentos" ON public.agendamentos;
DROP POLICY IF EXISTS "Users can update their own agendamentos" ON public.agendamentos;
DROP POLICY IF EXISTS "Users can delete their own agendamentos" ON public.agendamentos;

-- Create policies for system_settings
CREATE POLICY "Select system settings"
  ON public.system_settings FOR SELECT
  USING (true);

CREATE POLICY "Insert system settings for admins"
  ON public.system_settings FOR INSERT
  WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Update system settings for admins"
  ON public.system_settings FOR UPDATE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Delete system settings for admins"
  ON public.system_settings FOR DELETE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Create policies for agendamentos
CREATE POLICY "Select agendamentos"
  ON public.agendamentos FOR SELECT
  USING (true);

CREATE POLICY "Insert agendamentos for authenticated users"
  ON public.agendamentos FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Update own agendamentos"
  ON public.agendamentos FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Delete own agendamentos"
  ON public.agendamentos FOR DELETE
  USING (auth.uid() = created_by);