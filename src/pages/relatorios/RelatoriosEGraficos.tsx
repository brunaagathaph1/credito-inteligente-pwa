
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useLoans } from "@/hooks/useLoans";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useActivityLogs } from "@/hooks/useActivityLogs";

// Define types for the data
interface MesData {
  mes: string;
  emprestimos: number;
  recebimentos: number;
}

interface StatusData {
  name: string;
  value: number;
}

const RelatoriosEGraficos = () => {
  const { loans, isLoadingLoans } = useLoans();
  const { logActivity } = useActivityLogs();
  const [dadosMensais, setDadosMensais] = useState<MesData[]>([]);
  const [dadosStatus, setDadosStatus] = useState<StatusData[]>([]);

  useEffect(() => {
    logActivity("Acessou página de relatórios e gráficos");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    if (loans) {
      // Dados para o gráfico de barras mensal
      const mesesData: Record<string, MesData> = {};
      
      // Processar loans para o gráfico mensal
      loans.forEach(emprestimo => {
        if (!emprestimo.data_emprestimo) return;
        
        const data = new Date(emprestimo.data_emprestimo);
        const mesAno = format(data, 'MMM/yy', { locale: ptBR });
        
        if (!mesesData[mesAno]) {
          mesesData[mesAno] = {
            mes: mesAno,
            emprestimos: 0,
            recebimentos: 0
          };
        }
        
        mesesData[mesAno].emprestimos += Number(emprestimo.valor_principal) || 0;
        
        // Se há pagamentos, somar para o mês correspondente
        if (emprestimo.pagamentos && Array.isArray(emprestimo.pagamentos)) {
          emprestimo.pagamentos.forEach(pagamento => {
            if (!pagamento.data_pagamento) return;
            
            const dataPagamento = new Date(pagamento.data_pagamento);
            const mesPagamento = format(dataPagamento, 'MMM/yy', { locale: ptBR });
            
            if (!mesesData[mesPagamento]) {
              mesesData[mesPagamento] = {
                mes: mesPagamento,
                emprestimos: 0,
                recebimentos: 0
              };
            }
            
            mesesData[mesPagamento].recebimentos += Number(pagamento.valor) || 0;
          });
        }
      });
      
      // Converter para array e ordenar por mês
      const mesesArray = Object.values(mesesData);
      mesesArray.sort((a, b) => {
        const dataA = new Date(`${a.mes.split('/')[0]} 20${a.mes.split('/')[1]}`);
        const dataB = new Date(`${b.mes.split('/')[0]} 20${b.mes.split('/')[1]}`);
        return dataA.getTime() - dataB.getTime();
      });
      
      setDadosMensais(mesesArray);
      
      // Processar status dos empréstimos para o gráfico de pizza
      const statusCount: Record<string, number> = {
        "em-dia": 0,
        "atrasado": 0,
        "quitado": 0,
        "pendente": 0
      };
      
      loans.forEach(emprestimo => {
        if (emprestimo.status && statusCount[emprestimo.status] !== undefined) {
          statusCount[emprestimo.status]++;
        }
      });
      
      const statusArray = [
        { name: "Em dia", value: statusCount["em-dia"] || 0 },
        { name: "Atrasados", value: statusCount["atrasado"] || 0 },
        { name: "Quitados", value: statusCount["quitado"] || 0 },
        { name: "Pendentes", value: statusCount["pendente"] || 0 }
      ];
      
      // Filtrar para remover status com valor 0
      const statusFiltrado = statusArray.filter(item => item.value > 0);
      
      setDadosStatus(statusFiltrado.length > 0 ? statusFiltrado : statusArray);
    }
  }, [loans]);

  const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#8884d8"];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Relatórios e Gráficos</h1>
        <p className="text-muted-foreground">
          Visualize os dados financeiros do sistema.
        </p>
      </div>

      {isLoadingLoans ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Movimentação Financeira Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={dadosMensais}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value) => [formatCurrency(value), ""]} />
                    <Legend />
                    <Bar 
                      name="Empréstimos" 
                      dataKey="emprestimos" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      name="Recebimentos" 
                      dataKey="recebimentos" 
                      fill="hsl(var(--success))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status dos Empréstimos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dadosStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dadosStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} empréstimo(s)`, ""]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Relatórios por Cliente</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            Relatórios detalhados por cliente serão implementados em breve.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            Estatísticas detalhadas de pagamentos serão implementadas em breve.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelatoriosEGraficos;
