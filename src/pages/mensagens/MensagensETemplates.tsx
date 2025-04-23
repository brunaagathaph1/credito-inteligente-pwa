
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Calendar, 
  Mail, 
  MessageSquare, 
  MessagesSquare, 
  Send, 
  FileText, 
  Webhook 
} from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

const MensagensETemplates = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [showMessageEditor, setShowMessageEditor] = useState(false);
  const [showScheduleEditor, setShowScheduleEditor] = useState(false);

  // Dados de exemplo
  const templates = [
    { 
      id: 1, 
      nome: "Lembrete de Pagamento", 
      tipo: "email", 
      assunto: "Lembrete: Pagamento em Aberto",
      conteudo: "Olá {{cliente.nome}}, gostaríamos de lembrar que seu pagamento de R$ {{emprestimo.valor}} vence em {{emprestimo.data_vencimento}}.",
      ativo: true
    },
    { 
      id: 2, 
      nome: "Confirmação de Pagamento", 
      tipo: "whatsapp", 
      assunto: "",
      conteudo: "Olá {{cliente.nome}}! Confirmamos o recebimento do seu pagamento no valor de R$ {{pagamento.valor}}. Agradecemos a pontualidade!",
      ativo: true
    },
    { 
      id: 3, 
      nome: "Empréstimo Aprovado", 
      tipo: "email", 
      assunto: "Seu empréstimo foi aprovado!",
      conteudo: "Olá {{cliente.nome}}, seu empréstimo no valor de R$ {{emprestimo.valor_principal}} foi aprovado e será liberado em breve.",
      ativo: true
    },
  ];

  const mensagens = [
    {
      id: 1,
      cliente: "João Silva",
      assunto: "Lembrete: Pagamento em Aberto",
      data: "10/04/2025",
      status: "enviado",
      tipo: "email"
    },
    {
      id: 2,
      cliente: "Maria Oliveira",
      assunto: "Confirmação de Pagamento",
      data: "08/04/2025",
      status: "enviado",
      tipo: "whatsapp"
    },
    {
      id: 3,
      cliente: "Pedro Santos",
      assunto: "Empréstimo Aprovado",
      data: "12/04/2025",
      status: "agendado",
      tipo: "email"
    },
  ];

  const agendamentos = [
    {
      id: 1,
      nome: "Lembrete de Vencimento",
      tipo: "automático",
      evento: "emprestimo_vencendo",
      dias_antes: 3,
      template: "Lembrete de Pagamento",
      ativo: true
    },
    {
      id: 2,
      nome: "Confirmação após Pagamento",
      tipo: "automático",
      evento: "pagamento_confirmado",
      dias_antes: 0,
      template: "Confirmação de Pagamento",
      ativo: true
    },
  ];

  // Renderiza o editor de templates
  const renderTemplateEditor = () => (
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
            <Label htmlFor="template-nome">Nome do Template</Label>
            <Input id="template-nome" placeholder="Ex: Lembrete de Pagamento" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="template-tipo">Tipo de Mensagem</Label>
            <Select>
              <SelectTrigger id="template-tipo">
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
            <Label htmlFor="template-assunto">Assunto (para e-mail)</Label>
            <Input id="template-assunto" placeholder="Ex: Lembrete de Pagamento" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="template-conteudo">Conteúdo da Mensagem</Label>
            <Textarea 
              id="template-conteudo" 
              placeholder="Digite o conteúdo da mensagem..." 
              className="min-h-[200px]"
            />
          </div>
        </div>
        
        <div className="mt-4 space-y-4">
          <div>
            <Label className="mb-2 block">Variáveis Disponíveis:</Label>
            <div className="flex flex-wrap gap-2">
              <div className="border p-4 rounded-md w-full md:w-auto">
                <strong className="block mb-2">Cliente</strong>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="cursor-pointer" onClick={() => {}}>
                    {"{{cliente.nome}}"}
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer" onClick={() => {}}>
                    {"{{cliente.email}}"}
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer" onClick={() => {}}>
                    {"{{cliente.telefone}}"}
                  </Badge>
                </div>
              </div>
              
              <div className="border p-4 rounded-md w-full md:w-auto">
                <strong className="block mb-2">Empréstimo</strong>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="cursor-pointer" onClick={() => {}}>
                    {"{{emprestimo.valor_principal}}"}
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer" onClick={() => {}}>
                    {"{{emprestimo.data_vencimento}}"}
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer" onClick={() => {}}>
                    {"{{emprestimo.status}}"}
                  </Badge>
                </div>
              </div>
              
              <div className="border p-4 rounded-md w-full md:w-auto">
                <strong className="block mb-2">Pagamento</strong>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="cursor-pointer" onClick={() => {}}>
                    {"{{pagamento.valor}}"}
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer" onClick={() => {}}>
                    {"{{pagamento.data}}"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setShowTemplateEditor(false)}>
            Cancelar
          </Button>
          <Button>
            Salvar Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Renderiza o editor de mensagens
  const renderMessageEditor = () => (
    <Card>
      <CardHeader>
        <CardTitle>Nova Mensagem</CardTitle>
        <CardDescription>
          Enviar mensagem para um cliente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="msg-cliente">Cliente</Label>
            <Select>
              <SelectTrigger id="msg-cliente">
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">João Silva</SelectItem>
                <SelectItem value="2">Maria Oliveira</SelectItem>
                <SelectItem value="3">Pedro Santos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="msg-tipo">Tipo de Mensagem</Label>
            <Select>
              <SelectTrigger id="msg-tipo">
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
            <Label htmlFor="msg-template">Usar Template</Label>
            <Select>
              <SelectTrigger id="msg-template">
                <SelectValue placeholder="Selecione um template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Não usar template</SelectItem>
                {templates.map(t => (
                  <SelectItem key={t.id} value={t.id.toString()}>
                    {t.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="msg-agendamento">Agendamento</Label>
            <Input 
              id="msg-agendamento" 
              type="datetime-local" 
              placeholder="Enviar agora" 
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="msg-assunto">Assunto (para e-mail)</Label>
            <Input id="msg-assunto" placeholder="Assunto da mensagem" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="msg-conteudo">Conteúdo da Mensagem</Label>
            <Textarea 
              id="msg-conteudo" 
              placeholder="Digite sua mensagem..." 
              className="min-h-[200px]"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setShowMessageEditor(false)}>
            Cancelar
          </Button>
          <Button>
            <Send className="mr-2 h-4 w-4" />
            Enviar Mensagem
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Renderiza o editor de agendamentos
  const renderScheduleEditor = () => (
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
            <Label htmlFor="sched-nome">Nome do Agendamento</Label>
            <Input id="sched-nome" placeholder="Ex: Lembrete de Vencimento" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sched-tipo">Tipo de Agendamento</Label>
            <Select>
              <SelectTrigger id="sched-tipo">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="automatico">Automático (por evento)</SelectItem>
                <SelectItem value="recorrente">Recorrente (periódico)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sched-evento">Evento Disparador</Label>
            <Select>
              <SelectTrigger id="sched-evento">
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
            <Label htmlFor="sched-dias">Dias de Antecedência</Label>
            <Input 
              id="sched-dias" 
              type="number" 
              placeholder="Ex: 3 dias antes"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="sched-template">Template a Ser Utilizado</Label>
            <Select>
              <SelectTrigger id="sched-template">
                <SelectValue placeholder="Selecione um template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map(t => (
                  <SelectItem key={t.id} value={t.id.toString()}>
                    {t.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setShowScheduleEditor(false)}>
            Cancelar
          </Button>
          <Button>
            Salvar Agendamento
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Mensagens e Templates" 
        description="Gerencie mensagens e templates para comunicação com clientes"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full md:w-auto grid grid-cols-2 md:flex flex-wrap">
          <TabsTrigger value="templates" onClick={() => setActiveTab("templates")}>
            <FileText className="mr-2 h-4 w-4" /> Templates
          </TabsTrigger>
          <TabsTrigger value="mensagens" onClick={() => setActiveTab("mensagens")}>
            <Mail className="mr-2 h-4 w-4" /> Mensagens
          </TabsTrigger>
          <TabsTrigger value="agendamentos" onClick={() => setActiveTab("agendamentos")}>
            <Calendar className="mr-2 h-4 w-4" /> Agendamentos
          </TabsTrigger>
          <TabsTrigger value="integracoes" onClick={() => setActiveTab("integracoes")}>
            <Webhook className="mr-2 h-4 w-4" /> Integrações
          </TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          {showTemplateEditor ? (
            renderTemplateEditor()
          ) : (
            <Card>
              <CardHeader className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <CardTitle>Templates de Mensagens</CardTitle>
                  <CardDescription>
                    Modelos de mensagens para envio automático ou manual
                  </CardDescription>
                </div>
                <Button className="mt-4 md:mt-0" onClick={() => setShowTemplateEditor(true)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Novo Template
                </Button>
              </CardHeader>
              <CardContent>
                {templates.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2">Nome</th>
                          <th className="text-left py-3 px-2">Tipo</th>
                          <th className="text-left py-3 px-2">Assunto</th>
                          <th className="text-left py-3 px-2">Status</th>
                          <th className="text-right py-3 px-2">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {templates.map((template) => (
                          <tr key={template.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-2">{template.nome}</td>
                            <td className="py-3 px-2 capitalize">{template.tipo}</td>
                            <td className="py-3 px-2">{template.assunto || "-"}</td>
                            <td className="py-3 px-2">
                              <Badge variant={template.ativo ? "secondary" : "outline"}>
                                {template.ativo ? "Ativo" : "Inativo"}
                              </Badge>
                            </td>
                            <td className="py-3 px-2 text-right">
                              <Button variant="ghost" size="sm">
                                Editar
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyState
                    title="Nenhum template encontrado"
                    description="Crie templates para enviar mensagens com facilidade"
                    icon={<FileText />}
                    action={
                      <Button onClick={() => setShowTemplateEditor(true)}>
                        Criar Primeiro Template
                      </Button>
                    }
                  />
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Mensagens Tab */}
        <TabsContent value="mensagens" className="space-y-6">
          {showMessageEditor ? (
            renderMessageEditor()
          ) : (
            <Card>
              <CardHeader className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <CardTitle>Histórico de Mensagens</CardTitle>
                  <CardDescription>
                    Mensagens enviadas e agendadas para clientes
                  </CardDescription>
                </div>
                <Button className="mt-4 md:mt-0" onClick={() => setShowMessageEditor(true)}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Nova Mensagem
                </Button>
              </CardHeader>
              <CardContent>
                {mensagens.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2">Cliente</th>
                          <th className="text-left py-3 px-2">Assunto</th>
                          <th className="text-left py-3 px-2">Data</th>
                          <th className="text-left py-3 px-2">Tipo</th>
                          <th className="text-left py-3 px-2">Status</th>
                          <th className="text-right py-3 px-2">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mensagens.map((mensagem) => (
                          <tr key={mensagem.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-2">{mensagem.cliente}</td>
                            <td className="py-3 px-2">{mensagem.assunto}</td>
                            <td className="py-3 px-2">{mensagem.data}</td>
                            <td className="py-3 px-2 capitalize">{mensagem.tipo}</td>
                            <td className="py-3 px-2">
                              <Badge 
                                variant={
                                  mensagem.status === "enviado" ? "secondary" : 
                                  mensagem.status === "agendado" ? "outline" : 
                                  "destructive"
                                }
                              >
                                {mensagem.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-2 text-right">
                              <Button variant="ghost" size="sm">
                                Visualizar
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyState
                    title="Nenhuma mensagem encontrada"
                    description="Envie mensagens para seus clientes"
                    icon={<MessagesSquare />}
                    action={
                      <Button onClick={() => setShowMessageEditor(true)}>
                        Enviar Primeira Mensagem
                      </Button>
                    }
                  />
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Agendamentos Tab */}
        <TabsContent value="agendamentos" className="space-y-6">
          {showScheduleEditor ? (
            renderScheduleEditor()
          ) : (
            <Card>
              <CardHeader className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <CardTitle>Agendamentos Automáticos</CardTitle>
                  <CardDescription>
                    Configure mensagens para envio automático
                  </CardDescription>
                </div>
                <Button className="mt-4 md:mt-0" onClick={() => setShowScheduleEditor(true)}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Novo Agendamento
                </Button>
              </CardHeader>
              <CardContent>
                {agendamentos.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2">Nome</th>
                          <th className="text-left py-3 px-2">Evento</th>
                          <th className="text-left py-3 px-2">Template</th>
                          <th className="text-left py-3 px-2">Status</th>
                          <th className="text-right py-3 px-2">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {agendamentos.map((agendamento) => (
                          <tr key={agendamento.id} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-2">{agendamento.nome}</td>
                            <td className="py-3 px-2">{agendamento.evento}</td>
                            <td className="py-3 px-2">{agendamento.template}</td>
                            <td className="py-3 px-2">
                              <Badge 
                                variant={agendamento.ativo ? "secondary" : "destructive"}
                              >
                                {agendamento.ativo ? "Ativo" : "Inativo"}
                              </Badge>
                            </td>
                            <td className="py-3 px-2 text-right">
                              <Button variant="ghost" size="sm">
                                Editar
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyState
                    title="Nenhum agendamento encontrado"
                    description="Configure mensagens automáticas baseadas em eventos"
                    icon={<Calendar />}
                    action={
                      <Button onClick={() => setShowScheduleEditor(true)}>
                        Criar Primeiro Agendamento
                      </Button>
                    }
                  />
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Integrações Tab */}
        <TabsContent value="integracoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrações Externas</CardTitle>
              <CardDescription>
                Configure integrações com serviços externos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Integração com WhatsApp (Evolution API)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp-url">URL da API</Label>
                    <Input 
                      id="whatsapp-url" 
                      placeholder="https://sua-evolution-api.com" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp-key">API Key</Label>
                    <Input 
                      id="whatsapp-key" 
                      type="password"
                      placeholder="Chave secreta da API" 
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Button>
                    Testar Conexão
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t space-y-4">
                <h3 className="text-lg font-semibold">Webhooks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">URL para POST Automático</Label>
                    <Input 
                      id="webhook-url" 
                      placeholder="https://seu-webhook.com" 
                    />
                    <p className="text-sm text-muted-foreground">
                      Esta URL receberá POST automático quando ocorrerem os eventos selecionados
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="webhook-secret">Secret Key</Label>
                    <Input 
                      id="webhook-secret" 
                      type="password"
                      placeholder="Chave secreta para autenticação" 
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Label className="mb-2 block">Eventos a serem notificados:</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="event-loan" className="rounded" />
                      <Label htmlFor="event-loan">Novo empréstimo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="event-payment" className="rounded" />
                      <Label htmlFor="event-payment">Novo pagamento</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="event-client" className="rounded" />
                      <Label htmlFor="event-client">Novo cliente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="event-late" className="rounded" />
                      <Label htmlFor="event-late">Empréstimo atrasado</Label>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button>
                    Salvar Webhooks
                  </Button>
                  <Button variant="outline">
                    Testar Webhook
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t space-y-4">
                <h3 className="text-lg font-semibold">URL para API (GET externo)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-url">URL da API</Label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="api-url" 
                        value="https://seudominio.com/api/webhook/12345" 
                        readOnly
                      />
                      <Button variant="outline" size="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Esta URL permite que sistemas externos consultem informações via GET
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input 
                      id="api-key" 
                      type="password"
                      placeholder="Chave secreta para autenticação"
                    />
                    <p className="text-sm text-muted-foreground">
                      Inclua esta chave no cabeçalho de autorização das requisições
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button>
                    Gerar Nova API Key
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MensagensETemplates;
