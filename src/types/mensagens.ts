export interface Template {
  id: string;
  nome: string;
  tipo: 'email' | 'whatsapp' | 'sms';
  assunto: string;
  conteudo: string;
  ativo: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
}

export interface Mensagem {
  id: string;
  cliente_id: string;
  template_id?: string;
  assunto: string;
  conteudo: string;
  tipo: 'email' | 'whatsapp' | 'sms';
  status: 'enviado' | 'agendado' | 'erro' | 'pendente';
  erro?: string;
  data_envio?: string;
  data_agendamento?: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  cliente?: {
    id: string;
    nome: string;
    email?: string;
    telefone?: string;
  };
  template?: Template;
}

export interface Agendamento {
  id: string;
  nome: string;
  tipo: 'automatico' | 'recorrente';
  evento: 'emprestimo_criado' | 'emprestimo_vencendo' | 'emprestimo_atrasado' | 'pagamento_confirmado';
  dias_antes: number;
  template_id?: string;
  template?: Template;
  ativo: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
}

export interface WebhookIntegracao {
  id: string;
  nome: string;
  url: string;
  eventos: string[];
  secret_key?: string;
  headers?: Record<string, string>;
  ativo: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
}

export interface VariavelTemplate {
  categoria: string;
  nome: string;
  descricao: string;
  valor: string;
}

export const VARIAVEIS_TEMPLATES: Record<string, VariavelTemplate[]> = {
  cliente: [
    { categoria: 'cliente', nome: 'nome', descricao: 'Nome do cliente', valor: '{{cliente.nome}}' },
    { categoria: 'cliente', nome: 'email', descricao: 'Email do cliente', valor: '{{cliente.email}}' },
    { categoria: 'cliente', nome: 'telefone', descricao: 'Telefone do cliente', valor: '{{cliente.telefone}}' }
  ],
  emprestimo: [
    { categoria: 'emprestimo', nome: 'valor_principal', descricao: 'Valor principal do empréstimo', valor: '{{emprestimo.valor_principal}}' },
    { categoria: 'emprestimo', nome: 'data_vencimento', descricao: 'Data de vencimento', valor: '{{emprestimo.data_vencimento}}' },
    { categoria: 'emprestimo', nome: 'status', descricao: 'Status do empréstimo', valor: '{{emprestimo.status}}' }
  ],
  pagamento: [
    { categoria: 'pagamento', nome: 'valor', descricao: 'Valor do pagamento', valor: '{{pagamento.valor}}' },
    { categoria: 'pagamento', nome: 'data', descricao: 'Data do pagamento', valor: '{{pagamento.data}}' }
  ]
};

export interface SystemSettings {
  id: string;
  name: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by?: string;
}
