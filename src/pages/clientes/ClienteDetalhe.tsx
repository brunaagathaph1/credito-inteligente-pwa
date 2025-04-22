
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Trash2, UserMinus, DollarSign, Phone } from "lucide-react";
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

// Dados simulados de cliente
const clienteMock = {
  id: "1",
  nome: "João da Silva",
  documento: "123.456.789-00",
  telefone: "(11) 98765-4321",
  email: "joao.silva@email.com",
  endereco: {
    logradouro: "Rua das Flores",
    numero: "123",
    complemento: "Apto 101",
    bairro: "Centro",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01234-567"
  },
  score: 95,
  status: "ativo",
  observacoes: "Cliente de longa data, bom pagador. Prefere ser contactado por WhatsApp.",
  dataCadastro: "10/05/2023"
};

// Dados simulados de empréstimos deste cliente
const emprestimosMock = [
  {
    id: "1",
    valor: 5000,
    dataInicio: "15/05/2023",
    juros: 2.5,
    tipoJuros: "composto",
    parcelas: 10,
    status: "ativo",
    valorPago: 3000,
    valorRestante: 2500,
    proximoPagamento: "15/06/2023"
  },
  {
    id: "2",
    valor: 2000,
    dataInicio: "20/01/2023",
    juros: 2.0,
    tipoJuros: "simples",
    parcelas: 5,
    status: "quitado",
    valorPago: 2200,
    valorRestante: 0,
    proximoPagamento: null
  }
];

// Dados simulados de pagamentos
const pagamentosMock = [
  {
    id: "1",
    data: "15/05/2023",
    valor: 550,
    emprestimo: "1",
    parcela: 1
  },
  {
    id: "2",
    data: "15/06/2023",
    valor: 550,
    emprestimo: "1",
    parcela: 2
  },
  {
    id: "3",
    data: "15/07/2023",
    valor: 550,
    emprestimo: "1",
    parcela: 3
  },
  {
    id: "4",
    data: "15/08/2023",
    valor: 550,
    emprestimo: "1",
    parcela: 4
  },
  {
    id: "5",
    data: "15/09/2023",
    valor: 550,
    emprestimo: "1",
    parcela: 5
  },
  {
    id: "6",
    data: "15/10/2023",
    valor: 250,
    emprestimo: "1",
    parcela: 6
  }
];

const ClienteDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dados");

  // Aqui seria feita a busca dos dados do cliente com o ID fornecido
  // Por enquanto, usamos os dados simulados
  const cliente = clienteMock;
  const emprestimos = emprestimosMock;
  const pagamentos = pagamentosMock;

  const handleScoreClass = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const handleInactivateClient = () => {
    console.log("Inativar cliente:", id);
    // Aqui seria feita a chamada para inativar o cliente
    // Após a inativação, redirecionar para a lista de clientes
    navigate("/clientes");
  };

  const handleDeleteClient = () => {
    console.log("Excluir cliente:", id);
    // Aqui seria feita a chamada para excluir o cliente
    // Após a exclusão, redirecionar para a lista de clientes
    navigate("/clientes");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/clientes")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{cliente.nome}</h1>
          <p className="text-muted-foreground">{cliente.documento}</p>
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
          <Button variant="outline" asChild>
            <a href={`tel:${cliente.telefone.replace(/\D/g, '')}`}>
              <Phone className="mr-2 h-4 w-4" />
              Ligar
            </a>
          </Button>
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
                    <p className="text-sm font-medium text-muted-foreground">Documento</p>
                    <p>{cliente.documento}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                    <p>{cliente.telefone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">E-mail</p>
                    <p>{cliente.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        cliente.status === "ativo"
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {cliente.status === "ativo" ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Score</p>
                    <p className={handleScoreClass(cliente.score)}>{cliente.score}</p>
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
                  <p>
                    {cliente.endereco.logradouro}, {cliente.endereco.numero}
                    {cliente.endereco.complemento && `, ${cliente.endereco.complemento}`}
                  </p>
                  <p>
                    {cliente.endereco.bairro}, {cliente.endereco.cidade} - {cliente.endereco.estado}
                  </p>
                  <p>CEP: {cliente.endereco.cep}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{cliente.observacoes}</p>
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
                                emprestimo.status === "ativo"
                                  ? "bg-success/10 text-success"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {emprestimo.status === "ativo" ? "Ativo" : "Quitado"}
                            </span>
                            <p className="font-medium">
                              R$ {emprestimo.valor.toLocaleString("pt-BR")}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Iniciado em {emprestimo.dataInicio} • {emprestimo.parcelas} parcelas • Juros de {emprestimo.juros}% ({emprestimo.tipoJuros})
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {emprestimo.status === "ativo"
                              ? `Restante: R$ ${emprestimo.valorRestante.toLocaleString("pt-BR")}`
                              : "Quitado"}
                          </p>
                          {emprestimo.proximoPagamento && (
                            <p className="text-sm text-muted-foreground">
                              Próximo pagamento: {emprestimo.proximoPagamento}
                            </p>
                          )}
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
                            Parcela {pagamento.parcela} • Empréstimo #{pagamento.emprestimo}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Pago em {pagamento.data}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-success">
                            R$ {pagamento.valor.toLocaleString("pt-BR")}
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
