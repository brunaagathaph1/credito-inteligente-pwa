
-- Create a view for telefone without RLS policies 
CREATE OR REPLACE VIEW public.telefones_clientes AS
SELECT id, telefone
FROM public.clientes
WHERE telefone IS NOT NULL AND telefone != '';

-- Ensure we don't have policy issues with Evolution API
ALTER TABLE public.profiles ALTER COLUMN telefone DROP NOT NULL;

-- Create a webhook_logs table to store logs of webhook calls
CREATE TABLE IF NOT EXISTS public.webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID NOT NULL,
  evento TEXT NOT NULL,
  payload JSONB NOT NULL,
  resposta JSONB,
  erro TEXT,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Update emprestimos status type to match requirements
ALTER TABLE public.emprestimos 
  DROP CONSTRAINT IF EXISTS emprestimos_status_check;
  
ALTER TABLE public.emprestimos 
  ADD CONSTRAINT emprestimos_status_check
  CHECK (status IN ('pendente', 'em_dia', 'atrasado', 'quitado'));
