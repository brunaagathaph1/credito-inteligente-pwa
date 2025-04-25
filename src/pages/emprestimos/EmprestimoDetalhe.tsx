import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLoans } from "@/hooks/useLoans";
import { Renegociacao } from "@/types/emprestimos";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Calendar, 
  CreditCard, 
  DollarSign, 
  FileText,
  ReceiptText,
  User,
  Phone,
  Mail,
  AlertTriangle,
  CheckSquare,
  Clock,
  Repeat,
  AlertTriangle as AlertTriangleIcon,
  Calendar as CalendarIcon,
  Plus,
  Trash2
} from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RenegociacaoDialog } from "@/components/emprestimos/RenegociacaoDialog";
import { PageHeader } from "@/components/common/PageHeader";
import { toast } from "sonner";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { useIsMobile } from "@/hooks/use-mobile";

const EmprestimoDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { useLoan, useUpdateLoanStatus, useRegisterPayment, useDeleteLoan, useDeletePayment, useDeleteRenegotiation } = useLoans();
  const { logActivity } = useActivityLogs();
  const isMobile = useIsMobile();
  
  // Use the hooks from useLoans
  const { data: loan, isLoading: isLoadingLoan, error } = useLoan(id);
  const updateLoanStatusMutation = useUpdateLoanStatus();
  const registerPaymentMutation = useRegisterPayment();
  const deletePaymentMutation = useDeletePayment();
  const deleteRenegotiationMutation = useDeleteRenegotiation();
  const deleteLoanMutation = useDeleteLoan();

  // Local state
  const [formaPagamento, setFormaPagamento] = useState("Dinheiro");
  const [observacoesAdicionais, setObservacoesAdicionais] = useState("");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showRenegociacaoDialog, setShowRenegociacaoDialog] = useState(false);
  const [newPayment, setNewPayment] = useState({
    valor: "",
    data_pagamento: new Date().toISOString().split("T")[0],
    tipo: "parcial",
    observacoes: "",
    emprestimo_id: id || "",
    created_by: user?.id || "",
  });
  
  useEffect(() => {
    if (id) {
      logActivity(`Visualizou detalhes do empréstimo ID: ${id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  
  // Format helpers
  const formatCurrency = (value: number | string | undefined) => {
    if (value === undefined || value === null) return "-";
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return numValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  };
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };
  
  // Payment handling
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewPayment({ ...newPayment, [e.target.name]: e.target.value });
  };

  const handlePaymentSubmit = async () => {
    try {
      if (!newPayment.valor || parseFloat(newPayment.valor) <= 0) {
        toast.error("Informe um valor válido para o pagamento");
        return;
      }

      // Combina a forma de pagamento com as observações adicionais
      const observacoesCompletas = formaPagamento + (observacoesAdicionais ? ` - ${observacoesAdicionais}` : "");

      await registerPaymentMutation.mutateAsync({
        ...newPayment,
        observacoes: observacoesCompletas
      });

      setShowPaymentDialog(false);

      // Reset payment form
      setNewPayment({
        valor: "",
        data_pagamento: new Date().toISOString().split("T")[0],
        tipo: "parcial",
        observacoes: "",
        emprestimo_id: id || "",
        created_by: user?.id || "",
      });
      setFormaPagamento("Dinheiro");
      setObservacoesAdicionais("");

      // Atualiza os dados do empréstimo após registrar pagamento
      // O React Query já faz isso via invalidateQueries, mas garantimos atualização visual
      // Não é necessário forçar reload, pois o hook já está configurado corretamente
      toast.success("Pagamento registrado com sucesso!");
    } catch (error) {
      console.error("Erro ao registrar pagamento:", error);
      toast.error("Erro ao registrar pagamento");
    }
  };
  
  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateLoanStatusMutation.mutateAsync({
        loanId: id || "",
        status: newStatus,
      });
      toast.success("Status do empréstimo atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status do empréstimo");
    }
  };
  
  // Status helpers
  const handleStatusClass = (status: string) => {
    switch (status) {
      case "em_dia":
        return "bg-success/10 text-success";
      case "atrasado":
        return "bg-destructive/10 text-destructive";
      case "quitado":
        return "bg-muted text-muted-foreground";
      case "pendente":
        return "bg-yellow-500/10 text-yellow-500";
      case "renegociado":
        return "bg-blue-500/10 text-blue-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  
  const handleStatusText = (status: string) => {
    switch (status) {
      case "em_dia":
        return "Em dia";
      case "atrasado":
        return "Atrasado";
      case "quitado":
        return "Quitado";
      case "pendente":
        return "Pendente";
      case "renegociado":
        return "Renegociado";
      default:
        return status;
    }
  };
  
  // Calculate totals
  const calcularTotalPago = () => {
    if (!loan?.pagamentos || !Array.isArray(loan.pagamentos)) return 0;
    
    return loan.pagamentos.reduce((total, pagamento) => {
      const valorPagamento = typeof pagamento.valor === 'string' ? 
        parseFloat(pagamento.valor) : pagamento.valor;
      return total + valorPagamento;
    }, 0);
  };
  
  const calcularValorRestante = () => {
    if (!loan) return 0;
    const valorPrincipal = typeof loan.valor_principal === 'string' ? 
      parseFloat(loan.valor_principal) : loan.valor_principal;
    return Math.max(0, valorPrincipal - calcularTotalPago());
  };
  
  // Error handling
  if (error) {
    toast.error("Erro ao carregar dados do empréstimo");
    navigate("/emprestimos");
    return null;
  }

  const handleDeletePayment = async (paymentId: string) => {
    const pagamento = loan?.pagamentos?.find(p => p.id === paymentId);
    if (!pagamento) return;

    const mensagem = pagamento.tipo === 'juros' 
      ? 'Tem certeza que deseja excluir este pagamento?' 
      : `Tem certeza que deseja excluir este pagamento?\n\nO valor de ${formatCurrency(pagamento.valor)} será restaurado ao saldo do empréstimo.`;

    if (!window.confirm(mensagem)) {
      return;
    }

    try {
      await deletePaymentMutation.mutateAsync(paymentId);
      logActivity(`Excluiu pagamento ID ${paymentId}`);
      // Forçar atualização dos dados do empréstimo
      queryClient.invalidateQueries({ queryKey: ['loan', id] });
    } catch (error) {
      console.error('Erro ao excluir pagamento:', error);
    }
  };

  const handleDeleteRenegociacao = async (renegociationId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta renegociação?')) {
      try {
        await deleteRenegotiationMutation.mutateAsync(renegociationId);
        logActivity(`Excluiu renegociação ID ${renegociationId}`);
        // Forçar atualização dos dados do empréstimo
        queryClient.invalidateQueries({ queryKey: ['loan', id] });
      } catch (error) {
        console.error('Erro ao excluir renegociação:', error);
      }
    }
  };

  const handleDeleteEmprestimo = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este empréstimo?\n\nTodos os pagamentos e renegociações relacionados também serão excluídos.')) {
      return;
    }

    try {
      await deleteLoanMutation.mutateAsync(id || '');
      logActivity(`Excluiu empréstimo ID ${id}`);
      navigate('/emprestimos');
      toast.success('Empréstimo excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir empréstimo:', error);
      toast.error('Erro ao excluir empréstimo');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <PageHeader
          title={isLoadingLoan ? "Carregando..." : `Empréstimo de ${loan?.cliente?.nome || "Cliente"}`}
          description="Detalhes do empréstimo e registro de pagamentos"
        />

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/emprestimos")}
            className="hidden md:flex"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>
      
      {isLoadingLoan ? (
        <LoadingEmprestimoDetalhe />
      ) : loan ? (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteEmprestimo}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Excluir Empréstimo
            </Button>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Informações do Empréstimo</CardTitle>
                <div className="flex justify-between items-center">
                  <CardDescription>
                    Dados gerais do empréstimo
                  </CardDescription>
                  <Badge className={handleStatusClass(loan.status)}>
                    {handleStatusText(loan.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Valor Principal</Label>
                  <p className="text-lg font-semibold">{formatCurrency(loan.valor_principal)}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Taxa de Juros</Label>
                  <p className="text-lg">{loan.taxa_juros}% ({loan.tipo_juros})</p>
                </div>
                {/* Exibição do valor do próximo juros a ser pago */}
                <div>
                  <Label className="text-xs text-muted-foreground">Próximo Juros a Pagar</Label>
                  <p className="text-orange-600 font-medium">
                    {formatCurrency(
                      (() => {
                        // Considera o principal original, sem abater pagamentos
                        const principal = typeof loan.valor_principal === 'string' ? parseFloat(loan.valor_principal) : loan.valor_principal;
                        const taxa = typeof loan.taxa_juros === 'string' ? parseFloat(loan.taxa_juros) : loan.taxa_juros;
                        if (!principal || !taxa) return 0;
                        // Suporte para juros simples e compostos
                        if (loan.tipo_juros === 'composto') {
                          return principal * Math.pow(1 + taxa / 100, 1) - principal;
                        }
                        // Juros simples padrão
                        return principal * (taxa / 100);
                      })()
                    )}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Data do Empréstimo</Label>
                  <p>{formatDate(loan.data_emprestimo)}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Data de Vencimento</Label>
                  <p>{formatDate(loan.data_vencimento)}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Total Pago</Label>
                  <p className="text-green-600 font-medium">{formatCurrency(calcularTotalPago())}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Valor Restante</Label>
                  <p className="text-blue-600 font-medium">{formatCurrency(calcularValorRestante())}</p>
                </div>
              </CardContent>
              {loan.status !== "quitado" && loan.status !== "renegociado" && (
                <CardFooter className="flex gap-2 justify-end flex-wrap">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowPaymentDialog(true)}
                  >
                    <DollarSign className="h-4 w-4 mr-1" />
                    Registrar Pagamento
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRenegociacaoDialog(true)}
                  >
                    <Repeat className="h-4 w-4 mr-1" />
                    Renegociar
                  </Button>
                  {loan.status === "pendente" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange("em_dia")}
                    >
                      <CheckSquare className="h-4 w-4 mr-1" />
                      Marcar como Em Dia
                    </Button>
                  )}
                  {loan.status === "em_dia" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange("atrasado")}
                      className="text-destructive hover:text-destructive"
                    >
                      <AlertTriangleIcon className="h-4 w-4 mr-1" />
                      Marcar como Atrasado
                    </Button>
                  )}
                </CardFooter>
              )}
            </Card>
            
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Informações do Cliente</CardTitle>
                <CardDescription>
                  Dados do cliente associado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">Nome</Label>
                    <p className="text-base">{loan.cliente?.nome || "-"}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">Telefone</Label>
                    <p className="text-base">{loan.cliente?.telefone || "-"}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <p className="text-base">{loan.cliente?.email || "-"}</p>
                  </div>
                </div>
                
                <div className="flex justify-center mt-4">
                  <Button 
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link to={`/clientes/${loan.cliente_id}`}>
                      Ver Perfil Completo
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pagamentos</CardTitle>
              <CardDescription>
                Todos os pagamentos registrados neste empréstimo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loan.pagamentos && loan.pagamentos.length > 0 ? (
                <div className="space-y-4">
                  {loan.pagamentos.map((pagamento) => (
                    <Card key={pagamento.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-xs text-muted-foreground">Data</p>
                              <p className="text-sm font-medium">{formatDate(pagamento.data_pagamento)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Valor</p>
                              <p className="text-sm font-medium text-green-600">{formatCurrency(pagamento.valor)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Tipo</p>
                              <p className="text-sm capitalize">{pagamento.tipo}</p>
                            </div>
                            {pagamento.observacoes && (
                              <div className="col-span-2 mt-2">
                                <p className="text-xs text-muted-foreground">Observações</p>
                                <p className="text-sm">{pagamento.observacoes}</p>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePayment(pagamento.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : null}

              {/* Histórico de Renegociações */}
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Renegociações</CardTitle>
                  <CardDescription>
                    Alterações e renegociações deste empréstimo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loan.renegociacoes && loan.renegociacoes.length > 0 ? (
                    <div className="space-y-4">
                      {(loan.renegociacoes as Renegociacao[]).map((renegociacao) => (
                        <Card key={renegociacao.id} className="border-blue-200">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-4 flex-1">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                  <div>
                                    <p className="text-xs text-muted-foreground">Data da Renegociação</p>
                                    <p className="text-sm font-medium">{formatDate(renegociacao.data_renegociacao)}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Motivo</p>
                                    <p className="text-sm capitalize">{renegociacao.motivo}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">Status</p>
                                    <Badge variant="outline" className="mt-1">
                                      Novo empréstimo criado
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div>
                                  <p className="text-xs text-muted-foreground mb-2">Alterações</p>
                                  <div className="space-y-2 text-sm bg-muted/30 p-3 rounded-md">
                                    <div className="space-y-2">
                                      <div>
                                        <span className="font-medium">Valor Principal:</span>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 mt-1">
                                          <span className="text-muted-foreground">{formatCurrency(renegociacao.emprestimo_anterior_valor)}</span>
                                          <span className="hidden sm:inline">→</span>
                                          <span className="text-green-600 font-medium">{formatCurrency(renegociacao.novo_valor_principal)}</span>
                                        </div>
                                      </div>
                                      <div>
                                        <span className="font-medium">Taxa de Juros:</span>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 mt-1">
                                          <span className="text-muted-foreground">{renegociacao.emprestimo_anterior_juros}%</span>
                                          <span className="hidden sm:inline">→</span>
                                          <span className="text-green-600 font-medium">{renegociacao.nova_taxa_juros}%</span>
                                        </div>
                                      </div>
                                      <div>
                                        <span className="font-medium">Vencimento:</span>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 mt-1">
                                          <span className="text-muted-foreground">{formatDate(renegociacao.emprestimo_anterior_vencimento)}</span>
                                          <span className="hidden sm:inline">→</span>
                                          <span className="text-green-600 font-medium">{formatDate(renegociacao.nova_data_vencimento)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {renegociacao.observacoes && (
                                  <div>
                                    <p className="text-xs text-muted-foreground">Observações</p>
                                    <p className="text-sm whitespace-pre-wrap">{renegociacao.observacoes}</p>
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteRenegociacao(renegociacao.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="Sem renegociações"
                      description="Este empréstimo ainda não foi renegociado"
                      icon={<Repeat className="h-10 w-10" />}
                    />
                  )}
                </CardContent>
              </Card>

              {loan.observacoes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Observações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div className="text-sm whitespace-pre-wrap">
                        {typeof loan.observacoes === 'string' ? loan.observacoes : ''}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <EmptyState
          title="Empréstimo não encontrado"
          description="O empréstimo solicitado não foi encontrado no sistema."
          icon={<AlertTriangle className="h-10 w-10" />}
          action={
            <Button onClick={() => navigate("/emprestimos")}>
              Voltar para a lista
            </Button>
          }
        />
      )}
      
      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Registrar Novo Pagamento</DialogTitle>
            <DialogDescription>
              Insira os detalhes do pagamento realizado pelo cliente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="valor" className="text-right">
                Valor
              </Label>
              <div className="col-span-3 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">R$</span>
                <Input
                  id="valor"
                  name="valor"
                  className="pl-8"
                  value={newPayment.valor}
                  onChange={handlePaymentChange}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="data_pagamento" className="text-right">
                Data
              </Label>
              <Input
                id="data_pagamento"
                name="data_pagamento"
                className="col-span-3"
                value={newPayment.data_pagamento}
                onChange={handlePaymentChange}
                type="date"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipo" className="text-right">
                Tipo
              </Label>
              <Select 
                value={newPayment.tipo} 
                onValueChange={(value) => setNewPayment({...newPayment, tipo: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o tipo de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parcial">Pagamento Parcial</SelectItem>
                  <SelectItem value="total">Pagamento Total</SelectItem>
                  <SelectItem value="juros">Pagamento Apenas de Juros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="forma_pagamento" className="text-right">
                Forma
              </Label>
              <Select
                value={formaPagamento}
                onValueChange={setFormaPagamento}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="PIX">PIX</SelectItem>
                  <SelectItem value="Transferência">Transferência</SelectItem>
                  <SelectItem value="Depósito">Depósito</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="observacoes" className="text-right">
                Observações
              </Label>
              <Textarea
                id="observacoes"
                placeholder="Observações adicionais sobre o pagamento (opcional)"
                className="col-span-3"
                value={observacoesAdicionais}
                onChange={(e) => setObservacoesAdicionais(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handlePaymentSubmit} disabled={registerPaymentMutation.isPending}>
              {registerPaymentMutation.isPending ? "Registrando..." : "Registrar Pagamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Renegociação Dialog */}
      {loan && (
        <RenegociacaoDialog 
          isOpen={showRenegociacaoDialog} 
          onClose={() => setShowRenegociacaoDialog(false)}
          emprestimo={loan}
          onRenegociationComplete={() => {
            setShowRenegociacaoDialog(false);
            // Atualiza os dados do empréstimo após renegociação
            // O React Query já faz isso via invalidateQueries
          }}
        />
      )}
    </div>
  );
};

// Loading skeleton
const LoadingEmprestimoDetalhe = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
            <div className="text-sm text-muted-foreground">
              <Skeleton className="h-4 w-36" />
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-3 w-24 mb-1" />
                <Skeleton className="h-6 w-32" />
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
            <div className="text-sm text-muted-foreground">
              <Skeleton className="h-4 w-36" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="h-5 w-5" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-24 mb-1" />
                  <Skeleton className="h-5 w-full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
          <div className="text-sm text-muted-foreground">
            <Skeleton className="h-4 w-64" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmprestimoDetalhe;
