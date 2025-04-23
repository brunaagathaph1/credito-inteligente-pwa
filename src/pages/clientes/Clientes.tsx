
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Search, UserPlus, Eye, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { EmptyState } from "@/components/common/EmptyState";
import { useClients } from "@/hooks/useClients";
import { useIsMobile } from "@/hooks/use-mobile";

const Clientes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const { logActivity } = useActivityLogs();
  const { clients, isLoadingClients } = useClients();
  const isMobile = useIsMobile();
  
  // Log activity only once when component mounts
  useEffect(() => {
    // Only log activity once on component mount
    logActivity("Visualizou lista de clientes");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Filtrar clientes com base na busca e no filtro de status
  const clientesFiltrados = (clients || []).filter(cliente => {
    const matchesSearch = cliente.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cliente.cpf?.includes(searchTerm) ||
                          cliente.email?.toLowerCase().includes(searchTerm.toLowerCase());
                          
    // Since 'status' doesn't exist in the client type, we're removing this filter
    // And always returning true for the status part of the filter
    return matchesSearch;
  });

  const handleScoreClass = (score?: number) => {
    if (!score) return "text-muted-foreground";
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const handleViewClient = (clientId: string) => {
    navigate(`/clientes/${clientId}`);
  };

  // Renderiza um card para dispositivos móveis em vez de uma linha de tabela
  const renderMobileCard = (cliente: any) => (
    <Card key={cliente.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-base">{cliente.nome}</h3>
            <p className="text-xs text-muted-foreground">{cliente.cpf || '-'}</p>
          </div>
          <div className={`text-right ${handleScoreClass(cliente.score)}`}>
            <span className="font-medium">{cliente.score || '-'}</span>
            <p className="text-xs text-muted-foreground">Score</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-2 mb-3">
          <div>
            <p className="text-xs text-muted-foreground">Telefone</p>
            <p className="text-sm">{cliente.telefone || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm">{cliente.email || '-'}</p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewClient(cliente.id)}
            className="flex items-center"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie seus clientes e visualize informações.
          </p>
        </div>
        <Button onClick={() => navigate("/clientes/novo")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, CPF ou email..."
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
                <SelectItem value="ativo">Ativos</SelectItem>
                <SelectItem value="inativo">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoadingClients ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : clientesFiltrados.length > 0 ? (
            isMobile ? (
              <div>
                {clientesFiltrados.map(cliente => renderMobileCard(cliente))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden md:table-cell">CPF</TableHead>
                      <TableHead className="hidden md:table-cell">Telefone</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientesFiltrados.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell className="font-medium">{cliente.nome}</TableCell>
                        <TableCell className="hidden md:table-cell">{cliente.cpf || '-'}</TableCell>
                        <TableCell className="hidden md:table-cell">{cliente.telefone || '-'}</TableCell>
                        <TableCell className="hidden md:table-cell">{cliente.email || '-'}</TableCell>
                        <TableCell className={handleScoreClass(cliente.score)}>
                          {cliente.score || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewClient(cliente.id)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver cliente</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          ) : (
            <EmptyState
              title="Nenhum cliente encontrado"
              description={searchTerm 
                ? "Tente ajustar os filtros de busca" 
                : "Comece a cadastrar seus clientes para visualizá-los aqui"}
              icon={<UserPlus className="h-10 w-10" />}
              action={
                <Button onClick={() => navigate("/clientes/novo")}>
                  Cadastrar Cliente
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Clientes;
