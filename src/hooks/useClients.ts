
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientesApi } from '@/integrations/supabase/helpers';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type Cliente = Database['public']['Tables']['clientes']['Row'];

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
    mutationFn: (data: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>) => 
      clientesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente cadastrado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao cadastrar cliente: ' + error.message);
    },
  });

  const updateClient = useMutation({
    mutationFn: ({ id, ...data }: Partial<Cliente> & { id: string }) => 
      clientesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar cliente: ' + error.message);
    },
  });

  const deleteClient = useMutation({
    mutationFn: (id: string) => clientesApi.delete(id),
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
