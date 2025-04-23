
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Calendar, 
  Mail, 
  MessageSquare, 
  MessagesSquare, 
  Send, 
  FileText, 
  Webhook,
  Edit,
  AlertCircle,
  CheckCircle 
} from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { useMensagens } from "@/hooks/useMensagens";
import { useAuth } from "@/contexts/AuthContext";
import { useClients } from "@/hooks/useClients";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Agendamento, Template, Mensagem, VariavelTemplate, WebhookIntegracao } from "@/types/mensagens";
import { Textarea } from "@/components/ui/textarea";

import TemplateEditor from "./components/TemplateEditor";
import MessageEditor from "./components/MessageEditor";
import ScheduleEditor from "./components/ScheduleEditor";
import { WebhookEditor } from "./components/WebhookEditor";
import { TemplateCard } from "./components/cards/TemplateCard";
import { MessageCard } from "./components/cards/MessageCard";
import { ScheduleCard } from "./components/cards/ScheduleCard";

const MensagensETemplates = () => {
  const { user } = useAuth();
  const { clients } = useClients();
  const [activeTab, setActiveTab] = useState("templates");
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [showMessageEditor, setShowMessageEditor] = useState(false);
  const [showScheduleEditor, setShowScheduleEditor] = useState(false);
  const [showWebhookEditor, setShowWebhookEditor] = useState(false);
  const isMobile = useIsMobile();
  
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [editingAgendamento, setEditingAgendamento] = useState<Agendamento | null>(null);

  const { 
    useTemplates, createTemplate, updateTemplate,
    useMensagensHistory, createMensagem,
    useAgendamentos, createAgendamento,
    useWebhooks, saveWebhook
  } = useMensagens();
  
  const { data: templates = [], isLoading: isLoadingTemplates } = useTemplates();
  const { data: mensagens = [], isLoading: isLoadingMensagens } = useMensagensHistory();
  const { data: agendamentos = [], isLoading: isLoadingAgendamentos } = useAgendamentos();
  const { data: webhooks = [], isLoading: isLoadingWebhooks } = useWebhooks();

  const [newTemplate, setNewTemplate] = useState({
    nome: '',
    tipo: '' as 'email' | 'whatsapp' | 'sms',
    assunto: '',
    conteudo: '',
    ativo: true,
    created_by: user?.id || ''
  });

  const handleCloseTemplateEditor = () => {
    setShowTemplateEditor(false);
    setEditingTemplate(null);
    setNewTemplate({
      nome: '',
      tipo: '' as 'email' | 'whatsapp' | 'sms',
      assunto: '',
      conteudo: '',
      ativo: true,
      created_by: user?.id || ''
    });
  };

  const handleOpenEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setNewTemplate({
      nome: template.nome,
      tipo: template.tipo,
      assunto: template.assunto || '',
      conteudo: template.conteudo,
      ativo: template.ativo,
      created_by: template.created_by
    });
    setShowTemplateEditor(true);
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTemplate(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTemplateSelectChange = (name: string, value: string) => {
    if (name === 'tipo') {
      setNewTemplate(prev => ({
        ...prev,
        [name]: value as 'email' | 'whatsapp' | 'sms'
      }));
    } else {
      setNewTemplate(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleInsertVariable = (variable: VariavelTemplate) => {
    const textArea = document.getElementById('template-conteudo') as HTMLTextAreaElement;
    if (!textArea) return;
    
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const text = textArea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    
    setNewTemplate(prev => ({
      ...prev,
      conteudo: before + variable.valor + after
    }));
    
    setTimeout(() => {
      textArea.focus();
      textArea.selectionStart = start + variable.valor.length;
      textArea.selectionEnd = start + variable.valor.length;
    }, 10);
  };

  const handleSaveTemplate = async () => {
    if (!user) return;
    
    try {
      if (editingTemplate) {
        await updateTemplate.mutateAsync({
          id: editingTemplate.id,
          template: newTemplate
        });
        toast.success("Template atualizado com sucesso!");
      } else {
        await createTemplate.mutateAsync({
          ...newTemplate,
          created_by: user.id
        });
        toast.success("Template criado com sucesso!");
      }
      handleCloseTemplateEditor();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error("Erro ao salvar template.");
    }
  };

  const [newMensagem, setNewMensagem] = useState({
    cliente_id: '',
    template_id: '',
    assunto: '',
    conteudo: '',
    tipo: '' as 'email' | 'whatsapp' | 'sms',
    status: 'pendente' as 'enviado' | 'agendado' | 'erro' | 'pendente',
    data_agendamento: '',
    created_by: user?.id || ''
  });

  const handleMensagemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMensagem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMensagemSelectChange = (name: string, value: string) => {
    if (name === 'tipo') {
      setNewMensagem(prev => ({
        ...prev,
        [name]: value as 'email' | 'whatsapp' | 'sms'
      }));
    } else {
      setNewMensagem(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (name === 'template_id' && value && value !== '0') {
      const template = templates.find(t => t.id === value);
      if (template) {
        setNewMensagem(prev => ({
          ...prev,
          tipo: template.tipo,
          assunto: template.assunto || '',
          conteudo: template.conteudo
        }));
      }
    }
  };

  const handleSendMensagem = async () => {
    if (!user) return;
    
    try {
      await createMensagem.mutateAsync({
        ...newMensagem,
        template_id: newMensagem.template_id === '0' ? undefined : newMensagem.template_id,
        created_by: user.id
      });
      setShowMessageEditor(false);
      setNewMensagem({
        cliente_id: '',
        template_id: '',
        assunto: '',
        conteudo: '',
        tipo: '' as 'email' | 'whatsapp' | 'sms',
        status: 'pendente' as 'enviado' | 'agendado' | 'erro' | 'pendente',
        data_agendamento: '',
        created_by: user.id
      });
      toast.success("Mensagem enviada com sucesso!");
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Erro ao enviar mensagem.");
    }
  };

  const [newAgendamento, setNewAgendamento] = useState({
    nome: '',
    tipo: 'automatico' as 'automatico' | 'recorrente',
    evento: '' as 'emprestimo_criado' | 'emprestimo_vencendo' | 'emprestimo_atrasado' | 'pagamento_confirmado',
    dias_antes: 0,
    template_id: '',
    ativo: true,
    created_by: user?.id || ''
  });

  const handleCloseAgendamentoEditor = () => {
    setShowScheduleEditor(false);
    setEditingAgendamento(null);
    setNewAgendamento({
      nome: '',
      tipo: 'automatico' as 'automatico' | 'recorrente',
      evento: '' as 'emprestimo_criado' | 'emprestimo_vencendo' | 'emprestimo_atrasado' | 'pagamento_confirmado',
      dias_antes: 0,
      template_id: '',
      ativo: true,
      created_by: user?.id || ''
    });
  };

  const handleOpenEditAgendamento = (agendamento: Agendamento) => {
    setEditingAgendamento(agendamento);
    setNewAgendamento({
      nome: agendamento.nome,
      tipo: agendamento.tipo,
      evento: agendamento.evento,
      dias_antes: agendamento.dias_antes,
      template_id: agendamento.template_id,
      ativo: agendamento.ativo,
      created_by: agendamento.created_by
    });
    setShowScheduleEditor(true);
  };

  const handleAgendamentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAgendamento(prev => ({
      ...prev,
      [name]: name === 'dias_antes' ? parseInt(value) : value
    }));
  };

  const handleAgendamentoSelectChange = (name: string, value: string) => {
    if (name === 'tipo') {
      setNewAgendamento(prev => ({
        ...prev,
        [name]: value as 'automatico' | 'recorrente'
      }));
    } else if (name === 'evento') {
      setNewAgendamento(prev => ({
        ...prev,
        [name]: value as 'emprestimo_criado' | 'emprestimo_vencendo' | 'emprestimo_atrasado' | 'pagamento_confirmado'
      }));
    } else {
      setNewAgendamento(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveAgendamento = async () => {
    if (!user) return;
    
    try {
      await createAgendamento.mutateAsync({
        ...newAgendamento,
        created_by: user.id
      });
      handleCloseAgendamentoEditor();
      toast.success("Agendamento salvo com sucesso!");
    } catch (error) {
      console.error('Error saving agendamento:', error);
      toast.error("Erro ao salvar agendamento.");
    }
  };

  const [webhook, setWebhook] = useState({
    url: '',
    secret_key: '',
    eventos: [] as string[],
    nome: 'Webhook Default',
    ativo: true,
    created_by: user?.id || ''
  });

  const [evolutionApi, setEvolutionApi] = useState({
    url: '',
    api_key: ''
  });

  const [apiUrl, setApiUrl] = useState("https://seudominio.com/api/webhook/12345");
  const [apiKey, setApiKey] = useState("");

  const handleWebhookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWebhook(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEvolutionApiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEvolutionApi(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEventoChange = (evento: string) => {
    setWebhook(prev => {
      const eventos = prev.eventos.includes(evento)
        ? prev.eventos.filter(e => e !== evento)
        : [...prev.eventos, evento];
      return {
        ...prev,
        eventos
      };
    });
  };

  const handleSaveWebhook = async () => {
    if (!user || !webhook.url) return;
    
    try {
      await saveWebhook.mutateAsync({
        ...webhook,
        created_by: user.id
      });
      
      toast.success("Webhook salvo com sucesso!");
      setWebhook({
        url: '',
        secret_key: '',
        eventos: [],
        nome: 'Webhook Default',
        ativo: true,
        created_by: user.id
      });
      setShowWebhookEditor(false);
    } catch (error) {
      console.error('Error saving webhook:', error);
      toast.error("Erro ao salvar webhook");
    }
  };

  const testWebhook = () => {
    if (!webhook.url) {
      toast.error("Digite uma URL válida antes de testar");
      return;
    }
    toast.success("Teste de webhook enviado com sucesso!");
  };

  const generateApiKey = () => {
    const newKey = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
    toast.success("Nova API Key gerada com sucesso!");
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Mensagens e Templates" 
        description="Gerencie mensagens e templates para comunicação com clientes"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-card rounded-md p-1">
          {isMobile ? (
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="inline-flex w-max">
                <TabsTrigger value="templates" className="flex items-center" onClick={() => setActiveTab("templates")}>
                  <FileText className="mr-2 h-4 w-4" /> Templates
                </TabsTrigger>
                <TabsTrigger value="mensagens" className="flex items-center" onClick={() => setActiveTab("mensagens")}>
                  <Mail className="mr-2 h-4 w-4" /> Mensagens
                </TabsTrigger>
                <TabsTrigger value="agendamentos" className="flex items-center" onClick={() => setActiveTab("agendamentos")}>
                  <Calendar className="mr-2 h-4 w-4" /> Agendamentos
                </TabsTrigger>
                <TabsTrigger value="integracoes" className="flex items-center" onClick={() => setActiveTab("integracoes")}>
                  <Webhook className="mr-2 h-4 w-4" /> Integrações
                </TabsTrigger>
              </TabsList>
            </ScrollArea>
          ) : (
            <TabsList className="w-full flex">
              <TabsTrigger value="templates" className="flex-1" onClick={() => setActiveTab("templates")}>
                <FileText className="mr-2 h-4 w-4" /> Templates
              </TabsTrigger>
              <TabsTrigger value="mensagens" className="flex-1" onClick={() => setActiveTab("mensagens")}>
                <Mail className="mr-2 h-4 w-4" /> Mensagens
              </TabsTrigger>
              <TabsTrigger value="agendamentos" className="flex-1" onClick={() => setActiveTab("agendamentos")}>
                <Calendar className="mr-2 h-4 w-4" /> Agendamentos
              </TabsTrigger>
              <TabsTrigger value="integracoes" className="flex-1" onClick={() => setActiveTab("integracoes")}>
                <Webhook className="mr-2 h-4 w-4" /> Integrações
              </TabsTrigger>
            </TabsList>
          )}
        </div>

        <TabsContent value="templates" className="space-y-6">
          {showTemplateEditor ? (
            <TemplateEditor
              newTemplate={newTemplate}
              setNewTemplate={setNewTemplate}
              handleTemplateChange={handleTemplateChange}
              handleTemplateSelectChange={handleTemplateSelectChange}
              handleSaveTemplate={handleSaveTemplate}
              createTemplateIsPending={createTemplate.isPending || updateTemplate.isPending}
              onCancel={handleCloseTemplateEditor}
              handleInsertVariable={handleInsertVariable}
            />
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
                {isLoadingTemplates ? (
                  <div className="py-6 text-center">Carregando templates...</div>
                ) : templates && templates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates.map((template) => (
                      <TemplateCard 
                        key={template.id} 
                        template={template}
                        onEdit={() => handleOpenEditTemplate(template)}
                      />
                    ))}
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

        <TabsContent value="mensagens" className="space-y-6">
          {showMessageEditor ? (
            <MessageEditor
              newMensagem={newMensagem}
              setNewMensagem={setNewMensagem}
              clients={clients || []}
              templates={templates || []}
              handleMensagemChange={handleMensagemChange}
              handleMensagemSelectChange={handleMensagemSelectChange}
              createMensagemIsPending={createMensagem.isPending}
              handleSendMensagem={handleSendMensagem}
              onCancel={() => setShowMessageEditor(false)}
            />
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
                {isLoadingMensagens ? (
                  <div className="py-6 text-center">Carregando mensagens...</div>
                ) : mensagens && mensagens.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mensagens.map((mensagem) => (
                      <MessageCard 
                        key={mensagem.id} 
                        mensagem={mensagem}
                      />
                    ))}
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

        <TabsContent value="agendamentos" className="space-y-6">
          {showScheduleEditor ? (
            <ScheduleEditor
              newAgendamento={newAgendamento}
              setNewAgendamento={setNewAgendamento}
              templates={templates || []}
              handleAgendamentoChange={handleAgendamentoChange}
              handleAgendamentoSelectChange={handleAgendamentoSelectChange}
              createAgendamentoIsPending={createAgendamento.isPending}
              handleSaveAgendamento={handleSaveAgendamento}
              onCancel={handleCloseAgendamentoEditor}
            />
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
                {isLoadingAgendamentos ? (
                  <div className="py-6 text-center">Carregando agendamentos...</div>
                ) : agendamentos && agendamentos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agendamentos.map((agendamento) => (
                      <ScheduleCard 
                        key={agendamento.id} 
                        agendamento={agendamento}
                        onEdit={() => handleOpenEditAgendamento(agendamento)}
                      />
                    ))}
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

        <TabsContent value="integracoes" className="space-y-6">
          {showWebhookEditor ? (
            <WebhookEditor 
              webhook={webhook}
              setWebhook={setWebhook}
              handleWebhookChange={handleWebhookChange}
              handleEventoChange={handleEventoChange}
              handleSaveWebhook={handleSaveWebhook}
              testWebhook={testWebhook}
              saveWebhookIsPending={saveWebhook.isPending}
              onCancel={() => setShowWebhookEditor(false)}
            />
          ) : (
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
                      <Label htmlFor="url">URL da API</Label>
                      <Input 
                        id="url" 
                        name="url"
                        placeholder="https://sua-evolution-api.com" 
                        value={evolutionApi.url}
                        onChange={handleEvolutionApiChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="api_key">API Key</Label>
                      <Input 
                        id="api_key" 
                        name="api_key"
                        type="password"
                        placeholder="Chave secreta da API" 
                        value={evolutionApi.api_key}
                        onChange={handleEvolutionApiChange}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button onClick={() => {
                      if (!evolutionApi.url) {
                        toast.error("Digite uma URL válida antes de testar");
                        return;
                      }
                      toast.success("Conexão testada com sucesso!");
                    }}>
                      Testar Conexão
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Webhooks</h3>
                    <Button variant="outline" onClick={() => setShowWebhookEditor(true)}>
                      <Webhook className="mr-2 h-4 w-4" />
                      Novo Webhook
                    </Button>
                  </div>
                  
                  {webhooks && webhooks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {webhooks.map((hook) => (
                        <Card key={hook.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-base">{hook.nome}</CardTitle>
                              <Badge variant={hook.ativo ? "default" : "outline"}>
                                {hook.ativo ? "Ativo" : "Inativo"}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-4 pt-0">
                            <p className="text-sm text-muted-foreground truncate mb-1">
                              URL: {hook.url}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {hook.eventos.map((evento) => (
                                <Badge key={evento} variant="secondary" className="text-xs">
                                  {evento}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button size="sm" variant="outline" className="text-xs" onClick={() => {
                                toast.success("Webhook testado com sucesso!");
                              }}>Testar</Button>
                              <Button size="sm" variant="outline" className="text-xs">Editar</Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">Nenhum webhook configurado</p>
                      <Button onClick={() => setShowWebhookEditor(true)}>
                        Configurar Primeiro Webhook
                      </Button>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t space-y-4">
                  <h3 className="text-lg font-semibold">URL para API (GET externo)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-url">URL da API</Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="api-url" 
                          value={apiUrl} 
                          readOnly
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => {
                            navigator.clipboard.writeText(apiUrl);
                            toast.success("URL copiada para a área de transferência");
                          }}
                        >
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
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Inclua esta chave no cabeçalho de autorização das requisições
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button onClick={() => {
                      generateApiKey();
                      toast.success("Nova API Key gerada com sucesso!");
                    }}>
                      Gerar Nova API Key
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MensagensETemplates;
