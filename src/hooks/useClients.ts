
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientesApi } from '@/integrations/supabase/helpers';
import { toast } from 'sonner';

export function useClients() {
  const queryClient = useQueryClient();

  const { data: clients, isLoading: isLoadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await clientesApi.getAll();
      if (error) throw error;
      return data;
    },
  });

  const createClient = useMutation({
    mutationFn: clientesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente cadastrado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao cadastrar cliente: ' + error.message);
    },
  });

  const updateClient = useMutation({
    mutationFn: ({ id, ...data }) => clientesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar cliente: ' + error.message);
    },
  });

  const deleteClient = useMutation({
    mutationFn: clientesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente removido com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao remover cliente: ' + error.message);
    },
  });

  return {
    clients,
    isLoadingClients,
    createClient,
    updateClient,
    deleteClient,
  };
}
