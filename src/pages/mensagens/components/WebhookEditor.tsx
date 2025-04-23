
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface WebhookEditorProps {
  webhook: {
    url: string;
    secret_key: string;
    eventos: string[];
    nome: string;
    ativo: boolean;
    created_by: string;
  };
  setWebhook: React.Dispatch<React.SetStateAction<any>>;
  handleWebhookChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEventoChange: (evento: string) => void;
  handleSaveWebhook: () => void;
  testWebhook: () => void;
  saveWebhookIsPending: boolean;
  onCancel: () => void;
}

export const WebhookEditor = ({
  webhook,
  setWebhook,
  handleWebhookChange,
  handleEventoChange,
  handleSaveWebhook,
  testWebhook,
  saveWebhookIsPending,
  onCancel,
}: WebhookEditorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Webhook</CardTitle>
        <CardDescription>
          Configure integrações externas para notificações automáticas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Webhook</Label>
            <Input 
              id="nome"
              name="nome"
              placeholder="Ex: Notificação de novo empréstimo" 
              value={webhook.nome}
              onChange={handleWebhookChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL para POST Automático</Label>
            <Input 
              id="url" 
              name="url"
              placeholder="https://seu-webhook.com" 
              value={webhook.url}
              onChange={handleWebhookChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="secret_key">Secret Key</Label>
            <Input 
              id="secret_key" 
              name="secret_key"
              type="password"
              placeholder="Chave secreta para autenticação" 
              value={webhook.secret_key}
              onChange={handleWebhookChange}
            />
          </div>
        </div>

        <div className="mt-4">
          <Label className="mb-2 block">Eventos a serem notificados:</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="evento-emprestimo" 
                checked={webhook.eventos.includes('novoEmprestimo')}
                onCheckedChange={() => handleEventoChange('novoEmprestimo')}
              />
              <Label htmlFor="evento-emprestimo">Novo empréstimo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="evento-pagamento" 
                checked={webhook.eventos.includes('novoPagamento')}
                onCheckedChange={() => handleEventoChange('novoPagamento')}
              />
              <Label htmlFor="evento-pagamento">Novo pagamento</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="evento-cliente" 
                checked={webhook.eventos.includes('novoCliente')}
                onCheckedChange={() => handleEventoChange('novoCliente')}
              />
              <Label htmlFor="evento-cliente">Novo cliente</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="evento-atrasado" 
                checked={webhook.eventos.includes('emprestimoAtrasado')}
                onCheckedChange={() => handleEventoChange('emprestimoAtrasado')}
              />
              <Label htmlFor="evento-atrasado">Empréstimo atrasado</Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="outline" onClick={testWebhook}>
            Testar Webhook
          </Button>
          <Button onClick={handleSaveWebhook} disabled={saveWebhookIsPending}>
            {saveWebhookIsPending ? "Salvando..." : "Salvar Webhook"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
