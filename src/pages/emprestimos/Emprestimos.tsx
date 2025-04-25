import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, PlusCircle, Eye, Loader2 } from "lucide-react";
import { useLoans } from "@/hooks/useLoans";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { EmptyState } from "@/components/common/EmptyState";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";
import { PageHeader } from "@/components/common/PageHeader";

const Emprestimos = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const { loans, isLoadingLoans } = useLoans();
  const { logActivity } = useActivityLogs();
  const isMobile = useIsMobile();

  // Log activity once when component mounts
  useEffect(() => {
    logActivity("Visualizou lista de empréstimos");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Filtrar empréstimos com base na busca e no filtro de status
  const emprestimosFiltrados = (loans || []).filter(emprestimo => {
    const clienteNome = emprestimo.cliente?.nome || "";
    const matchesSearch = clienteNome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || emprestimo.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      default:
        return status;
    }
  };

  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return numValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Renderiza um card para dispositivos móveis em vez de uma linha de tabela
  const renderMobileCard = (emprestimo: any) => (
    <Card key={emprestimo.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-base">{emprestimo.cliente?.nome || '-'}</h3>
            <p className="text-xs text-muted-foreground">
              {emprestimo.taxa_juros}% ({emprestimo.tipo_juros === "composto" ? "composto" : "simples"})
            </p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              handleStatusClass(emprestimo.status)
            }`}
          >
            {handleStatusText(emprestimo.status)}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <p className="text-xs text-muted-foreground">Data</p>
            <p className="text-sm">{formatDate(emprestimo.data_emprestimo)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Valor</p>
            <p className="text-sm font-medium">{formatCurrency(emprestimo.valor_principal)}</p>
          </div>
          {emprestimo.status !== "quitado" && (
            <>
              <div>
                <p className="text-xs text-muted-foreground">Vencimento</p>
                <p className="text-sm">{formatDate(emprestimo.data_vencimento)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Restante</p>
                <p className="text-sm">{formatCurrency(emprestimo.valor_principal)}</p>
              </div>
            </>
          )}
        </div>
        
        <div className="flex justify-end mt-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
          >
            <Link to={`/emprestimos/${emprestimo.id}`} className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              Ver detalhes
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Empréstimos"
        description="Gerencie todos os empréstimos ativos e quitados"
      />

      <div className="flex items-center justify-end">
        <Button onClick={() => navigate("/emprestimos/novo")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Empréstimo
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Lista de Empréstimos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome do cliente..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="em_dia">Em dia</SelectItem>
                <SelectItem value="atrasado">Atrasados</SelectItem>
                <SelectItem value="quitado">Quitados</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoadingLoans ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : emprestimosFiltrados.length > 0 ? (
            isMobile ? (
              <div>
                {emprestimosFiltrados.map(emprestimo => renderMobileCard(emprestimo))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead className="hidden md:table-cell">Data</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="hidden md:table-cell text-right">Restante</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emprestimosFiltrados.map((emprestimo) => (
                      <TableRow key={emprestimo.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{emprestimo.cliente?.nome || '-'}</div>
                            <div className="text-xs text-muted-foreground">
                              {emprestimo.taxa_juros}% ({emprestimo.tipo_juros === "composto" ? "composto" : "simples"})
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {formatDate(emprestimo.data_emprestimo)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(emprestimo.valor_principal)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-right">
                          {emprestimo.status === "quitado" 
                            ? "Quitado" 
                            : formatCurrency(emprestimo.valor_principal) // Placeholder - replace with actual remaining value
                          }
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              handleStatusClass(emprestimo.status)
                            }`}
                          >
                            {handleStatusText(emprestimo.status)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                            >
                              <Link to={`/emprestimos/${emprestimo.id}`} className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                Ver detalhes
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          ) : (
            <EmptyState
              title="Nenhum empréstimo encontrado"
              description={searchTerm || statusFilter !== "todos" 
                ? "Tente ajustar os filtros de busca" 
                : "Comece a cadastrar empréstimos para visualizá-los aqui"}
              icon={<PlusCircle className="h-10 w-10" />}
              action={
                <Button onClick={() => navigate("/emprestimos/novo")}>
                  Cadastrar Empréstimo
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Emprestimos;
