
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Agendamento, Mensagem, Template, WebhookIntegracao } from "@/types/mensagens";

export const useMensagens = () => {
  const queryClient = useQueryClient();

  // Templates
  const useTemplates = () => {
    return useQuery({
      queryKey: ['templates'],
      queryFn: async () => {
        try {
          const { data, error } = await supabase
            .from('templates_mensagens')
            .select('*')
            .order('nome');
          
          if (error) throw error;
          return data as Template[];
        } catch (error) {
          console.error("Error fetching templates:", error);
          toast.error("Erro ao carregar templates");
          return [];
        }
      }
    });
  };

  const createTemplate = useMutation({
    mutationFn: async (template: Omit<Template, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const { data, error } = await supabase
          .from('templates_mensagens')
          .insert(template)
          .select()
          .single();
        
        if (error) throw error;
        return data as Template;
      } catch (error) {
        console.error("Error creating template:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success("Template criado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar template: ${error.message || "Erro desconhecido"}`);
    }
  });

  const updateTemplate = useMutation({
    mutationFn: async ({ id, template }: { id: string; template: Partial<Template> }) => {
      try {
        const { data, error } = await supabase
          .from('templates_mensagens')
          .update(template)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return data as Template;
      } catch (error) {
        console.error("Error updating template:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success("Template atualizado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar template: ${error.message || "Erro desconhecido"}`);
    }
  });

  const deleteTemplate = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from('templates_mensagens')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return id;
      } catch (error) {
        console.error("Error deleting template:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success("Template excluído com sucesso!");
    },
    onError: (error: any) => {
      toast.error(`Erro ao excluir template: ${error.message || "Erro desconhecido"}`);
    }
  });

  // Mensagens
  const useMensagensHistory = () => {
    return useQuery({
      queryKey: ['mensagens'],
      queryFn: async () => {
        try {
          const { data, error } = await supabase
            .from('mensagens')
            .select(`
              *,
              cliente:cliente_id(id, nome)
            `)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          return data as Mensagem[];
        } catch (error) {
          console.error("Error fetching mensagens:", error);
          toast.error("Erro ao carregar histórico de mensagens");
          return [];
        }
      }
    });
  };

  const createMensagem = useMutation({
    mutationFn: async (mensagem: Omit<Mensagem, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const { data, error } = await supabase
          .from('mensagens')
          .insert(mensagem)
          .select()
          .single();
        
        if (error) throw error;
        return data as Mensagem;
      } catch (error) {
        console.error("Error creating mensagem:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mensagens'] });
      toast.success("Mensagem enviada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(`Erro ao enviar mensagem: ${error.message || "Erro desconhecido"}`);
    }
  });

  // Agendamentos
  const useAgendamentos = () => {
    return useQuery({
      queryKey: ['agendamentos'],
      queryFn: async () => {
        try {
          const { data, error } = await supabase
            .from('agendamentos')
            .select(`
              *,
              template:template_id(id, nome)
            `)
            .order('nome');
          
          if (error) {
            // Se a tabela não existir, retorna array vazio sem erro
            if (error.code === '42P01') {
              return [];
            }
            throw error;
          }
          
          return data as Agendamento[];
        } catch (error) {
          console.error("Error fetching agendamentos:", error);
          toast.error("Erro ao carregar agendamentos");
          return [];
        }
      }
    });
  };

  const createAgendamento = useMutation({
    mutationFn: async (agendamento: Omit<Agendamento, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const { data, error } = await supabase
          .from('agendamentos')
          .insert(agendamento)
          .select()
          .single();
        
        if (error) throw error;
        return data as Agendamento;
      } catch (error) {
        console.error("Error creating agendamento:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      toast.success("Agendamento criado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar agendamento: ${error.message || "Erro desconhecido"}`);
    }
  });

  // Webhooks e Integrações
  const useWebhooks = () => {
    return useQuery({
      queryKey: ['webhooks'],
      queryFn: async () => {
        try {
          const { data, error } = await supabase
            .from('webhooks')
            .select('*')
            .order('nome');
          
          if (error) throw error;
          return data as WebhookIntegracao[];
        } catch (error) {
          console.error("Error fetching webhooks:", error);
          toast.error("Erro ao carregar webhooks");
          return [];
        }
      }
    });
  };

  const saveWebhook = useMutation({
    mutationFn: async (webhook: Omit<WebhookIntegracao, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        const { data, error } = await supabase
          .from('webhooks')
          .insert(webhook)
          .select()
          .single();
        
        if (error) throw error;
        return data as WebhookIntegracao;
      } catch (error) {
        console.error("Error creating webhook:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast.success("Webhook salvo com sucesso!");
    },
    onError: (error: any) => {
      toast.error(`Erro ao salvar webhook: ${error.message || "Erro desconhecido"}`);
    }
  });

  return {
    // Templates
    useTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    
    // Mensagens
    useMensagensHistory,
    createMensagem,
    
    // Agendamentos
    useAgendamentos,
    createAgendamento,
    
    // Webhooks
    useWebhooks,
    saveWebhook
  };
};
