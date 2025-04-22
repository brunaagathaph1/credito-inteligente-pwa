import { supabase } from './client';
import type { Database } from './types';

// Auth helper functions
export const auth = {
  async signUp(email: string, password: string, nome: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nome }
      }
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  },

  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    return { data: data?.user, error };
  }
};

// Cliente helper functions
export const clientesApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('nome');
    return { data, error };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  async create(cliente: Omit<Database['public']['Tables']['clientes']['Insert'], 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('clientes')
      .insert(cliente)
      .select()
      .single();
    return { data, error };
  },

  async update(id: string, cliente: Partial<Database['public']['Tables']['clientes']['Update']>) {
    const { data, error } = await supabase
      .from('clientes')
      .update(cliente)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Empréstimos helper functions
export const emprestimosApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('emprestimos')
      .select(`
        *,
        cliente:clientes(id, nome)
      `)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('emprestimos')
      .select(`
        *,
        cliente:clientes(id, nome, telefone, email),
        pagamentos(*)
      `)
      .eq('id', id)
      .single();
    return { data, error };
  },

  async create(emprestimo: Omit<Database['public']['Tables']['emprestimos']['Insert'], 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('emprestimos')
      .insert(emprestimo)
      .select()
      .single();
    return { data, error };
  },

  async update(id: string, emprestimo: Partial<Database['public']['Tables']['emprestimos']['Update']>) {
    const { data, error } = await supabase
      .from('emprestimos')
      .update(emprestimo)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('emprestimos')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Pagamentos helper functions
export const pagamentosApi = {
  async getByEmprestimoId(emprestimoId: string) {
    const { data, error } = await supabase
      .from('pagamentos')
      .select('*')
      .eq('emprestimo_id', emprestimoId)
      .order('data_pagamento');
    return { data, error };
  },

  async create(pagamento: Omit<Database['public']['Tables']['pagamentos']['Insert'], 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('pagamentos')
      .insert(pagamento)
      .select()
      .single();
    return { data, error };
  },

  async update(id: string, pagamento: Partial<Database['public']['Tables']['pagamentos']['Update']>) {
    const { data, error } = await supabase
      .from('pagamentos')
      .update(pagamento)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('pagamentos')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Categorias helper functions
export const categoriasApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    return { data, error };
  },

  async create(categoria: Omit<Database['public']['Tables']['categories']['Insert'], 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('categories')
      .insert(categoria)
      .select()
      .single();
    return { data, error };
  },

  async update(id: string, categoria: Partial<Database['public']['Tables']['categories']['Update']>) {
    const { data, error } = await supabase
      .from('categories')
      .update(categoria)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Métodos de Pagamento helper functions
export const metodosApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .order('name');
    return { data, error };
  },

  async create(metodo: Omit<Database['public']['Tables']['payment_methods']['Insert'], 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('payment_methods')
      .insert(metodo)
      .select()
      .single();
    return { data, error };
  },

  async update(id: string, metodo: Partial<Database['public']['Tables']['payment_methods']['Update']>) {
    const { data, error } = await supabase
      .from('payment_methods')
      .update(metodo)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Contas Bancárias helper functions
export const contasBancariasApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('contas_bancarias')
      .select('*')
      .order('criada_em', { ascending: false });
    return { data, error };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('contas_bancarias')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },

  async create(conta: Omit<Database['public']['Tables']['contas_bancarias']['Insert'], 'id' | 'criada_em' | 'atualizada_em'>) {
    const { data, error } = await supabase
      .from('contas_bancarias')
      .insert(conta)
      .select()
      .single();
    return { data, error };
  },

  async update(id: string, conta: Partial<Database['public']['Tables']['contas_bancarias']['Update']>) {
    const { data, error } = await supabase
      .from('contas_bancarias')
      .update({
        ...conta,
        atualizada_em: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('contas_bancarias')
      .delete()
      .eq('id', id);
    return { error };
  }
};
