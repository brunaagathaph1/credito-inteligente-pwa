
import { supabase } from "@/integrations/supabase/client";

// Function to send WhatsApp notification via Evolution API
export const sendEvolutionApiNotification = async (
  phoneNumber: string, 
  message: string,
  templateData?: any
) => {
  try {
    // Get Evolution API configuration
    const { data, error } = await supabase
      .from('configuracoes_financeiras')
      .select('observacoes')
      .eq('nome', 'evolution_api')
      .maybeSingle();
      
    if (error) throw error;
    
    if (!data || !data.observacoes) {
      console.log("Evolution API not configured");
      return false;
    }
    
    try {
      const config = JSON.parse(data.observacoes);
      
      if (!config.webhook_url || !config.api_key) {
        console.log("URL or API key not configured");
        return false;
      }
      
      // Format phone number (remove non-digits)
      const formattedPhone = phoneNumber.replace(/\D/g, '');
      
      // Prepare payload for the webhook
      const payload = {
        phone: formattedPhone,
        message,
        ...templateData
      };
      
      console.log(`Preparing to send Evolution API notification to ${formattedPhone}`);
      console.log("Webhook URL:", config.webhook_url);
      
      // Send the actual webhook request
      try {
        const response = await fetch(config.webhook_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.api_key}`
          },
          body: JSON.stringify(payload)
        });
        
        const responseData = await response.json();
        
        // Log the webhook event
        await logMessageEvent("whatsapp_sent", {
          ...payload,
          success: response.ok,
          response: responseData
        });
        
        if (!response.ok) {
          console.error("Error from webhook:", responseData);
          return false;
        }
        
        console.log("Evolution API notification sent successfully");
        return true;
      } catch (fetchError) {
        console.error("Fetch error:", fetchError);
        await logMessageEvent("whatsapp_error", {
          ...payload,
          error: fetchError.toString()
        });
        return false;
      }
    } catch (e) {
      console.error("Error parsing Evolution API config:", e);
      return false;
    }
  } catch (error) {
    console.error("Error sending Evolution API notification:", error);
    return false;
  }
};

// Function to log message events
export const logMessageEvent = async (event: string, payload: any) => {
  try {
    await supabase
      .from('mensagens')
      .insert({
        tipo: 'whatsapp',
        status: payload.success ? 'enviado' : 'erro',
        conteudo: payload.message,
        cliente_id: payload.cliente_id || null,
        emprestimo_id: payload.emprestimo_id || null,
        assunto: event,
        created_by: 'sistema',
        data_envio: new Date().toISOString(),
        erro: payload.success ? null : (payload.error || JSON.stringify(payload.response))
      });
      
    return true;
  } catch (error) {
    console.error("Error logging message event:", error);
    return false;
  }
};

// Function to process variables in templates
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
  
  // Process client variables
  if (data.cliente) {
    processedTemplate = processedTemplate.replace(/\{\{cliente\.nome\}\}/g, data.cliente.nome || '');
    processedTemplate = processedTemplate.replace(/\{\{cliente\.telefone\}\}/g, data.cliente.telefone || '');
    processedTemplate = processedTemplate.replace(/\{\{cliente\.email\}\}/g, data.cliente.email || '');
  }
  
  // Process loan variables
  if (data.emprestimo) {
    processedTemplate = processedTemplate.replace(/\{\{emprestimo\.valor_principal\}\}/g, 
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
        .format(Number(data.emprestimo.valor_principal)) || '');
    
    processedTemplate = processedTemplate.replace(/\{\{emprestimo\.data_vencimento\}\}/g, 
      new Date(data.emprestimo.data_vencimento).toLocaleDateString('pt-BR') || '');
      
    processedTemplate = processedTemplate.replace(/\{\{emprestimo\.taxa_juros\}\}/g, 
      `${data.emprestimo.taxa_juros}%` || '');
  }
  
  // Process payment variables
  if (data.pagamento) {
    processedTemplate = processedTemplate.replace(/\{\{pagamento\.valor\}\}/g, 
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
        .format(Number(data.pagamento.valor)) || '');
        
    processedTemplate = processedTemplate.replace(/\{\{pagamento\.data_pagamento\}\}/g, 
      new Date(data.pagamento.data_pagamento).toLocaleDateString('pt-BR') || '');
  }
  
  // Process other variables
  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'string' || typeof data[key] === 'number') {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      processedTemplate = processedTemplate.replace(regex, String(data[key]));
    }
  });
  
  return processedTemplate;
};

// Function to check and send scheduled messages
export const checkAndSendScheduledMessages = async () => {
  try {
    // Get all active schedules
    const { data: agendamentos, error: agendamentosError } = await supabase
      .from('agendamentos')
      .select(`
        *,
        template:template_id(*)
      `)
      .eq('ativo', true);
      
    if (agendamentosError) throw agendamentosError;
    if (!agendamentos || !agendamentos.length) return [];
    
    const today = new Date();
    const processedMessages = [];
    
    // For each schedule, check if we need to send messages
    for (const agendamento of agendamentos) {
      // Skip if no template
      if (!agendamento.template) continue;
      
      let emprestimosToProcess = [];
      
      // Get relevant loans based on event type
      switch (agendamento.evento) {
        case 'emprestimo_vencendo':
          // Get loans that will be due in X days (dias_antes)
          const targetDate = new Date();
          targetDate.setDate(today.getDate() + agendamento.dias_antes);
          const targetDateStr = targetDate.toISOString().split('T')[0];
          
          const { data: emprestimosVencendo, error: emprestimosVencendoError } = await supabase
            .from('emprestimos')
            .select(`
              *,
              cliente:clientes(*)
            `)
            .eq('data_vencimento', targetDateStr)
            .in('status', ['pendente', 'em_dia']);
            
          if (emprestimosVencendoError) throw emprestimosVencendoError;
          emprestimosToProcess = emprestimosVencendo || [];
          break;
          
        case 'emprestimo_atrasado':
          const today = new Date().toISOString().split('T')[0];
          
          const { data: emprestimosAtrasados, error: emprestimosAtrasadosError } = await supabase
            .from('emprestimos')
            .select(`
              *,
              cliente:clientes(*)
            `)
            .lt('data_vencimento', today)
            .eq('status', 'em_dia');
            
          if (emprestimosAtrasadosError) throw emprestimosAtrasadosError;
          emprestimosToProcess = emprestimosAtrasados || [];
          break;
          
        case 'emprestimo_criado':
          // Skip - this should be handled during loan creation
          break;
          
        case 'pagamento_confirmado':
          // Skip - this should be handled during payment registration
          break;
      }
      
      // Process each loan that meets the criteria
      for (const emprestimo of emprestimosToProcess) {
        if (!emprestimo.cliente || !emprestimo.cliente.telefone) continue;
        
        // Process template and send notification
        const message = await processTemplateVariables(
          agendamento.template.conteudo,
          { 
            cliente: emprestimo.cliente,
            emprestimo: emprestimo 
          }
        );
        
        const messageResult = await sendEvolutionApiNotification(
          emprestimo.cliente.telefone,
          message,
          {
            cliente_id: emprestimo.cliente_id,
            emprestimo_id: emprestimo.id
          }
        );
        
        processedMessages.push({
          emprestimo_id: emprestimo.id,
          cliente_id: emprestimo.cliente_id,
          agendamento_id: agendamento.id,
          success: messageResult
        });
      }
    }
    
    return processedMessages;
  } catch (error) {
    console.error("Error checking scheduled messages:", error);
    return [];
  }
};

// Function to handle loan creation notifications
export const handleLoanCreatedNotification = async (loanId: string) => {
  try {
    // Find template for loan creation
    const { data: agendamento, error: agendamentoError } = await supabase
      .from('agendamentos')
      .select(`
        *,
        template:template_id(*)
      `)
      .eq('evento', 'emprestimo_criado')
      .eq('ativo', true)
      .maybeSingle();
      
    if (agendamentoError) throw agendamentoError;
    if (!agendamento || !agendamento.template) return false;
    
    // Get loan with client data
    const { data: emprestimo, error: emprestimoError } = await supabase
      .from('emprestimos')
      .select(`
        *,
        cliente:clientes(*)
      `)
      .eq('id', loanId)
      .single();
      
    if (emprestimoError) throw emprestimoError;
    if (!emprestimo.cliente || !emprestimo.cliente.telefone) return false;
    
    // Process template and send notification
    const message = await processTemplateVariables(
      agendamento.template.conteudo,
      { 
        cliente: emprestimo.cliente,
        emprestimo: emprestimo 
      }
    );
    
    return await sendEvolutionApiNotification(
      emprestimo.cliente.telefone,
      message,
      {
        cliente_id: emprestimo.cliente_id,
        emprestimo_id: emprestimo.id
      }
    );
  } catch (error) {
    console.error("Error sending loan creation notification:", error);
    return false;
  }
};

// Function to handle payment confirmation notifications
export const handlePaymentConfirmedNotification = async (paymentId: string) => {
  try {
    // Find template for payment confirmation
    const { data: agendamento, error: agendamentoError } = await supabase
      .from('agendamentos')
      .select(`
        *,
        template:template_id(*)
      `)
      .eq('evento', 'pagamento_confirmado')
      .eq('ativo', true)
      .maybeSingle();
      
    if (agendamentoError) throw agendamentoError;
    if (!agendamento || !agendamento.template) return false;
    
    // Get payment with loan and client data
    const { data: pagamento, error: pagamentoError } = await supabase
      .from('pagamentos')
      .select(`
        *,
        emprestimo:emprestimo_id(
          *,
          cliente:cliente_id(*)
        )
      `)
      .eq('id', paymentId)
      .single();
      
    if (pagamentoError) throw pagamentoError;
    if (!pagamento.emprestimo || 
        !pagamento.emprestimo.cliente || 
        !pagamento.emprestimo.cliente.telefone) return false;
    
    // Process template and send notification
    const message = await processTemplateVariables(
      agendamento.template.conteudo,
      { 
        cliente: pagamento.emprestimo.cliente,
        emprestimo: pagamento.emprestimo,
        pagamento: pagamento
      }
    );
    
    return await sendEvolutionApiNotification(
      pagamento.emprestimo.cliente.telefone,
      message,
      {
        cliente_id: pagamento.emprestimo.cliente_id,
        emprestimo_id: pagamento.emprestimo_id,
        pagamento_id: pagamento.id
      }
    );
  } catch (error) {
    console.error("Error sending payment confirmed notification:", error);
    return false;
  }
};
