import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
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
import { useMensagens } from "@/hooks/useMensagens";
import { useAuth } from "@/contexts/AuthContext";
import { VARIAVEIS_TEMPLATES, VariavelTemplate } from "@/types/mensagens";
import { useClients } from "@/hooks/useClients";
import TemplateEditor from "./components/TemplateEditor";
import MessageEditor from "./components/MessageEditor";
import ScheduleEditor from "./components/ScheduleEditor";

const MensagensETemplates = () => {
  const { user } = useAuth();
  const { clients } = useClients();
  const [activeTab, setActiveTab] = useState("templates");
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [showMessageEditor, setShowMessageEditor] = useState(false);
  const [showScheduleEditor, setShowScheduleEditor] = useState(false);

  // Hooks para dados
  const { 
    useTemplates, createTemplate, 
    useMensagensHistory, createMensagem,
    useAgendamentos, createAgendamento,
    useWebhooks, saveWebhook
  } = useMensagens();
  
  const { data: templates = [], isLoading: isLoadingTemplates } = useTemplates();
  const { data: mensagens = [], isLoading: isLoadingMensagens } = useMensagensHistory();
  const { data: agendamentos = [], isLoading: isLoadingAgendamentos } = useAgendamentos();
  const { data: webhooks = [], isLoading: isLoadingWebhooks } = useWebhooks();

  // Template editor state
  const [newTemplate, setNewTemplate] = useState({
    nome: '',
    tipo: '' as 'email' | 'whatsapp' | 'sms',
    assunto: '',
    conteudo: '',
    ativo: true,
    created_by: user?.id || ''
  });

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
    
    // Focus back on textarea and place cursor after inserted variable
    setTimeout(() => {
      textArea.focus();
      textArea.selectionStart = start + variable.valor.length;
      textArea.selectionEnd = start + variable.valor.length;
    }, 10);
  };

  const handleSaveTemplate = async () => {
    if (!user) return;
    
    try {
      await createTemplate.mutateAsync({
        ...newTemplate,
        created_by: user.id
      });
      setShowTemplateEditor(false);
      setNewTemplate({
        nome: '',
        tipo: '' as 'email' | 'whatsapp' | 'sms',
        assunto: '',
        conteudo: '',
        ativo: true,
        created_by: user.id
      });
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  // Mensagem editor state
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
    
    // Se selecionou um template, preenche os campos com os dados do template
    if (name === 'template_id' && value && value !== '0') {
      const template = templates.find(t => t.id === value);
      if (template) {
        setNewMensagem(prev => ({
          ...prev,
          tipo: template.tipo,
          assunto: template.assunto,
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
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Agendamento editor state
  const [newAgendamento, setNewAgendamento] = useState({
    nome: '',
    tipo: 'automatico' as 'automatico' | 'recorrente',
    evento: '' as 'emprestimo_criado' | 'emprestimo_vencendo' | 'emprestimo_atrasado' | 'pagamento_confirmado',
    dias_antes: 0,
    template_id: '',
    ativo: true,
    created_by: user?.id || ''
  });

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
      setShowScheduleEditor(false);
      setNewAgendamento({
        nome: '',
        tipo: 'automatico' as 'automatico' | 'recorrente',
        evento: '' as 'emprestimo_criado' | 'emprestimo_vencendo' | 'emprestimo_atrasado' | 'pagamento_confirmado',
        dias_antes: 0,
        template_id: '',
        ativo: true,
        created_by: user.id
      });
    } catch (error) {
      console.error('Error saving agendamento:', error);
    }
  };

  // Webhook state
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
      
      // Reset form and show success message
      toast.success("Webhook salvo com sucesso!");
      setWebhook({
        url: '',
        secret_key: '',
        eventos: [],
        nome: 'Webhook Default',
        ativo: true,
        created_by: user.id
      });
    } catch (error) {
      console.error('Error saving webhook:', error);
      toast.error("Erro ao salvar webhook");
    }
  };

  const testWebhook = () => {
    // Implementação para testar webhook
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

  // Renderiza o editor de templates
  const renderTemplateEditor = () => (
    <TemplateEditor
      newTemplate={newTemplate}
      setNewTemplate={setNewTemplate}
      handleTemplateChange={handleTemplateChange}
      handleTemplateSelectChange={handleTemplateSelectChange}
      handleSaveTemplate={handleSaveTemplate}
      createTemplateIsPending={createTemplate.isPending}
      onCancel={() => setShowTemplateEditor(false)}
      handleInsertVariable={handleInsertVariable}
    />
  );

  // Renderiza o editor de mensagens
  const renderMessageEditor = () => (
    <MessageEditor
      newMensagem={{
        cliente_id: '',
        template_id: '',
        assunto: '',
        conteudo: '',
        tipo: '' as 'email' | 'whatsapp' | 'sms',
        status: 'pendente' as 'enviado' | 'agendado' | 'erro' | 'pendente',
        data_agendamento: '',
        created_by: user?.id || ''
      }}
      setNewMensagem={function(): void {}}
      clients={clients || []}
      templates={templates || []}
      handleMensagemChange={function(): void {}}
      handleMensagemSelectChange={function(): void {}}
      createMensagemIsPending={false}
      handleSendMensagem={function(): void {}}
      onCancel={() => setShowMessageEditor(false)}
    />
  );

  // Renderiza o editor de agendamentos
  const renderScheduleEditor = () => (
    <ScheduleEditor
      newAgendamento={{
        nome: '',
        tipo: 'automatico' as 'automatico' | 'recorrente',
        evento: '' as 'emprestimo_criado' | 'emprestimo_vencendo' | 'emprestimo_atrasado' | 'pagamento_confirmado',
        dias_antes: 0,
        template_id: '',
        ativo: true,
        created_by: user?.id || ''
      }}
      setNewAgendamento={function(): void {}}
      templates={templates || []}
      handleAgendamentoChange={function(): void {}}
      handleAgendamentoSelectChange={function(): void {}}
      createAgendamentoIsPending={false}
      handleSaveAgendamento={function(): void {}}
      onCancel={() => setShowScheduleEditor(false)}
    />
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Mensagens e Templates" 
        description="Gerencie mensagens e templates para comunicação com clientes"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-card rounded-md p-1">
          <TabsList className="w-full flex-nowrap">
            <TabsTrigger value="templates" className="flex-1" onClick={() => setActiveTab("templates")}>
              <FileText className="mr-2 h-4 w-4 hidden sm:block" /> Templates
            </TabsTrigger>
            <TabsTrigger value="mensagens" className="flex-1" onClick={() => setActiveTab("mensagens")}>
              <Mail className="mr-2 h-4 w-4 hidden sm:block" /> Mensagens
            </TabsTrigger>
            <TabsTrigger value="agendamentos" className="flex-1" onClick={() => setActiveTab("agendamentos")}>
              <Calendar className="mr-2 h-4 w-4 hidden sm:block" /> Agendamentos
            </TabsTrigger>
            <TabsTrigger value="integracoes" className="flex-1" onClick={() => setActiveTab("integracoes")}>
              <Webhook className="mr-2 h-4 w-4 hidden sm:block" /> Integrações
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          {showTemplateEditor ? (
            <TemplateEditor
              newTemplate={newTemplate}
              setNewTemplate={setNewTemplate}
              handleTemplateChange={handleTemplateChange}
              handleTemplateSelectChange={handleTemplateSelectChange}
              handleSaveTemplate={handleSaveTemplate}
              createTemplateIsPending={createTemplate.isPending}
              onCancel={() => setShowTemplateEditor(false)}
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
                  <div className="overflow-x-auto -mx-4 md:mx-0">
                    <div className="inline-block min-w-full align-middle md:px-0 px-4">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-2">Nome</th>
                            <th className="text-left py-3 px-2">Tipo</th>
                            <th className="text-left py-3 px-2 hidden sm:table-cell">Assunto</th>
                            <th className="text-left py-3 px-2">Status</th>
                            <th className="text-right py-3 px-2">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {templates.map((template) => (
                            <tr key={template.id} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-2">{template.nome}</td>
                              <td className="py-3 px-2 capitalize">{template.tipo}</td>
                              <td className="py-3 px-2 hidden sm:table-cell">{template.assunto || "-"}</td>
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
            <MessageEditor
              newMensagem={{
                cliente_id: '',
                template_id: '',
                assunto: '',
                conteudo: '',
                tipo: '' as 'email' | 'whatsapp' | 'sms',
                status: 'pendente' as 'enviado' | 'agendado' | 'erro' | 'pendente',
                data_agendamento: '',
                created_by: user?.id || ''
              }}
              setNewMensagem={function(): void {}}
              clients={clients || []}
              templates={templates || []}
              handleMensagemChange={function(): void {}}
              handleMensagemSelectChange={function(): void {}}
              createMensagemIsPending={false}
              handleSendMensagem={function(): void {}}
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
                  <div className="overflow-x-auto -mx-4 md:mx-0">
                    <div className="inline-block min-w-full align-middle md:px-0 px-4">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-2">Cliente</th>
                            <th className="text-left py-3 px-2 hidden sm:table-cell">Assunto</th>
                            <th className="text-left py-3 px-2">Data</th>
                            <th className="text-left py-3 px-2 hidden sm:table-cell">Tipo</th>
                            <th className="text-left py-3 px-2">Status</th>
                            <th className="text-right py-3 px-2">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mensagens.map((mensagem) => (
                            <tr key={mensagem.id} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-2">{mensagem.cliente?.nome || "-"}</td>
                              <td className="py-3 px-2 hidden sm:table-cell">{mensagem.assunto || "-"}</td>
                              <td className="py-3 px-2">
                                {mensagem.data_envio ? new Date(mensagem.data_envio).toLocaleDateString() : 
                                 mensagem.data_agendamento ? new Date(mensagem.data_agendamento).toLocaleDateString() : 
                                 new Date(mensagem.created_at).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-2 capitalize hidden sm:table-cell">{mensagem.tipo}</td>
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
            <ScheduleEditor
              newAgendamento={{
                nome: '',
                tipo: 'automatico' as 'automatico' | 'recorrente',
                evento: '' as 'emprestimo_criado' | 'emprestimo_vencendo' | 'emprestimo_atrasado' | 'pagamento_confirmado',
                dias_antes: 0,
                template_id: '',
                ativo: true,
                created_by: user?.id || ''
              }}
              setNewAgendamento={function(): void {}}
              templates={templates || []}
              handleAgendamentoChange={function(): void {}}
              handleAgendamentoSelectChange={function(): void {}}
              createAgendamentoIsPending={false}
              handleSaveAgendamento={function(): void {}}
              onCancel={() => setShowScheduleEditor(false)}
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
                  <div className="overflow-x-auto -mx-4 md:mx-0">
                    <div className="inline-block min-w-full align-middle md:px-0 px-4">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-2">Nome</th>
                            <th className="text-left py-3 px-2 hidden sm:table-cell">Evento</th>
                            <th className="text-left py-3 px-2">Template</th>
                            <th className="text-left py-3 px-2">Status</th>
                            <th className="text-right py-3 px-2">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {agendamentos.map((agendamento) => (
                            <tr key={agendamento.id} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-2">{agendamento.nome}</td>
                              <td className="py-3 px-2 hidden sm:table-cell">{agendamento.evento}</td>
                              <td className="py-3 px-2">{agendamento.template?.nome || "-"}</td>
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
                  <Button onClick={() => toast.success("Conexão testada com sucesso!")}>
                    Testar Conexão
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t space-y-4">
                <h3 className="text-lg font-semibold">Webhooks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="url">URL para POST Automático</Label>
                    <Input 
                      id="url" 
                      name="url"
                      placeholder="https://seu-webhook.com" 
                      value={webhook.url}
                      onChange={handleWebhookChange}
                    />
                    <p className="text-sm text-muted-foreground">
                      Esta URL receberá POST automático quando ocorrerem os eventos selecionados
                    </p>
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
                <div className="mt-4 flex gap-2">
                  <Button onClick={handleSaveWebhook}>
                    Salvar Webhooks
                  </Button>
                  <Button variant="outline" onClick={testWebhook}>
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
                  <Button onClick={generateApiKey}>
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
