
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Activity, Filter, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/common/EmptyState";
import { useActivityLogs, ActivityLog } from "@/hooks/useActivityLogs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const LogsAtividades = () => {
  const { logs, loading, fetchUserLogs } = useActivityLogs();
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchUserLogs(100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentFilter) {
      setFilteredLogs(logs.filter(log => log.acao.includes(currentFilter)));
    } else {
      setFilteredLogs(logs);
    }
  }, [logs, currentFilter]);

  // Gerar tipos de ações únicas para o filtro
  const acoesTipos = [...new Set(logs.map(log => log.acao))];

  // Filtrar por tipo de ação
  const handleFilterChange = (tipoAcao: string | null) => {
    setCurrentFilter(tipoAcao);
  };

  // Exportar logs para CSV
  const exportToCSV = () => {
    const csvHeader = "Data,Ação,Detalhes,IP,User Agent\n";
    const csvData = filteredLogs.map(log => {
      const dataFormatada = format(new Date(log.data_hora), "dd/MM/yyyy HH:mm:ss", { locale: ptBR });
      const detalhes = log.detalhes ? JSON.stringify(log.detalhes).replace(/"/g, '""') : "";
      return `"${dataFormatada}","${log.acao}","${detalhes}","${log.ip_origem || ""}","${log.user_agent || ""}"`;
    }).join("\n");

    const csvContent = csvHeader + csvData;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `logs_atividades_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Logs de Atividades"
        description="Histórico das suas ações no sistema"
        actions={
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  {currentFilter ? `Filtro: ${currentFilter}` : "Filtrar"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleFilterChange(null)}>
                  Todos os logs
                </DropdownMenuItem>
                {acoesTipos.map((tipo) => (
                  <DropdownMenuItem 
                    key={tipo} 
                    onClick={() => handleFilterChange(tipo)}
                  >
                    {tipo}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" onClick={exportToCSV} disabled={filteredLogs.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        }
      />

      {loading ? (
        <div className="flex justify-center py-10">Carregando...</div>
      ) : filteredLogs.length > 0 ? (
        <div className="bg-white rounded-md shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Detalhes</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {format(new Date(log.data_hora), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="font-medium">{log.acao}</TableCell>
                  <TableCell>
                    {log.detalhes ? (
                      <div className="max-w-xs truncate">
                        {JSON.stringify(log.detalhes)}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Sem detalhes</span>
                    )}
                  </TableCell>
                  <TableCell>{log.ip_origem || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState
          title="Nenhum log de atividade encontrado"
          description={currentFilter 
            ? `Não há registros para o filtro "${currentFilter}"`
            : "Ainda não há registros de atividades no sistema"
          }
          icon={<Activity />}
          action={
            currentFilter ? (
              <Button variant="outline" onClick={() => setCurrentFilter(null)}>
                Limpar filtro
              </Button>
            ) : undefined
          }
        />
      )}
    </div>
  );
};

export default LogsAtividades;
