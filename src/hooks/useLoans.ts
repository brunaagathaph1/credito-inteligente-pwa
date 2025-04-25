import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loan, Pagamento, Parcela } from '@/types/emprestimos';

export const useLoans = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

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
      // Modified query to correctly specify the relationship and include renegociations
      const { data, error } = await supabase
        .from('emprestimos')
        .select(`
          *,
          cliente:clientes(id, nome, telefone, email, cpf),
          renegociacao:renegociacao_id(
            *,
            emprestimo_anterior:emprestimo_id(*),
            novo_emprestimo:id(*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao carregar empréstimo:', error);
        throw error;
      }
      
      // Fetch pagamentos in a separate query
      const { data: pagamentos, error: pagamentosError } = await supabase
        .from('pagamentos')
        .select('*')
        .eq('emprestimo_id', id);
        
      if (pagamentosError) {
        console.error('Erro ao carregar pagamentos:', pagamentosError);
        throw pagamentosError;
      }
      
      // Fetch renegociacoes where this loan is either the original or new loan
      const { data: renegociacoes, error: renegociacoesError } = await supabase
        .from('renegociacoes')
        .select('*, emprestimo:emprestimo_id(*)')
        .or(`emprestimo_id.eq.${id}`);

      // Combine the data
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
    createLoan: createLoanMutation, // Export the mutation directly
  };
};
