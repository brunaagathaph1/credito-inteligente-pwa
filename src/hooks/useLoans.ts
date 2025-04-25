import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loan, Pagamento, Parcela, Renegociacao } from '@/types/emprestimos';
import { useActivityLogs } from '@/hooks/useActivityLogs';

export const useLoans = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { logActivity } = useActivityLogs();

  const fetchLoans = async () => {
    try {
      // Fetch basic loans data with cliente, excluding renegociated loans
      const { data: loans, error } = await supabase
        .from('emprestimos')
        .select(`
          *,
          cliente:clientes(id, nome, telefone, email, cpf)
        `)
        .eq('renegociado', false) // Não mostrar empréstimos renegociados na lista principal
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar empréstimos:', error);
        throw error;
      }

      // Fetch pagamentos for all loans
      const { data: pagamentos, error: pagamentosError } = await supabase
        .from('pagamentos')
        .select('*');

      if (pagamentosError) {
        console.error('Erro ao buscar pagamentos:', pagamentosError);
        throw pagamentosError;
      }

      // Organize pagamentos by emprestimo_id
      const pagamentosPorEmprestimo: Record<string, Pagamento[]> = {};
      pagamentos?.forEach(pagamento => {
        if (!pagamentosPorEmprestimo[pagamento.emprestimo_id]) {
          pagamentosPorEmprestimo[pagamento.emprestimo_id] = [];
        }
        pagamentosPorEmprestimo[pagamento.emprestimo_id].push(pagamento);
      });

      // Add pagamentos to each loan
      return loans?.map(loan => ({
        ...loan,
        pagamentos: pagamentosPorEmprestimo[loan.id] || []
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar empréstimos:', error);
      throw error;
    }
  };

  const fetchLoan = async (id: string) => {
    try {
      // Fetch loan with cliente data
      const { data, error } = await supabase
        .from('emprestimos')
        .select(`
          *,
          cliente:clientes(id, nome, telefone, email, cpf)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao carregar empréstimo:', error);
        throw error;
      }
      
      // Fetch pagamentos
      const { data: pagamentos, error: pagamentosError } = await supabase
        .from('pagamentos')
        .select('*')
        .eq('emprestimo_id', id);
        
      if (pagamentosError) {
        console.error('Erro ao carregar pagamentos:', pagamentosError);
        throw pagamentosError;
      }
      
      // Fetch renegociacoes where this loan is the original loan
      const { data: renegociacoes, error: renegociacoesError } = await supabase
        .from('renegociacoes')
        .select(`
          *,
          novo_emprestimo:id(*)
        `)
        .eq('emprestimo_id', id);

      if (renegociacoesError) {
        console.error('Erro ao carregar renegociações:', renegociacoesError);
        throw renegociacoesError;
      }

      // Combine all data
      return {
        ...data,
        pagamentos: pagamentos || [],
        renegociacoes: renegociacoes || []
      };
    } catch (error) {
      console.error('Erro ao carregar empréstimo:', error);
      throw error;
    }
  };

  const createLoanMutation = async (loanData: any) => {
    try {
      // Primeiro criamos o empréstimo
      const { data: loan, error: loanError } = await supabase
        .from('emprestimos')
        .insert([{
          ...loanData,
          created_by: user?.id || null,
        }])
        .select()
        .single();

      if (loanError) throw loanError;

      // If parcelas need to be created, we would handle that separately
      // as it's not in the types.ts definition

      toast.success('Empréstimo criado com sucesso!');
      return loan;
    } catch (error: any) {
      console.error('Erro ao criar empréstimo:', error);
      toast.error(`Erro ao criar empréstimo: ${error.message}`);
      throw error;
    }
  };

  const updateLoanStatus = async ({ loanId, status }: { loanId: string; status: string }) => {
    try {
      const { data, error } = await supabase
        .from('emprestimos')
        .update({ status })
        .eq('id', loanId)
        .select()
        .single();

      if (error) throw error;

      toast.success('Status do empréstimo atualizado!');
      return data;
    } catch (error: any) {
      console.error('Erro ao atualizar status do empréstimo:', error);
      toast.error(`Erro ao atualizar empréstimo: ${error.message}`);
      throw error;
    }
  };

  const registerPayment = async (paymentData: any) => {
    try {
      // Registrar o pagamento
      const { data: payment, error: paymentError } = await supabase
        .from('pagamentos')
        .insert([{
          ...paymentData,
          created_by: user?.id || null,
        }])
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Registrar atividade
      await logActivity(`Registrou pagamento ID ${payment.id}`);

      // Check and update loan status if needed
      const { data: allPayments, error: allPaymentsError } = await supabase
        .from('pagamentos')
        .select('*')
        .eq('emprestimo_id', paymentData.emprestimo_id);

      if (allPaymentsError) throw allPaymentsError;

      // Get loan details
      const { data: loan, error: loanError } = await supabase
        .from('emprestimos')
        .select('*')
        .eq('id', paymentData.emprestimo_id)
        .single();

      if (loanError) throw loanError;

      // Check if total payments equals or exceeds loan value
      // Somar apenas pagamentos que não sejam do tipo 'juros'
      const totalPaid = allPayments
        .filter((p) => p.tipo !== 'juros')
        .reduce((sum, p) => sum + parseFloat(String(p.valor)), 0);
      
      if (totalPaid >= parseFloat(String(loan.valor_principal))) {
        const { error: updateError } = await supabase
          .from('emprestimos')
          .update({ status: 'quitado' })
          .eq('id', paymentData.emprestimo_id);

        if (updateError) throw updateError;
      }

      toast.success('Pagamento registrado com sucesso!');
      return payment;
    } catch (error: any) {
      console.error('Erro ao registrar pagamento:', error);
      toast.error(`Erro ao registrar pagamento: ${error.message}`);
      throw error;
    }
  };

  const createRenegotiation = async (renegotiationData: any) => {
    try {
      // Primeiro, registramos a renegociação
      const { data: renegociacao, error: renegociacaoError } = await supabase
        .from('renegociacoes')
        .insert([{
          ...renegotiationData.renegociacao,
          created_by: user?.id || null,
        }])
        .select()
        .single();

      if (renegociacaoError) throw renegociacaoError;

      // Registrar atividade
      await logActivity(`Criou renegociação ID ${renegociacao.id}`);

      // Atualizamos o status do empréstimo original para 'renegociado'
      const { error: emprestimoOriginalError } = await supabase
        .from('emprestimos')
        .update({ 
          status: 'renegociado',
          renegociacao_id: renegociacao.id
        })
        .eq('id', renegotiationData.renegociacao.emprestimo_id);

      if (emprestimoOriginalError) throw emprestimoOriginalError;

      // Criamos o novo empréstimo
      const { data: novoEmprestimo, error: novoEmprestimoError } = await supabase
        .from('emprestimos')
        .insert([{
          ...renegotiationData.novoEmprestimo,
          renegociacao_id: renegociacao.id,
          created_by: user?.id || null,
        }])
        .select()
        .single();

      if (novoEmprestimoError) throw novoEmprestimoError;

      toast.success('Empréstimo renegociado com sucesso!');
      return { renegociacao, novoEmprestimo };
    } catch (error: any) {
      console.error('Erro ao renegociar empréstimo:', error);
      toast.error(`Erro ao renegociar empréstimo: ${error.message}`);
      throw error;
    }
  };

  const deleteLoan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('emprestimos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Empréstimo excluído com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir empréstimo:', error);
      toast.error(`Erro ao excluir empréstimo: ${error.message}`);
      throw error;
    }
  };

  const deletePayment = async (id: string) => {
    try {
      // 1. Buscar o pagamento junto com os dados do empréstimo
      const { data: pagamento, error: pagamentoError } = await supabase
        .from('pagamentos')
        .select(`
          *,
          emprestimo:emprestimo_id(
            id,
            valor_principal,
            status
          )
        `)
        .eq('id', id)
        .single();

      if (pagamentoError) throw pagamentoError;

      // 2. Se for pagamento do tipo 'juros', apenas excluir
      if (pagamento.tipo === 'juros') {
        const { error } = await supabase
          .from('pagamentos')
          .delete()
          .eq('id', id);

        if (error) throw error;
        toast.success('Pagamento excluído com sucesso!');
        return true;
      }

      // 3. Buscar todos os outros pagamentos do empréstimo
      const { data: pagamentos, error: pagamentosError } = await supabase
        .from('pagamentos')
        .select('*')
        .eq('emprestimo_id', pagamento.emprestimo_id)
        .neq('id', id); // Excluir o pagamento que será deletado

      if (pagamentosError) throw pagamentosError;

      // 4. Calcular novo total pago
      const totalPago = pagamentos
        .filter((p) => p.tipo !== 'juros')
        .reduce((sum, p) => sum + parseFloat(String(p.valor)), 0);

      // 5. Determinar novo status do empréstimo
      let novoStatus = pagamento.emprestimo.status;
      if (totalPago < parseFloat(String(pagamento.emprestimo.valor_principal))) {
        novoStatus = pagamento.emprestimo.status === 'quitado' ? 'em_dia' : pagamento.emprestimo.status;
      }

      // 6. Executar operações em ordem
      // Primeiro atualizar o status do empréstimo se necessário
      if (novoStatus !== pagamento.emprestimo.status) {
        const { error: updateError } = await supabase
          .from('emprestimos')
          .update({ status: novoStatus })
          .eq('id', pagamento.emprestimo_id);

        if (updateError) throw updateError;
      }

      // Por último, excluir o pagamento
      const { error: deleteError } = await supabase
        .from('pagamentos')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      toast.success('Pagamento excluído com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir pagamento:', error);
      toast.error(`Erro ao excluir pagamento: ${error.message}`);
      throw error;
    }
  };

  const deleteRenegotiation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('renegociacoes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Renegociação excluída com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir renegociação:', error);
      toast.error(`Erro ao excluir renegociação: ${error.message}`);
      throw error;
    }
  };

  // React Query mutations
  const deleteLoanMutation = useMutation({
    mutationFn: deleteLoan,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['loans'] });
    }
  });

  const deletePaymentMutation = useMutation({
    mutationFn: deletePayment,
    onSuccess: async (_, id) => {
      // Buscar o emprestimo_id do pagamento que foi excluído
      const queryData = queryClient.getQueryData(['loan']) as { id: string } | undefined;
      if (queryData?.id) {
        // Forçar uma nova busca dos dados do empréstimo
        await queryClient.invalidateQueries({ queryKey: ['loan', queryData.id] });
      }
      // Atualizar a lista geral de empréstimos
      queryClient.invalidateQueries({ queryKey: ['loans'] });
    }
  });

  const deleteRenegotiationMutation = useMutation({
    mutationFn: deleteRenegotiation,
    onSuccess: async (_, id) => {
      // Buscar o emprestimo_id da renegociação que foi excluída
      const queryData = queryClient.getQueryData(['loan']) as { id: string } | undefined;
      if (queryData?.id) {
        // Forçar uma nova busca dos dados do empréstimo
        await queryClient.invalidateQueries({ queryKey: ['loan', queryData.id] });
      }
      // Atualizar a lista geral de empréstimos
      queryClient.invalidateQueries({ queryKey: ['loans'] });
    }
  });

  // React Query Hooks
  const { data: loans, ...loansQueryResult } = useQuery({
    queryKey: ['loans'],
    queryFn: fetchLoans,
  });

  const useLoan = (id?: string) => {
    return useQuery({
      queryKey: ['loan', id],
      queryFn: () => fetchLoan(id as string),
      enabled: !!id,
    });
  };

  const useCreateLoan = () => {
    return useMutation({
      mutationFn: createLoanMutation,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['loans'] });
      },
    });
  };

  const useUpdateLoanStatus = () => {
    return useMutation({
      mutationFn: updateLoanStatus,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['loans'] });
      },
    });
  };

  const useRegisterPayment = () => {
    return useMutation({
      mutationFn: registerPayment,
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['loans'] });
        queryClient.invalidateQueries({ queryKey: ['loan', variables.emprestimo_id] });
      },
    });
  };

  const useCreateRenegotiation = () => {
    return useMutation({
      mutationFn: createRenegotiation,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['loans'] });
      },
    });
  };

  return {
    loans,
    isLoadingLoans: loansQueryResult.isLoading,
    loansError: loansQueryResult.error,
    useLoan,
    useCreateLoan,
    useUpdateLoanStatus,
    useRegisterPayment,
    useCreateRenegotiation,
    createLoan: createLoanMutation,
    useDeleteLoan: () => deleteLoanMutation,
    useDeletePayment: () => deletePaymentMutation,
    useDeleteRenegotiation: () => deleteRenegotiationMutation,
  };
};
