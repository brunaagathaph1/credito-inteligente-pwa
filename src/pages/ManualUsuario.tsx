import React, { useState } from 'react';
import { PageHeader } from "@/components/common/PageHeader";
import { Book, FileText, HelpCircle, Info, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

const ManualUsuario = () => {
  const [activeTab, setActiveTab] = useState("inicio");
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Manual do Usuário" 
        description="Instruções e guia completo para utilização do sistema"
      />

      <div className="flex items-center space-x-2 mb-6">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Pesquisar no manual..." 
          className="max-w-md"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="bg-card rounded-md p-1">
          {isMobile ? (
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="inline-flex w-max">
                <TabsTrigger value="inicio">
                  <Info className="h-4 w-4 mr-2" />
                  Início
                </TabsTrigger>
                <TabsTrigger value="clientes">
                  <FileText className="h-4 w-4 mr-2" />
                  Clientes
                </TabsTrigger>
                <TabsTrigger value="emprestimos">
                  <FileText className="h-4 w-4 mr-2" />
                  Empréstimos
                </TabsTrigger>
                <TabsTrigger value="mensagens">
                  <FileText className="h-4 w-4 mr-2" />
                  Mensagens
                </TabsTrigger>
                <TabsTrigger value="faq">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  FAQ
                </TabsTrigger>
              </TabsList>
            </ScrollArea>
          ) : (
            <TabsList className="w-full">
              <TabsTrigger value="inicio">
                <Info className="h-4 w-4 mr-2" />
                Início
              </TabsTrigger>
              <TabsTrigger value="clientes">
                <FileText className="h-4 w-4 mr-2" />
                Clientes
              </TabsTrigger>
              <TabsTrigger value="emprestimos">
                <FileText className="h-4 w-4 mr-2" />
                Empréstimos
              </TabsTrigger>
              <TabsTrigger value="mensagens">
                <FileText className="h-4 w-4 mr-2" />
                Mensagens
              </TabsTrigger>
              <TabsTrigger value="faq">
                <HelpCircle className="h-4 w-4 mr-2" />
                FAQ
              </TabsTrigger>
            </TabsList>
          )}
        </div>

        <TabsContent value="inicio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bem-vindo ao Manual do Usuário</CardTitle>
              <CardDescription>
                Este manual contém todas as informações necessárias para utilizar o sistema de forma eficiente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                O sistema foi desenvolvido para facilitar a gestão de empréstimos, clientes e pagamentos.
                Navegue pelas abas acima para encontrar instruções específicas para cada área do sistema.
              </p>
              
              <h3 className="text-lg font-semibold mt-4">Visão Geral do Sistema</h3>
              <p>
                O sistema está organizado nas seguintes seções principais:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Dashboard:</strong> Visão geral com estatísticas e informações importantes</li>
                <li><strong>Clientes:</strong> Cadastro e gerenciamento de clientes</li>
                <li><strong>Empréstimos:</strong> Criação e acompanhamento de empréstimos</li>
                <li><strong>Relatórios:</strong> Relatórios e gráficos para análise de dados</li>
                <li><strong>Mensagens:</strong> Envio de comunicações para clientes</li>
                <li><strong>Configurações:</strong> Personalização do sistema</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clientes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Clientes</CardTitle>
              <CardDescription>
                Aprenda a cadastrar, editar e gerenciar seus clientes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Como cadastrar um novo cliente?</AccordionTrigger>
                  <AccordionContent>
                    <p>Para cadastrar um novo cliente, siga os passos abaixo:</p>
                    <ol className="list-decimal pl-6 space-y-2 mt-2">
                      <li>Acesse o menu "Clientes" no painel lateral</li>
                      <li>Clique no botão "Novo Cliente"</li>
                      <li>Preencha os campos obrigatórios (Nome, CPF, etc.)</li>
                      <li>Clique em "Salvar" para finalizar o cadastro</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Como editar informações de um cliente?</AccordionTrigger>
                  <AccordionContent>
                    <p>Para editar as informações de um cliente existente:</p>
                    <ol className="list-decimal pl-6 space-y-2 mt-2">
                      <li>Acesse o menu "Clientes"</li>
                      <li>Localize o cliente na lista ou use a busca</li>
                      <li>Clique no nome do cliente para acessar os detalhes</li>
                      <li>Clique no botão "Editar" no canto superior direito</li>
                      <li>Faça as alterações necessárias</li>
                      <li>Clique em "Salvar" para confirmar as mudanças</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Como visualizar o histórico de um cliente?</AccordionTrigger>
                  <AccordionContent>
                    <p>Para visualizar o histórico completo de um cliente:</p>
                    <ol className="list-decimal pl-6 space-y-2 mt-2">
                      <li>Acesse o menu "Clientes"</li>
                      <li>Clique no nome do cliente para acessar os detalhes</li>
                      <li>Na página de detalhes, você encontrará abas com:</li>
                      <ul className="list-disc pl-6 space-y-1 mt-1">
                        <li>Informações pessoais</li>
                        <li>Empréstimos ativos e anteriores</li>
                        <li>Histórico de pagamentos</li>
                        <li>Histórico de comunicações</li>
                      </ul>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emprestimos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Empréstimos</CardTitle>
              <CardDescription>
                Aprenda a criar, acompanhar e gerenciar empréstimos no sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Como criar um novo empréstimo?</AccordionTrigger>
                  <AccordionContent>
                    <p>Para criar um novo empréstimo, siga os passos abaixo:</p>
                    <ol className="list-decimal pl-6 space-y-2 mt-2">
                      <li>Acesse o menu "Empréstimos" no painel lateral</li>
                      <li>Clique no botão "Novo Empréstimo"</li>
                      <li>Selecione o cliente (ou cadastre um novo)</li>
                      <li>Preencha os valores do empréstimo:</li>
                      <ul className="list-disc pl-6 space-y-1 mt-1">
                        <li>Valor principal</li>
                        <li>Taxa de juros</li>
                        <li>Tipo de juros (simples ou composto)</li>
                        <li>Data de vencimento</li>
                      </ul>
                      <li>Clique em "Salvar" para finalizar</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Como registrar um pagamento?</AccordionTrigger>
                  <AccordionContent>
                    <p>Para registrar um pagamento em um empréstimo:</p>
                    <ol className="list-decimal pl-6 space-y-2 mt-2">
                      <li>Acesse o menu "Empréstimos"</li>
                      <li>Clique no empréstimo desejado para acessar os detalhes</li>
                      <li>Clique no botão "Registrar Pagamento"</li>
                      <li>Preencha o valor do pagamento</li>
                      <li>Selecione a data do pagamento</li>
                      <li>Escolha o tipo de pagamento (parcial ou total)</li>
                      <li>Clique em "Confirmar" para registrar o pagamento</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Como calcular juros e multas por atraso?</AccordionTrigger>
                  <AccordionContent>
                    <p>O sistema calcula automaticamente juros e multas por atraso, mas você pode entender como funciona:</p>
                    <ol className="list-decimal pl-6 space-y-2 mt-2">
                      <li>Quando um empréstimo está atrasado, o sistema aplica:</li>
                      <ul className="list-disc pl-6 space-y-1 mt-1">
                        <li>Multa por atraso (configurável nas Configurações Financeiras)</li>
                        <li>Juros diários de atraso (configurável nas Configurações Financeiras)</li>
                      </ul>
                      <li>Para visualizar o cálculo detalhado:</li>
                      <ul className="list-disc pl-6 space-y-1 mt-1">
                        <li>Acesse os detalhes do empréstimo</li>
                        <li>Vá para a aba "Cálculos"</li>
                        <li>Você verá o valor original, juros, multas e total a pagar</li>
                      </ul>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Como renegociar um empréstimo?</AccordionTrigger>
                  <AccordionContent>
                    <p>Para renegociar um empréstimo existente:</p>
                    <ol className="list-decimal pl-6 space-y-2 mt-2">
                      <li>Acesse o menu "Empréstimos"</li>
                      <li>Clique no empréstimo que deseja renegociar</li>
                      <li>Clique no botão "Renegociar"</li>
                      <li>Defina os novos termos do empréstimo:</li>
                      <ul className="list-disc pl-6 space-y-1 mt-1">
                        <li>Novo valor principal (geralmente o saldo devedor atual)</li>
                        <li>Nova taxa de juros</li>
                        <li>Nova data de vencimento</li>
                      </ul>
                      <li>Adicione um motivo para a renegociação</li>
                      <li>Clique em "Confirmar Renegociação"</li>
                    </ol>
                    <p className="mt-2">Nota: O empréstimo original será marcado como "Renegociado" e um novo empréstimo será criado com os novos termos.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mensagens" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sistema de Mensagens</CardTitle>
              <CardDescription>
                Aprenda a enviar mensagens e configurar comunicações automáticas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Como criar um template de mensagem?</AccordionTrigger>
                  <AccordionContent>
                    <p>Para criar um novo template de mensagem:</p>
                    <ol className="list-decimal pl-6 space-y-2 mt-2">
                      <li>Acesse o menu "Mensagens"</li>
                      <li>Vá para a aba "Templates"</li>
                      <li>Clique em "Novo Template"</li>
                      <li>Preencha as informações:</li>
                      <ul className="list-disc pl-6 space-y-1 mt-1">
                        <li>Nome do template</li>
                        <li>Tipo de mensagem (email, WhatsApp, SMS)</li>
                        <li>Assunto (para emails)</li>
                        <li>Conteúdo da mensagem</li>
                      </ul>
                      <li>Use variáveis disponíveis para personalizar a mensagem</li>
                      <li>Clique em "Salvar Template"</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Como enviar uma mensagem para um cliente?</AccordionTrigger>
                  <AccordionContent>
                    <p>Para enviar uma mensagem para um cliente:</p>
                    <ol className="list-decimal pl-6 space-y-2 mt-2">
                      <li>Acesse o menu "Mensagens"</li>
                      <li>Vá para a aba "Mensagens"</li>
                      <li>Clique em "Nova Mensagem"</li>
                      <li>Selecione o cliente destinatário</li>
                      <li>Escolha o tipo de mensagem (email, WhatsApp, SMS)</li>
                      <li>Opcionalmente, selecione um template existente</li>
                      <li>Preencha o assunto e conteúdo da mensagem</li>
                      <li>Clique em "Enviar Mensagem"</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Como configurar mensagens automáticas?</AccordionTrigger>
                  <AccordionContent>
                    <p>Para configurar mensagens automáticas baseadas em eventos:</p>
                    <ol className="list-decimal pl-6 space-y-2 mt-2">
                      <li>Acesse o menu "Mensagens"</li>
                      <li>Vá para a aba "Agendamentos"</li>
                      <li>Clique em "Novo Agendamento"</li>
                      <li>Configure o agendamento:</li>
                      <ul className="list-disc pl-6 space-y-1 mt-1">
                        <li>Nome do agendamento</li>
                        <li>Tipo (automático por evento ou recorrente)</li>
                        <li>Evento disparador (ex: empréstimo vencendo, pagamento confirmado)</li>
                        <li>Dias de antecedência (para eventos como vencimento)</li>
                        <li>Template a ser utilizado</li>
                      </ul>
                      <li>Clique em "Salvar Agendamento"</li>
                    </ol>
                    <p className="mt-2">Nota: As mensagens automáticas serão enviadas quando os eventos configurados ocorrerem, sem necessidade de intervenção manual.</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Como usar variáveis nas mensagens?</AccordionTrigger>
                  <AccordionContent>
                    <p>Para personalizar mensagens com dados dinâmicos:</p>
                    <ol className="list-decimal pl-6 space-y-2 mt-2">
                      <li>Ao criar um template ou mensagem, você verá a seção "Variáveis Disponíveis"</li>
                      <li>Clique em uma variável para inseri-la no conteúdo da mensagem</li>
                      <li>As variáveis são substituídas pelos dados reais quando a mensagem é enviada</li>
                    </ol>
                    <p className="mt-2">Exemplos de variáveis:</p>
                    <ul className="list-disc pl-6 space-y-1 mt-1">
                      <li><code>{"{{cliente.nome}}"}</code> - Nome do cliente</li>
                      <li><code>{"{{emprestimo.valor_principal}}"}</code> - Valor do empréstimo</li>
                      <li><code>{"{{emprestimo.data_vencimento}}"}</code> - Data de vencimento</li>
                      <li><code>{"{{pagamento.valor}}"}</code> - Valor do pagamento</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
              <CardDescription>
                Respostas para as dúvidas mais comuns sobre o sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Como recuperar minha senha?</AccordionTrigger>
                  <AccordionContent>
                    <p>Para recuperar sua senha:</p>
                    <ol className="list-decimal pl-6 space-y-2 mt-2">
                      <li>Na tela de login, clique em "Esqueceu sua senha?"</li>
                      <li>Digite seu e-mail cadastrado</li>
                      <li>Clique em "Enviar link de recuperação"</li>
                      <li>Verifique seu e-mail e siga as instruções enviadas</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>O sistema funciona em dispositivos móveis?</AccordionTrigger>
                  <AccordionContent>
                    <p>Sim, o sistema é totalmente responsivo e funciona em smartphones e tablets. A interface se adapta automaticamente ao tamanho da tela do dispositivo.</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Como exportar relatórios?</AccordionTrigger>
                  <AccordionContent>
                    <p>Para exportar relatórios:</p>
                    <ol className="list-decimal pl-6 space-y-2 mt-2">
                      <li>Acesse o menu "Relatórios"</li>
                      <li>Selecione o tipo de relatório desejado</li>
                      <li>Aplique os filtros necessários</li>
                      <li>Clique no botão "Exportar" no canto superior direito</li>
                      <li>Escolha o formato desejado (PDF, Excel, CSV)</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Como configurar as taxas de juros padrão?</AccordionTrigger>
                  <AccordionContent>
                    <p>Para configurar as taxas de juros padrão:</p>
                    <ol className="list-decimal pl-6 space-y-2 mt-2">
                      <li>Acesse o menu "Configurações"</li>
                      <li>Clique em "Configurações Financeiras"</li>
                      <li>Crie ou edite uma configuração financeira</li>
                      <li>Defina os valores para:</li>
                      <ul className="list-disc pl-6 space-y-1 mt-1">
                        <li>Taxa padrão de juros</li>
                        <li>Tipo de juros padrão (simples ou composto)</li>
                        <li>Taxa de juros para atraso</li>
                        <li>Taxa de multa para atraso</li>
                      </ul>
                      <li>Clique em "Salvar"</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>O sistema envia lembretes automáticos de vencimento?</AccordionTrigger>
                  <AccordionContent>
                    <p>Sim, o sistema pode enviar lembretes automáticos de vencimento. Para configurar:</p>
                    <ol className="list-decimal pl-6 space-y-2 mt-2">
                      <li>Acesse o menu "Mensagens"</li>
                      <li>Vá para a aba "Agendamentos"</li>
                      <li>Crie um novo agendamento com o evento "emprestimo_vencendo"</li>
                      <li>Configure quantos dias antes do vencimento o lembrete deve ser enviado</li>
                      <li>Selecione o template de mensagem a ser utilizado</li>
                      <li>Ative o agendamento</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManualUsuario;
