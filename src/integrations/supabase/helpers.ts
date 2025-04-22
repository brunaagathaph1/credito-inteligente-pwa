
import { supabase } from './client';

// Tipo para usuários
export type UserProfile = {
  id: string;
  email: string;
  nome: string;
  role: 'admin' | 'user';
};

// Funções auxiliares para autenticação
export const auth = {
  // Cadastrar usuário
  async signUp(email: string, password: string, nome: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome
        }
      }
    });
    return { data, error };
  },

  // Login com email e senha
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Logout
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Recuperar senha
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/recuperar-senha`
    });
    return { error };
  },

  // Obter usuário atual
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    return { data: data?.user, error };
  }
};

// Funções auxiliares para clientes
export const clientesApi = {
  // Listar todos os clientes
  async getAll() {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('nome');
    return { data, error };
  },

  // Obter um cliente por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  // Criar um novo cliente
  async create(cliente: any) {
    const { data, error } = await supabase
      .from('clientes')
      .insert(cliente)
      .select();
    return { data, error };
  },

  // Atualizar um cliente
  async update(id: string, cliente: any) {
    const { data, error } = await supabase
      .from('clientes')
      .update(cliente)
      .eq('id', id)
      .select();
    return { data, error };
  },

  // Excluir um cliente
  async delete(id: string) {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Funções auxiliares para empréstimos
export const emprestimosApi = {
  // Listar todos os empréstimos
  async getAll() {
    const { data, error } = await supabase
      .from('emprestimos')
      .select(`
        *,
        clientes (
          id,
          nome
        )
      `)
      .order('data_emprestimo', { ascending: false });
    return { data, error };
  },

  // Obter um empréstimo por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('emprestimos')
      .select(`
        *,
        clientes (
          id,
          nome,
          telefone,
          email
        ),
        pagamentos (*)
      `)
      .eq('id', id)
      .single();
    return { data, error };
  },

  // Criar um novo empréstimo
  async create(emprestimo: any) {
    const { data, error } = await supabase
      .from('emprestimos')
      .insert(emprestimo)
      .select();
    return { data, error };
  },

  // Atualizar um empréstimo
  async update(id: string, emprestimo: any) {
    const { data, error } = await supabase
      .from('emprestimos')
      .update(emprestimo)
      .eq('id', id)
      .select();
    return { data, error };
  },

  // Excluir um empréstimo
  async delete(id: string) {
    const { error } = await supabase
      .from('emprestimos')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Funções auxiliares para pagamentos
export const pagamentosApi = {
  // Listar todos os pagamentos de um empréstimo
  async getByEmprestimoId(emprestimoId: string) {
    const { data, error } = await supabase
      .from('pagamentos')
      .select('*')
      .eq('emprestimo_id', emprestimoId)
      .order('data_pagamento');
    return { data, error };
  },

  // Criar um novo pagamento
  async create(pagamento: any) {
    const { data, error } = await supabase
      .from('pagamentos')
      .insert(pagamento)
      .select();
    return { data, error };
  },

  // Atualizar um pagamento
  async update(id: string, pagamento: any) {
    const { data, error } = await supabase
      .from('pagamentos')
      .update(pagamento)
      .eq('id', id)
      .select();
    return { data, error };
  },

  // Excluir um pagamento
  async delete(id: string) {
    const { error } = await supabase
      .from('pagamentos')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Funções auxiliares para configurações
export const configuracoesApi = {
  // Obter configurações
  async get() {
    const { data, error } = await supabase
      .from('configuracoes')
      .select('*')
      .limit(1)
      .single();
    return { data, error };
  },

  // Atualizar configurações
  async update(id: string, configuracoes: any) {
    const { data, error } = await supabase
      .from('configuracoes')
      .update(configuracoes)
      .eq('id', id)
      .select();
    return { data, error };
  }
};

// Funções auxiliares para templates de mensagens
export const templatesApi = {
  // Listar todos os templates
  async getAll() {
    const { data, error } = await supabase
      .from('templates_mensagem')
      .select('*');
    return { data, error };
  },

  // Obter um template por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('templates_mensagem')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  // Criar um novo template
  async create(template: any) {
    const { data, error } = await supabase
      .from('templates_mensagem')
      .insert(template)
      .select();
    return { data, error };
  },

  // Atualizar um template
  async update(id: string, template: any) {
    const { data, error } = await supabase
      .from('templates_mensagem')
      .update(template)
      .eq('id', id)
      .select();
    return { data, error };
  },

  // Excluir um template
  async delete(id: string) {
    const { error } = await supabase
      .from('templates_mensagem')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Funções auxiliares para mensagens agendadas
export const mensagensApi = {
  // Listar todas as mensagens agendadas
  async getAll() {
    const { data, error } = await supabase
      .from('mensagens_agendadas')
      .select(`
        *,
        clientes (
          id,
          nome
        ),
        templates_mensagem (
          id,
          nome
        )
      `)
      .order('data_agendamento');
    return { data, error };
  },

  // Obter uma mensagem por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('mensagens_agendadas')
      .select(`
        *,
        clientes (
          id,
          nome,
          telefone,
          email
        ),
        templates_mensagem (
          id,
          nome,
          conteudo
        )
      `)
      .eq('id', id)
      .single();
    return { data, error };
  },

  // Criar uma nova mensagem agendada
  async create(mensagem: any) {
    const { data, error } = await supabase
      .from('mensagens_agendadas')
      .insert(mensagem)
      .select();
    return { data, error };
  },

  // Atualizar uma mensagem agendada
  async update(id: string, mensagem: any) {
    const { data, error } = await supabase
      .from('mensagens_agendadas')
      .update(mensagem)
      .eq('id', id)
      .select();
    return { data, error };
  },

  // Excluir uma mensagem agendada
  async delete(id: string) {
    const { error } = await supabase
      .from('mensagens_agendadas')
      .delete()
      .eq('id', id);
    return { error };
  }
};
