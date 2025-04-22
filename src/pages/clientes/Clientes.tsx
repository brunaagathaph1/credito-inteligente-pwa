
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { EmptyState } from "@/components/common/EmptyState";

type Cliente = {
  id: string;
  nome: string;
  cpf?: string;
  telefone?: string;
  email?: string;
  score?: number;
  status?: string;
};

const Clientes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const { logActivity } = useActivityLogs();
  
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('clientes')
          .select('*')
          .order('nome');
          
        if (error) {
          throw error;
        }
        
        setClientes(data || []);
        // Log activity after successful fetch
        logActivity("Visualizou lista de clientes");
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClientes();
  }, [logActivity]);
  
  // Filtrar clientes com base na busca e no filtro de status
  const clientesFiltrados = clientes.filter(cliente => {
    const matchesSearch = cliente.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cliente.cpf?.includes(searchTerm) ||
                          cliente.email?.toLowerCase().includes(searchTerm.toLowerCase());
                          
    const matchesStatus = statusFilter === "todos" || cliente.status === statusFilter;
    
    return matchesSearch && (statusFilter === "todos" || true); // Temporário até implementar status
  });

  const handleScoreClass = (score?: number) => {
    if (!score) return "text-muted-foreground";
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

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

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : clientesFiltrados.length > 0 ? (
            <div className="rounded-md border">
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
                          asChild
                        >
                          <Link to={`/clientes/${cliente.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver cliente</span>
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              title="Nenhum cliente encontrado"
              description={searchTerm || statusFilter !== "todos" 
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
