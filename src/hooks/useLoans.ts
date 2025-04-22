
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { emprestimosApi } from '@/integrations/supabase/helpers';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type Emprestimo = Database['public']['Tables']['emprestimos']['Row'];

export function useLoans() {
  const queryClient = useQueryClient();

  const { data: loans, isLoading: isLoadingLoans } = useQuery({
    queryKey: ['loans'],
    queryFn: async () => {
      const { data, error } = await emprestimosApi.getAll();
      if (error) throw error;
      return data;
    },
  });

  const createLoan = useMutation({
    mutationFn: (data: Omit<Emprestimo, 'id' | 'created_at' | 'updated_at'>) => 
      emprestimosApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      toast.success('Empréstimo cadastrado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao cadastrar empréstimo: ' + error.message);
    },
  });

  const updateLoan = useMutation({
    mutationFn: ({ id, ...data }: Partial<Emprestimo> & { id: string }) => 
      emprestimosApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      toast.success('Empréstimo atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar empréstimo: ' + error.message);
    },
  });

  const deleteLoan = useMutation({
    mutationFn: (id: string) => emprestimosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      toast.success('Empréstimo removido com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao remover empréstimo: ' + error.message);
    },
  });

  return {
    loans,
    isLoadingLoans,
    createLoan,
    updateLoan,
    deleteLoan,
  };
}
