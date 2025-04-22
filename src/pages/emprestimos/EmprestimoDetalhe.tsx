
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose
} from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Edit, 
  DollarSign, 
  Trash2, 
  RefreshCw, 
  Calendar, 
  ArrowUpRight,
  CheckCircle
} from "lucide-react";

// Dados simulados do empréstimo
const emprestimoMock = {
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
  proximoPagamento: "15/10/2023",
  proximaParcelaValor: 550,
  status: "em-dia"
};

// Dados simulados de parcelas
const parcelasMock = [
  {
    id: "1",
    numero: 1,
    valor: 550,
    dataVencimento: "15/06/2023",
    dataPagamento: "15/06/2023",
    status: "pago"
  },
  {
    id: "2",
    numero: 2,
    valor: 550,
    dataVencimento: "15/07/2023",
    dataPagamento: "15/07/2023",
    status: "pago"
  },
  {
    id: "3",
    numero: 3,
    valor: 550,
    dataVencimento: "15/08/2023",
    dataPagamento: "15/08/2023",
    status: "pago"
  },
  {
    id: "4",
    numero: 4,
    valor: 550,
    dataVencimento: "15/09/2023",
    dataPagamento: "15/09/2023",
    status: "pago"
  },
  {
    id: "5",
    numero: 5,
    valor: 550,
    dataVencimento: "15/10/2023",
    dataPagamento: null,
    status: "pendente"
  },
  {
    id: "6",
    numero: 6,
    valor: 550,
    dataVencimento: "15/11/2023",
    dataPagamento: null,
    status: "pendente"
  },
  {
    id: "7",
    numero: 7,
    valor: 550,
    dataVencimento: "15/12/2023",
    dataPagamento: null,
    status: "pendente"
  },
  {
    id: "8",
    numero: 8,
    valor: 550,
    dataVencimento: "15/01/2024",
    dataPagamento: null,
    status: "pendente"
  },
  {
    id: "9",
    numero: 9,
    valor: 550,
    dataVencimento: "15/02/2024",
    dataPagamento: null,
    status: "pendente"
  },
  {
    id: "10",
    numero: 10,
    valor: 550,
    dataVencimento: "15/03/2024",
    dataPagamento: null,
    status: "pendente"
  }
];

// Dados simulados de histórico
const historicoMock = [
  {
    id: "1",
    data: "15/05/2023",
    tipo: "criacao",
    descricao: "Empréstimo criado no valor de R$ 5.000,00 com 10 parcelas",
  },
  {
    id: "2",
    data: "15/06/2023",
    tipo: "pagamento",
    descricao: "Pagamento de R$ 550,00 referente à parcela 1/10",
  },
  {
    id: "3",
    data: "15/07/2023",
    tipo: "pagamento",
    descricao: "Pagamento de R$ 550,00 referente à parcela 2/10",
  },
  {
    id: "4",
    data: "15/08/2023",
    tipo: "pagamento",
    descricao: "Pagamento de R$ 550,00 referente à parcela 3/10",
  },
  {
    id: "5",
    data: "15/09/2023",
    tipo: "pagamento",
    descricao: "Pagamento de R$ 550,00 referente à parcela 4/10",
  }
];

const EmprestimoDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("detalhes");
  const [valorPagamento, setValorPagamento] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Aqui seria feita a busca dos dados do empréstimo com o ID fornecido
  // Por enquanto, usamos os dados simulados
  const emprestimo = emprestimoMock;
  const parcelas = parcelasMock;
  const historico = historicoMock;

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

  const handleParcelaStatusClass = (status: string) => {
    switch (status) {
      case "pago":
        return "bg-success/10 text-success";
      case "pendente":
        return "bg-muted text-muted-foreground";
      case "atrasado":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleDeleteEmprestimo = () => {
    // Aqui seria feita a chamada para excluir o empréstimo
    console.log("Excluir empréstimo:", id);
    navigate("/emprestimos");
  };

  const handleRegistrarPagamento = () => {
    setIsLoading(true);
    
    // Simulação de registro de pagamento
    console.log("Registrar pagamento:", valorPagamento);
    
    setTimeout(() => {
      setIsLoading(false);
      setValorPagamento("");
      // Recarregar dados do empréstimo
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/emprestimos")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Detalhes do Empréstimo</h1>
          <p className="text-muted-foreground">
            Cliente: {emprestimo.clienteNome}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div className="flex gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium ${
              handleStatusClass(emprestimo.status)
            }`}
          >
            {handleStatusText(emprestimo.status)}
          </span>
          <span className="inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium bg-accent">
            {emprestimo.tipoJuros === "composto" ? "Juros Compostos" : "Juros Simples"}
          </span>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/emprestimos/${id}/editar`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <DollarSign className="mr-2 h-4 w-4" />
                Registrar Pagamento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Pagamento</DialogTitle>
                <DialogDescription>
                  Informe o valor recebido para este empréstimo.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor do Pagamento</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">R$</span>
                    <Input
                      id="valor"
                      type="number"
                      placeholder="0,00"
                      className="pl-10"
                      value={valorPagamento}
                      onChange={(e) => setValorPagamento(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button onClick={handleRegistrarPagamento} disabled={isLoading}>
                  {isLoading ? "Registrando..." : "Registrar Pagamento"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir empréstimo</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir este empréstimo? Esta ação não pode ser desfeita e todos os dados associados serão perdidos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteEmprestimo} className="bg-destructive text-destructive-foreground">
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Valor Original
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {emprestimo.valor.toLocaleString("pt-BR")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {emprestimo.parcelas} parcelas de R$ {(emprestimo.valor / emprestimo.parcelas).toLocaleString("pt-BR")} + juros
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Valor Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              R$ {emprestimo.valorPago.toLocaleString("pt-BR")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {parcelas.filter(p => p.status === "pago").length} de {emprestimo.parcelas} parcelas pagas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Valor Restante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              R$ {emprestimo.valorRestante.toLocaleString("pt-BR")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Próximo pagamento: {emprestimo.proximoPagamento}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
          <TabsTrigger value="parcelas">Parcelas</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>
        
        <TabsContent value="detalhes">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Empréstimo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Valor Principal</p>
                  <p className="font-medium">R$ {emprestimo.valor.toLocaleString("pt-BR")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data do Empréstimo</p>
                  <p>{emprestimo.dataInicio}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taxa de Juros</p>
                  <p>{emprestimo.juros}% ao mês ({emprestimo.tipoJuros === "composto" ? "composto" : "simples"})</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Parcelas</p>
                  <p>{emprestimo.parcelas} parcelas</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Valor Já Pago</p>
                  <p className="text-success">R$ {emprestimo.valorPago.toLocaleString("pt-BR")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Valor Restante</p>
                  <p className="text-primary">R$ {emprestimo.valorRestante.toLocaleString("pt-BR")}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Próximo Pagamento</h3>
                <Card className="bg-accent">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-10 w-10 text-primary" />
                        <div>
                          <p className="font-medium">{emprestimo.proximoPagamento}</p>
                          <p className="text-sm text-muted-foreground">Data de vencimento</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-2xl">R$ {emprestimo.proximaParcelaValor.toLocaleString("pt-BR")}</p>
                        <p className="text-sm text-muted-foreground">Valor da parcela</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" className="sm:flex-1" asChild>
                  <Link to={`/clientes/${emprestimo.clienteId}`}>
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Ver Cliente
                  </Link>
                </Button>
                <Button variant="outline" className="sm:flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Renegociar Empréstimo
                </Button>
                <Button className="sm:flex-1">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Quitar Empréstimo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="parcelas">
          <Card>
            <CardHeader>
              <CardTitle>Parcelas do Empréstimo</CardTitle>
              <CardDescription>
                Visualize todas as parcelas e seus status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parcela</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead>Pagamento</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parcelas.map((parcela) => (
                      <TableRow key={parcela.id}>
                        <TableCell className="font-medium">
                          {parcela.numero}/{emprestimo.parcelas}
                        </TableCell>
                        <TableCell>{parcela.dataVencimento}</TableCell>
                        <TableCell className="text-right">
                          R$ {parcela.valor.toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          {parcela.dataPagamento || "-"}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              handleParcelaStatusClass(parcela.status)
                            }`}
                          >
                            {parcela.status === "pago" 
                              ? "Pago" 
                              : parcela.status === "atrasado" 
                                ? "Atrasado" 
                                : "Pendente"
                            }
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="historico">
          <Card>
            <CardHeader>
              <CardTitle>Histórico do Empréstimo</CardTitle>
              <CardDescription>
                Todas as alterações e transações relacionadas a este empréstimo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {historico.map((item) => (
                  <div key={item.id} className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-muted">
                        {item.tipo === "criacao" ? (
                          <DollarSign className="h-5 w-5 text-primary" />
                        ) : item.tipo === "pagamento" ? (
                          <CheckCircle className="h-5 w-5 text-success" />
                        ) : (
                          <RefreshCw className="h-5 w-5 text-warning" />
                        )}
                      </div>
                      <div className="h-full w-px bg-border" />
                    </div>
                    <div className="mb-10 space-y-0.5">
                      <p className="text-sm text-muted-foreground">{item.data}</p>
                      <p className="font-medium">{item.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmprestimoDetalhe;
