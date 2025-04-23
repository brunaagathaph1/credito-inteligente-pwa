
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Template } from "@/types/mensagens";

interface TemplateCardProps {
  template: Template;
  onEdit: () => void;
  onDelete: () => void;
}

export const TemplateCard = ({ template, onEdit, onDelete }: TemplateCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base truncate">{template.nome}</CardTitle>
          <Badge variant={template.ativo ? "default" : "outline"}>
            {template.ativo ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4 pt-0">
        <div className="space-y-2">
          <div>
            <p className="text-xs text-muted-foreground">Tipo</p>
            <p className="text-sm capitalize">{template.tipo}</p>
          </div>
          {template.assunto && (
            <div>
              <p className="text-xs text-muted-foreground">Assunto</p>
              <p className="text-sm truncate">{template.assunto}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-muted-foreground">Conteúdo</p>
            <p className="text-sm line-clamp-2">{template.conteudo}</p>
          </div>
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
