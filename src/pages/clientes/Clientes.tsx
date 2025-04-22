
import { useState } from "react";
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
import { Search, UserPlus, Eye } from "lucide-react";

// Dados simulados de clientes
const clientesMock = [
  { 
    id: "1", 
    nome: "João da Silva", 
    documento: "123.456.789-00", 
    telefone: "(11) 98765-4321", 
    score: 95, 
    status: "ativo" 
  },
  { 
    id: "2", 
    nome: "Maria Oliveira", 
    documento: "987.654.321-00", 
    telefone: "(11) 91234-5678", 
    score: 85, 
    status: "ativo" 
  },
  { 
    id: "3", 
    nome: "Carlos Santos", 
    documento: "456.789.123-00", 
    telefone: "(11) 95555-1234", 
    score: 75, 
    status: "inativo" 
  },
  { 
    id: "4", 
    nome: "Ana Souza", 
    documento: "789.123.456-00", 
    telefone: "(11) 94444-5678", 
    score: 90, 
    status: "ativo" 
  },
  { 
    id: "5", 
    nome: "Roberto Ferreira", 
    documento: "321.654.987-00", 
    telefone: "(11) 93333-7890", 
    score: 65, 
    status: "ativo" 
  },
];

const Clientes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  
  // Filtrar clientes com base na busca e no filtro de status
  const clientesFiltrados = clientesMock.filter(cliente => {
    const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cliente.documento.includes(searchTerm);
                          
    const matchesStatus = statusFilter === "todos" || cliente.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleScoreClass = (score: number) => {
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
                placeholder="Buscar por nome ou documento..."
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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">Documento</TableHead>
                  <TableHead className="hidden md:table-cell">Telefone</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientesFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                      Nenhum cliente encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  clientesFiltrados.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium">{cliente.nome}</TableCell>
                      <TableCell className="hidden md:table-cell">{cliente.documento}</TableCell>
                      <TableCell className="hidden md:table-cell">{cliente.telefone}</TableCell>
                      <TableCell className={handleScoreClass(cliente.score)}>
                        {cliente.score}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            cliente.status === "ativo"
                              ? "bg-success/10 text-success"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {cliente.status === "ativo" ? "Ativo" : "Inativo"}
                        </span>
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Clientes;
