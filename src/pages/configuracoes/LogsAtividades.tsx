
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw, ClockIcon } from "lucide-react";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const LogsAtividades = () => {
  const { logs, loading, fetchUserLogs } = useActivityLogs();
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    fetchUserLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserLogs();
    setTimeout(() => setRefreshing(false), 500);
  };
  
  const formatDateTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Logs de Atividades</h1>
          <p className="text-muted-foreground">
            Visualize o histórico das suas ações no sistema.
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          disabled={refreshing || loading}
          className="w-full md:w-auto"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Histórico de Atividades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Data/Hora</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead className="hidden md:table-cell">Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      <div className="flex justify-center">
                        <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                      Nenhum log de atividade encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center">
                          <ClockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          {formatDateTime(log.data_hora)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{log.acao}</div>
                          <div className="md:hidden text-xs text-muted-foreground mt-1 line-clamp-2">
                            {log.detalhes ? JSON.stringify(log.detalhes) : ""}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {log.detalhes ? (
                          <div className="text-sm text-muted-foreground max-w-md">
                            {Object.entries(log.detalhes).map(([key, value]) => (
                              <div key={key}>
                                <span className="font-medium">{key}:</span> {String(value)}
                              </div>
                            ))}
                          </div>
                        ) : null}
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

export default LogsAtividades;
