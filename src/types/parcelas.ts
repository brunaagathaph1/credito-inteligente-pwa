
export interface Parcela {
  id: string;
  emprestimo_id: string;
  numero: number;
  valor: number;
  data_vencimento: string;
  status: 'pendente' | 'paga' | 'atrasada';
  created_by: string;
  created_at?: string;
  updated_at?: string;
}
