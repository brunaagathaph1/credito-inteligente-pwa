
import { sendEvolutionApiNotification } from "./webhookIntegration";

// Trigger events for new client
export const triggerClienteNovo = async (clienteData: any) => {
  // Send Evolution API notification (only for WhatsApp)
  if (clienteData.telefone) {
    await sendEvolutionApiNotification(
      clienteData.telefone,
      `Olá ${clienteData.nome}, bem-vindo! Seu cadastro foi realizado com sucesso.`,
      { cliente_id: clienteData.id }
    );
  }
};

// Trigger events for new loan
export const triggerEmprestimoNovo = async (emprestimoData: any) => {
  // Send Evolution API notification (only for WhatsApp)
  if (emprestimoData.cliente?.telefone) {
    await sendEvolutionApiNotification(
      emprestimoData.cliente.telefone,
      `Olá ${emprestimoData.cliente.nome}, seu empréstimo no valor de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(emprestimoData.valor_principal)} foi aprovado.`,
      { 
        cliente_id: emprestimoData.cliente_id,
        emprestimo_id: emprestimoData.id
      }
    );
  }
};

// Trigger events for new payment
export const triggerPagamentoNovo = async (pagamentoData: any) => {
  // Send Evolution API notification (only for WhatsApp)
  if (pagamentoData.cliente?.telefone) {
    await sendEvolutionApiNotification(
      pagamentoData.cliente.telefone,
      `Olá ${pagamentoData.cliente.nome}, recebemos seu pagamento de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pagamentoData.valor)}. Obrigado!`,
      { 
        cliente_id: pagamentoData.cliente_id,
        emprestimo_id: pagamentoData.emprestimo_id,
        pagamento_id: pagamentoData.id
      }
    );
  }
};

// Trigger events for late loan
export const triggerEmprestimoAtrasado = async (emprestimoData: any) => {
  // Send Evolution API notification (only for WhatsApp)
  if (emprestimoData.cliente?.telefone) {
    await sendEvolutionApiNotification(
      emprestimoData.cliente.telefone,
      `Olá ${emprestimoData.cliente.nome}, seu empréstimo está atrasado. Por favor, entre em contato conosco para regularizar.`,
      { 
        cliente_id: emprestimoData.cliente_id,
        emprestimo_id: emprestimoData.id
      }
    );
  }
};
