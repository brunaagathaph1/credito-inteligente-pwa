
-- Migration: 006_banco_logs_auditoria.sql
-- Descrição: Cria tabela de contas bancárias e de logs de atividades/auditoria de usuários
-- Autor: Lovable AI
-- Data: 2025-04-22

-- =============================================
-- 1. TABELA DE CONTAS BANCÁRIAS
-- =============================================

CREATE TABLE IF NOT EXISTS public.contas_bancarias (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,                         -- Nome identificador da conta (ex: Conta Santader PJ)
  banco text NOT NULL,                        -- Nome/banco ex: Santander
  numero_agencia text NOT NULL,               -- Agência bancária (com digito)
  numero_conta text NOT NULL,                 -- Número da conta (com digito)
  tipo text NOT NULL,                         -- Tipo (ex: corrente, poupança)
  titular text,                               -- Nome do titular da conta
  cpf_cnpj text,                              -- CPF ou CNPJ do titular
  status text NOT NULL DEFAULT 'ativo',       -- Status (ativo, inativo, encerrada)
  observacoes text,
  criada_em timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  atualizada_em timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  criada_por uuid REFERENCES auth.users(id) NOT NULL
);

ALTER TABLE public.contas_bancarias ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS: somente o usuário autenticado que criou pode ler/escrever

CREATE POLICY "Usuário autenticado pode visualizar suas contas bancárias"
  ON public.contas_bancarias FOR SELECT
  TO authenticated
  USING (criada_por = auth.uid());

CREATE POLICY "Usuário autenticado pode criar conta bancária"
  ON public.contas_bancarias FOR INSERT
  TO authenticated
  WITH CHECK (criada_por = auth.uid());

CREATE POLICY "Usuário autenticado pode atualizar conta bancária"
  ON public.contas_bancarias FOR UPDATE
  TO authenticated
  USING (criada_por = auth.uid());

CREATE POLICY "Usuário autenticado pode excluir conta bancária"
  ON public.contas_bancarias FOR DELETE
  TO authenticated
  USING (criada_por = auth.uid());

CREATE INDEX IF NOT EXISTS idx_contas_bancarias_status ON public.contas_bancarias(status);

-- =============================================
-- 2. TABELA DE LOGS DE ATIVIDADES/AUDITORIA
-- =============================================

CREATE TABLE IF NOT EXISTS public.logs_atividades (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id uuid REFERENCES auth.users(id) NOT NULL,         -- Usuário responsável pela ação
  acao text NOT NULL,                                         -- Ação executada (ex: login, criar_cliente, editar_emprestimo, registrar_pagamento)
  detalhes jsonb,                                             -- Informações adicionais (id do objeto, fields modificados, etc)
  ip_origem text,                                             -- IP do usuário
  user_agent text,                                            -- User-Agent do navegador/dispositivo
  data_hora timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.logs_atividades ENABLE ROW LEVEL SECURITY;

-- Políticas: usuário só pode ver seus próprios logs
CREATE POLICY "Usuário autenticado pode ver seus próprios logs"
  ON public.logs_atividades FOR SELECT
  TO authenticated
  USING (usuario_id = auth.uid());

-- Apenas o próprio usuário pode inserir (audit log próprio)
CREATE POLICY "Usuário autenticado pode criar logs de atividades"
  ON public.logs_atividades FOR INSERT
  TO authenticated
  WITH CHECK (usuario_id = auth.uid());

-- Nenhuma atualização/deleção permitida (apenas leitura e inserção)

-- Optional: Index para consulta rápida por ação/data
CREATE INDEX IF NOT EXISTS idx_logs_atividades_acao_data ON public.logs_atividades(acao, data_hora);

-- =============================================
-- FIM
-- =============================================

