
import { sendWebhookNotification, sendEvolutionApiNotification } from "./webhookIntegration";

// Trigger events for new client
export const triggerClienteNovo = async (clienteData: any) => {
  // Send webhook notification
  await sendWebhookNotification("cliente.novo", clienteData);
  
  // Send Evolution API notification
  await sendEvolutionApiNotification("cliente.novo", clienteData, clienteData.telefone);
};

// Trigger events for new loan
export const triggerEmprestimoNovo = async (emprestimoData: any) => {
  // Send webhook notification
  await sendWebhookNotification("emprestimo.novo", emprestimoData);
  
  // Send Evolution API notification
  await sendEvolutionApiNotification("emprestimo.novo", emprestimoData);
};

// Trigger events for new payment
export const triggerPagamentoNovo = async (pagamentoData: any) => {
  // Send webhook notification
  await sendWebhookNotification("pagamento.novo", pagamentoData);
  
  // Send Evolution API notification
  await sendEvolutionApiNotification("pagamento.novo", pagamentoData);
};

// Trigger events for late loan
export const triggerEmprestimoAtrasado = async (emprestimoData: any) => {
  // Send webhook notification
  await sendWebhookNotification("emprestimo.atraso", emprestimoData);
  
  // Send Evolution API notification
  await sendEvolutionApiNotification("emprestimo.atraso", emprestimoData);
};
