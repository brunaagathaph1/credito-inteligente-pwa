
-- Criar view para telefones de usuários (profiles)
CREATE OR REPLACE VIEW public.telefones_usuarios AS
SELECT id, telefone
FROM public.profiles
WHERE telefone IS NOT NULL;

-- Ajustar a view para não usar security invoker
ALTER VIEW public.telefones_usuarios SET (security_invoker = false);
