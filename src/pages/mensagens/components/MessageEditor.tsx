
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { VARIAVEIS_TEMPLATES, VariavelTemplate, Template } from "@/types/mensagens";
import React from "react";
import { Send } from "lucide-react";

interface MessageEditorProps {
  newMensagem: {
    cliente_id: string;
    template_id: string;
    assunto: string;
    conteudo: string;
    tipo: "email" | "whatsapp" | "sms" | "";
    status: "enviado" | "agendado" | "erro" | "pendente";
    data_agendamento: string;
    created_by: string;
  };
  setNewMensagem: React.Dispatch<React.SetStateAction<any>>;
  clients: any[];
  templates: Template[];
  handleMensagemChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleMensagemSelectChange: (name: string, value: string) => void;
  createMensagemIsPending: boolean;
  handleSendMensagem: () => void;
  onCancel: () => void;
}

export default function MessageEditor({
  newMensagem,
  setNewMensagem,
  clients,
  templates,
  handleMensagemChange,
  handleMensagemSelectChange,
  createMensagemIsPending,
  handleSendMensagem,
  onCancel
}: MessageEditorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cliente_id">Cliente</Label>
          <Select 
            value={newMensagem.cliente_id}
            onValueChange={(value) => handleMensagemSelectChange('cliente_id', value)}
          >
            <SelectTrigger id="cliente_id">
              <SelectValue placeholder="Selecione o cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients.map(cliente => (
                <SelectItem key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo de Mensagem</Label>
          <Select 
            value={newMensagem.tipo}
            onValueChange={(value) => handleMensagemSelectChange('tipo', value as "email" | "whatsapp" | "sms")}
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
        <div className="space-y-2">
          <Label htmlFor="template_id">Usar Template</Label>
          <Select 
            value={newMensagem.template_id}
            onValueChange={(value) => handleMensagemSelectChange('template_id', value)}
          >
            <SelectTrigger id="template_id">
              <SelectValue placeholder="Selecione um template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Não usar template</SelectItem>
              {templates.map(t => (
                <SelectItem key={t.id} value={t.id}>
                  {t.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="data_agendamento">Agendamento</Label>
          <Input 
            id="data_agendamento" 
            name="data_agendamento"
            type="datetime-local" 
            placeholder="Enviar agora" 
            value={newMensagem.data_agendamento}
            onChange={handleMensagemChange}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="assunto">Assunto (para e-mail)</Label>
          <Input 
            id="assunto" 
            name="assunto"
            placeholder="Assunto da mensagem" 
            value={newMensagem.assunto}
            onChange={handleMensagemChange}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="conteudo">Conteúdo da Mensagem</Label>
          <Textarea 
            id="conteudo" 
            name="conteudo"
            placeholder="Digite sua mensagem..." 
            className="min-h-[200px]"
            value={newMensagem.conteudo}
            onChange={handleMensagemChange}
          />
        </div>
      </div>
      
      <div className="mt-4 space-y-4">
        <div>
          <Label className="mb-2 block">Variáveis Disponíveis:</Label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(VARIAVEIS_TEMPLATES).map(([categoria, variaveis]) => (
              <div key={categoria} className="border p-4 rounded-md w-full md:w-auto">
                <strong className="block mb-2">{categoria.charAt(0).toUpperCase() + categoria.slice(1)}</strong>
                <div className="flex flex-wrap gap-1">
                  {variaveis.map((variavel) => (
                    <Badge 
                      key={variavel.valor} 
                      variant="outline" 
                      className="cursor-pointer" 
                      onClick={() => {
                        const textarea = document.getElementById('conteudo') as HTMLTextAreaElement;
                        if (textarea) {
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const text = textarea.value;
                          const before = text.substring(0, start);
                          const after = text.substring(end, text.length);
                          setNewMensagem(prev => ({
                            ...prev,
                            conteudo: before + variavel.valor + after
                          }));
                          setTimeout(() => {
                            textarea.focus();
                            textarea.selectionStart = start + variavel.valor.length;
                            textarea.selectionEnd = start + variavel.valor.length;
                          }, 10);
                        }
                      }}
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
        <Button onClick={handleSendMensagem} disabled={createMensagemIsPending}>
          <Send className="mr-2 h-4 w-4" />
          {createMensagemIsPending ? "Enviando..." : "Enviar Mensagem"}
        </Button>
      </div>
    </div>
  );
}
