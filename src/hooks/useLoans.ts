
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { emprestimosApi, pagamentosApi } from "@/integrations/supabase/helpers";
import { toast } from "sonner";
import { triggerEmprestimoNovo } from "@/utils/eventTriggers";

export interface Pagamento {
  id: string;
  emprestimo_id: string;
  valor: number;
  data_pagamento: string;
  tipo: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface Loan {
  id: string;
  cliente_id: string;
  valor_principal: number;
  taxa_juros: number;
  tipo_juros: string;
  data_emprestimo: string;
  data_vencimento: string;
  status: string;
  observacoes?: string;
  renegociacao_id?: string;
  renegociado: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  cliente?: {
    id: string;
    nome: string;
    telefone?: string;
    email?: string;
  };
  pagamentos?: Pagamento[];
}

export const useLoans = () => {
  const queryClient = useQueryClient();

  // Get all loans
  const { data: loans, isLoading: isLoadingLoans } = useQuery({
    queryKey: ['loans'],
    queryFn: async () => {
      try {
        const { data, error } = await emprestimosApi.getAll();
        
        if (error) throw error;
        
        // Fetch pagamentos for each loan
        const loansWithPayments = await Promise.all(
          data.map(async (loan) => {
            const { data: pagamentos } = await pagamentosApi.getByEmprestimoId(loan.id);
            return {
              ...loan,
              pagamentos: pagamentos || []
            } as Loan;
          })
        );
        
        return loansWithPayments;
      } catch (error) {
        console.error("Error fetching loans:", error);
        toast.error("Erro ao carregar empréstimos");
        return [];
      }
    }
  });

  // Get loan by ID
  const getLoanById = async (id: string) => {
    try {
      const { data, error } = await emprestimosApi.getById(id);
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching loan:", error);
      toast.error("Erro ao carregar dados do empréstimo");
      throw error;
    }
  };

  // Create new loan
  const createLoan = useMutation({
    mutationFn: async (loanData: Omit<Loan, "id" | "created_at" | "updated_at" | "cliente" | "pagamentos">) => {
      try {
        // First create the loan
        const { data, error } = await emprestimosApi.create(loanData);
        if (error) throw error;
        
        // Trigger webhook/notification events for new loan
        if (data) {
          try {
            await triggerEmprestimoNovo(data);
            console.log("Event notifications triggered for new loan");
          } catch (eventError) {
            console.error("Error triggering event notifications:", eventError);
            // Continue even if event trigger fails
          }
        }
        
        return data;
      } catch (error) {
        console.error("Error creating loan:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      toast.success("Empréstimo criado com sucesso!");
    },
    onError: (error: any) => {
      console.error("Error creating loan:", error);
      toast.error(`Erro ao criar empréstimo: ${error.message || "Erro desconhecido"}`);
    }
  });

  // Update loan
  const updateLoan = useMutation({
    mutationFn: async ({ id, loanData }: { id: string; loanData: Partial<Loan> }) => {
      const { data, error } = await emprestimosApi.update(id, loanData);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      toast.success("Empréstimo atualizado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar empréstimo: ${error.message || "Erro desconhecido"}`);
    }
  });

  // Delete loan
  const deleteLoan = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await emprestimosApi.delete(id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      toast.success("Empréstimo excluído com sucesso!");
    },
    onError: (error: any) => {
      toast.error(`Erro ao excluir empréstimo: ${error.message || "Erro desconhecido"}`);
    }
  });

  return {
    loans,
    isLoadingLoans,
    getLoanById,
    createLoan,
    updateLoan,
    deleteLoan
  };
};
