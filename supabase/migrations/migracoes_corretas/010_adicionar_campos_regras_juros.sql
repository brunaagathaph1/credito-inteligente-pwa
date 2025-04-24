-- Adicionar campos para regras personalizadas de juros
ALTER TABLE public.configuracoes_financeiras 
ADD COLUMN IF NOT EXISTS juros_sobre_juros boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS acumula_taxa_mensal boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS permite_carencia boolean DEFAULT false;

-- Criar tipo enum para status de configuração
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'config_status') THEN
    CREATE TYPE public.config_status AS ENUM ('ativo', 'inativo', 'modelo');
  END IF;
END $$;

-- Adicionar campo status
ALTER TABLE public.configuracoes_financeiras 
ADD COLUMN IF NOT EXISTS status config_status DEFAULT 'ativo'::config_status;

-- Criar índice para busca por nome
CREATE INDEX IF NOT EXISTS idx_config_financeiras_nome ON public.configuracoes_financeiras(nome);

-- Criar índice para busca por status
CREATE INDEX IF NOT EXISTS idx_config_financeiras_status ON public.configuracoes_financeiras(status);

-- Atualizar configurações existentes para usar os novos campos
UPDATE public.configuracoes_financeiras 
SET 
  juros_sobre_juros = false,
  acumula_taxa_mensal = false,
  permite_carencia = true,
  status = 'ativo'
WHERE nome = 'default';

-- Garantir que todos os registros tenham um status válido
UPDATE public.configuracoes_financeiras 
SET status = 'ativo' 
WHERE status IS NULL;