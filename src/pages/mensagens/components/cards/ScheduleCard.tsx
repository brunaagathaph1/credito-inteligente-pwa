
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, Trash2 } from "lucide-react";
import { Agendamento } from "@/types/mensagens";

interface ScheduleCardProps {
  agendamento: Agendamento;
  onEdit: () => void;
  onDelete: () => void;
}

export const ScheduleCard = ({ agendamento, onEdit, onDelete }: ScheduleCardProps) => {
  const getEventoLabel = (evento: string) => {
    switch (evento) {
      case 'emprestimo_criado': return 'Empréstimo Criado';
      case 'emprestimo_vencendo': return 'Empréstimo Vencendo';
      case 'emprestimo_atrasado': return 'Empréstimo Atrasado';
      case 'pagamento_confirmado': return 'Pagamento Confirmado';
      default: return evento;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base truncate">{agendamento.nome}</CardTitle>
          <Badge variant={agendamento.ativo ? "default" : "outline"}>
            {agendamento.ativo ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4 pt-0">
        <div className="space-y-2">
          <div>
            <p className="text-xs text-muted-foreground">Tipo</p>
            <p className="text-sm capitalize">
              {agendamento.tipo === 'automatico' ? 'Automático (por evento)' : 'Recorrente'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Evento</p>
            <p className="text-sm">
              {getEventoLabel(agendamento.evento)}
              {agendamento.dias_antes > 0 && ` (${agendamento.dias_antes} dias antes)`}
            </p>
          </div>
          {agendamento.template && (
            <div>
              <p className="text-xs text-muted-foreground">Template</p>
              <p className="text-sm truncate">{agendamento.template.nome}</p>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
