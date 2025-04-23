
export interface Pagamento {
  id: string;
  emprestimo_id: string;
  valor: number;
  data_pagamento: string;
  tipo: string;
  observacoes?: string;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}
