export interface ConfiguracaoFinanceira {
  id: string;
  nome: string;
  taxa_padrao_juros: number;
  tipo_juros_padrao: 'simples' | 'composto';
  prazo_maximo_dias: number;
  taxa_juros_atraso: number;
  taxa_multa_atraso: number;
  juros_sobre_juros: boolean;
  acumula_taxa_mensal: boolean;
  permite_carencia: boolean;
  status: 'ativo' | 'inativo' | 'modelo';
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  observacoes?: string;
}

export interface SimulacaoParcela {
  numero: number;
  valorParcela: number;
  valorTotal: number;
  dataVencimento?: string;
}