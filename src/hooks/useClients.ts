import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientesApi } from '@/integrations/supabase/helpers';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type Cliente = Database['public']['Tables']['clientes']['Row'];
type ClienteInsert = Database['public']['Tables']['clientes']['Insert'];

export function useClients(clientId?: string) {
  const queryClient = useQueryClient();

  const { data: clients, isLoading: isLoadingClients, error: clientsError, refetch } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await clientesApi.getAll();
      if (error) throw error;
      return data;
    },
  });

  const { data: client, isLoading: isClientLoading } = useQuery({
    queryKey: ['client', clientId],
    queryFn: async () => {
      if (!clientId) return null;
      const { data, error } = await clientesApi.getById(clientId);
      if (error) throw error;
      return data;
    },
    enabled: !!clientId,
  });

  const createClient = useMutation({
    mutationFn: (data: Omit<ClienteInsert, 'id' | 'created_at' | 'updated_at'>) => 
      clientesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (error: any) => {
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
    onError: (error: any) => {
      toast.error('Erro ao atualizar cliente: ' + error.message);
    },
  });

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Cliente excluído com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir cliente:', error);
      toast.error(`Erro ao excluir cliente: ${error.message}`);
      throw error;
    }
  };

  const deleteClientMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    }
  });

  return {
    clients,
    client,
    isLoadingClients,
    isClientLoading,
    clientsError,
    refetch,
    createClient,
    updateClient,
    useDeleteClient: () => deleteClientMutation,
  };
}
