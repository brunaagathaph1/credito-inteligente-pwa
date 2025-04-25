-- Atualizar constraint de status dos empréstimos para incluir status 'renegociado'
ALTER TABLE public.emprestimos 
  DROP CONSTRAINT IF EXISTS emprestimos_status_check;
  
ALTER TABLE public.emprestimos 
  ADD CONSTRAINT emprestimos_status_check
  CHECK (status IN ('pendente', 'em_dia', 'atrasado', 'quitado', 'renegociado'));