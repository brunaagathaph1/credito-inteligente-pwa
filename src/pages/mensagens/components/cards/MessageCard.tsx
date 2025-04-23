
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Mensagem } from "@/types/mensagens";

interface MessageCardProps {
  mensagem: Mensagem;
}

export const MessageCard = ({ mensagem }: MessageCardProps) => {
  const statusColor = () => {
    switch (mensagem.status) {
      case "enviado":
        return "secondary";
      case "agendado":
        return "outline";
      case "erro":
        return "destructive";
      default:
        return "default";
    }
  };

  const formattedDate = () => {
    if (mensagem.data_envio) {
      return new Date(mensagem.data_envio).toLocaleDateString();
    }
    if (mensagem.data_agendamento) {
      return new Date(mensagem.data_agendamento).toLocaleDateString();
    }
    return new Date(mensagem.created_at).toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base truncate">
            {mensagem.cliente?.nome || "Cliente não especificado"}
          </CardTitle>
          <Badge variant={statusColor()}>
            {mensagem.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4 pt-0">
        <div className="space-y-2">
          <div>
            <p className="text-xs text-muted-foreground">Data</p>
            <p className="text-sm">{formattedDate()}</p>
          </div>
          {mensagem.assunto && (
            <div>
              <p className="text-xs text-muted-foreground">Assunto</p>
              <p className="text-sm truncate">{mensagem.assunto}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground">Tipo</p>
            <p className="text-sm capitalize">{mensagem.tipo}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            Visualizar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
