import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { 
  Calendar, 
  Check, 
  Clock, 
  Edit, 
  FilePlus, 
  Filter, 
  Link, 
  MailPlus, 
  MessageSquare, 
  MessageSquarePlus, 
  MessagesSquare, 
  Plus, 
  Repeat, 
  Search,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Agendamento, Template, Mensagem, VariavelTemplate, WebhookIntegracao } from "@/types/mensagens";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import TemplateEditor from "./components/TemplateEditor";
import MessageEditor from "./components/MessageEditor";
import ScheduleEditor from "./components/ScheduleEditor";
import { WebhookEditor } from "./components/WebhookEditor";
import { TemplateCard } from "./components/cards/TemplateCard";
import { MessageCard } from "./components/cards/MessageCard";
import { ScheduleCard } from "./components/cards/ScheduleCard";
import { useMensagens } from "@/hooks/useMensagens";
import { useAuth } from "@/contexts/AuthContext";
import { useClients } from "@/hooks/useClients";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const MensagensETemplates = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { useTemplates, createTemplate, updateTemplate, deleteTemplate, useMensagensHistory, createMensagem, useAgendamentos, createAgendamento, updateAgendamento, deleteAgendamento, useEvolutionApiConfig, saveEvolutionApiConfig, testEvolutionApi } = useMensagens();
  const { clients } = useClients();
  const templates = useTemplates();
  const agendamentos = useAgendamentos();
  const evolutionApiConfigData = useEvolutionApiConfig();
  const mensagensHistory = useMensagensHistory();

  const navigationItems = [
    { id: "templates", label: "Templates", icon: MessageSquare },
    { id: "mensagens", label: "Mensagens", icon: MessagesSquare },
    { id: "agendamentos", label: "Agendamentos", icon: Calendar },
    { id: "integracoes", label: "Integrações", icon: Link }
  ];

  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [showScheduleEditor, setShowScheduleEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<Agendamento | null>(null);
  const [confirmDeleteTemplate, setConfirmDeleteTemplate] = useState<Template | null>(null);
  const [confirmDeleteSchedule, setConfirmDeleteSchedule] = useState<Agendamento | null>(null);
  const [evolutionApiConfig, setEvolutionApiConfig] = useState({
    webhook_url: '',
    api_key: '',
    observacoes: ''
  });
  const [activeTab, setActiveTab] = useState("templates");

  // New message state
  const [newMensagem, setNewMensagem] = useState({
    cliente_id: "",
    template_id: "",
    assunto: "",
    conteudo: "",
    tipo: "whatsapp" as "email" | "whatsapp" | "sms", // Changed from empty string to default "whatsapp"
    status: "pendente" as "enviado" | "agendado" | "erro" | "pendente",
    data_agendamento: "",
    created_by: user?.id || "",
  });

  const [newTemplate, setNewTemplate] = useState({
    nome: "",
    tipo: "whatsapp" as "email" | "whatsapp" | "sms",
    assunto: "",
    conteudo: "",
    ativo: true,
    created_by: user?.id || "",
  });

  const [newAgendamento, setNewAgendamento] = useState({
    nome: "",
    tipo: "automatico" as "automatico" | "recorrente",
    evento: "emprestimo_criado" as "emprestimo_criado" | "emprestimo_vencendo" | "emprestimo_atrasado" | "pagamento_confirmado",
    dias_antes: 0,
    template_id: "",
    ativo: true,
    created_by: user?.id || "",
  });

  // Handlers
  const handleNewTemplate = () => {
    setNewTemplate({
      nome: "",
      tipo: "whatsapp" as "email" | "whatsapp" | "sms",
      assunto: "",
      conteudo: "",
      ativo: true,
      created_by: user?.id || "",
    });
    setEditingTemplate(null);
    setShowTemplateEditor(true);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setNewTemplate({
      nome: template.nome,
      tipo: template.tipo,
      assunto: template.assunto || "",
      conteudo: template.conteudo,
      ativo: template.ativo,
      created_by: template.created_by,
    });
    setShowTemplateEditor(true);
  };

  const handleEditSchedule = (agendamento: Agendamento) => {
    setEditingSchedule(agendamento);
    setNewAgendamento({
      nome: agendamento.nome,
      tipo: agendamento.tipo,
      evento: agendamento.evento,
      dias_antes: agendamento.dias_antes,
      template_id: agendamento.template_id || "",
      ativo: agendamento.ativo,
      created_by: agendamento.created_by,
    });
    setShowScheduleEditor(true);
  };

  const handleDeleteTemplateConfirm = (template: Template) => {
    setConfirmDeleteTemplate(template);
  };

  const handleDeleteScheduleConfirm = (agendamento: Agendamento) => {
    setConfirmDeleteSchedule(agendamento);
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewTemplate({ ...newTemplate, [e.target.name]: e.target.value });
  };

  const handleMensagemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewMensagem({ ...newMensagem, [e.target.name]: e.target.value });
  };

  const handleAgendamentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAgendamento({ ...newAgendamento, [e.target.name]: e.target.value });
  };

  const handleTemplateSelectChange = (name: string, value: string) => {
    setNewTemplate({ ...newTemplate, [name]: value });
  };

  const handleMensagemSelectChange = (name: string, value: string) => {
    setNewMensagem({ ...newMensagem, [name]: value });
  };

  const handleAgendamentoSelectChange = (name: string, value: string) => {
    setNewAgendamento({ ...newAgendamento, [name]: value });
  };

  const handleInsertVariable = (variable: VariavelTemplate) => {
    setNewTemplate({
      ...newTemplate,
      conteudo: newTemplate.conteudo + variable.valor,
    });
  };

  const handleSaveTemplate = async () => {
    if (editingTemplate) {
      // Update existing template
      await updateTemplate.mutateAsync({ id: editingTemplate.id, template: newTemplate });
    } else {
      // Create new template
      await createTemplate.mutateAsync(newTemplate);
    }
    setShowTemplateEditor(false);
  };

  const handleDeleteTemplate = async () => {
    if (confirmDeleteTemplate) {
      await deleteTemplate.mutateAsync(confirmDeleteTemplate.id);
      setConfirmDeleteTemplate(null);
    }
  };

  const handleSendMensagem = async () => {
    // Ensure tipo is not empty before sending
    if (!newMensagem.tipo) {
      toast.error("Selecione um tipo de mensagem");
      return;
    }
    
    await createMensagem.mutateAsync(newMensagem);
    setNewMensagem({
      cliente_id: "",
      template_id: "",
      assunto: "",
      conteudo: "",
      tipo: "whatsapp" as "email" | "whatsapp" | "sms", // Reset to default "whatsapp" instead of empty string
      status: "pendente" as "enviado" | "agendado" | "erro" | "pendente",
      data_agendamento: "",
      created_by: user?.id || "",
    });
  };

  const handleSaveAgendamento = async () => {
    if (editingSchedule) {
      // Update existing agendamento
      await updateAgendamento.mutateAsync({ id: editingSchedule.id, agendamento: newAgendamento });
    } else {
      // Create new agendamento
      await createAgendamento.mutateAsync(newAgendamento);
    }
    setShowScheduleEditor(false);
    setEditingSchedule(null);
  };

  const handleDeleteSchedule = async () => {
    if (confirmDeleteSchedule) {
      await deleteAgendamento.mutateAsync(confirmDeleteSchedule.id);
      setConfirmDeleteSchedule(null);
    }
  };

  const handleSaveEvolutionApi = async () => {
    await saveEvolutionApiConfig.mutateAsync(evolutionApiConfig);
  };

  const handleTestEvolutionApi = async () => {
    await testEvolutionApi.mutateAsync(evolutionApiConfig);
  };

  // Side effect to set Evolution API config
  useEffect(() => {
    if (evolutionApiConfigData.data) {
      setEvolutionApiConfig(evolutionApiConfigData.data);
    }
  }, [evolutionApiConfigData.data]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comunicações"
        description="Envie mensagens e gerencie templates para comunicação com clientes"
      />

      {isMobile ? (
        <div>
          {/* Barra de navegação mobile */}
          <div className="bg-card border-b shadow-sm mb-6">
            <nav className="flex w-full overflow-x-auto no-scrollbar">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    flex-1 min-w-[25%] flex flex-col items-center justify-center py-3 px-1
                    transition-colors duration-200 relative
                    ${activeTab === item.id 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-muted-foreground hover:text-primary hover:bg-accent/50'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5 mb-1" aria-hidden="true" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Conteúdo */}
          <div>
            {activeTab === "templates" && (
              <>
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
                  <>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                      <h2 className="text-xl font-bold">Templates de Mensagens</h2>
                      <Button onClick={() => handleNewTemplate()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Template
                      </Button>
                    </div>

                    {templates.isLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                          <Card key={i}>
                            <CardHeader>
                              <CardTitle><Skeleton className="h-5 w-3/4" /></CardTitle>
                            </CardHeader>
                            <CardContent>
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-5/6" />
                              <Skeleton className="h-4 w-1/2" />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : templates.data && templates.data.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {templates.data.map((template) => (
                          <TemplateCard 
                            key={template.id} 
                            template={template} 
                            onEdit={() => handleEditTemplate(template)}
                            onDelete={() => handleDeleteTemplateConfirm(template)}
                          />
                        ))}
                      </div>
                    ) : (
                      <EmptyState 
                        title="Nenhum template encontrado"
                        description="Crie templates para agilizar o envio de mensagens."
                        icon={<FilePlus className="h-10 w-10" />}
                        action={
                          <Button onClick={() => handleNewTemplate()}>
                            Criar Template
                          </Button>
                        }
                      />
                    )}
                  </>
                )}
              </>
            )}

            {activeTab === "mensagens" && (
              <Card>
                <CardHeader>
                  <CardTitle>Enviar Mensagem</CardTitle>
                  <CardDescription>
                    Envie mensagens personalizadas para seus clientes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MessageEditor 
                    newMensagem={newMensagem}
                    setNewMensagem={setNewMensagem}
                    templates={templates.data || []} 
                    clients={clients || []}
                    handleMensagemChange={handleMensagemChange}
                    handleMensagemSelectChange={handleMensagemSelectChange}
                    createMensagemIsPending={createMensagem.isPending}
                    handleSendMensagem={handleSendMensagem}
                    onCancel={() => {}}
                  />
                </CardContent>
              </Card>
            )}

            {activeTab === "agendamentos" && (
              <>
                {showScheduleEditor ? (
                  <ScheduleEditor
                    newAgendamento={newAgendamento}
                    setNewAgendamento={setNewAgendamento}
                    templates={templates.data || []}
                    handleAgendamentoChange={handleAgendamentoChange}
                    handleAgendamentoSelectChange={handleAgendamentoSelectChange}
                    createAgendamentoIsPending={createAgendamento.isPending}
                    handleSaveAgendamento={handleSaveAgendamento}
                    onCancel={() => setShowScheduleEditor(false)}
                  />
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                      <h2 className="text-xl font-bold">Agendamentos Automáticos</h2>
                      <Button onClick={() => setShowScheduleEditor(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Agendamento
                      </Button>
                    </div>

                    {agendamentos.isLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                          <Card key={i}>
                            <CardHeader>
                              <CardTitle><Skeleton className="h-5 w-3/4" /></CardTitle>
                            </CardHeader>
                            <CardContent>
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-5/6" />
                              <Skeleton className="h-4 w-1/2" />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : agendamentos.data && agendamentos.data.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {agendamentos.data.map((agendamento) => (
                          <ScheduleCard 
                            key={agendamento.id} 
                            agendamento={agendamento}
                            onEdit={() => handleEditSchedule(agendamento)}
                            onDelete={() => handleDeleteScheduleConfirm(agendamento)}
                          />
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        title="Nenhum agendamento encontrado"
                        description="Agende mensagens automáticas para seus clientes."
                        icon={<Calendar className="h-10 w-10" />}
                        action={
                          <Button onClick={() => setShowScheduleEditor(true)}>
                            Criar Agendamento
                          </Button>
                        }
                      />
                    )}
                  </>
                )}
              </>
            )}

            {activeTab === "integracoes" && (
              <>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Integração com WhatsApp (Evolution API)</CardTitle>
                    <CardDescription>
                      Configure a integração com WhatsApp para envio de mensagens automáticas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="webhook_url">URL do Webhook</Label>
                        <Input 
                          id="webhook_url" 
                          placeholder="https://seu-webhook.com" 
                          value={evolutionApiConfig.webhook_url}
                          onChange={(e) => setEvolutionApiConfig({...evolutionApiConfig, webhook_url: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="api_key">Chave de Autenticação</Label>
                        <Input 
                          id="api_key" 
                          type="password"
                          placeholder="Chave secreta para autenticação" 
                          value={evolutionApiConfig.api_key}
                          onChange={(e) => setEvolutionApiConfig({...evolutionApiConfig, api_key: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="observacoes">Observações (opcional)</Label>
                        <Textarea 
                          id="observacoes"
                          placeholder="Observações sobre esta integração" 
                          value={evolutionApiConfig.observacoes || ''}
                          onChange={(e) => setEvolutionApiConfig({...evolutionApiConfig, observacoes: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => handleTestEvolutionApi()}>
                        Testar Conexão
                      </Button>
                      <Button onClick={() => handleSaveEvolutionApi()}>
                        Salvar Configuração
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Outras Integrações</CardTitle>
                    <CardDescription>
                      Integrações adicionais estarão disponíveis em breve
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EmptyState 
                      title="Em desenvolvimento"
                      description="Novas integrações serão adicionadas em breve."
                      icon={<AlertTriangle className="h-10 w-10" />}
                    />
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      ) : (
        <Tabs defaultValue="templates" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            {navigationItems.map((item) => (
              <TabsTrigger key={item.id} value={item.id} className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="templates" className="mt-6">
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
              <>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                  <h2 className="text-xl font-bold">Templates de Mensagens</h2>
                  <Button onClick={() => handleNewTemplate()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Template
                  </Button>
                </div>

                {templates.isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i}>
                        <CardHeader>
                          <CardTitle><Skeleton className="h-5 w-3/4" /></CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-5/6" />
                          <Skeleton className="h-4 w-1/2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : templates.data && templates.data.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates.data.map((template) => (
                      <TemplateCard 
                        key={template.id} 
                        template={template} 
                        onEdit={() => handleEditTemplate(template)}
                        onDelete={() => handleDeleteTemplateConfirm(template)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState 
                    title="Nenhum template encontrado"
                    description="Crie templates para agilizar o envio de mensagens."
                    icon={<FilePlus className="h-10 w-10" />}
                    action={
                      <Button onClick={() => handleNewTemplate()}>
                        Criar Template
                      </Button>
                    }
                  />
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="mensagens" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Enviar Mensagem</CardTitle>
                <CardDescription>
                  Envie mensagens personalizadas para seus clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MessageEditor 
                  newMensagem={newMensagem}
                  setNewMensagem={setNewMensagem}
                  templates={templates.data || []} 
                  clients={clients || []}
                  handleMensagemChange={handleMensagemChange}
                  handleMensagemSelectChange={handleMensagemSelectChange}
                  createMensagemIsPending={createMensagem.isPending}
                  handleSendMensagem={handleSendMensagem}
                  onCancel={() => {}}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agendamentos" className="mt-6">
            {showScheduleEditor ? (
              <ScheduleEditor
                newAgendamento={newAgendamento}
                setNewAgendamento={setNewAgendamento}
                templates={templates.data || []}
                handleAgendamentoChange={handleAgendamentoChange}
                handleAgendamentoSelectChange={handleAgendamentoSelectChange}
                createAgendamentoIsPending={createAgendamento.isPending}
                handleSaveAgendamento={handleSaveAgendamento}
                onCancel={() => setShowScheduleEditor(false)}
              />
            ) : (
              <>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                  <h2 className="text-xl font-bold">Agendamentos Automáticos</h2>
                  <Button onClick={() => setShowScheduleEditor(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Agendamento
                  </Button>
                </div>

                {agendamentos.isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i}>
                        <CardHeader>
                          <CardTitle><Skeleton className="h-5 w-3/4" /></CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-5/6" />
                          <Skeleton className="h-4 w-1/2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : agendamentos.data && agendamentos.data.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agendamentos.data.map((agendamento) => (
                      <ScheduleCard 
                        key={agendamento.id} 
                        agendamento={agendamento}
                        onEdit={() => handleEditSchedule(agendamento)}
                        onDelete={() => handleDeleteScheduleConfirm(agendamento)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="Nenhum agendamento encontrado"
                    description="Agende mensagens automáticas para seus clientes."
                    icon={<Calendar className="h-10 w-10" />}
                    action={
                      <Button onClick={() => setShowScheduleEditor(true)}>
                        Criar Agendamento
                      </Button>
                    }
                  />
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="integracoes" className="mt-6">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Integração com WhatsApp (Evolution API)</CardTitle>
                <CardDescription>
                  Configure a integração com WhatsApp para envio de mensagens automáticas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhook_url">URL do Webhook</Label>
                    <Input 
                      id="webhook_url" 
                      placeholder="https://seu-webhook.com" 
                      value={evolutionApiConfig.webhook_url}
                      onChange={(e) => setEvolutionApiConfig({...evolutionApiConfig, webhook_url: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api_key">Chave de Autenticação</Label>
                    <Input 
                      id="api_key" 
                      type="password"
                      placeholder="Chave secreta para autenticação" 
                      value={evolutionApiConfig.api_key}
                      onChange={(e) => setEvolutionApiConfig({...evolutionApiConfig, api_key: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="observacoes">Observações (opcional)</Label>
                    <Textarea 
                      id="observacoes"
                      placeholder="Observações sobre esta integração" 
                      value={evolutionApiConfig.observacoes || ''}
                      onChange={(e) => setEvolutionApiConfig({...evolutionApiConfig, observacoes: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => handleTestEvolutionApi()}>
                    Testar Conexão
                  </Button>
                  <Button onClick={() => handleSaveEvolutionApi()}>
                    Salvar Configuração
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Outras Integrações</CardTitle>
                <CardDescription>
                  Integrações adicionais estarão disponíveis em breve
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmptyState 
                  title="Em desenvolvimento"
                  description="Novas integrações serão adicionadas em breve."
                  icon={<AlertTriangle className="h-10 w-10" />}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Dialog confirmação para excluir template */}
      <AlertDialog open={confirmDeleteTemplate !== null} onOpenChange={(open) => !open && setConfirmDeleteTemplate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Template</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este template? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTemplate} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog confirmação para excluir agendamento */}
      <AlertDialog open={confirmDeleteSchedule !== null} onOpenChange={(open) => !open && setConfirmDeleteSchedule(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Agendamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSchedule} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MensagensETemplates;
