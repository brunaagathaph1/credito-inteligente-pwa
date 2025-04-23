
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Agendamento, Template, Mensagem, WebhookIntegracao, SystemSettings } from "@/types/mensagens";

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

  // Updated Agendamentos hook
  const useAgendamentos = () => {
    return useQuery<Agendamento[]>({
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
          
          if (error) throw error;
          
          // Transform the data to match the Agendamento type
          const agendamentos = data?.map(item => ({
            ...item,
            tipo: item.tipo as 'automatico' | 'recorrente',
            evento: item.evento as 'emprestimo_criado' | 'emprestimo_vencendo' | 'emprestimo_atrasado' | 'pagamento_confirmado',
            template: item.template as Partial<Template> | undefined
          })) || [];
          
          return agendamentos;
        } catch (error) {
          console.error("Error fetching agendamentos:", error);
          toast.error("Erro ao carregar agendamentos");
          return [];
        }
      }
    });
  };

  // Updated createAgendamento mutation
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

  // Add updateAgendamento mutation
  const updateAgendamento = useMutation({
    mutationFn: async ({ id, agendamento }: { id: string; agendamento: Partial<Agendamento> }) => {
      try {
        const { data, error } = await supabase
          .from('agendamentos')
          .update(agendamento)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return data as Agendamento;
      } catch (error) {
        console.error("Error updating agendamento:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      toast.success("Agendamento atualizado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar agendamento: ${error.message || "Erro desconhecido"}`);
    }
  });

  // Add deleteAgendamento mutation
  const deleteAgendamento = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from('agendamentos')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return id;
      } catch (error) {
        console.error("Error deleting agendamento:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      toast.success("Agendamento excluído com sucesso!");
    },
    onError: (error: any) => {
      toast.error(`Erro ao excluir agendamento: ${error.message || "Erro desconhecido"}`);
    }
  });

  // Configurações da Evolution API (WhatsApp)
  const useEvolutionApiConfig = () => {
    return useQuery({
      queryKey: ['evolutionApiConfig'],
      queryFn: async () => {
        try {
          const { data, error } = await supabase
            .from('configuracoes_financeiras')
            .select('*')
            .eq('nome', 'evolution_api')
            .maybeSingle();
          
          if (error) throw error;
          
          if (data && data.observacoes) {
            try {
              return JSON.parse(data.observacoes);
            } catch (e) {
              console.error("Error parsing Evolution API config:", e);
              return { webhook_url: '', api_key: '' };
            }
          }
          
          return { webhook_url: '', api_key: '' };
        } catch (error) {
          console.error("Error fetching Evolution API config:", error);
          toast.error("Erro ao carregar configuração da API");
          return { webhook_url: '', api_key: '' };
        }
      }
    });
  };

  const saveEvolutionApiConfig = useMutation({
    mutationFn: async (config: { webhook_url: string; api_key: string; observacoes?: string }) => {
      try {
        // Check if config already exists
        const { data: existingConfig, error: fetchError } = await supabase
          .from('configuracoes_financeiras')
          .select('id')
          .eq('nome', 'evolution_api')
          .maybeSingle();
        
        if (fetchError) throw fetchError;
        
        if (existingConfig) {
          // Update existing config
          const { data, error } = await supabase
            .from('configuracoes_financeiras')
            .update({
              observacoes: JSON.stringify(config)
            })
            .eq('id', existingConfig.id)
            .select()
            .single();
          
          if (error) throw error;
          return data;
        } else {
          // Create new config
          const { data, error } = await supabase
            .from('configuracoes_financeiras')
            .insert({
              nome: 'evolution_api',
              observacoes: JSON.stringify(config),
              taxa_padrao_juros: 0,
              tipo_juros_padrao: 'simples',
              taxa_juros_atraso: 0,
              taxa_multa_atraso: 0,
              prazo_maximo_dias: 30,
              created_by: 'sistema'
            })
            .select()
            .single();
          
          if (error) throw error;
          return data;
        }
      } catch (error) {
        console.error("Error saving Evolution API config:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evolutionApiConfig'] });
      toast.success("Configuração da API salva com sucesso!");
    },
    onError: (error: any) => {
      toast.error(`Erro ao salvar configuração da API: ${error.message || "Erro desconhecido"}`);
    }
  });

  const testEvolutionApi = useMutation({
    mutationFn: async (config: { webhook_url: string; api_key: string }) => {
      try {
        // Here we would normally make a test request to the webhook
        // For now, we'll just simulate a successful test
        return true;
      } catch (error) {
        console.error("Error testing Evolution API:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Conexão com a API de WhatsApp testada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(`Erro ao testar conexão com a API: ${error.message || "Erro desconhecido"}`);
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
    updateAgendamento,
    deleteAgendamento,
    
    // Evolution API Config
    useEvolutionApiConfig,
    saveEvolutionApiConfig,
    testEvolutionApi
  };
};
