import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { useLoans } from "@/hooks/useLoans";
import { useDashboardData } from "@/hooks/useDashboardData";
import { format, isAfter, isBefore, addDays, differenceInDays, formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UserRound, CircleDollarSign, LineChart, Clock, AlertTriangle, CheckCircle2, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const { loans } = useLoans();
  const { 
    summaryData, 
    isLoadingSummary, 
    recentLoans, 
    isLoadingRecent, 
    upcomingPayments,
    isLoadingUpcoming
  } = useDashboardData();

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };
  
  const handleStatusClass = (status: string) => {
    switch (status) {
      case "em_dia":
        return "bg-success/10 text-success";
      case "atrasado":
        return "bg-destructive/10 text-destructive";
      case "quitado":
        return "bg-muted text-muted-foreground";
      case "pendente":
        return "bg-yellow-500/10 text-yellow-500";
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
      case "renegociado":
        return "Renegociado";
      default:
        return status;
    }
  };

  const getDueDaysText = (dateString: string) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    const diffDays = differenceInDays(dueDate, today);
    
    if (diffDays === 0) {
      return "Vence hoje";
    } else if (diffDays === 1) {
      return "Vence amanhã";
    } else if (diffDays > 1) {
      return `Vence em ${diffDays} dias`;
    } else if (diffDays === -1) {
      return "Venceu ontem";
    } else {
      return `Venceu há ${Math.abs(diffDays)} dias`;
    }
  };
  
  const getDueDaysClass = (dateString: string) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    
    if (isBefore(dueDate, today)) {
      return "text-destructive";
    } else if (differenceInDays(dueDate, today) <= 3) {
      return "text-yellow-500";
    } else {
      return "text-muted-foreground";
    }
  };
  
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral das suas finanças e empréstimos"
      />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Emprestado"
          value={isLoadingSummary ? "..." : formatCurrency(summaryData?.totalEmprestado || 0)}
          description={`Empréstimos Ativos: ${isLoadingSummary ? "..." : loans?.filter(l => l.status !== 'quitado')?.length || 0}`}
          icon={<CircleDollarSign />}
          loading={isLoadingSummary}
        />
        <StatCard
          title="Total Recebido"
          value={isLoadingSummary ? "..." : formatCurrency(summaryData?.totalRecebido || 0)}
          description={`Pagamentos: ${isLoadingSummary ? "..." : summaryData?.paymentCount || 0}`}
          icon={<CheckCircle2 />}
          loading={isLoadingSummary}
        />
        <StatCard
          title="Pendente Recebimento"
          value={isLoadingSummary ? "..." : formatCurrency(summaryData?.totalPendente || 0)}
          description={`Clientes: ${isLoadingSummary ? "..." : summaryData?.clientCount || 0}`}
          icon={<Clock />}
          loading={isLoadingSummary}
        />
        <StatCard
          title="Movimento do Mês"
          value={isLoadingSummary ? "..." : formatCurrency(summaryData?.recebimentosMes || 0)}
          description={`Emprestado: ${isLoadingSummary ? "..." : formatCurrency(summaryData?.emprestimosMes || 0)}`}
          icon={<LineChart />}
          loading={isLoadingSummary}
        />
      </div>
      
      {/* Content Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Loans Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Empréstimos Recentes</span>
              {!isLoadingRecent && (
                <Link to="/emprestimos">
                  <Button variant="link" size="sm" className="h-auto p-0">
                    Ver todos
                  </Button>
                </Link>
              )}
            </CardTitle>
            <CardDescription>Últimos empréstimos cadastrados no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingRecent ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : recentLoans && recentLoans.length > 0 ? (
              <div className="space-y-4">
                {recentLoans.map((loan) => (
                  <div key={loan.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-2">
                    <div className="space-y-1">
                      <div className="font-medium">{loan.cliente?.nome || "Cliente"}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <CalendarClock className="h-3 w-3 mr-1" />
                        {formatDate(loan.data_emprestimo)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 sm:mt-0">
                      <div className="text-sm font-medium sm:mr-4">
                        {formatCurrency(Number(loan.valor_principal))}
                      </div>
                      <Badge className={handleStatusClass(loan.status)}>
                        {handleStatusText(loan.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Nenhum empréstimo registrado ainda.</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link to="/emprestimos/novo" className="w-full">
              <Button className="w-full">
                Novo Empréstimo
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        {/* Upcoming Payments Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Próximos Vencimentos</span>
              {!isLoadingUpcoming && (
                <Link to="/emprestimos">
                  <Button variant="link" size="sm" className="h-auto p-0">
                    Ver todos
                  </Button>
                </Link>
              )}
            </CardTitle>
            <CardDescription>Empréstimos com pagamento próximo ao vencimento</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingUpcoming ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : upcomingPayments && upcomingPayments.length > 0 ? (
              <div className="space-y-4">
                {upcomingPayments.map((loan) => (
                  <div key={loan.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-2">
                    <div className="space-y-1">
                      <div className="font-medium">
                        <Link to={`/clientes/${loan.cliente_id}`} className="hover:underline">
                          {loan.cliente?.nome || "Cliente"}
                        </Link>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(Number(loan.valor_principal))}
                      </div>
                    </div>
                    <div className="mt-2 sm:mt-0 flex flex-col items-end">
                      <div className="text-xs font-medium mb-1">
                        {formatDate(loan.data_vencimento)}
                      </div>
                      <div className={`text-xs ${getDueDaysClass(loan.data_vencimento)}`}>
                        {getDueDaysText(loan.data_vencimento)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Nenhum vencimento próximo.</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link to="/relatorios" className="w-full">
              <Button variant="outline" className="w-full">
                Ver Relatórios
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
