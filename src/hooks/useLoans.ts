
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface Loan {
  id: string;
  cliente_id: string;
  valor_principal: number;
  taxa_juros: number;
  prazo_meses: number;
  data_inicio: string;
  status: 'aberto' | 'quitado' | 'atrasado' | 'renegociado';
  parcelas?: any[];
  cliente?: any;
  valor_total?: number;
  created_by: string;
  created_at: string;
}

export const useLoans = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchLoans = async () => {
    try {
      const { data, error } = await supabase
        .from('emprestimos')
        .select(`
          *,
          cliente:clientes(id, nome, telefone, email, cpf)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar empréstimos:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar empréstimos:', error);
      throw error;
    }
  };

  const fetchLoan = async (id: string) => {
    try {
      // Modified query to correctly specify the relationship for renegociacoes
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
      
      // Fetch parcelas in a separate query
      const { data: parcelas, error: parcelasError } = await supabase
        .from('parcelas')
        .select('*')
        .eq('emprestimo_id', id);
        
      if (parcelasError) {
        console.error('Erro ao carregar parcelas:', parcelasError);
        throw parcelasError;
      }
      
      // Fetch renegociacoes in a separate query
      const { data: renegociacoes, error: renegociacoesError } = await supabase
        .from('renegociacoes')
        .select('*')
        .eq('emprestimo_id', id);
        
      if (renegociacoesError) {
        console.error('Erro ao carregar renegociações:', renegociacoesError);
        throw renegociacoesError;
      }

      // Combine the data
      return {
        ...data,
        parcelas: parcelas || [],
        renegociacoes: renegociacoes || []
      };
    } catch (error) {
      console.error('Erro ao carregar empréstimo:', error);
      throw error;
    }
  };

  const createLoan = async (loanData: any) => {
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

      // Calculamos e criamos as parcelas
      const parcelas = [];
      const valorParcela = loanData.valor_principal / loanData.prazo_meses;
      let dataVencimento = new Date(loanData.data_inicio);

      for (let i = 1; i <= loanData.prazo_meses; i++) {
        // Avança para o próximo mês
        dataVencimento.setMonth(dataVencimento.getMonth() + 1);

        parcelas.push({
          emprestimo_id: loan.id,
          numero: i,
          valor: valorParcela,
          data_vencimento: dataVencimento.toISOString().split('T')[0],
          status: 'pendente',
          created_by: user?.id || null,
        });
      }

      const { error: parcelasError } = await supabase
        .from('parcelas')
        .insert(parcelas);

      if (parcelasError) throw parcelasError;

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

      // Atualizar o status da parcela
      const { error: parcelaError } = await supabase
        .from('parcelas')
        .update({ status: 'paga' })
        .eq('id', paymentData.parcela_id);

      if (parcelaError) throw parcelaError;

      // Verificar se todas as parcelas estão pagas para atualizar o status do empréstimo
      const { data: parcelas, error: parcelasError } = await supabase
        .from('parcelas')
        .select('status')
        .eq('emprestimo_id', paymentData.emprestimo_id);

      if (parcelasError) throw parcelasError;

      const todasPagas = parcelas.every((parcela) => parcela.status === 'paga');
      
      if (todasPagas) {
        const { error: emprestimoError } = await supabase
          .from('emprestimos')
          .update({ status: 'quitado' })
          .eq('id', paymentData.emprestimo_id);

        if (emprestimoError) throw emprestimoError;
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

      // Calculamos e criamos as parcelas do novo empréstimo
      const parcelas = [];
      const valorParcela = renegotiationData.novoEmprestimo.valor_principal / renegotiationData.novoEmprestimo.prazo_meses;
      let dataVencimento = new Date(renegotiationData.novoEmprestimo.data_inicio);

      for (let i = 1; i <= renegotiationData.novoEmprestimo.prazo_meses; i++) {
        dataVencimento.setMonth(dataVencimento.getMonth() + 1);

        parcelas.push({
          emprestimo_id: novoEmprestimo.id,
          numero: i,
          valor: valorParcela,
          data_vencimento: dataVencimento.toISOString().split('T')[0],
          status: 'pendente',
          created_by: user?.id || null,
        });
      }

      const { error: parcelasError } = await supabase
        .from('parcelas')
        .insert(parcelas);

      if (parcelasError) throw parcelasError;

      toast.success('Empréstimo renegociado com sucesso!');
      return { renegociacao, novoEmprestimo };
    } catch (error: any) {
      console.error('Erro ao renegociar empréstimo:', error);
      toast.error(`Erro ao renegociar empréstimo: ${error.message}`);
      throw error;
    }
  };

  // React Query Hooks
  const { data: loansData, isLoading: isLoadingLoans, error: loansError } = useQuery({
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
      mutationFn: createLoan,
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
    loans: loansData,
    isLoadingLoans,
    loansError,
    useLoan,
    useCreateLoan,
    useUpdateLoanStatus,
    useRegisterPayment,
    useCreateRenegotiation,
  };
};
