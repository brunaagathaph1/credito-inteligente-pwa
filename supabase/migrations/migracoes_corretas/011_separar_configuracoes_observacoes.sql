-- Migration: 011_separar_configuracoes_observacoes.sql
-- Descrição: Adiciona coluna para configurações de juros nos empréstimos e forma de pagamento nas renegociações
-- Criado em: 2025-04-25

-- Adicionar nova coluna para configurações de juros
ALTER TABLE public.emprestimos ADD COLUMN IF NOT EXISTS configuracao_juros jsonb;

-- Adicionar nova coluna para forma de pagamento nas renegociações
ALTER TABLE public.renegociacoes ADD COLUMN IF NOT EXISTS forma_pagamento text;

-- Migrar dados das observações em formato JSON para o novo campo
DO $$
DECLARE
    emp RECORD;
BEGIN
    FOR emp IN 
        SELECT id, observacoes 
        FROM public.emprestimos 
        WHERE observacoes IS NOT NULL 
          AND observacoes::text LIKE '%configuracao_juros%'
    LOOP
        BEGIN
            UPDATE public.emprestimos
            SET 
                configuracao_juros = (observacoes::json)->'configuracao_juros',
                observacoes = NULL
            WHERE id = emp.id;
        EXCEPTION WHEN OTHERS THEN
            NULL; -- Ignora erros e mantém as observações como estão
        END;
    END LOOP;
END $$;

-- Criar índice para melhorar performance de consultas que usam configuracao_juros
CREATE INDEX IF NOT EXISTS idx_emprestimos_configuracao_juros ON public.emprestimos USING gin (configuracao_juros);