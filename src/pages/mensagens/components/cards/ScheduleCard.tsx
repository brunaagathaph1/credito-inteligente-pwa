
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Calendar } from "lucide-react";
import { Agendamento } from "@/types/mensagens";

interface ScheduleCardProps {
  agendamento: Agendamento;
  onEdit: () => void;
}

export const ScheduleCard = ({ agendamento, onEdit }: ScheduleCardProps) => {
  const formatEventName = (evento: string) => {
    switch(evento) {
      case 'emprestimo_criado':
        return 'Empréstimo Criado';
      case 'emprestimo_vencendo':
        return 'Empréstimo Vencendo';
      case 'emprestimo_atrasado':
        return 'Empréstimo Atrasado';
      case 'pagamento_confirmado':
        return 'Pagamento Confirmado';
      default:
        return evento;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base truncate">{agendamento.nome}</CardTitle>
          <Badge variant={agendamento.ativo ? "secondary" : "destructive"}>
            {agendamento.ativo ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4 pt-0">
        <div className="space-y-2">
          <div>
            <p className="text-xs text-muted-foreground">Tipo</p>
            <p className="text-sm capitalize">{agendamento.tipo}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Evento</p>
            <p className="text-sm">{formatEventName(agendamento.evento)}</p>
          </div>
          {agendamento.template && (
            <div>
              <p className="text-xs text-muted-foreground">Template</p>
              <p className="text-sm truncate">{agendamento.template.nome}</p>
            </div>
          )}
          {agendamento.tipo === "automatico" && agendamento.evento === "emprestimo_vencendo" && (
            <div>
              <p className="text-xs text-muted-foreground">Dias antes</p>
              <p className="text-sm">{agendamento.dias_antes} dias</p>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
