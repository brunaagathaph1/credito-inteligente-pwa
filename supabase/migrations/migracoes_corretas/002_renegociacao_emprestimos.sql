
-- Migration: 005_renegociacao_emprestimos.sql
-- Descrição: Adiciona suporte para renegociação de empréstimos e configurações financeiras
-- Criado em: 2025-04-22

-- =============================================
-- PARTE 1: CONFIGURAÇÕES FINANCEIRAS
-- =============================================

-- Criação da tabela de configurações financeiras
CREATE TABLE public.configuracoes_financeiras (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  taxa_padrao_juros numeric(5,2) NOT NULL,
  tipo_juros_padrao text NOT NULL CHECK (tipo_juros_padrao IN ('simples', 'composto')),
  prazo_maximo_dias integer NOT NULL,
  taxa_multa_atraso numeric(5,2) NOT NULL,
  taxa_juros_atraso numeric(5,2) NOT NULL,
  ativo boolean DEFAULT true NOT NULL,
  observacoes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by uuid REFERENCES auth.users(id) NOT NULL
);

-- Ativar segurança por linha (RLS)
ALTER TABLE public.configuracoes_financeiras ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para configurações financeiras
CREATE POLICY "Usuários autenticados podem visualizar configurações financeiras" 
ON public.configuracoes_financeiras FOR SELECT 
TO authenticated USING (true);

CREATE POLICY "Usuários autenticados podem inserir suas configurações financeiras" 
ON public.configuracoes_financeiras FOR INSERT 
TO authenticated WITH CHECK (created_by = auth.uid());

CREATE POLICY "Usuários autenticados podem atualizar suas configurações financeiras" 
ON public.configuracoes_financeiras FOR UPDATE 
TO authenticated USING (created_by = auth.uid());

CREATE POLICY "Usuários autenticados podem excluir suas configurações financeiras" 
ON public.configuracoes_financeiras FOR DELETE 
TO authenticated USING (created_by = auth.uid());

-- =============================================
-- PARTE 2: RENEGOCIAÇÃO DE EMPRÉSTIMOS
-- =============================================

-- Criação da tabela de renegociações
CREATE TABLE public.renegociacoes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  emprestimo_id uuid REFERENCES public.emprestimos(id) ON DELETE CASCADE NOT NULL,
  emprestimo_anterior_valor numeric(10,2) NOT NULL,
  emprestimo_anterior_juros numeric(5,2) NOT NULL,
  emprestimo_anterior_vencimento date NOT NULL,
  novo_valor_principal numeric(10,2) NOT NULL,
  nova_taxa_juros numeric(5,2) NOT NULL,
  novo_tipo_juros text NOT NULL CHECK (novo_tipo_juros IN ('simples', 'composto')),
  nova_data_vencimento date NOT NULL,
  data_renegociacao date DEFAULT CURRENT_DATE NOT NULL,
  motivo text,
  observacoes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by uuid REFERENCES auth.users(id) NOT NULL
);

-- Ativar segurança por linha (RLS)
ALTER TABLE public.renegociacoes ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para renegociações
CREATE POLICY "Usuários autenticados podem visualizar renegociações" 
ON public.renegociacoes FOR SELECT 
TO authenticated USING (created_by = auth.uid());

CREATE POLICY "Usuários autenticados podem inserir renegociações" 
ON public.renegociacoes FOR INSERT 
TO authenticated WITH CHECK (created_by = auth.uid());

CREATE POLICY "Usuários autenticados podem atualizar renegociações" 
ON public.renegociacoes FOR UPDATE 
TO authenticated USING (created_by = auth.uid());

CREATE POLICY "Usuários autenticados podem excluir renegociações" 
ON public.renegociacoes FOR DELETE 
TO authenticated USING (created_by = auth.uid());

-- Adicionar coluna no empréstimo para indicar se foi renegociado
ALTER TABLE public.emprestimos ADD COLUMN IF NOT EXISTS renegociado boolean DEFAULT false;

-- Adicionar coluna no empréstimo para relacionar com renegociação
ALTER TABLE public.emprestimos ADD COLUMN IF NOT EXISTS renegociacao_id uuid REFERENCES public.renegociacoes(id);

-- =============================================
-- PARTE 3: SISTEMA DE MENSAGENS E TEMPLATES
-- =============================================

-- Criação da tabela de templates de mensagens
CREATE TABLE public.templates_mensagens (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  assunto text NOT NULL,
  conteudo text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('email', 'sms', 'whatsapp', 'notificacao')),
  ativo boolean DEFAULT true NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by uuid REFERENCES auth.users(id) NOT NULL
);

-- Ativar segurança por linha (RLS)
ALTER TABLE public.templates_mensagens ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para templates de mensagens
CREATE POLICY "Usuários autenticados podem visualizar templates de mensagens" 
ON public.templates_mensagens FOR SELECT 
TO authenticated USING (created_by = auth.uid());

CREATE POLICY "Usuários autenticados podem inserir templates de mensagens" 
ON public.templates_mensagens FOR INSERT 
TO authenticated WITH CHECK (created_by = auth.uid());

CREATE POLICY "Usuários autenticados podem atualizar templates de mensagens" 
ON public.templates_mensagens FOR UPDATE 
TO authenticated USING (created_by = auth.uid());

CREATE POLICY "Usuários autenticados podem excluir templates de mensagens" 
ON public.templates_mensagens FOR DELETE 
TO authenticated USING (created_by = auth.uid());

-- Criação da tabela de mensagens enviadas
CREATE TABLE public.mensagens (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id uuid REFERENCES public.templates_mensagens(id),
  cliente_id uuid REFERENCES public.clientes(id) NOT NULL,
  emprestimo_id uuid REFERENCES public.emprestimos(id),
  assunto text NOT NULL,
  conteudo text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('email', 'sms', 'whatsapp', 'notificacao')),
  status text NOT NULL CHECK (status IN ('agendada', 'enviada', 'falha', 'cancelada')),
  data_agendamento timestamp with time zone,
  data_envio timestamp with time zone,
  erro text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by uuid REFERENCES auth.users(id) NOT NULL
);

-- Ativar segurança por linha (RLS)
ALTER TABLE public.mensagens ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para mensagens
CREATE POLICY "Usuários autenticados podem visualizar mensagens" 
ON public.mensagens FOR SELECT 
TO authenticated USING (created_by = auth.uid());

CREATE POLICY "Usuários autenticados podem inserir mensagens" 
ON public.mensagens FOR INSERT 
TO authenticated WITH CHECK (created_by = auth.uid());

CREATE POLICY "Usuários autenticados podem atualizar mensagens" 
ON public.mensagens FOR UPDATE 
TO authenticated USING (created_by = auth.uid());

CREATE POLICY "Usuários autenticados podem excluir mensagens" 
ON public.mensagens FOR DELETE 
TO authenticated USING (created_by = auth.uid());

-- =============================================
-- PARTE 4: WEBHOOKS PARA INTEGRAÇÕES
-- =============================================

-- Criação da tabela de webhooks configurados
CREATE TABLE public.webhooks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  url text NOT NULL,
  eventos text[] NOT NULL,
  headers jsonb,
  ativo boolean DEFAULT true NOT NULL,
  secret_key text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by uuid REFERENCES auth.users(id) NOT NULL
);

-- Ativar segurança por linha (RLS)
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para webhooks
CREATE POLICY "Usuários autenticados podem visualizar webhooks" 
ON public.webhooks FOR SELECT 
TO authenticated USING (created_by = auth.uid());

CREATE POLICY "Usuários autenticados podem inserir webhooks" 
ON public.webhooks FOR INSERT 
TO authenticated WITH CHECK (created_by = auth.uid());

CREATE POLICY "Usuários autenticados podem atualizar webhooks" 
ON public.webhooks FOR UPDATE 
TO authenticated USING (created_by = auth.uid());

CREATE POLICY "Usuários autenticados podem excluir webhooks" 
ON public.webhooks FOR DELETE 
TO authenticated USING (created_by = auth.uid());

-- Tabela para registrar eventos de webhook
CREATE TABLE public.webhook_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  webhook_id uuid REFERENCES public.webhooks(id) ON DELETE CASCADE NOT NULL,
  evento text NOT NULL,
  payload jsonb NOT NULL,
  resposta jsonb,
  status text NOT NULL CHECK (status IN ('sucesso', 'falha', 'pendente')),
  erro text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar segurança por linha (RLS)
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para logs de webhook
CREATE POLICY "Usuários autenticados podem visualizar logs de webhook" 
ON public.webhook_logs FOR SELECT 
TO authenticated USING (
  webhook_id IN (
    SELECT id FROM public.webhooks WHERE created_by = auth.uid()
  )
);

-- Índices para melhorar performance
CREATE INDEX idx_renegociacoes_emprestimo_id ON public.renegociacoes(emprestimo_id);
CREATE INDEX idx_emprestimos_renegociacao_id ON public.emprestimos(renegociacao_id);
CREATE INDEX idx_mensagens_cliente_id ON public.mensagens(cliente_id);
CREATE INDEX idx_mensagens_emprestimo_id ON public.mensagens(emprestimo_id);
CREATE INDEX idx_mensagens_status ON public.mensagens(status);
CREATE INDEX idx_webhook_logs_webhook_id ON public.webhook_logs(webhook_id);
