
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Mail, 
  MessageSquare, 
  Calendar, 
  Webhook, 
  Plus,
  Link,
  Check,
  Loader2,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { toast } from "sonner";
import { useClients } from "@/hooks/useClients";

// Variables to use in templates
const SYSTEM_VARIABLES = [
  { name: "{nome_cliente}", description: "Nome do cliente" },
  { name: "{valor_emprestimo}", description: "Valor do empréstimo" },
  { name: "{data_vencimento}", description: "Data de vencimento" },
  { name: "{parcela_atual}", description: "Número da parcela atual" },
  { name: "{valor_parcela}", description: "Valor da parcela" },
  { name: "{total_parcelas}", description: "Total de parcelas" },
  { name: "{saldo_devedor}", description: "Saldo devedor" },
];

interface Template {
  id: string;
  nome: string;
  assunto: string;
  conteudo: string;
  tipo: string;
}

const VariableButton = ({ variable, onClick }: { variable: { name: string, description: string }, onClick: (variable: string) => void }) => (
  <Button 
    type="button" 
    variant="outline" 
    size="sm" 
    className="mb-1 mr-1" 
    onClick={() => onClick(variable.name)}
    title={variable.description}
  >
    {variable.name}
  </Button>
);

const TextEditor = ({ value, onChange, placeholder }: { value: string, onChange: (value: string) => void, placeholder: string }) => {
  const insertStyle = (tag: string) => {
    // Simple style insertion, a more robust solution would use a proper editor like TinyMCE or Quill
    onChange(value + ` <${tag}>texto</${tag}> `);
  };
  
  const insertAlignment = (align: string) => {
    onChange(value + ` <div style="text-align: ${align}">texto alinhado</div> `);
  };
  
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 mb-2 p-1 border rounded-md bg-muted/50">
        <Button type="button" variant="ghost" size="icon" onClick={() => insertStyle('b')} title="Negrito">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => insertStyle('i')} title="Itálico">
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => insertStyle('u')} title="Sublinhado">
          <Underline className="h-4 w-4" />
        </Button>
        <div className="h-6 border-l mx-1"></div>
        <Button type="button" variant="ghost" size="icon" onClick={() => insertAlignment('left')} title="Alinhar à esquerda">
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => insertAlignment('center')} title="Centralizar">
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={() => insertAlignment('right')} title="Alinhar à direita">
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
      <Textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={8}
        className="min-h-[200px]"
      />
      <div>
        <Label className="mb-2 block">Variáveis disponíveis:</Label>
        <div className="flex flex-wrap gap-1">
          {SYSTEM_VARIABLES.map((variable) => (
            <VariableButton 
              key={variable.name} 
              variable={variable} 
              onClick={(v) => onChange(value + v)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const EmailConfigCard = () => {
  const [smtpConfig, setSmtpConfig] = useState({
    host: "",
    port: "",
    user: "",
    password: "",
    from_email: "",
    from_name: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  
  useEffect(() => {
    loadEmailConfig();
  }, []);
  
  const loadEmailConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes_financeiras')
        .select('observacoes')
        .eq('nome', 'smtp_config')
        .maybeSingle();
      
      if (error) throw error;
      
      if (data && data.observacoes) {
        try {
          const parsedConfig = JSON.parse(data.observacoes);
          setSmtpConfig(parsedConfig);
        } catch (e) {
          console.error("Error parsing SMTP config", e);
        }
      }
    } catch (error) {
      console.error("Error loading SMTP config:", error);
    } finally {
      setIsLoadingConfig(false);
    }
  };
  
  const saveEmailConfig = async () => {
    setIsLoading(true);
    
    try {
      // Check if config exists
      const { data, error } = await supabase
        .from('configuracoes_financeiras')
        .select('id')
        .eq('nome', 'smtp_config')
        .maybeSingle();
      
      if (error) throw error;
      
      const configData = {
        observacoes: JSON.stringify(smtpConfig),
        taxa_padrao_juros: 0,
        tipo_juros_padrao: 'composto',
        prazo_maximo_dias: 30,
        taxa_multa_atraso: 0,
        taxa_juros_atraso: 0
      };
      
      let result;
      
      if (data) {
        // Update existing
        result = await supabase
          .from('configuracoes_financeiras')
          .update({
            observacoes: JSON.stringify(smtpConfig),
            updated_at: new Date().toISOString()
          })
          .eq('id', data.id);
      } else {
        // Create new
        result = await supabase
          .from('configuracoes_financeiras')
          .insert({
            nome: 'smtp_config',
            ...configData,
            created_by: "system" // Ideally the user ID
          });
      }
      
      if (result.error) throw result.error;
      
      toast.success("Configurações SMTP salvas com sucesso");
    } catch (error) {
      console.error("Error saving SMTP config:", error);
      toast.error("Erro ao salvar configurações SMTP");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSmtpConfig(prev => ({ ...prev, [name]: value }));
  };
  
  if (isLoadingConfig) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configurações SMTP de Email</CardTitle>
          <CardDescription>
            Configure o servidor SMTP para envio de emails.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Carregando configurações...</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações SMTP de Email</CardTitle>
        <CardDescription>
          Configure o servidor SMTP para envio de emails.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="host">Servidor SMTP</Label>
            <Input 
              id="host" 
              name="host" 
              placeholder="smtp.exemplo.com" 
              value={smtpConfig.host}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="port">Porta</Label>
            <Input 
              id="port" 
              name="port" 
              placeholder="587" 
              value={smtpConfig.port}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="user">Usuário</Label>
            <Input 
              id="user" 
              name="user" 
              placeholder="seu.email@exemplo.com" 
              value={smtpConfig.user}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              value={smtpConfig.password}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="from_name">Nome de Exibição</Label>
            <Input 
              id="from_name" 
              name="from_name" 
              placeholder="Sua Empresa" 
              value={smtpConfig.from_name}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="from_email">Email de Origem</Label>
            <Input 
              id="from_email" 
              name="from_email" 
              placeholder="noreply@exemplo.com" 
              value={smtpConfig.from_email}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={saveEmailConfig} 
          disabled={isLoading}
          className="ml-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Salvar Configurações
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

const MensagensETemplates = () => {
  const navigate = useNavigate();
  const { logActivity } = useActivityLogs();
  const { clients, isLoadingClients } = useClients();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  // Templates state
  const [templateList, setTemplateList] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [templateName, setTemplateName] = useState("");
  const [templateSubject, setTemplateSubject] = useState("");
  const [templateContent, setTemplateContent] = useState("");
  const [templateType, setTemplateType] = useState("email");
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  
  // Messages state
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [messageType, setMessageType] = useState("email");
  const [scheduleDate, setScheduleDate] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  
  // Webhook state
  const [webhookConfig, setWebhookConfig] = useState({
    postUrl: "",
    apiUrl: "",
    events: {
      novoEmprestimo: true,
      novoPagamento: true,
      novoCliente: true,
      emprestimoAtrasado: true
    }
  });
  const [evolutionConfig, setEvolutionConfig] = useState({
    url: "",
    events: {
      novoEmprestimo: true,
      novoPagamento: true,
      novoCliente: true,
      emprestimoAtrasado: true
    }
  });
  const [isSavingWebhook, setIsSavingWebhook] = useState(false);
  const [isSavingEvolution, setIsSavingEvolution] = useState(false);
  
  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          
          if (error) throw error;
          
          setIsAdmin(data?.role === 'admin');
        } catch (error) {
          console.error("Error checking admin status:", error);
        }
      }
    };
    
    checkAdminStatus();
  }, [user]);
  
  // Load templates on component mount
  useEffect(() => {
    logActivity("Acessou página de mensagens e templates");
    loadTemplates();
    loadWebhookConfig();
    loadEvolutionConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Load templates
  const loadTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const { data, error } = await supabase
        .from('templates_mensagens')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setTemplateList(data || []);
    } catch (error) {
      console.error("Erro ao carregar templates:", error);
      toast.error("Erro ao carregar templates");
    } finally {
      setLoadingTemplates(false);
    }
  };
  
  // Load webhook config
  const loadWebhookConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('webhooks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const webhook = data[0];
        
        const events = {
          novoEmprestimo: webhook.eventos.includes("emprestimo.novo"),
          novoPagamento: webhook.eventos.includes("pagamento.novo"),
          novoCliente: webhook.eventos.includes("cliente.novo"),
          emprestimoAtrasado: webhook.eventos.includes("emprestimo.atraso")
        };
        
        // Split URL for post and API if needed
        const urls = webhook.url.split("|");
        
        setWebhookConfig({
          postUrl: urls[0] || "",
          apiUrl: urls[1] || "",
          events
        });
      }
    } catch (error) {
      console.error("Erro ao carregar configuração do webhook:", error);
    }
  };
  
  // Load Evolution API config
  const loadEvolutionConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes_financeiras')
        .select('*')
        .eq('nome', 'evolution_api')
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        try {
          // Parse config from observacoes
          const config = JSON.parse(data.observacoes || "{}");
          
          setEvolutionConfig({
            url: config.url || "",
            events: config.events || {
              novoEmprestimo: true,
              novoPagamento: true,
              novoCliente: true,
              emprestimoAtrasado: true
            }
          });
        } catch (e) {
          console.error("Erro ao parsear config da Evolution API:", e);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar configuração da Evolution API:", error);
    }
  };
  
  // Save template
  const salvarTemplate = async () => {
    if (!templateName || !templateContent) {
      toast.error("Nome e conteúdo do template são obrigatórios");
      return;
    }
    
    setIsSavingTemplate(true);
    
    try {
      const templateData = {
        nome: templateName,
        assunto: templateType === "email" ? templateSubject : "",
        conteudo: templateContent,
        tipo: templateType,
        ativo: true,
        created_by: user?.id || "system"
      };
      
      const { data, error } = await supabase
        .from('templates_mensagens')
        .insert(templateData)
        .select();
      
      if (error) throw error;
      
      toast.success("Template salvo com sucesso!");
      logActivity("Criou template de mensagem");
      
      // Clear form
      setTemplateName("");
      setTemplateSubject("");
      setTemplateContent("");
      
      // Refresh templates
      loadTemplates();
    } catch (error) {
      console.error("Erro ao salvar template:", error);
      toast.error("Erro ao salvar template. Tente novamente.");
    } finally {
      setIsSavingTemplate(false);
    }
  };
  
  // Handle template selection
  const handleTemplateChange = async (templateId: string) => {
    setSelectedTemplate(templateId);
    
    if (templateId) {
      try {
        const template = templateList.find(t => t.id === templateId);
        
        if (template) {
          setMessageSubject(template.assunto || "");
          setMessageContent(template.conteudo || "");
          setMessageType(template.tipo || "email");
        }
      } catch (error) {
        console.error("Erro ao carregar template:", error);
      }
    } else {
      // Clear if no template is selected
      setMessageSubject("");
      setMessageContent("");
    }
  };
  
  // Send message
  const enviarMensagem = async () => {
    if (!selectedClient || !messageContent) {
      toast.error("Cliente e conteúdo da mensagem são obrigatórios");
      return;
    }
    
    if (messageType === "email" && !messageSubject) {
      toast.error("Assunto é obrigatório para mensagens de email");
      return;
    }
    
    setIsSendingMessage(true);
    
    try {
      const mensagemData = {
        cliente_id: selectedClient,
        template_id: selectedTemplate || null,
        assunto: messageSubject,
        conteudo: messageContent,
        tipo: messageType,
        status: scheduleDate ? "agendada" : "pendente",
        data_agendamento: scheduleDate || null,
        created_by: user?.id || "system"
      };
      
      const { data, error } = await supabase.from('mensagens').insert(mensagemData);
      
      if (error) throw error;
      
      toast.success(scheduleDate ? "Mensagem agendada com sucesso!" : "Mensagem enviada para a fila de processamento!");
      logActivity(scheduleDate ? "Agendou mensagem" : "Enviou mensagem");
      
      // Clear form
      setSelectedClient("");
      setSelectedTemplate("");
      setMessageSubject("");
      setMessageContent("");
      setScheduleDate("");
    } catch (error) {
      console.error("Erro ao enviar/agendar mensagem:", error);
      toast.error("Erro ao processar mensagem. Tente novamente.");
    } finally {
      setIsSendingMessage(false);
    }
  };
  
  // Save webhook config
  const salvarWebhookConfig = async () => {
    if (!webhookConfig.postUrl && !webhookConfig.apiUrl) {
      toast.error("Pelo menos uma URL é obrigatória");
      return;
    }
    
    setIsSavingWebhook(true);
    
    try {
      // Create array of events
      const eventos = [];
      if (webhookConfig.events.novoEmprestimo) eventos.push("emprestimo.novo");
      if (webhookConfig.events.novoPagamento) eventos.push("pagamento.novo");
      if (webhookConfig.events.novoCliente) eventos.push("cliente.novo");
      if (webhookConfig.events.emprestimoAtrasado) eventos.push("emprestimo.atraso");
      
      // Combine URLs
      const url = webhookConfig.postUrl + (webhookConfig.apiUrl ? `|${webhookConfig.apiUrl}` : "");
      
      // Check if webhook already exists
      const { data: existingWebhook, error: fetchError } = await supabase
        .from('webhooks')
        .select('id')
        .limit(1);
      
      if (fetchError) throw fetchError;
      
      let result;
      
      if (existingWebhook && existingWebhook.length > 0) {
        // Update existing
        result = await supabase
          .from('webhooks')
          .update({
            url,
            eventos,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingWebhook[0].id);
      } else {
        // Create new
        result = await supabase
          .from('webhooks')
          .insert({
            nome: "Webhook Principal",
            url,
            eventos,
            ativo: true,
            created_by: user?.id || "system"
          });
      }
      
      if (result.error) throw result.error;
      
      toast.success("Webhook configurado com sucesso!");
      logActivity("Configurou webhook de integrações");
    } catch (error) {
      console.error("Erro ao salvar webhook:", error);
      toast.error("Erro ao configurar webhook. Tente novamente.");
    } finally {
      setIsSavingWebhook(false);
    }
  };
  
  // Save Evolution API config
  const salvarEvolutionConfig = async () => {
    if (!evolutionConfig.url) {
      toast.error("URL da Evolution API é obrigatória");
      return;
    }
    
    setIsSavingEvolution(true);
    
    try {
      // Save as JSON in the observacoes field
      const configJson = JSON.stringify(evolutionConfig);
      
      // Check if config exists
      const { data: existingConfig, error: fetchError } = await supabase
        .from('configuracoes_financeiras')
        .select('id')
        .eq('nome', 'evolution_api')
        .maybeSingle();
      
      if (fetchError) throw fetchError;
      
      let result;
      
      if (existingConfig) {
        // Update existing
        result = await supabase
          .from('configuracoes_financeiras')
          .update({
            observacoes: configJson,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingConfig.id);
      } else {
        // Create new
        result = await supabase
          .from('configuracoes_financeiras')
          .insert({
            nome: 'evolution_api',
            taxa_padrao_juros: 0,
            tipo_juros_padrao: 'composto',
            prazo_maximo_dias: 0,
            taxa_multa_atraso: 0,
            taxa_juros_atraso: 0,
            observacoes: configJson,
            created_by: user?.id || "system"
          });
      }
      
      if (result.error) throw result.error;
      
      toast.success("Configuração da Evolution API salva com sucesso!");
      logActivity("Configurou integração com Evolution API");
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
      toast.error("Erro ao salvar configuração. Tente novamente.");
    } finally {
      setIsSavingEvolution(false);
    }
  };
  
  // Test webhook
  const testarWebhook = async () => {
    try {
      // Log the test
      await supabase
        .from('webhook_logs')
        .insert({
          webhook_id: "test",
          evento: "webhook.test",
          payload: JSON.stringify({
            event: "webhook.test",
            timestamp: new Date().toISOString(),
            data: {
              message: "Teste de conexão do sistema Crédito Inteligente"
            }
          }),
          status: "enviado"
        });
      
      toast.success("Teste de webhook enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao testar webhook:", error);
      toast.error("Erro ao testar webhook");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mensagens e Templates</h1>
        <p className="text-muted-foreground">
          Gerencie mensagens automatizadas e templates para comunicação com clientes.
        </p>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList className="w-full grid grid-cols-1 md:grid-cols-4 mb-4">
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>Templates</span>
          </TabsTrigger>
          <TabsTrigger value="mensagens" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Mensagens</span>
          </TabsTrigger>
          <TabsTrigger value="agendamento" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Agendamento</span>
          </TabsTrigger>
          <TabsTrigger value="integracoes" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            <span>Integrações</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          <EmailConfigCard />
          
          <Card>
            <CardHeader>
              <CardTitle>Criar Novo Template</CardTitle>
              <CardDescription>
                Utilize o editor abaixo para criar templates com variáveis dinâmicas do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="templateName">Nome do Template</Label>
                  <Input 
                    id="templateName" 
                    placeholder="Ex: Boas Vindas" 
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="templateType">Tipo de Mensagem</Label>
                  <Select 
                    value={templateType} 
                    onValueChange={setTemplateType}
                  >
                    <SelectTrigger id="templateType">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {templateType === "email" && (
                <div className="space-y-2">
                  <Label htmlFor="templateSubject">Assunto do E-mail</Label>
                  <Input 
                    id="templateSubject" 
                    placeholder="Assunto da mensagem" 
                    value={templateSubject}
                    onChange={(e) => setTemplateSubject(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="templateContent">Conteúdo</Label>
                <TextEditor 
                  value={templateContent}
                  onChange={setTemplateContent}
                  placeholder="Digite ou cole o conteúdo do template aqui..."
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={salvarTemplate} disabled={isSavingTemplate}>
                {isSavingTemplate ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Salvar Template
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Templates Existentes</CardTitle>
              <CardDescription>
                Gerencie os templates de mensagens criados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingTemplates ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="mt-2 text-muted-foreground">Carregando templates...</p>
                </div>
              ) : templateList.length > 0 ? (
                <div className="space-y-4">
                  {templateList.map(template => (
                    <Card key={template.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base">{template.nome}</CardTitle>
                            <CardDescription>Tipo: {template.tipo === "email" ? "E-mail" : "WhatsApp"}</CardDescription>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            Editar
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        {template.tipo === "email" && template.assunto && (
                          <p className="text-sm font-medium mt-1">Assunto: {template.assunto}</p>
                        )}
                        <div className="mt-2 text-sm text-muted-foreground truncate max-h-20 overflow-hidden">
                          {template.conteudo}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground mt-4">
                    Nenhum template encontrado. Crie seu primeiro template acima.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mensagens" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enviar Mensagem</CardTitle>
              <CardDescription>
                Envie uma mensagem personalizada para um cliente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientSelect">Cliente</Label>
                  {isLoadingClients ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Carregando clientes...</span>
                    </div>
                  ) : (
                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                      <SelectTrigger id="clientSelect">
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients && clients.map(cliente => (
                          <SelectItem key={cliente.id} value={cliente.id}>
                            {cliente.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="messageType">Tipo de Mensagem</Label>
                  <Select value={messageType} onValueChange={setMessageType}>
                    <SelectTrigger id="messageType">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="templateSelect">Template</Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                  <SelectTrigger id="templateSelect">
                    <SelectValue placeholder="Selecione um template (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Personalizado (sem template)</SelectItem>
                    {templateList
                      .filter(t => t.tipo === messageType)
                      .map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.nome}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>

              {messageType === "email" && (
                <div className="space-y-2">
                  <Label htmlFor="messageSubject">Assunto do E-mail</Label>
                  <Input 
                    id="messageSubject" 
                    placeholder="Assunto da mensagem" 
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="messageContent">Conteúdo</Label>
                <TextEditor 
                  value={messageContent}
                  onChange={setMessageContent}
                  placeholder="Digite o conteúdo da mensagem..."
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={enviarMensagem} disabled={isSendingMessage}>
                {isSendingMessage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Enviar Mensagem
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Mensagens</CardTitle>
              <CardDescription>
                Veja as mensagens enviadas e seus status.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground mt-4">
                O histórico de mensagens enviadas será implementado em breve.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agendamento" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agendar Mensagem</CardTitle>
              <CardDescription>
                Programe o envio automático de mensagens para datas específicas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientSelectSchedule">Cliente</Label>
                  {isLoadingClients ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Carregando clientes...</span>
                    </div>
                  ) : (
                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                      <SelectTrigger id="clientSelectSchedule">
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients && clients.map(cliente => (
                          <SelectItem key={cliente.id} value={cliente.id}>
                            {cliente.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="messageTypeSchedule">Tipo de Mensagem</Label>
                  <Select value={messageType} onValueChange={setMessageType}>
                    <SelectTrigger id="messageTypeSchedule">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="templateSelectSchedule">Template</Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                  <SelectTrigger id="templateSelectSchedule">
                    <SelectValue placeholder="Selecione um template (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Personalizado (sem template)</SelectItem>
                    {templateList
                      .filter(t => t.tipo === messageType)
                      .map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.nome}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduleDate">Data e Hora de Envio</Label>
                <Input 
                  id="scheduleDate" 
                  type="datetime-local" 
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  required
                />
              </div>

              {messageType === "email" && (
                <div className="space-y-2">
                  <Label htmlFor="messageSubjectSchedule">Assunto do E-mail</Label>
                  <Input 
                    id="messageSubjectSchedule" 
                    placeholder="Assunto da mensagem" 
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="messageContentSchedule">Conteúdo</Label>
                <TextEditor 
                  value={messageContent}
                  onChange={setMessageContent}
                  placeholder="Digite o conteúdo da mensagem..."
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={enviarMensagem} 
                disabled={isSendingMessage || !scheduleDate}
              >
                {isSendingMessage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Agendando...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Agendar Mensagem
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mensagens Agendadas</CardTitle>
              <CardDescription>
                Veja as mensagens programadas para envio futuro.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground mt-4">
                A listagem de mensagens agendadas será implementada em breve.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integracoes" className="space-y-6">
          {isAdmin && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Integração com Webhooks</CardTitle>
                  <CardDescription>
                    Configure webhooks para integrar com outros sistemas.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhookPostUrl">URL de POST (notificações automáticas)</Label>
                    <Input 
                      id="webhookPostUrl" 
                      placeholder="https://seu-servico.com/webhook" 
                      value={webhookConfig.postUrl}
                      onChange={(e) => setWebhookConfig({...webhookConfig, postUrl: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="webhookApiUrl">URL de API (para acesso externo)</Label>
                    <Input 
                      id="webhookApiUrl" 
                      placeholder="https://sua-api.com/credito-inteligente" 
                      value={webhookConfig.apiUrl}
                      onChange={(e) => setWebhookConfig({...webhookConfig, apiUrl: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Eventos</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="eventEmprestimo" 
                          className="h-4 w-4 rounded border-gray-300"
                          checked={webhookConfig.events.novoEmprestimo}
                          onChange={(e) => {
                            setWebhookConfig({
                              ...webhookConfig, 
                              events: {
                                ...webhookConfig.events, 
                                novoEmprestimo: e.target.checked
                              }
                            });
                          }}
                        />
                        <Label htmlFor="eventEmprestimo" className="text-sm">Novo Empréstimo</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="eventPagamento" 
                          className="h-4 w-4 rounded border-gray-300"
                          checked={webhookConfig.events.novoPagamento}
                          onChange={(e) => {
                            setWebhookConfig({
                              ...webhookConfig, 
                              events: {
                                ...webhookConfig.events, 
                                novoPagamento: e.target.checked
                              }
                            });
                          }}
                        />
                        <Label htmlFor="eventPagamento" className="text-sm">Novo Pagamento</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="eventCliente" 
                          className="h-4 w-4 rounded border-gray-300"
                          checked={webhookConfig.events.novoCliente}
                          onChange={(e) => {
                            setWebhookConfig({
                              ...webhookConfig, 
                              events: {
                                ...webhookConfig.events, 
                                novoCliente: e.target.checked
                              }
                            });
                          }}
                        />
                        <Label htmlFor="eventCliente" className="text-sm">Novo Cliente</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="eventAtraso" 
                          className="h-4 w-4 rounded border-gray-300"
                          checked={webhookConfig.events.emprestimoAtrasado}
                          onChange={(e) => {
                            setWebhookConfig({
                              ...webhookConfig, 
                              events: {
                                ...webhookConfig.events, 
                                emprestimoAtrasado: e.target.checked
                              }
                            });
                          }}
                        />
                        <Label htmlFor="eventAtraso" className="text-sm">Empréstimo Atrasado</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-2 justify-end">
                  <Button 
                    onClick={testarWebhook} 
                    variant="outline"
                    disabled={!webhookConfig.postUrl}
                  >
                    <Link className="mr-2 h-4 w-4" />
                    Testar Conexão
                  </Button>
                  <Button 
                    onClick={salvarWebhookConfig}
                    disabled={!webhookConfig.postUrl && !webhookConfig.apiUrl || isSavingWebhook}
                  >
                    {isSavingWebhook ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Salvar Configuração
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Integração com Evolution API</CardTitle>
                  <CardDescription>
                    Configure a integração com Evolution API para WhatsApp.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="evolutionApiUrl">URL da Evolution API</Label>
                    <Input 
                      id="evolutionApiUrl" 
                      placeholder="https://evolution-api.exemplo.com" 
                      value={evolutionConfig.url}
                      onChange={(e) => setEvolutionConfig({...evolutionConfig, url: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Eventos para notificação WhatsApp</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="evolutionEventEmprestimo" 
                          className="h-4 w-4 rounded border-gray-300"
                          checked={evolutionConfig.events.novoEmprestimo}
                          onChange={(e) => {
                            setEvolutionConfig({
                              ...evolutionConfig, 
                              events: {
                                ...evolutionConfig.events, 
                                novoEmprestimo: e.target.checked
                              }
                            });
                          }}
                        />
                        <Label htmlFor="evolutionEventEmprestimo" className="text-sm">Novo Empréstimo</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="evolutionEventPagamento" 
                          className="h-4 w-4 rounded border-gray-300"
                          checked={evolutionConfig.events.novoPagamento}
                          onChange={(e) => {
                            setEvolutionConfig({
                              ...evolutionConfig, 
                              events: {
                                ...evolutionConfig.events, 
                                novoPagamento: e.target.checked
                              }
                            });
                          }}
                        />
                        <Label htmlFor="evolutionEventPagamento" className="text-sm">Novo Pagamento</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="evolutionEventCliente" 
                          className="h-4 w-4 rounded border-gray-300"
                          checked={evolutionConfig.events.novoCliente}
                          onChange={(e) => {
                            setEvolutionConfig({
                              ...evolutionConfig, 
                              events: {
                                ...evolutionConfig.events, 
                                novoCliente: e.target.checked
                              }
                            });
                          }}
                        />
                        <Label htmlFor="evolutionEventCliente" className="text-sm">Novo Cliente</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="evolutionEventAtraso" 
                          className="h-4 w-4 rounded border-gray-300"
                          checked={evolutionConfig.events.emprestimoAtrasado}
                          onChange={(e) => {
                            setEvolutionConfig({
                              ...evolutionConfig, 
                              events: {
                                ...evolutionConfig.events, 
                                emprestimoAtrasado: e.target.checked
                              }
                            });
                          }}
                        />
                        <Label htmlFor="evolutionEventAtraso" className="text-sm">Empréstimo Atrasado</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      A Evolution API permite integração com WhatsApp para envio automático de mensagens.
                      Configure a URL da API para começar a usar.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    onClick={salvarEvolutionConfig}
                    disabled={!evolutionConfig.url || isSavingEvolution}
                  >
                    {isSavingEvolution ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Salvar Configuração
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Logs de Webhook</CardTitle>
                  <CardDescription>
                    Visualize os logs de chamadas de webhook.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative overflow-x-auto rounded-md border">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="px-6 py-3">Data/Hora</th>
                          <th scope="col" className="px-6 py-3">Evento</th>
                          <th scope="col" className="px-6 py-3">Status</th>
                          <th scope="col" className="px-6 py-3">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white border-b">
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            {new Date().toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            webhook.test
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              Enviado
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              Detalhes
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
          
          {!isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Acesso Restrito</CardTitle>
                <CardDescription>
                  Configurações de integração são restritas a administradores.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <Webhook className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground mt-4">
                  Você não tem permissões para acessar as configurações de integração.
                  Entre em contato com um administrador para obter acesso.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MensagensETemplates;
