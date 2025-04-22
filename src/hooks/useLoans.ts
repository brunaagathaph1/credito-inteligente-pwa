
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { emprestimosApi, pagamentosApi } from "@/integrations/supabase/helpers";
import { toast } from "sonner";

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
            };
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
    mutationFn: async (loanData: any) => {
      const { data, error } = await emprestimosApi.create(loanData);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
    }
  });

  // Update loan
  const updateLoan = useMutation({
    mutationFn: async ({ id, loanData }: { id: string; loanData: any }) => {
      const { data, error } = await emprestimosApi.update(id, loanData);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
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
