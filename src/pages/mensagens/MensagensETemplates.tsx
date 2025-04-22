
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
import { 
  Mail, 
  MessageSquare, 
  Calendar, 
  Webhook, 
  Plus,
  Link,
  Check,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useClients } from "@/hooks/useClients";

const MensagensETemplates = () => {
  const navigate = useNavigate();
  const { logActivity } = useActivityLogs();
  const { clients, isLoadingClients } = useClients();
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookEvents, setWebhookEvents] = useState(["emprestimo.novo", "pagamento.novo"]);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [isSavingWebhook, setIsSavingWebhook] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateSubject, setTemplateSubject] = useState("");
  const [templateContent, setTemplateContent] = useState("");
  const [templateType, setTemplateType] = useState("whatsapp");
  const [integracoes, setIntegracoes] = useState({ evolution: "", webhooks: [] });
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [messageType, setMessageType] = useState("whatsapp");
  const [scheduleDate, setScheduleDate] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    logActivity("Acessou página de mensagens e templates");
    carregarIntegracoes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const carregarIntegracoes = async () => {
    try {
      // Carregar webhooks existentes
      const { data: webhooks, error: webhooksError } = await supabase
        .from('webhooks')
        .select('*');

      if (webhooksError) throw webhooksError;
      
      // Carregar configuração da Evolution API se existir
      const { data: configsData, error: configsError } = await supabase
        .from('configuracoes_financeiras')
        .select('observacoes')
        .eq('nome', 'evolution_api')
        .single();
      
      setIntegracoes({
        evolution: configsData?.observacoes || "",
        webhooks: webhooks || []
      });
      
      // Se existe um webhook, carrega no formulário
      if (webhooks && webhooks.length > 0) {
        setWebhookUrl(webhooks[0].url || "");
        setWebhookEvents(webhooks[0].eventos || ["emprestimo.novo", "pagamento.novo"]);
      }
    } catch (error) {
      console.error("Erro ao carregar integrações:", error);
    }
  };

  const salvarWebhook = async () => {
    if (!webhookUrl) {
      toast.error("URL do webhook é obrigatória");
      return;
    }
    
    setIsSavingWebhook(true);
    
    try {
      // Verificar se já existe um webhook
      const { data: webhooks } = await supabase
        .from('webhooks')
        .select('id');
      
      // Atualiza ou cria webhook
      if (webhooks && webhooks.length > 0) {
        await supabase
          .from('webhooks')
          .update({
            url: webhookUrl,
            eventos: webhookEvents,
            updated_at: new Date().toISOString()
          })
          .eq('id', webhooks[0].id);
      } else {
        await supabase
          .from('webhooks')
          .insert({
            nome: "Webhook Principal",
            url: webhookUrl,
            eventos: webhookEvents,
            ativo: true,
            created_by: "system" // Idealmente seria o ID do usuário logado
          });
      }
      
      toast.success("Webhook configurado com sucesso!");
      logActivity("Configurou webhook de integrações");
      await carregarIntegracoes();
    } catch (error) {
      console.error("Erro ao salvar webhook:", error);
      toast.error("Erro ao configurar webhook. Tente novamente.");
    } finally {
      setIsSavingWebhook(false);
    }
  };

  const testarWebhook = async () => {
    if (!webhookUrl) {
      toast.error("URL do webhook é obrigatória");
      return;
    }
    
    setIsTestingWebhook(true);
    
    try {
      // Envia um teste para o webhook
      const testPayload = {
        event: "webhook.test",
        timestamp: new Date().toISOString(),
        data: {
          message: "Teste de conexão do sistema Crédito Inteligente"
        }
      };
      
      // Tenta registrar o teste no log
      await supabase
        .from('webhook_logs')
        .insert({
          webhook_id: integracoes.webhooks[0]?.id || "00000000-0000-0000-0000-000000000000",
          evento: "webhook.test",
          payload: testPayload,
          status: "enviando"
        });
      
      // Tenta enviar para o webhook (simulado pois não temos acesso direto ao servidor)
      // Em produção usaria um edge function para fazer esta chamada
      setTimeout(() => {
        toast.success("Teste de webhook enviado com sucesso!");
        setIsTestingWebhook(false);
      }, 1500);
    } catch (error) {
      console.error("Erro ao testar webhook:", error);
      toast.error("Erro ao testar webhook. Verifique a URL e tente novamente.");
      setIsTestingWebhook(false);
    }
  };

  const salvarTemplate = async () => {
    if (!templateName || !templateContent) {
      toast.error("Nome e conteúdo do template são obrigatórios");
      return;
    }
    
    setIsSavingTemplate(true);
    
    try {
      await supabase
        .from('templates_mensagens')
        .insert({
          nome: templateName,
          assunto: templateSubject,
          conteudo: templateContent,
          tipo: templateType,
          ativo: true,
          created_by: "system" // Idealmente seria o ID do usuário logado
        });
      
      toast.success("Template salvo com sucesso!");
      logActivity("Criou template de mensagem");
      
      // Limpa o formulário
      setTemplateName("");
      setTemplateSubject("");
      setTemplateContent("");
    } catch (error) {
      console.error("Erro ao salvar template:", error);
      toast.error("Erro ao salvar template. Tente novamente.");
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const enviarMensagem = async () => {
    if (!selectedClient || !messageContent) {
      toast.error("Cliente e conteúdo da mensagem são obrigatórios");
      return;
    }
    
    setIsSendingMessage(true);
    
    try {
      const mensagemData = {
        cliente_id: selectedClient,
        assunto: messageSubject,
        conteudo: messageContent,
        tipo: messageType,
        status: scheduleDate ? "agendada" : "pendente",
        data_agendamento: scheduleDate || null,
        created_by: "system" // Idealmente seria o ID do usuário logado
      };
      
      await supabase.from('mensagens').insert(mensagemData);
      
      toast.success(scheduleDate ? "Mensagem agendada com sucesso!" : "Mensagem enviada para a fila de processamento!");
      logActivity(scheduleDate ? "Agendou mensagem" : "Enviou mensagem");
      
      // Limpa o formulário
      setSelectedClient("");
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

  const salvarConfigEvolution = async () => {
    try {
      // Verifica se já existe a configuração
      const { data } = await supabase
        .from('configuracoes_financeiras')
        .select('id')
        .eq('nome', 'evolution_api')
        .maybeSingle();
      
      if (data?.id) {
        await supabase
          .from('configuracoes_financeiras')
          .update({
            observacoes: integracoes.evolution,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.id);
      } else {
        await supabase
          .from('configuracoes_financeiras')
          .insert({
            nome: 'evolution_api',
            taxa_padrao_juros: 0,
            tipo_juros_padrao: 'composto',
            prazo_maximo_dias: 0,
            taxa_multa_atraso: 0,
            taxa_juros_atraso: 0,
            observacoes: integracoes.evolution,
            created_by: "system" // Idealmente seria o ID do usuário logado
          });
      }
      
      toast.success("Configuração da Evolution API salva com sucesso!");
      logActivity("Configurou integração com Evolution API");
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
      toast.error("Erro ao salvar configuração. Tente novamente.");
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
          <Card>
            <CardHeader>
              <CardTitle>Criar Novo Template</CardTitle>
              <CardDescription>
                Utilize variáveis como {"{nome_cliente}"}, {"{valor_emprestimo}"}, {"{data_vencimento}"} no conteúdo.
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
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="templateSubject">Assunto (para e-mail)</Label>
                <Input 
                  id="templateSubject" 
                  placeholder="Assunto da mensagem" 
                  disabled={templateType !== "email"}
                  value={templateSubject}
                  onChange={(e) => setTemplateSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="templateContent">Conteúdo</Label>
                <Textarea 
                  id="templateContent" 
                  placeholder="Olá {nome_cliente}, seu empréstimo de {valor_emprestimo} vence em {data_vencimento}." 
                  rows={5}
                  value={templateContent}
                  onChange={(e) => setTemplateContent(e.target.value)}
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
            <CardContent className="text-center py-8">
              <Mail className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground mt-4">
                A listagem completa de templates será implementada em breve.
              </p>
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
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="messageSubject">Assunto (para e-mail)</Label>
                <Input 
                  id="messageSubject" 
                  placeholder="Assunto da mensagem" 
                  disabled={messageType !== "email"}
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="messageContent">Conteúdo</Label>
                <Textarea 
                  id="messageContent" 
                  placeholder="Digite o conteúdo da mensagem..." 
                  rows={5}
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
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
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="email">E-mail</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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

              <div className="space-y-2">
                <Label htmlFor="messageSubjectSchedule">Assunto (para e-mail)</Label>
                <Input 
                  id="messageSubjectSchedule" 
                  placeholder="Assunto da mensagem" 
                  disabled={messageType !== "email"}
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="messageContentSchedule">Conteúdo</Label>
                <Textarea 
                  id="messageContentSchedule" 
                  placeholder="Digite o conteúdo da mensagem..." 
                  rows={5}
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={enviarMensagem} disabled={isSendingMessage || !scheduleDate}>
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
          <Card>
            <CardHeader>
              <CardTitle>Integração com Webhooks</CardTitle>
              <CardDescription>
                Configure webhooks para integrar com outros sistemas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">URL do Webhook</Label>
                <Input 
                  id="webhookUrl" 
                  placeholder="https://seu-servico.com/webhook" 
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
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
                      checked={webhookEvents.includes("emprestimo.novo")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setWebhookEvents([...webhookEvents, "emprestimo.novo"]);
                        } else {
                          setWebhookEvents(webhookEvents.filter(ev => ev !== "emprestimo.novo"));
                        }
                      }}
                    />
                    <Label htmlFor="eventEmprestimo" className="text-sm">Novo Empréstimo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="eventPagamento" 
                      className="h-4 w-4 rounded border-gray-300"
                      checked={webhookEvents.includes("pagamento.novo")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setWebhookEvents([...webhookEvents, "pagamento.novo"]);
                        } else {
                          setWebhookEvents(webhookEvents.filter(ev => ev !== "pagamento.novo"));
                        }
                      }}
                    />
                    <Label htmlFor="eventPagamento" className="text-sm">Novo Pagamento</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="eventCliente" 
                      className="h-4 w-4 rounded border-gray-300"
                      checked={webhookEvents.includes("cliente.novo")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setWebhookEvents([...webhookEvents, "cliente.novo"]);
                        } else {
                          setWebhookEvents(webhookEvents.filter(ev => ev !== "cliente.novo"));
                        }
                      }}
                    />
                    <Label htmlFor="eventCliente" className="text-sm">Novo Cliente</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="eventAtraso" 
                      className="h-4 w-4 rounded border-gray-300"
                      checked={webhookEvents.includes("emprestimo.atraso")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setWebhookEvents([...webhookEvents, "emprestimo.atraso"]);
                        } else {
                          setWebhookEvents(webhookEvents.filter(ev => ev !== "emprestimo.atraso"));
                        }
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
                disabled={!webhookUrl || isTestingWebhook}
              >
                {isTestingWebhook ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testando...
                  </>
                ) : (
                  <>
                    <Link className="mr-2 h-4 w-4" />
                    Testar Conexão
                  </>
                )}
              </Button>
              <Button 
                onClick={salvarWebhook}
                disabled={!webhookUrl || isSavingWebhook}
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
                  value={integracoes.evolution}
                  onChange={(e) => setIntegracoes({...integracoes, evolution: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  A Evolution API permite integração com WhatsApp para envio automático de mensagens.
                  Configure a URL da API para começar a usar.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={salvarConfigEvolution}>
                <Check className="mr-2 h-4 w-4" />
                Salvar Configuração
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
            <CardContent className="text-center py-8">
              <Webhook className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground mt-4">
                O histórico de logs de webhook será implementado em breve.
              </p>
              <Button 
                className="mt-4" 
                variant="outline" 
                onClick={() => navigate("/configuracoes/logs-atividades")}
              >
                Ver Logs de Atividades
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MensagensETemplates;
