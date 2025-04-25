-- Migration: 012_ajustar_delete_cascade.sql
-- Descrição: Ajusta as relações entre tabelas para permitir exclusão em cascata
-- Criado em: 2025-04-25

-- Remover as foreign keys existentes
ALTER TABLE public.emprestimos 
  DROP CONSTRAINT IF EXISTS emprestimos_cliente_id_fkey,
  DROP CONSTRAINT IF EXISTS emprestimos_renegociacao_id_fkey;

ALTER TABLE public.pagamentos
  DROP CONSTRAINT IF EXISTS pagamentos_emprestimo_id_fkey;

ALTER TABLE public.renegociacoes
  DROP CONSTRAINT IF EXISTS renegociacoes_emprestimo_id_fkey;

-- Recriar as foreign keys com ON DELETE CASCADE
ALTER TABLE public.emprestimos
  ADD CONSTRAINT emprestimos_cliente_id_fkey 
  FOREIGN KEY (cliente_id) 
  REFERENCES public.clientes(id) 
  ON DELETE CASCADE;

ALTER TABLE public.pagamentos
  ADD CONSTRAINT pagamentos_emprestimo_id_fkey 
  FOREIGN KEY (emprestimo_id) 
  REFERENCES public.emprestimos(id) 
  ON DELETE CASCADE;

ALTER TABLE public.renegociacoes
  ADD CONSTRAINT renegociacoes_emprestimo_id_fkey 
  FOREIGN KEY (emprestimo_id) 
  REFERENCES public.emprestimos(id) 
  ON DELETE CASCADE;

-- A relação emprestimo->renegociacao deve ser SET NULL pois é bidirecional
ALTER TABLE public.emprestimos
  ADD CONSTRAINT emprestimos_renegociacao_id_fkey 
  FOREIGN KEY (renegociacao_id) 
  REFERENCES public.renegociacoes(id) 
  ON DELETE SET NULL;