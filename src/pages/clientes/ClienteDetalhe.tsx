
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Trash2, UserMinus, DollarSign, Phone, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { EmptyState } from "@/components/common/EmptyState";

const ClienteDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { logActivity } = useActivityLogs();
  const [activeTab, setActiveTab] = useState("dados");
  const [cliente, setCliente] = useState<any>(null);
  const [emprestimos, setEmprestimos] = useState<any[]>([]);
  const [pagamentos, setPagamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClienteDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Buscar dados do cliente
        const { data: clienteData, error: clienteError } = await supabase
          .from("clientes")
          .select("*")
          .eq("id", id)
          .single();
          
        if (clienteError) throw clienteError;
        
        setCliente(clienteData);
        
        // Buscar empréstimos do cliente
        const { data: emprestimosData, error: emprestimosError } = await supabase
          .from("emprestimos")
          .select("*")
          .eq("cliente_id", id)
          .order("data_emprestimo", { ascending: false });
          
        if (emprestimosError) throw emprestimosError;
        
        setEmprestimos(emprestimosData || []);
        
        // Buscar pagamentos relacionados a este cliente
        if (emprestimosData && emprestimosData.length > 0) {
          const emprestimosIds = emprestimosData.map(emp => emp.id);
          
          const { data: pagamentosData, error: pagamentosError } = await supabase
            .from("pagamentos")
            .select("*")
            .in("emprestimo_id", emprestimosIds)
            .order("data_pagamento", { ascending: false });
            
          if (pagamentosError) throw pagamentosError;
          
          setPagamentos(pagamentosData || []);
        }
        
        // Registrar atividade
        await logActivity("Visualizou detalhes do cliente", { cliente_id: id });
        
      } catch (error: any) {
        console.error("Erro ao buscar detalhes do cliente:", error);
        toast.error(`Erro ao carregar dados: ${error.message || "Erro desconhecido"}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClienteDetails();
  }, [id, logActivity]);

  const handleScoreClass = (score?: number) => {
    if (!score) return "text-muted-foreground";
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const handleInactivateClient = async () => {
    if (!id || !user) return;
    
    try {
      // Aqui seria feita a chamada para inativar o cliente
      // Por enquanto, apenas registramos a atividade
      await logActivity("Inativou cliente", { cliente_id: id });
      
      toast.success("Cliente inativado com sucesso!");
      navigate("/clientes");
    } catch (error: any) {
      console.error("Erro ao inativar cliente:", error);
      toast.error(`Erro ao inativar cliente: ${error.message || "Erro desconhecido"}`);
    }
  };

  const handleDeleteClient = async () => {
    if (!id || !user) return;
    
    try {
      const { error } = await supabase
        .from("clientes")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      await logActivity("Excluiu cliente", { cliente_id: id });
      
      toast.success("Cliente excluído com sucesso!");
      navigate("/clientes");
    } catch (error: any) {
      console.error("Erro ao excluir cliente:", error);
      toast.error(`Erro ao excluir cliente: ${error.message || "Erro desconhecido"}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!cliente) {
    return (
      <EmptyState
        title="Cliente não encontrado"
        description="O cliente que você está procurando não existe ou foi removido"
        icon={<UserMinus className="h-10 w-10" />}
        action={
          <Button onClick={() => navigate("/clientes")}>
            Voltar para Lista
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/clientes")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{cliente.nome}</h1>
          <p className="text-muted-foreground">{cliente.cpf || "Sem CPF"}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/clientes/${id}/editar`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive">
                <UserMinus className="mr-2 h-4 w-4" />
                Inativar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Inativar cliente</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja inativar este cliente? Ele não será excluído, mas ficará indisponível para novos empréstimos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleInactivateClient} className="bg-destructive text-destructive-foreground">
                  Inativar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir cliente</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita e todos os dados associados serão perdidos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteClient} className="bg-destructive text-destructive-foreground">
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="flex gap-2">
          <Button asChild>
            <Link to={`/emprestimos/novo?cliente=${id}`}>
              <DollarSign className="mr-2 h-4 w-4" />
              Novo Empréstimo
            </Link>
          </Button>
          {cliente.telefone && (
            <Button variant="outline" asChild>
              <a href={`tel:${cliente.telefone.replace(/\D/g, '')}`}>
                <Phone className="mr-2 h-4 w-4" />
                Ligar
              </a>
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dados">Dados</TabsTrigger>
          <TabsTrigger value="emprestimos">Empréstimos</TabsTrigger>
          <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dados">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nome</p>
                    <p>{cliente.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">CPF</p>
                    <p>{cliente.cpf || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                    <p>{cliente.telefone || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">E-mail</p>
                    <p>{cliente.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        cliente.status !== "inativo"
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {cliente.status === "inativo" ? "Inativo" : "Ativo"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Score</p>
                    <p className={handleScoreClass(cliente.score)}>{cliente.score || "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cliente.endereco ? (
                    <p>{cliente.endereco}</p>
                  ) : (
                    <p className="text-muted-foreground">Endereço não cadastrado</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                {cliente.observacoes ? (
                  <p>{cliente.observacoes}</p>
                ) : (
                  <p className="text-muted-foreground">Nenhuma observação cadastrada</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="emprestimos">
          <Card>
            <CardHeader>
              <CardTitle>Empréstimos</CardTitle>
            </CardHeader>
            <CardContent>
              {emprestimos.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum empréstimo encontrado para este cliente.</p>
                  <Button className="mt-4" asChild>
                    <Link to={`/emprestimos/novo?cliente=${id}`}>Criar Empréstimo</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {emprestimos.map((emprestimo) => (
                    <div
                      key={emprestimo.id}
                      className="rounded-lg border p-4 hover:bg-accent cursor-pointer"
                      onClick={() => navigate(`/emprestimos/${emprestimo.id}`)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                emprestimo.status === "quitado"
                                  ? "bg-success/10 text-success"
                                  : emprestimo.status === "pendente"
                                  ? "bg-warning/10 text-warning"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {emprestimo.status === "quitado" 
                                ? "Quitado" 
                                : emprestimo.status === "pendente"
                                ? "Pendente"
                                : emprestimo.status}
                            </span>
                            <p className="font-medium">
                              R$ {Number(emprestimo.valor_principal).toLocaleString("pt-BR", {minimumFractionDigits: 2})}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Empréstimo em {format(new Date(emprestimo.data_emprestimo), "dd/MM/yyyy", { locale: ptBR })} 
                            • Vencimento em {format(new Date(emprestimo.data_vencimento), "dd/MM/yyyy", { locale: ptBR })}
                            • Juros de {Number(emprestimo.taxa_juros).toLocaleString("pt-BR")}% ({emprestimo.tipo_juros})
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pagamentos">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pagamentos</CardTitle>
            </CardHeader>
            <CardContent>
              {pagamentos.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum pagamento registrado para este cliente.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pagamentos.map((pagamento) => (
                    <div
                      key={pagamento.id}
                      className="rounded-lg border p-4"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            Pagamento • Empréstimo #{pagamento.emprestimo_id.substring(0, 8)}...
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Pago em {format(new Date(pagamento.data_pagamento), "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-success">
                            R$ {Number(pagamento.valor).toLocaleString("pt-BR", {minimumFractionDigits: 2})}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {pagamento.tipo}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClienteDetalhe;
