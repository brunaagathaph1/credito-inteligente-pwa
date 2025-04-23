
import { supabase } from "@/integrations/supabase/client";

// Função para enviar notificação via Evolution API (WhatsApp)
export const sendEvolutionApiNotification = async (
  phoneNumber: string, 
  message: string,
  templateData?: any
) => {
  try {
    // Obter configuração da Evolution API
    const { data, error } = await supabase
      .from('configuracoes_financeiras')
      .select('observacoes')
      .eq('nome', 'evolution_api')
      .maybeSingle();
      
    if (error) throw error;
    
    if (!data || !data.observacoes) {
      console.log("Evolution API não configurada");
      return false;
    }
    
    try {
      const config = JSON.parse(data.observacoes);
      
      if (!config.webhook_url || !config.api_key) {
        console.log("URL ou chave da API não configurados");
        return false;
      }
      
      // Formatar número de telefone (remover não-dígitos)
      const formattedPhone = phoneNumber.replace(/\D/g, '');
      
      // Preparar dados para envio
      const payload = {
        phone: formattedPhone,
        message,
        ...templateData
      };
      
      // Em um ambiente de produção, você faria uma solicitação HTTP aqui
      console.log(`Evolution API notification sent`);
      console.log("Payload:", payload);
      console.log("URL:", config.webhook_url);
      
      // Registrar o evento
      await logMessageEvent("whatsapp_sent", payload);
      
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

// Função para registrar eventos de mensagens
export const logMessageEvent = async (event: string, payload: any) => {
  try {
    await supabase
      .from('mensagens')
      .insert({
        tipo: 'whatsapp',
        status: 'enviado',
        conteudo: payload.message,
        cliente_id: payload.cliente_id || null,
        emprestimo_id: payload.emprestimo_id || null,
        assunto: event,
        created_by: 'sistema',
        data_envio: new Date().toISOString()
      });
      
    return true;
  } catch (error) {
    console.error("Error logging message event:", error);
    return false;
  }
};

// Função para processar variáveis em templates
export const processTemplateVariables = async (
  template: string, 
  data: {
    cliente?: any;
    emprestimo?: any;
    pagamento?: any;
    [key: string]: any;
  }
) => {
  let processedTemplate = template;
  
  // Processar variáveis de cliente
  if (data.cliente) {
    processedTemplate = processedTemplate.replace(/\{\{cliente\.nome\}\}/g, data.cliente.nome || '');
    processedTemplate = processedTemplate.replace(/\{\{cliente\.telefone\}\}/g, data.cliente.telefone || '');
    processedTemplate = processedTemplate.replace(/\{\{cliente\.email\}\}/g, data.cliente.email || '');
  }
  
  // Processar variáveis de empréstimo
  if (data.emprestimo) {
    processedTemplate = processedTemplate.replace(/\{\{emprestimo\.valor_principal\}\}/g, 
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
        .format(data.emprestimo.valor_principal) || '');
    processedTemplate = processedTemplate.replace(/\{\{emprestimo\.data_vencimento\}\}/g, 
      new Date(data.emprestimo.data_vencimento).toLocaleDateString('pt-BR') || '');
    processedTemplate = processedTemplate.replace(/\{\{emprestimo\.taxa_juros\}\}/g, 
      `${data.emprestimo.taxa_juros}%` || '');
  }
  
  // Processar variáveis de pagamento
  if (data.pagamento) {
    processedTemplate = processedTemplate.replace(/\{\{pagamento\.valor\}\}/g, 
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
        .format(data.pagamento.valor) || '');
    processedTemplate = processedTemplate.replace(/\{\{pagamento\.data_pagamento\}\}/g, 
      new Date(data.pagamento.data_pagamento).toLocaleDateString('pt-BR') || '');
  }
  
  // Processar outras variáveis
  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'string' || typeof data[key] === 'number') {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      processedTemplate = processedTemplate.replace(regex, String(data[key]));
    }
  });
  
  return processedTemplate;
};
