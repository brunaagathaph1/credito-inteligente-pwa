export interface Loan {
  id: string;
  cliente_id: string;
  valor_principal: number | string;
  taxa_juros: number | string;
  prazo_meses?: number | string;
  data_inicio?: string;
  data_emprestimo: string;
  data_vencimento: string;
  status: 'aberto' | 'quitado' | 'atrasado' | 'renegociado' | 'pendente' | 'em_dia';
  cliente?: any;
  valor_total?: number | string;
  created_by: string;
  created_at: string;
  tipo_juros: string;
  observacoes?: string;
  renegociacao_id?: string;
  renegociado?: boolean;
  pagamentos?: Pagamento[];
}

export interface Pagamento {
  id: string;
  emprestimo_id: string;
  valor: number | string;
  data_pagamento: string;
  tipo: string;
  observacoes?: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface Parcela {
  id: string;
  emprestimo_id: string;
  numero: number;
  valor: number | string;
  data_vencimento: string;
  status: 'pendente' | 'paga' | 'atrasada';
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

export interface Renegociacao {
  id: string;
  emprestimo_id: string;
  emprestimo_anterior_valor: number;
  emprestimo_anterior_juros: number;
  emprestimo_anterior_vencimento: string;
  novo_valor_principal: number;
  nova_taxa_juros: number;
  novo_tipo_juros: string;
  nova_data_vencimento: string;
  data_renegociacao: string;
  motivo: string;
  forma_pagamento?: string;
  observacoes?: string;
  created_by: string;
  created_at?: string;
  emprestimo?: any;
}
