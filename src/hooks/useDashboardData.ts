
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLoans } from "./useLoans";
import { toast } from "sonner";

export const useDashboardData = () => {
  const { loans, isLoadingLoans } = useLoans();

  // Calculate summary data from loans
  const { data: summaryData, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      if (!loans) return null;
      
      try {
        let totalEmprestado = 0;
        let totalRecebido = 0;
        let totalPendente = 0;
        let emprestimosMes = 0;
        let recebimentosMes = 0;
        
        const hoje = new Date();
        const inicioDeMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const fimDeMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
        
        loans.forEach(emprestimo => {
          // Total emprestado
          totalEmprestado += Number(emprestimo.valor_principal) || 0;
          
          // Empréstimos deste mês
          const dataEmprestimo = new Date(emprestimo.data_emprestimo);
          if (dataEmprestimo >= inicioDeMes && dataEmprestimo <= fimDeMes) {
            emprestimosMes += Number(emprestimo.valor_principal) || 0;
          }
          
          // Total pendente
          if (emprestimo.status === 'pendente' || emprestimo.status === 'em_dia' || emprestimo.status === 'atrasado') {
            totalPendente += Number(emprestimo.valor_principal) || 0;
          }
          
          // Total recebido e recebimentos deste mês
          if (emprestimo.pagamentos && Array.isArray(emprestimo.pagamentos)) {
            emprestimo.pagamentos.forEach(pagamento => {
              const valorPagamento = Number(pagamento.valor) || 0;
              totalRecebido += valorPagamento;
              
              // Recebimentos deste mês
              const dataPagamento = new Date(pagamento.data_pagamento);
              if (dataPagamento >= inicioDeMes && dataPagamento <= fimDeMes) {
                recebimentosMes += valorPagamento;
              }
            });
          }
        });
        
        // Get client count
        const { count: clientCount, error: clientError } = await supabase
          .from('clientes')
          .select('id', { count: 'exact', head: true });
          
        if (clientError) throw clientError;
        
        // Get loan count
        const { count: loanCount, error: loanError } = await supabase
          .from('emprestimos')
          .select('id', { count: 'exact', head: true });
          
        if (loanError) throw loanError;
        
        // Get payment count
        const { count: paymentCount, error: paymentError } = await supabase
          .from('pagamentos')
          .select('id', { count: 'exact', head: true });
          
        if (paymentError) throw paymentError;
        
        return {
          totalEmprestado,
          totalRecebido,
          totalPendente,
          emprestimosMes,
          recebimentosMes,
          clientCount: clientCount || 0,
          loanCount: loanCount || 0,
          paymentCount: paymentCount || 0
        };
      } catch (error) {
        console.error("Error calculating dashboard data:", error);
        toast.error("Erro ao calcular dados do dashboard");
        return null;
      }
    },
    enabled: !!loans && !isLoadingLoans
  });

  // Get recent loans
  const { data: recentLoans, isLoading: isLoadingRecent } = useQuery({
    queryKey: ['recent-loans'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('emprestimos')
          .select(`
            *,
            cliente:clientes(id, nome)
          `)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (error) throw error;
        
        return data;
      } catch (error) {
        console.error("Error fetching recent loans:", error);
        toast.error("Erro ao carregar empréstimos recentes");
        return [];
      }
    }
  });
  
  // Get upcoming payments
  const { data: upcomingPayments, isLoading: isLoadingUpcoming } = useQuery({
    queryKey: ['upcoming-payments'],
    queryFn: async () => {
      if (!loans) return [];
      
      try {
        const today = new Date();
        const nextMonth = new Date();
        nextMonth.setDate(today.getDate() + 30);
        
        const upcoming = loans
          .filter(loan => 
            loan.status !== 'quitado' && 
            new Date(loan.data_vencimento) > today &&
            new Date(loan.data_vencimento) <= nextMonth
          )
          .sort((a, b) => 
            new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime()
          )
          .slice(0, 5);
          
        return upcoming;
      } catch (error) {
        console.error("Error calculating upcoming payments:", error);
        toast.error("Erro ao calcular pagamentos próximos");
        return [];
      }
    },
    enabled: !!loans && !isLoadingLoans
  });
  
  return {
    summaryData,
    isLoadingSummary,
    recentLoans,
    isLoadingRecent,
    upcomingPayments,
    isLoadingUpcoming
  };
};
