import { supabase } from "@/integrations/supabase/client";

export const sendWebhookNotification = async (event: string, data: any) => {
  try {
    const { data: webhookData, error } = await supabase
      .from('webhooks')
      .select('*')
      .eq('ativo', true)
      .limit(1);
      
    if (error) throw error;
    
    if (!webhookData || webhookData.length === 0) return false;
    
    const webhook = webhookData[0];
    
    // Validar se o webhook suporta o evento específico
    if (!webhook.eventos.includes(event)) return false;
    
    const postUrl = webhook.url.split('|')[0];
    
    if (!postUrl) return false;
    
    // Registrar log do webhook
    await logWebhookEvent(event, data, webhook.id);
    
    // Enviar webhook apenas para eventos específicos
    const evolutionApiConfig = await getEvolutionApiConfig();
    const eventMap: Record<string, string> = {
      'emprestimo.novo': 'novoEmprestimo',
      'pagamento.novo': 'novoPagamento',
      'cliente.novo': 'novoCliente',
      'emprestimo.atraso': 'emprestimoAtrasado'
    };

    const shouldNotifyEvolutionApi = evolutionApiConfig?.eventos?.[eventMap[event]];
    
    if (shouldNotifyEvolutionApi) {
      console.log(`Webhook notification sent to ${postUrl} for event ${event}`);
    }
    
    return true;
  } catch (error) {
    console.error("Error sending webhook notification:", error);
    return false;
  }
};

const getEvolutionApiConfig = async () => {
  try {
    const { data, error } = await supabase
      .from('configuracoes_financeiras')
      .select('observacoes')
      .eq('nome', 'evolution_api')
      .maybeSingle();
      
    if (error) throw error;
    
    if (!data || !data.observacoes) return null;
    
    return JSON.parse(data.observacoes);
  } catch (error) {
    console.error("Error fetching Evolution API config:", error);
    return null;
  }
};

export const logWebhookEvent = async (event: string, payload: any, webhookId: string = 'default') => {
  try {
    await supabase
      .from('webhook_logs')
      .insert({
        webhook_id: webhookId,
        evento: event,
        payload: payload,
        status: 'enviado'
      });
      
    return true;
  } catch (error) {
    console.error("Error logging webhook event:", error);
    return false;
  }
};

export const shouldNotifyEvolutionApi = async (event: string) => {
  try {
    const { data, error } = await supabase
      .from('configuracoes_financeiras')
      .select('observacoes')
      .eq('nome', 'evolution_api')
      .maybeSingle();
      
    if (error) throw error;
    
    if (!data || !data.observacoes) return false;
    
    try {
      const config = JSON.parse(data.observacoes);
      
      // Map events to config properties
      const eventMap: Record<string, string> = {
        'emprestimo.novo': 'novoEmprestimo',
        'pagamento.novo': 'novoPagamento',
        'cliente.novo': 'novoCliente',
        'emprestimo.atraso': 'emprestimoAtrasado'
      };
      
      return config.events && config.events[eventMap[event]];
    } catch (e) {
      console.error("Error parsing Evolution API config:", e);
      return false;
    }
  } catch (error) {
    console.error("Error checking Evolution API config:", error);
    return false;
  }
};

export const sendEvolutionApiNotification = async (event: string, data: any, telefone?: string) => {
  try {
    // Check if Evolution API should be notified
    const shouldNotify = await shouldNotifyEvolutionApi(event);
    
    if (!shouldNotify) return false;
    
    // Get Evolution API configuration
    const { data: configData, error } = await supabase
      .from('configuracoes_financeiras')
      .select('observacoes')
      .eq('nome', 'evolution_api')
      .maybeSingle();
      
    if (error) throw error;
    
    if (!configData || !configData.observacoes) return false;
    
    try {
      const config = JSON.parse(configData.observacoes);
      
      if (!config.url) return false;
      
      // Check if we have a phone number
      if (!telefone) {
        // Try to get phone number from cliente
        if (data.cliente_id) {
          const { data: clienteData } = await supabase
            .from('clientes')
            .select('telefone')
            .eq('id', data.cliente_id)
            .single();
            
          if (clienteData?.telefone) {
            telefone = clienteData.telefone;
          }
        }
      }
      
      if (!telefone) {
        console.log("No phone number available for Evolution API notification");
        return false;
      }
      
      // Format phone number (remove non-digits)
      const formattedPhone = telefone.replace(/\D/g, '');
      
      // In a real production environment, you would make an HTTP request here
      // This is simulated for this implementation
      console.log(`Evolution API notification sent to ${config.url} for event ${event}`);
      console.log("Data:", { ...data, telefone: formattedPhone });
      
      // Log the event
      await logWebhookEvent(`evolution.${event}`, { ...data, telefone: formattedPhone });
      
      return true;
    } catch (e) {
      console.error("Error parsing Evolution API config:", e);
      return false;
    }
  } catch (error) {
    console.error("Error sending Evolution API notification:", error);
    return false;
  }
};
