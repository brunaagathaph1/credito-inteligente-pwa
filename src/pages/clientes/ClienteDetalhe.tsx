
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Building, 
  Calendar, 
  CreditCard, 
  Edit, 
  Mail, 
  Phone, 
  User,
  MapPin,
  FileText,
  Star,
  AlertTriangle,
  PlusCircle
} from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { useLoans } from "@/hooks/useLoans";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { useIsMobile } from "@/hooks/use-mobile";
import { PageHeader } from "@/components/common/PageHeader";
import { toast } from "sonner";
import { useActivityLogs } from "@/hooks/useActivityLogs";

const ClienteDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClientById, isClientLoading } = useClients();
  const { loans } = useLoans();
  const isMobile = useIsMobile();
  const { logActivity } = useActivityLogs();
  
  // Get client details using the hook
  const { data: client, isLoading, error } = getClientById(id);

  // Filter loans for this client
  const clientLoans = loans?.filter(loan => loan.cliente_id === id) || [];
  
  useEffect(() => {
    if (id) {
      logActivity(`Visualizou detalhes do cliente ID: ${id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "-";
    }
  };
  
  const formatCurrency = (value: number | string | undefined) => {
    if (value === undefined || value === null) return "-";
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return numValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  };

  const handleStatusClass = (status: string) => {
    switch (status) {
      case "em_dia":
        return "bg-success/10 text-success";
      case "atrasado":
        return "bg-destructive/10 text-destructive";
      case "quitado":
        return "bg-muted text-muted-foreground";
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

  if (error) {
    toast.error("Erro ao carregar dados do cliente");
    navigate("/clientes");
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <PageHeader
          title={isLoading ? "Carregando..." : client?.nome || "Cliente"}
          description="Detalhes do cliente e empréstimos relacionados"
        />

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/clientes")}
            className="hidden md:flex"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          {!isLoading && client && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/clientes/editar/${id}`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          )}
        </div>
      </div>
      
      {isLoading || isClientLoading ? (
        <LoadingClienteDetalhe />
      ) : client ? (
        <Tabs defaultValue="dados" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="dados">Dados do Cliente</TabsTrigger>
            <TabsTrigger value="emprestimos">Empréstimos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dados" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div className="flex items-start space-x-4">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Nome</p>
                    <p className="text-sm text-muted-foreground">{client.nome}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">CPF</p>
                    <p className="text-sm text-muted-foreground">{client.cpf || "Não informado"}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{client.email || "Não informado"}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Telefone</p>
                    <p className="text-sm text-muted-foreground">{client.telefone || "Não informado"}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Endereço</p>
                    <p className="text-sm text-muted-foreground">{client.endereco || "Não informado"}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Star className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Score de Crédito</p>
                    <p className="text-sm text-muted-foreground">{client.score || "Não atribuído"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {client.observacoes && (
              <Card>
                <CardHeader>
                  <CardTitle>Observações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{client.observacoes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="emprestimos">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Empréstimos</h2>
              <Button size="sm" onClick={() => navigate(`/emprestimos/novo?cliente=${id}`)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Empréstimo
              </Button>
            </div>
            
            {clientLoans.length > 0 ? (
              <div className="space-y-4">
                {clientLoans.map(loan => (
                  <Card key={loan.id} className="overflow-hidden">
                    <div className="p-4 md:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-medium">
                              Empréstimo de {formatCurrency(loan.valor_principal)}
                            </h3>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Taxa: {loan.taxa_juros}% ({loan.tipo_juros})
                          </p>
                        </div>
                        <Badge className={handleStatusClass(loan.status)}>
                          {handleStatusText(loan.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Criação</p>
                          <p className="text-sm font-medium">{formatDate(loan.data_emprestimo)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Vencimento</p>
                          <p className="text-sm font-medium">{formatDate(loan.data_vencimento)}</p>
                        </div>
                        
                        <div className="col-span-2 md:col-span-4 flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/emprestimos/${loan.id}`)}
                          >
                            Ver detalhes
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nenhum empréstimo encontrado"
                description="Este cliente não possui empréstimos registrados."
                icon={<AlertTriangle className="h-10 w-10" />}
                action={
                  <Button onClick={() => navigate(`/emprestimos/novo?cliente=${id}`)}>
                    Novo Empréstimo
                  </Button>
                }
              />
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <EmptyState
          title="Cliente não encontrado"
          description="O cliente solicitado não foi encontrado."
          icon={<AlertTriangle className="h-10 w-10" />}
          action={
            <Button onClick={() => navigate("/clientes")}>
              Voltar para a lista
            </Button>
          }
        />
      )}
    </div>
  );
};

// Loading skeleton
const LoadingClienteDetalhe = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-start space-x-4">
              <Skeleton className="h-5 w-5" />
              <div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32 mt-1" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClienteDetalhe;
