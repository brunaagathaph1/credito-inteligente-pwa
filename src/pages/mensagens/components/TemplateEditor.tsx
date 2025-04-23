
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { VARIAVEIS_TEMPLATES, VariavelTemplate } from "@/types/mensagens";
import React from "react";
import { toast } from "sonner";

interface TemplateEditorProps {
  newTemplate: {
    nome: string;
    tipo: "email" | "whatsapp" | "sms" | "";
    assunto: string;
    conteudo: string;
    ativo: boolean;
    created_by: string;
  };
  setNewTemplate: React.Dispatch<React.SetStateAction<any>>;
  handleTemplateChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleTemplateSelectChange: (name: string, value: string) => void;
  handleSaveTemplate: () => void;
  createTemplateIsPending: boolean;
  onCancel: () => void;
  handleInsertVariable: (variable: VariavelTemplate) => void;
}

export default function TemplateEditor({
  newTemplate,
  setNewTemplate,
  handleTemplateChange,
  handleTemplateSelectChange,
  handleSaveTemplate,
  createTemplateIsPending,
  onCancel,
  handleInsertVariable
}: TemplateEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Template</CardTitle>
        <CardDescription>
          Crie um novo template para mensagens
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Template</Label>
            <Input 
              id="nome"
              name="nome"
              placeholder="Ex: Lembrete de Pagamento" 
              value={newTemplate.nome}
              onChange={handleTemplateChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Mensagem</Label>
            <Select 
              value={newTemplate.tipo}
              onValueChange={(value) => handleTemplateSelectChange('tipo', value)}
            >
              <SelectTrigger id="tipo">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">E-mail</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="assunto">Assunto (para e-mail)</Label>
            <Input 
              id="assunto"
              name="assunto"
              placeholder="Ex: Lembrete de Pagamento" 
              value={newTemplate.assunto}
              onChange={handleTemplateChange}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="template-conteudo">Conteúdo da Mensagem</Label>
            <Textarea 
              id="template-conteudo" 
              name="conteudo"
              placeholder="Digite o conteúdo da mensagem..." 
              className="min-h-[200px]"
              value={newTemplate.conteudo}
              onChange={handleTemplateChange}
            />
          </div>
        </div>
        
        <div className="mt-4 space-y-4">
          <div>
            <Label className="mb-2 block">Variáveis Disponíveis:</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(VARIAVEIS_TEMPLATES).map(([categoria, variaveis]) => (
                <div key={categoria} className="border p-3 rounded-md">
                  <strong className="block mb-2 text-sm">{categoria.charAt(0).toUpperCase() + categoria.slice(1)}</strong>
                  <div className="flex flex-wrap gap-1">
                    {variaveis.map((variavel) => (
                      <Badge 
                        key={variavel.valor} 
                        variant="outline" 
                        className="cursor-pointer text-xs mb-1" 
                        onClick={() => handleInsertVariable(variavel)}
                      >
                        {variavel.valor}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSaveTemplate} disabled={createTemplateIsPending}>
            {createTemplateIsPending ? "Salvando..." : "Salvar Template"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
