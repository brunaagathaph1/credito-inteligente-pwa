-- Migration: 013_ajustar_rls_delete.sql
-- Descrição: Ajustar políticas RLS para permitir deleção
-- Criado em: 2025-04-25

-- Drop existing delete policies
DROP POLICY IF EXISTS "Usuários autenticados podem excluir clientes" ON public.clientes;
DROP POLICY IF EXISTS "Usuários autenticados podem excluir empréstimos" ON public.emprestimos;
DROP POLICY IF EXISTS "Usuários autenticados podem excluir pagamentos" ON public.pagamentos;
DROP POLICY IF EXISTS "Usuários autenticados podem excluir renegociações" ON public.renegociacoes;

-- Create new delete policies
CREATE POLICY "Usuários autenticados podem excluir clientes"
ON public.clientes FOR DELETE
TO authenticated
USING (true);

CREATE POLICY "Usuários autenticados podem excluir empréstimos"
ON public.emprestimos FOR DELETE
TO authenticated
USING (true);

CREATE POLICY "Usuários autenticados podem excluir pagamentos"
ON public.pagamentos FOR DELETE
TO authenticated
USING (true);

CREATE POLICY "Usuários autenticados podem excluir renegociações"
ON public.renegociacoes FOR DELETE
TO authenticated
USING (true);