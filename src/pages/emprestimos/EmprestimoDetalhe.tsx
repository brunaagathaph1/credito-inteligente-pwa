
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  User, 
  FileText, 
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw
} from "lucide-react";
import { RenegociacaoDialog } from "@/components/emprestimos/RenegociacaoDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useActivityLogs } from "@/hooks/useActivityLogs";

const EmprestimoDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { logActivity } = useActivityLogs();
  const [emprestimo, setEmprestimo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [isRenegociacaoOpen, setIsRenegociacaoOpen] = useState(false);

  useEffect(() => {
    carregarEmprestimo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const carregarEmprestimo = async () => {
    if (!id) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('emprestimos')
        .select(`
          *,
          cliente:clientes(id, nome, telefone, email),
          pagamentos(*),
          renegociacoes:renegociacoes(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      setEmprestimo(data);
      logActivity(`Visualizou detalhes do empréstimo ID ${id}`);
    } catch (error) {
      console.error("Erro ao carregar empréstimo:", error);
      toast.error("Erro ao carregar detalhes do empréstimo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (novoStatus: string) => {
    if (!id) return;
    
    setIsLoadingAction(true);
    
    try {
      const { error } = await supabase
        .from('emprestimos')
        .update({ 
          status: novoStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success(`Status atualizado para: ${formatStatus(novoStatus)}`);
      logActivity(`Alterou status do empréstimo ID ${id} para ${novoStatus}`);
      carregarEmprestimo();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status do empréstimo");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleRenegociationComplete = () => {
    carregarEmprestimo();
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "em-dia":
        return "Em dia";
      case "atrasado":
        return "Atrasado";
      case "quitado":
        return "Quitado";
      case "pendente":
        return "Pendente";
      default:
        return status;
    }
  };

  const getStatusClassName = (status: string) => {
    switch (status) {
      case "em-dia":
        return "bg-success/20 text-success";
      case "atrasado":
        return "bg-destructive/20 text-destructive";
      case "quitado":
        return "bg-muted text-muted-foreground";
      case "pendente":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const getJurosDescricao = (tipo: string, taxa: number) => {
    return `${taxa}% ao mês (${tipo === "composto" ? "composto" : "simples"})`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!emprestimo) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => navigate("/emprestimos")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">Empréstimo não encontrado</h2>
            <p className="text-muted-foreground mb-6">
              O empréstimo que você está procurando não existe ou foi removido.
            </p>
            <Button onClick={() => navigate("/emprestimos")}>
              Ver todos os empréstimos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/emprestimos")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Detalhes do Empréstimo</h1>
            <p className="text-muted-foreground">
              Informações completas sobre o empréstimo.
            </p>
          </div>
        </div>
        {emprestimo.status !== "quitado" && (
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsRenegociacaoOpen(true)}
              disabled={isLoadingAction}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Renegociar
            </Button>
            {emprestimo.status !== "em-dia" && (
              <Button 
                variant="outline" 
                className="bg-success/10 hover:bg-success/20 text-success hover:text-success"
                onClick={() => handleStatusUpdate("em-dia")}
                disabled={isLoadingAction}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Marcar Em Dia
              </Button>
            )}
            {emprestimo.status !== "quitado" && (
              <Button 
                variant="outline"
                className="bg-muted hover:bg-muted/80"
                onClick={() => handleStatusUpdate("quitado")}
                disabled={isLoadingAction}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Marcar Quitado
              </Button>
            )}
            {emprestimo.status !== "atrasado" && (
              <Button 
                variant="outline"
                className="bg-destructive/10 hover:bg-destructive/20 text-destructive hover:text-destructive"
                onClick={() => handleStatusUpdate("atrasado")}
                disabled={isLoadingAction}
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Marcar Atrasado
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Card de resumo */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">Resumo do Empréstimo</CardTitle>
              <CardDescription>
                Empréstimo para {emprestimo.cliente?.nome || "Cliente não disponível"}
              </CardDescription>
            </div>
            <div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClassName(emprestimo.status)}`}>
                {formatStatus(emprestimo.status)}
              </span>
              {emprestimo.renegociado && (
                <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                  Renegociado
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground flex items-center mb-1">
                <DollarSign className="h-4 w-4 mr-1" />
                Valor Principal
              </span>
              <span className="text-2xl font-bold">
                {formatCurrency(emprestimo.valor_principal)}
              </span>
              <span className="text-sm text-muted-foreground mt-1">
                {getJurosDescricao(emprestimo.tipo_juros, emprestimo.taxa_juros)}
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground flex items-center mb-1">
                <Calendar className="h-4 w-4 mr-1" />
                Data do Empréstimo
              </span>
              <span className="text-lg font-medium">
                {formatDate(emprestimo.data_emprestimo)}
              </span>
              <span className="text-sm text-muted-foreground mt-1">
                Vencimento: {formatDate(emprestimo.data_vencimento)}
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground flex items-center mb-1">
                <User className="h-4 w-4 mr-1" />
                Cliente
              </span>
              <span className="text-lg font-medium">
                {emprestimo.cliente?.nome || "Cliente não disponível"}
              </span>
              <span className="text-sm text-muted-foreground mt-1">
                {emprestimo.cliente?.telefone || "Telefone não disponível"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="pagamentos" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
          <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pagamentos">
          <Card>
            <CardHeader>
              <CardTitle>Pagamentos</CardTitle>
              <CardDescription>
                Registro de pagamentos realizados para este empréstimo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {emprestimo.pagamentos && emprestimo.pagamentos.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Observações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {emprestimo.pagamentos.map((pagamento: any) => (
                        <TableRow key={pagamento.id}>
                          <TableCell>{formatDate(pagamento.data_pagamento)}</TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(pagamento.valor)}
                          </TableCell>
                          <TableCell>
                            {pagamento.tipo === "parcial" ? "Parcial" : "Integral"}
                          </TableCell>
                          <TableCell>{pagamento.observacoes || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Nenhum pagamento registrado para este empréstimo.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="detalhes">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Empréstimo</CardTitle>
              <CardDescription>
                Informações detalhadas sobre o empréstimo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Identificação
                    </h3>
                    <p className="text-sm mb-1">
                      <strong>ID:</strong> {emprestimo.id}
                    </p>
                    <p className="text-sm mb-1">
                      <strong>Cliente:</strong> {emprestimo.cliente?.nome || "-"}
                    </p>
                    <p className="text-sm">
                      <strong>Telefone:</strong> {emprestimo.cliente?.telefone || "-"}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Termos Financeiros
                    </h3>
                    <p className="text-sm mb-1">
                      <strong>Valor Principal:</strong> {formatCurrency(emprestimo.valor_principal)}
                    </p>
                    <p className="text-sm mb-1">
                      <strong>Taxa de Juros:</strong> {emprestimo.taxa_juros}%
                    </p>
                    <p className="text-sm">
                      <strong>Tipo de Juros:</strong> {emprestimo.tipo_juros === "composto" ? "Composto" : "Simples"}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Datas
                    </h3>
                    <p className="text-sm mb-1">
                      <strong>Data do Empréstimo:</strong> {formatDate(emprestimo.data_emprestimo)}
                    </p>
                    <p className="text-sm mb-1">
                      <strong>Data de Vencimento:</strong> {formatDate(emprestimo.data_vencimento)}
                    </p>
                    <p className="text-sm">
                      <strong>Criado em:</strong> {format(new Date(emprestimo.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Status
                    </h3>
                    <p className="text-sm mb-1">
                      <strong>Status Atual:</strong> {formatStatus(emprestimo.status)}
                    </p>
                    <p className="text-sm mb-1">
                      <strong>Renegociado:</strong> {emprestimo.renegociado ? "Sim" : "Não"}
                    </p>
                    <p className="text-sm">
                      <strong>Última Atualização:</strong> {format(new Date(emprestimo.updated_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                
                {emprestimo.observacoes && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Observações
                    </h3>
                    <p className="text-sm whitespace-pre-line p-3 bg-muted rounded-md">
                      {emprestimo.observacoes}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="historico">
          <Card>
            <CardHeader>
              <CardTitle>Histórico do Empréstimo</CardTitle>
              <CardDescription>
                Histórico de renegociações e alterações.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {emprestimo.renegociacoes && emprestimo.renegociacoes.length > 0 ? (
                <div className="space-y-4">
                  {emprestimo.renegociacoes.map((renegociacao: any) => (
                    <div key={renegociacao.id} className="border p-4 rounded-md">
                      <div className="flex items-center mb-3">
                        <RefreshCw className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="font-medium">
                          Renegociação em {formatDate(renegociacao.data_renegociacao)}
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Valores Anteriores</h4>
                          <p className="text-sm mb-1">
                            <strong>Valor Principal:</strong> {formatCurrency(renegociacao.emprestimo_anterior_valor)}
                          </p>
                          <p className="text-sm mb-1">
                            <strong>Taxa de Juros:</strong> {renegociacao.emprestimo_anterior_juros}%
                          </p>
                          <p className="text-sm">
                            <strong>Vencimento:</strong> {formatDate(renegociacao.emprestimo_anterior_vencimento)}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Novos Valores</h4>
                          <p className="text-sm mb-1">
                            <strong>Valor Principal:</strong> {formatCurrency(renegociacao.novo_valor_principal)}
                          </p>
                          <p className="text-sm mb-1">
                            <strong>Taxa de Juros:</strong> {renegociacao.nova_taxa_juros}% ({renegociacao.novo_tipo_juros})
                          </p>
                          <p className="text-sm">
                            <strong>Vencimento:</strong> {formatDate(renegociacao.nova_data_vencimento)}
                          </p>
                        </div>
                      </div>
                      
                      {(renegociacao.motivo || renegociacao.observacoes) && (
                        <div>
                          {renegociacao.motivo && (
                            <p className="text-sm mb-1">
                              <strong>Motivo:</strong> {renegociacao.motivo}
                            </p>
                          )}
                          {renegociacao.observacoes && (
                            <p className="text-sm whitespace-pre-line">
                              <strong>Observações:</strong> {renegociacao.observacoes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center p-4 rounded-full bg-muted mb-4">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Sem histórico de renegociações</h3>
                  <p className="text-muted-foreground">
                    Este empréstimo não possui histórico de renegociações.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog de Renegociação */}
      <RenegociacaoDialog 
        isOpen={isRenegociacaoOpen}
        onClose={() => setIsRenegociacaoOpen(false)}
        emprestimo={emprestimo}
        onRenegociationComplete={handleRenegociationComplete}
      />
    </div>
  );
};

export default EmprestimoDetalhe;
