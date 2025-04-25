import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLoans } from "@/hooks/useLoans";
import { useClients } from "@/hooks/useClients";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/common/PageHeader";
import { useActivityLogs } from "@/hooks/useActivityLogs";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const RelatoriosEGraficos = () => {
  const { loans } = useLoans();
  const { clients } = useClients();
  const { logActivity } = useActivityLogs();
  const [selectedClient, setSelectedClient] = useState<string>('all');

  useEffect(() => {
    logActivity("Visualizou relatórios e gráficos");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  // Status distribution data
  const statusData = () => {
    if (!loans) return [];
    
    const statusCounts: Record<string, number> = {};
    loans.forEach(loan => {
      if (!statusCounts[loan.status]) {
        statusCounts[loan.status] = 0;
      }
      statusCounts[loan.status]++;
    });
    
    return Object.entries(statusCounts).map(([name, value]) => ({ 
      name: statusLabel(name), 
      value, 
      percentage: Math.round((value / loans.length) * 100) 
    }));
  };
  
  // Status label function
  const statusLabel = (status: string) => {
    switch (status) {
      case "em_dia": return "Em dia";
      case "atrasado": return "Atrasado";
      case "quitado": return "Quitado";
      case "pendente": return "Pendente";
      case "renegociado": return "Renegociado";
      default: return status;
    }
  };

  // Monthly loan data
  const monthlyLoanData = () => {
    if (!loans) return [];
    
    const endDate = new Date();
    const startDate = subMonths(endDate, 5);
    
    const months = eachMonthOfInterval({ start: startDate, end: endDate });
    
    const monthlyData = months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const monthName = format(month, "MMM", { locale: ptBR });
      
      let emprestado = 0;
      let recebido = 0;
      
      loans.forEach(loan => {
        const loanDate = parseISO(loan.data_emprestimo);
        if (loanDate >= monthStart && loanDate <= monthEnd) {
          emprestado += Number(loan.valor_principal) || 0;
        }
        
        if (loan.pagamentos && Array.isArray(loan.pagamentos)) {
          loan.pagamentos.forEach(pagamento => {
            const pagamentoDate = parseISO(pagamento.data_pagamento);
            if (pagamentoDate >= monthStart && pagamentoDate <= monthEnd) {
              recebido += Number(pagamento.valor) || 0;
            }
          });
        }
      });
      
      return {
        name: monthName,
        emprestado,
        recebido
      };
    });
    
    return monthlyData;
  };

  // Payment statistics
  const paymentStatistics = () => {
    if (!loans) return { totalLoans: 0, totalVolume: 0, averagePayment: 0, paymentCount: 0 };
    
    let totalPayments = 0;
    let paymentCount = 0;
    let totalVolume = 0;
    
    loans.forEach(loan => {
      totalVolume += Number(loan.valor_principal) || 0;
      
      if (loan.pagamentos && Array.isArray(loan.pagamentos)) {
        loan.pagamentos.forEach(pagamento => {
          totalPayments += Number(pagamento.valor) || 0;
          paymentCount++;
        });
      }
    });
    
    return {
      totalLoans: loans.length,
      totalVolume,
      averagePayment: paymentCount ? totalPayments / paymentCount : 0,
      paymentCount
    };
  };

  // Client specific data
  const clientData = () => {
    if (!loans || !clients || selectedClient === 'all') return { loans: [], totalBorrowed: 0, totalPaid: 0 };
    
    const clientLoans = loans.filter(loan => loan.cliente_id === selectedClient);
    let totalBorrowed = 0;
    let totalPaid = 0;
    
    clientLoans.forEach(loan => {
      totalBorrowed += Number(loan.valor_principal) || 0;
      
      if (loan.pagamentos && Array.isArray(loan.pagamentos)) {
        loan.pagamentos.forEach(pagamento => {
          totalPaid += Number(pagamento.valor) || 0;
        });
      }
    });
    
    return { 
      loans: clientLoans, 
      totalBorrowed, 
      totalPaid,
      remainingBalance: Math.max(0, totalBorrowed - totalPaid)
    };
  };

  // Custom tool tip for recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border rounded-md shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Get client data
  const clientInfo = clientData();
  // Get payment stats
  const paymentStats = paymentStatistics();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Relatórios e Gráficos"
        description="Visualize dados financeiros e estatísticas dos empréstimos"
      />
      
      <div className="w-full overflow-hidden">
        <Tabs defaultValue="status" className="w-full">
          <TabsList className="mb-4 w-full flex-wrap">
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="movimentacao">Movimentação</TabsTrigger>
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
            <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
          </TabsList>

          <div className="w-full overflow-x-auto">
            <TabsContent value="status" className="space-y-6 min-w-[300px]">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Status</CardTitle>
                  <CardDescription>Proporção de empréstimos por status atual</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-center">
                      {loans ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={statusData()}
                              innerRadius={60}
                              outerRadius={80}
                              fill="#8884d8"
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, percentage }) => `${name}: ${percentage}%`}
                            >
                              {statusData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} empréstimos`, 'Quantidade']} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <Skeleton className="h-[300px] w-full" />
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Detalhamento</h3>
                      <div className="space-y-2">
                        {loans ? statusData().map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-3 w-3 mr-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                              <span>{item.name}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="text-muted-foreground">{item.value} empréstimos</span>
                              <span className="font-medium w-12 text-right">{item.percentage}%</span>
                            </div>
                          </div>
                        )) : (
                          <>
                            {[...Array(5)].map((_, i) => (
                              <Skeleton key={i} className="h-6 w-full" />
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="movimentacao" className="space-y-6 min-w-[300px]">
              <Card>
                <CardHeader>
                  <CardTitle>Movimentação Financeira</CardTitle>
                  <CardDescription>Valores emprestados e recebidos por mês</CardDescription>
                </CardHeader>
                <CardContent>
                  {loans ? (
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={monthlyLoanData()}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `R$${value / 1000}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="emprestado" name="Emprestado" fill="#8884d8" />
                        <Bar dataKey="recebido" name="Recebido" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Skeleton className="h-[400px] w-full" />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="clientes" className="space-y-6 min-w-[300px]">
              <Card>
                <CardHeader>
                  <CardTitle>Relatório por Cliente</CardTitle>
                  <CardDescription>Detalhes de empréstimos por cliente específico</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="w-full md:w-1/2">
                    <Select 
                      value={selectedClient} 
                      onValueChange={setSelectedClient}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Clientes</SelectItem>
                        {clients?.map(client => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedClient !== 'all' && clients ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Emprestado</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(clientInfo.totalBorrowed)}</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-green-600">{formatCurrency(clientInfo.totalPaid)}</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Saldo Restante</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{formatCurrency(clientInfo.remainingBalance || 0)}</div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-lg mb-4">Histórico de Empréstimos</h3>
                        <div className="rounded-md border overflow-hidden">
                          <table className="min-w-full divide-y divide-border">
                            <thead className="bg-muted/50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Data</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Valor</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Vencimento</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border bg-background">
                              {clientInfo.loans.map(loan => (
                                <tr key={loan.id}>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm">{formatDate(loan.data_emprestimo)}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm">{formatCurrency(Number(loan.valor_principal))}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm">{formatDate(loan.data_vencimento)}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                                      ${loan.status === 'em_dia' ? 'bg-green-100 text-green-800' :
                                        loan.status === 'atrasado' ? 'bg-red-100 text-red-800' :
                                        loan.status === 'quitado' ? 'bg-blue-100 text-blue-800' :
                                        loan.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                      }`}>
                                      {statusLabel(loan.status)}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        {selectedClient === 'all' ? 
                          "Selecione um cliente específico para ver seus detalhes" : 
                          "Carregando dados do cliente..."}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="pagamentos" className="space-y-6 min-w-[300px]">
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas de Pagamentos</CardTitle>
                  <CardDescription>Análise detalhada dos pagamentos recebidos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total de Pagamentos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{paymentStats.paymentCount}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Volume Total Recebido</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(paymentStats.totalVolume)}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Média por Pagamento</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(paymentStats.averagePayment)}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total de Empréstimos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{paymentStats.totalLoans}</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {loans && (
                    <div className="pt-4">
                      <h3 className="font-medium text-lg mb-4">Distribuição de Pagamentos</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                          data={monthlyLoanData()}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={(value) => `R$${value / 1000}k`} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Line type="monotone" dataKey="recebido" name="Pagamentos" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default RelatoriosEGraficos;
