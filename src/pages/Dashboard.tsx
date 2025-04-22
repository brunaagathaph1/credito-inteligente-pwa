
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, DollarSign, Users, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { 
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { useLoans } from "@/hooks/useLoans";
import { useClients } from "@/hooks/useClients";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { format, addDays, compareAsc, isAfter, isBefore, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useActivityLogs } from "@/hooks/useActivityLogs";

// Define interfaces for type safety
interface ResumoCard {
  titulo: string;
  valor: string;
  descricao: string;
  icone: JSX.Element;
  cor: string;
}

interface RecebimentoMensal {
  mes: string;
  date: Date;
  valor: number;
}

interface Vencimento {
  id: string;
  clienteNome: string;
  valor: number;
  diasParaVencimento: number;
  dataVencimento: string;
}

const Dashboard = () => {
  const { loans, isLoadingLoans } = useLoans();
  const { clients, isLoadingClients } = useClients();
  const { logActivity } = useActivityLogs();
  const navigate = useNavigate();
  const [resumoCards, setResumoCards] = useState<ResumoCard[]>([]);
  const [recebimentosMensais, setRecebimentosMensais] = useState<{ mes: string; valor: number }[]>([]);
  const [proximosVencimentos, setProximosVencimentos] = useState<Vencimento[]>([]);
  
  useEffect(() => {
    logActivity("Acessou o Dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loans && clients) {
      // Processa dados para os cards de resumo
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfPrevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endOfPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      
      // Calcula valores para empréstimos ativos (não quitados)
      const emprestimosAtivos = loans.filter(emp => emp.status !== "quitado");
      const totalEmprestimosAtivos = emprestimosAtivos.reduce(
        (sum, emp) => sum + Number(emp.valor_principal), 0
      );
      
      // Conta clientes ativos (clientes com empréstimos ativos)
      const clientesComEmprestimosAtivos = new Set(
        emprestimosAtivos.map(emp => emp.cliente_id)
      ).size;
      
      // Calcula novos clientes este mês
      const clientesNovosMes = clients.filter(
        cliente => {
          const createdAt = new Date(cliente.created_at);
          return isAfter(createdAt, startOfMonth) || createdAt.getTime() === startOfMonth.getTime();
        }
      ).length;
      
      // Calcula recebimentos do mês atual
      const recebimentosMesAtual = loans
        .flatMap(emp => emp.pagamentos && Array.isArray(emp.pagamentos) ? emp.pagamentos : [])
        .filter(pag => {
          if (!pag || !pag.data_pagamento) return false;
          const dataPagamento = new Date(pag.data_pagamento);
          return (isAfter(dataPagamento, startOfMonth) || dataPagamento.getTime() === startOfMonth.getTime()) 
                 && isBefore(dataPagamento, today);
        })
        .reduce((sum, pag) => sum + Number(pag.valor), 0);
      
      // Calcula recebimentos do mês anterior
      const recebimentosMesAnterior = loans
        .flatMap(emp => emp.pagamentos && Array.isArray(emp.pagamentos) ? emp.pagamentos : [])
        .filter(pag => {
          if (!pag || !pag.data_pagamento) return false;
          const dataPagamento = new Date(pag.data_pagamento);
          return isAfter(dataPagamento, startOfPrevMonth) && isBefore(dataPagamento, endOfPrevMonth);
        })
        .reduce((sum, pag) => sum + Number(pag.valor), 0);
      
      // Calcula percentual de variação entre meses
      const percentualVariacao = recebimentosMesAnterior > 0 
        ? ((recebimentosMesAtual - recebimentosMesAnterior) / recebimentosMesAnterior) * 100 
        : 0;
      
      // Calcula valor de inadimplência (empréstimos atrasados)
      const emprestimosAtrasados = loans.filter(emp => emp.status === "atrasado");
      const valorInadimplencia = emprestimosAtrasados.reduce(
        (sum, emp) => sum + Number(emp.valor_principal), 0
      );
      
      // Percentual de inadimplência em relação ao total
      const percentualInadimplencia = totalEmprestimosAtivos > 0 
        ? (valorInadimplencia / totalEmprestimosAtivos) * 100 
        : 0;
      
      // Atualiza dados dos cards
      setResumoCards([
        {
          titulo: "Total de Empréstimos Ativos",
          valor: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalEmprestimosAtivos),
          descricao: `${emprestimosAtivos.length} empréstimo${emprestimosAtivos.length !== 1 ? 's' : ''}`,
          icone: <DollarSign className="h-6 w-6 text-primary" />,
          cor: "bg-blue-50 dark:bg-blue-950",
        },
        {
          titulo: "Clientes Ativos",
          valor: clientesComEmprestimosAtivos.toString(),
          descricao: `${clientesNovosMes} novo${clientesNovosMes !== 1 ? 's' : ''} este mês`,
          icone: <Users className="h-6 w-6 text-primary" />,
          cor: "bg-green-50 dark:bg-green-950",
        },
        {
          titulo: "Recebimentos do Mês",
          valor: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(recebimentosMesAtual),
          descricao: `${Math.abs(percentualVariacao).toFixed(0)}% ${percentualVariacao >= 0 ? 'acima' : 'abaixo'} do mês anterior`,
          icone: percentualVariacao >= 0 
            ? <ArrowUp className="h-6 w-6 text-success" />
            : <ArrowDown className="h-6 w-6 text-destructive" />,
          cor: percentualVariacao >= 0 ? "bg-success/10" : "bg-destructive/10",
        },
        {
          titulo: "Inadimplência",
          valor: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorInadimplencia),
          descricao: `${percentualInadimplencia.toFixed(1)}% da carteira total`,
          icone: <ArrowDown className="h-6 w-6 text-destructive" />,
          cor: "bg-destructive/10",
        },
      ]);
      
      // Processa dados para o gráfico de recebimentos mensais
      const ultimosMeses: RecebimentoMensal[] = Array.from({ length: 6 }, (_, i) => {
        const data = new Date();
        data.setMonth(data.getMonth() - i);
        return {
          mes: format(data, 'MMM', { locale: ptBR }),
          date: data,
          valor: 0
        };
      }).reverse();
      
      // Mapeia pagamentos para os respectivos meses
      loans.forEach(emp => {
        if (!emp.pagamentos || !Array.isArray(emp.pagamentos)) return;
        
        emp.pagamentos.forEach(pag => {
          if (!pag || !pag.data_pagamento) return;
          
          const dataPagamento = new Date(pag.data_pagamento);
          
          // Verifica se o pagamento está dentro dos últimos 6 meses
          const mesIndex = ultimosMeses.findIndex(m => 
            m.date.getMonth() === dataPagamento.getMonth() && 
            m.date.getFullYear() === dataPagamento.getFullYear()
          );
          
          if (mesIndex !== -1) {
            ultimosMeses[mesIndex].valor += Number(pag.valor);
          }
        });
      });
      
      setRecebimentosMensais(ultimosMeses.map(m => ({
        mes: m.mes,
        valor: m.valor
      })));
      
      // Processa dados para próximos vencimentos
      const hoje = new Date();
      const proximosDias = addDays(hoje, 15); // Próximos 15 dias
      
      const vencimentosProximos = loans
        .filter(emp => 
          emp.status !== "quitado" && 
          emp.data_vencimento && 
          isBefore(parseISO(emp.data_vencimento), proximosDias) && 
          isAfter(parseISO(emp.data_vencimento), hoje)
        )
        .map(emp => {
          const cliente = clients.find(c => c.id === emp.cliente_id);
          const diasRestantes = Math.ceil(
            (new Date(emp.data_vencimento).getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24)
          );
          
          return {
            id: emp.id,
            clienteNome: cliente?.nome || "Cliente não encontrado",
            valor: Number(emp.valor_principal),
            diasParaVencimento: diasRestantes,
            dataVencimento: emp.data_vencimento
          };
        })
        .sort((a, b) => a.diasParaVencimento - b.diasParaVencimento)
        .slice(0, 4); // Limita a 4 itens
      
      setProximosVencimentos(vencimentosProximos);
    }
  }, [loans, clients]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const isLoading = isLoadingLoans || isLoadingClients;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao Crédito Inteligente, seus números resumidos.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {resumoCards.map((card, index) => (
              <Card key={index} className={card.cor}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium">
                      {card.titulo}
                    </CardTitle>
                    {card.icone}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.valor}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {card.descricao}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">
                    Recebimentos Mensais
                  </CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={recebimentosMensais}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value), "Valor"]}
                        labelFormatter={(label) => `Mês: ${label}`}
                      />
                      <Legend />
                      <Bar
                        name="Valor Recebido"
                        dataKey="valor"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                        barSize={30}
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                  Próximos Vencimentos
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                {proximosVencimentos.length > 0 ? (
                  <div className="space-y-4">
                    {proximosVencimentos.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between border-b pb-3 last:border-0 cursor-pointer hover:bg-accent/50 p-2 rounded"
                        onClick={() => navigate(`/emprestimos/${item.id}`)}
                      >
                        <div className="space-y-1">
                          <p className="font-medium">{item.clienteNome}</p>
                          <p className="text-sm text-muted-foreground">
                            Vencimento em {item.diasParaVencimento} dia{item.diasParaVencimento !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(item.valor)}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(item.dataVencimento), "dd/MM/yyyy")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground mb-4">Não há vencimentos próximos</p>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/emprestimos/novo")}
                    >
                      Cadastrar Novo Empréstimo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
