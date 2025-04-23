
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";
import { Template } from "@/types/mensagens";

interface ScheduleEditorProps {
  newAgendamento: {
    nome: string;
    tipo: "automatico" | "recorrente";
    evento: "emprestimo_criado" | "emprestimo_vencendo" | "emprestimo_atrasado" | "pagamento_confirmado" | "";
    dias_antes: number;
    template_id: string;
    ativo: boolean;
    created_by: string;
  };
  setNewAgendamento: React.Dispatch<React.SetStateAction<any>>;
  templates: Template[];
  handleAgendamentoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAgendamentoSelectChange: (name: string, value: string) => void;
  createAgendamentoIsPending: boolean;
  handleSaveAgendamento: () => void;
  onCancel: () => void;
}

export default function ScheduleEditor({
  newAgendamento,
  setNewAgendamento,
  templates,
  handleAgendamentoChange,
  handleAgendamentoSelectChange,
  createAgendamentoIsPending,
  handleSaveAgendamento,
  onCancel,
}: ScheduleEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Agendamento</CardTitle>
        <CardDescription>
          Configure mensagens automáticas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Agendamento</Label>
            <Input 
              id="nome"
              name="nome" 
              placeholder="Ex: Lembrete de Vencimento" 
              value={newAgendamento.nome}
              onChange={handleAgendamentoChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Agendamento</Label>
            <Select 
              value={newAgendamento.tipo}
              onValueChange={(value) => handleAgendamentoSelectChange('tipo', value)}
            >
              <SelectTrigger id="tipo">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="automatico">Automático (por evento)</SelectItem>
                <SelectItem value="recorrente">Recorrente (periódico)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="evento">Evento Disparador</Label>
            <Select 
              value={newAgendamento.evento}
              onValueChange={(value) => handleAgendamentoSelectChange('evento', value)}
            >
              <SelectTrigger id="evento">
                <SelectValue placeholder="Selecione o evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emprestimo_criado">Empréstimo Criado</SelectItem>
                <SelectItem value="emprestimo_vencendo">Empréstimo Vencendo</SelectItem>
                <SelectItem value="emprestimo_atrasado">Empréstimo Atrasado</SelectItem>
                <SelectItem value="pagamento_confirmado">Pagamento Confirmado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dias_antes">Dias de Antecedência</Label>
            <Input 
              id="dias_antes"
              name="dias_antes" 
              type="number" 
              placeholder="Ex: 3 dias antes"
              value={newAgendamento.dias_antes}
              onChange={handleAgendamentoChange}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="template_id">Template a Ser Utilizado</Label>
            <Select 
              value={newAgendamento.template_id}
              onValueChange={(value) => handleAgendamentoSelectChange('template_id', value)}
            >
              <SelectTrigger id="template_id">
                <SelectValue placeholder="Selecione um template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map(t => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSaveAgendamento} disabled={createAgendamentoIsPending}>
            {createAgendamentoIsPending ? "Salvando..." : "Salvar Agendamento"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

