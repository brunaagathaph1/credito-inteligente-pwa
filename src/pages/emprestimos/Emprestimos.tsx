
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
import { Search, PlusCircle, Eye } from "lucide-react";

// Dados simulados de empréstimos
const emprestimosMock = [
  { 
    id: "1", 
    clienteId: "1",
    clienteNome: "João da Silva", 
    valor: 5000, 
    dataInicio: "15/05/2023", 
    juros: 2.5, 
    tipoJuros: "composto", 
    parcelas: 10, 
    valorPago: 3000, 
    valorRestante: 2500,
    status: "em-dia"
  },
  { 
    id: "2", 
    clienteId: "1",
    clienteNome: "João da Silva", 
    valor: 2000, 
    dataInicio: "20/01/2023", 
    juros: 2.0, 
    tipoJuros: "simples", 
    parcelas: 5, 
    valorPago: 2200, 
    valorRestante: 0,
    status: "quitado"
  },
  { 
    id: "3", 
    clienteId: "2",
    clienteNome: "Maria Oliveira", 
    valor: 10000, 
    dataInicio: "05/02/2023", 
    juros: 3.0, 
    tipoJuros: "composto", 
    parcelas: 12, 
    valorPago: 5000, 
    valorRestante: 6000,
    status: "em-dia"
  },
  { 
    id: "4", 
    clienteId: "3",
    clienteNome: "Carlos Santos", 
    valor: 1500, 
    dataInicio: "10/06/2023", 
    juros: 2.2, 
    tipoJuros: "simples", 
    parcelas: 3, 
    valorPago: 500, 
    valorRestante: 1100,
    status: "atrasado"
  },
  { 
    id: "5", 
    clienteId: "4",
    clienteNome: "Ana Souza", 
    valor: 7500, 
    dataInicio: "30/04/2023", 
    juros: 2.8, 
    tipoJuros: "composto", 
    parcelas: 15, 
    valorPago: 2000, 
    valorRestante: 6000,
    status: "em-dia"
  },
];

const Emprestimos = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  
  // Filtrar empréstimos com base na busca e no filtro de status
  const emprestimosFiltrados = emprestimosMock.filter(emprestimo => {
    const matchesSearch = emprestimo.clienteNome.toLowerCase().includes(searchTerm.toLowerCase());
                          
    const matchesStatus = statusFilter === "todos" || emprestimo.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusClass = (status: string) => {
    switch (status) {
      case "em-dia":
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
      case "em-dia":
        return "Em dia";
      case "atrasado":
        return "Atrasado";
      case "quitado":
        return "Quitado";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Empréstimos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os empréstimos ativos e quitados.
          </p>
        </div>
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
                <SelectItem value="em-dia">Em dia</SelectItem>
                <SelectItem value="atrasado">Atrasados</SelectItem>
                <SelectItem value="quitado">Quitados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
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
                {emprestimosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                      Nenhum empréstimo encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  emprestimosFiltrados.map((emprestimo) => (
                    <TableRow key={emprestimo.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{emprestimo.clienteNome}</div>
                          <div className="text-xs text-muted-foreground">
                            {emprestimo.parcelas} parcelas • {emprestimo.juros}% ({emprestimo.tipoJuros === "composto" ? "composto" : "simples"})
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {emprestimo.dataInicio}
                      </TableCell>
                      <TableCell className="text-right">
                        R$ {emprestimo.valor.toLocaleString("pt-BR")}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-right">
                        {emprestimo.status === "quitado" 
                          ? "Quitado" 
                          : `R$ ${emprestimo.valorRestante.toLocaleString("pt-BR")}`
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
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                        >
                          <Link to={`/emprestimos/${emprestimo.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver empréstimo</span>
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

export default Emprestimos;
