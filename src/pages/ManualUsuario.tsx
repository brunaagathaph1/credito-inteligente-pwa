
import React from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, Users, CreditCard, BarChart2, MessageSquare, Settings } from 'lucide-react';

const ManualUsuario = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Manual do Usuário" 
        description="Guia completo de todas as funcionalidades do sistema"
      />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Manual do Sistema Crédito Inteligente
          </CardTitle>
          <CardDescription>
            Explore este manual para aprender a usar todas as funcionalidades disponíveis no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="introducao" className="mt-2">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-64 flex-shrink-0">
                <div className="sticky top-4">
                  <div className="mb-4 relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="search"
                      placeholder="Buscar no manual..."
                      className="pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                  <TabsList className="flex flex-col h-auto w-full bg-muted p-0 gap-1">
                    <TabsTrigger value="introducao" className="justify-start w-full px-3 h-9 data-[state=active]:text-primary">
                      Introdução
                    </TabsTrigger>
                    <TabsTrigger value="dashboard" className="justify-start w-full px-3 h-9 data-[state=active]:text-primary">
                      Dashboard
                    </TabsTrigger>
                    <TabsTrigger value="clientes" className="justify-start w-full px-3 h-9 data-[state=active]:text-primary">
                      Clientes
                    </TabsTrigger>
                    <TabsTrigger value="emprestimos" className="justify-start w-full px-3 h-9 data-[state=active]:text-primary">
                      Empréstimos
                    </TabsTrigger>
                    <TabsTrigger value="relatorios" className="justify-start w-full px-3 h-9 data-[state=active]:text-primary">
                      Relatórios
                    </TabsTrigger>
                    <TabsTrigger value="mensagens" className="justify-start w-full px-3 h-9 data-[state=active]:text-primary">
                      Mensagens
                    </TabsTrigger>
                    <TabsTrigger value="configuracoes" className="justify-start w-full px-3 h-9 data-[state=active]:text-primary">
                      Configurações
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
              
              <div className="flex-1">
                <ScrollArea className="h-[600px] rounded-md border p-4">
                  <TabsContent value="introducao" className="mt-0 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">Bem-vindo ao Sistema Crédito Inteligente</h3>
                      <p className="mt-2 text-muted-foreground">
                        O Sistema Crédito Inteligente é uma plataforma completa para gestão de empréstimos. Este manual vai te ajudar a entender e utilizar todas as funcionalidades disponíveis.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Visão Geral do Sistema</h4>
                      <p className="text-muted-foreground">
                        Nosso sistema foi desenvolvido para facilitar o gerenciamento de empréstimos, com funcionalidades como cadastro de clientes, controle de empréstimos, gestão de pagamentos, relatórios e muito mais.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Como Navegar</h4>
                      <p className="text-muted-foreground">
                        A navegação no sistema é feita através do menu lateral (ou menu inferior em dispositivos móveis). As principais áreas são:
                      </p>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                        <li><strong>Dashboard:</strong> Visão geral dos empréstimos e pagamentos</li>
                        <li><strong>Clientes:</strong> Gerenciamento de clientes</li>
                        <li><strong>Empréstimos:</strong> Controle dos empréstimos e pagamentos</li>
                        <li><strong>Relatórios:</strong> Gráficos e relatórios financeiros</li>
                        <li><strong>Mensagens:</strong> Comunicação com clientes</li>
                        <li><strong>Configurações:</strong> Ajustes do sistema</li>
                      </ul>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium">Primeiros Passos</h4>
                      <ol className="list-decimal pl-5 mt-2 space-y-1 text-muted-foreground">
                        <li>Cadastre um cliente em "Clientes {'>'} Novo Cliente"</li>
                        <li>Crie um empréstimo em "Empréstimos {'>'} Novo Empréstimo"</li>
                        <li>Registre pagamentos no detalhe do empréstimo</li>
                        <li>Acompanhe pagamentos no Dashboard</li>
                      </ol>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="dashboard" className="mt-0 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center">
                        <BarChart2 className="w-5 h-5 mr-2" />
                        Dashboard
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        O Dashboard é a tela inicial do sistema e fornece uma visão geral dos empréstimos, pagamentos e indicadores financeiros.
                      </p>
                    </div>
                    
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="cards">
                        <AccordionTrigger>Cartões de Resumo</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-2">
                            Na parte superior do Dashboard, você encontrará cartões com resumos importantes:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li><strong>Total Emprestado:</strong> Soma de todos os empréstimos ativos</li>
                            <li><strong>Recebido no Mês:</strong> Total de pagamentos recebidos no mês atual</li>
                            <li><strong>Vencendo Hoje:</strong> Quantidade de empréstimos que vencem hoje</li>
                            <li><strong>Atrasados:</strong> Quantidade de empréstimos em atraso</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="graficos">
                        <AccordionTrigger>Gráficos</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-2">
                            Os gráficos do Dashboard mostram visualmente:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li><strong>Empréstimos por Status:</strong> Distribuição dos empréstimos por status (ativos, quitados, atrasados)</li>
                            <li><strong>Pagamentos por Mês:</strong> Histórico de pagamentos recebidos nos últimos meses</li>
                            <li><strong>Empréstimos por Cliente:</strong> Distribuição de empréstimos por cliente</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="listas">
                        <AccordionTrigger>Listas de Acompanhamento</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-2">
                            Na parte inferior do Dashboard, você encontrará listas para acompanhamento:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li><strong>Próximos Vencimentos:</strong> Lista dos empréstimos que vencem nos próximos dias</li>
                            <li><strong>Empréstimos em Atraso:</strong> Lista dos empréstimos com pagamentos em atraso</li>
                            <li><strong>Últimos Pagamentos:</strong> Registro dos pagamentos mais recentes</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TabsContent>
                  
                  <TabsContent value="clientes" className="mt-0 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        Clientes
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        O módulo de Clientes permite cadastrar e gerenciar todos os seus clientes.
                      </p>
                    </div>
                    
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="lista-clientes">
                        <AccordionTrigger>Lista de Clientes</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-2">
                            Na tela principal de Clientes, você verá a lista de todos os clientes cadastrados.
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Use a barra de pesquisa para buscar clientes por nome, telefone ou email</li>
                            <li>Clique no ícone de olho para ver os detalhes do cliente</li>
                            <li>Use o botão "Novo Cliente" para cadastrar um cliente</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="novo-cliente">
                        <AccordionTrigger>Cadastro de Cliente</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-2">
                            Para cadastrar um novo cliente, siga estes passos:
                          </p>
                          <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                            <li>Clique no botão "Novo Cliente"</li>
                            <li>Preencha os dados do cliente (nome, telefone, email, etc.)</li>
                            <li>O campo Nome é obrigatório</li>
                            <li>Preencha o endereço completo para facilitar contatos futuros</li>
                            <li>Use o campo Observações para adicionar informações adicionais</li>
                            <li>Clique em "Salvar" para finalizar o cadastro</li>
                          </ol>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="detalhe-cliente">
                        <AccordionTrigger>Detalhes do Cliente</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-2">
                            Na tela de detalhes do cliente, você verá:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li><strong>Dados Pessoais:</strong> Todas as informações de contato do cliente</li>
                            <li><strong>Empréstimos:</strong> Lista de todos os empréstimos do cliente</li>
                            <li><strong>Histórico de Pagamentos:</strong> Registro de todos os pagamentos realizados</li>
                            <li>Use o botão "Editar" para atualizar as informações do cliente</li>
                            <li>Use o botão "Novo Empréstimo" para criar um empréstimo para este cliente</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TabsContent>
                  
                  <TabsContent value="emprestimos" className="mt-0 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Empréstimos
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        O módulo de Empréstimos permite gerenciar todos os empréstimos e seus pagamentos.
                      </p>
                    </div>
                    
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="lista-emprestimos">
                        <AccordionTrigger>Lista de Empréstimos</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-2">
                            Na tela principal de Empréstimos, você verá a lista de todos os empréstimos cadastrados.
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Use a barra de pesquisa para buscar empréstimos por cliente ou status</li>
                            <li>Use os filtros para visualizar empréstimos por status (pendente, pago, atrasado)</li>
                            <li>Clique no ícone de olho para ver os detalhes do empréstimo</li>
                            <li>Use o botão "Novo Empréstimo" para cadastrar um empréstimo</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="novo-emprestimo">
                        <AccordionTrigger>Cadastro de Empréstimo</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-2">
                            Para cadastrar um novo empréstimo, siga estes passos:
                          </p>
                          <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                            <li>Clique no botão "Novo Empréstimo"</li>
                            <li>Selecione o cliente no campo Cliente</li>
                            <li>Preencha o Valor Principal do empréstimo</li>
                            <li>Defina a Taxa de Juros aplicada</li>
                            <li>Escolha o Tipo de Juros (simples ou composto)</li>
                            <li>Selecione a Data do Empréstimo (por padrão, é a data atual)</li>
                            <li>Defina a Data de Vencimento</li>
                            <li>Use o campo Observações para adicionar informações adicionais</li>
                            <li>Clique em "Salvar" para finalizar o cadastro</li>
                          </ol>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="detalhe-emprestimo">
                        <AccordionTrigger>Detalhes do Empréstimo</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-2">
                            Na tela de detalhes do empréstimo, você verá:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li><strong>Dados do Empréstimo:</strong> Todas as informações sobre o empréstimo</li>
                            <li><strong>Dados do Cliente:</strong> Informações do cliente vinculado</li>
                            <li><strong>Pagamentos:</strong> Lista de todos os pagamentos realizados</li>
                            <li><strong>Renegociações:</strong> Histórico de renegociações, se houver</li>
                            <li>Use o botão "Registrar Pagamento" para adicionar um novo pagamento</li>
                            <li>Use o botão "Renegociar" para fazer uma renegociação do empréstimo</li>
                            <li>Use o botão "Editar" para atualizar as informações do empréstimo</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="pagamentos">
                        <AccordionTrigger>Pagamentos</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-2">
                            Para registrar um pagamento, siga estes passos:
                          </p>
                          <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                            <li>Na tela de detalhes do empréstimo, clique em "Registrar Pagamento"</li>
                            <li>Preencha o Valor do pagamento</li>
                            <li>Selecione a Data do Pagamento</li>
                            <li>Escolha o Tipo de pagamento (parcial, total, juros)</li>
                            <li>Use o campo Observações para adicionar informações adicionais</li>
                            <li>Clique em "Salvar" para registrar o pagamento</li>
                          </ol>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="renegociacao">
                        <AccordionTrigger>Renegociação</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-2">
                            Para realizar uma renegociação, siga estes passos:
                          </p>
                          <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                            <li>Na tela de detalhes do empréstimo, clique em "Renegociar"</li>
                            <li>Defina o Novo Valor Principal (incluindo juros acumulados, se aplicável)</li>
                            <li>Ajuste a Nova Taxa de Juros, se necessário</li>
                            <li>Escolha o Novo Tipo de Juros, se desejar alterar</li>
                            <li>Defina a Nova Data de Vencimento</li>
                            <li>Preencha o Motivo da renegociação</li>
                            <li>Clique em "Confirmar Renegociação" para finalizar</li>
                          </ol>
                          <p className="text-muted-foreground mt-2">
                            Ao renegociar, o empréstimo atual será marcado como "Renegociado" e um novo empréstimo será criado com as novas condições.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TabsContent>
                  
                  <TabsContent value="relatorios" className="mt-0 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center">
                        <BarChart2 className="w-5 h-5 mr-2" />
                        Relatórios
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        O módulo de Relatórios fornece gráficos e análises detalhadas sobre seus empréstimos e pagamentos.
                      </p>
                    </div>
                    
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="graficos-gerais">
                        <AccordionTrigger>Gráficos Gerais</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-2">
                            Os gráficos gerais mostram uma visão ampla dos seus empréstimos:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li><strong>Evolução Mensal:</strong> Mostra o volume de empréstimos e pagamentos mês a mês</li>
                            <li><strong>Distribuição por Status:</strong> Gráfico de pizza mostrando a proporção de empréstimos por status</li>
                            <li><strong>Principais Clientes:</strong> Clientes com maior volume de empréstimos</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="relatorios-filtrados">
                        <AccordionTrigger>Relatórios Filtrados</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-2">
                            Você pode criar relatórios personalizados usando os filtros disponíveis:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Filtre por período (data inicial e final)</li>
                            <li>Filtre por cliente</li>
                            <li>Filtre por status do empréstimo</li>
                            <li>Filtre por valor (mínimo e máximo)</li>
                            <li>Após aplicar os filtros, clique em "Gerar Relatório"</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="exportacao">
                        <AccordionTrigger>Exportação de Dados</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-2">
                            Você pode exportar os relatórios gerados em diferentes formatos:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Clique no botão "Exportar" após gerar um relatório</li>
                            <li>Escolha o formato desejado (PDF, Excel, CSV)</li>
                            <li>O arquivo será gerado e baixado automaticamente</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TabsContent>
                  
                  <TabsContent value="mensagens" className="mt-0 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Mensagens
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        O módulo de Mensagens permite enviar comunicações para seus clientes via e-mail e WhatsApp.
                      </p>
                    </div>
                    
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="templates">
                        <AccordionTrigger>Templates de Mensagens</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-2">
                            Os templates permitem criar modelos de mensagens que podem ser reutilizados:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Clique em "Novo Template" para criar um modelo</li>
                            <li>Defina o Nome do template</li>
                            <li>Escolha o Tipo (e-mail ou WhatsApp)</li>
                            <li>Para e-mails, defina o Assunto</li>
                            <li>Escreva o Conteúdo da mensagem</li>
                            <li>Use as Variáveis Disponíveis para personalizar as mensagens</li>
                            <li>Clique em "Salvar Template" para finalizar</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="envio-mensagens">
                        <AccordionTrigger>Envio de Mensagens</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-2">
                            Para enviar uma mensagem, siga estes passos:
                          </p>
                          <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                            <li>Clique em "Nova Mensagem"</li>
                            <li>Selecione o Cliente destinatário</li>
                            <li>Escolha o Tipo de mensagem (e-mail ou WhatsApp)</li>
                            <li>Opcionalmente, selecione um Template para usar como base</li>
                            <li>Se desejar, defina um Agendamento para envio futuro</li>
                            <li>Para e-mails, preencha o Assunto</li>
                            <li>Escreva o Conteúdo da mensagem</li>
                            <li>Clique em "Enviar Mensagem" para finalizar</li>
                          </ol>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="agendamentos">
                        <AccordionTrigger>Agendamentos Automáticos</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-2">
                            Agendamentos permitem automatizar o envio de mensagens com base em eventos:
                          </p>
                          <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
                            <li>Clique em "Novo Agendamento"</li>
                            <li>Defina o Nome do agendamento</li>
                            <li>Escolha o Tipo (automático por evento ou recorrente)</li>
                            <li>Selecione o Evento Disparador (empréstimo criado, vencendo, etc.)</li>
                            <li>Para eventos de vencimento, defina os Dias de Antecedência</li>
                            <li>Selecione o Template a ser utilizado</li>
                            <li>Clique em "Salvar Agendamento" para finalizar</li>
                          </ol>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="integracoes">
                        <AccordionTrigger>Integrações</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-2">
                            Configure integrações para envio de mensagens via WhatsApp e recebimento de eventos externos:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li><strong>WhatsApp (Evolution API):</strong> Conecte sua conta do WhatsApp para envio de mensagens</li>
                            <li><strong>Webhooks:</strong> Configure URLs para receber notificações de eventos do sistema</li>
                            <li><strong>API externa:</strong> Configure uma API para consultas externas ao sistema</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TabsContent>
                  
                  <TabsContent value="configuracoes" className="mt-0 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center">
                        <Settings className="w-5 h-5 mr-2" />
                        Configurações
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        O módulo de Configurações permite personalizar o sistema de acordo com suas necessidades.
                      </p>
                    </div>
                    
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="categorias">
                        <AccordionTrigger>Categorias</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-2">
                            Gerencie categorias para organizar seus empréstimos:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Veja a lista de categorias existentes</li>
                            <li>Clique em "Nova Categoria" para criar uma categoria</li>
                            <li>Preencha o Nome e a Descrição da categoria</li>
                            <li>Use o botão "Editar" para modificar uma categoria existente</li>
                            <li>Use o botão "Excluir" para remover uma categoria (se não estiver em uso)</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="metodos-pagamento">
                        <AccordionTrigger>Métodos de Pagamento</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-2">
                            Gerencie os métodos de pagamento aceitos:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Veja a lista de métodos de pagamento existentes</li>
                            <li>Clique em "Novo Método" para criar um método de pagamento</li>
                            <li>Preencha o Nome e a Descrição do método</li>
                            <li>Use o botão "Editar" para modificar um método existente</li>
                            <li>Use o botão "Excluir" para remover um método (se não estiver em uso)</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="contas-bancarias">
                        <AccordionTrigger>Contas Bancárias</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-2">
                            Gerencie suas contas bancárias para recebimentos:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Veja a lista de contas bancárias cadastradas</li>
                            <li>Clique em "Nova Conta" para cadastrar uma conta</li>
                            <li>Preencha os dados da conta (banco, agência, número, titular, etc.)</li>
                            <li>Use o botão "Editar" para modificar uma conta existente</li>
                            <li>Use o botão "Excluir" para remover uma conta (se não estiver em uso)</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="configuracoes-financeiras">
                        <AccordionTrigger>Configurações Financeiras</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-2">
                            Configure parâmetros financeiros padrão:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li><strong>Prazo Máximo:</strong> Defina o prazo máximo em dias para empréstimos</li>
                            <li><strong>Taxa Padrão de Juros:</strong> Configure a taxa de juros padrão</li>
                            <li><strong>Tipo de Juros Padrão:</strong> Defina se o padrão é juros simples ou composto</li>
                            <li><strong>Taxa de Juros de Atraso:</strong> Configure a taxa aplicada em caso de atraso</li>
                            <li><strong>Taxa de Multa de Atraso:</strong> Defina a multa por atraso</li>
                            <li><strong>Notificações e Eventos:</strong> Configure quais eventos devem disparar notificações</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="logs-atividades">
                        <AccordionTrigger>Logs de Atividades</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-2">
                            Consulte o histórico de atividades do sistema:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Veja todas as ações realizadas no sistema</li>
                            <li>Filtre por data, usuário ou tipo de ação</li>
                            <li>Consulte detalhes de cada atividade</li>
                            <li>Os logs são úteis para auditoria e resolução de problemas</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="perfil">
                        <AccordionTrigger>Perfil</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-2">
                            Gerencie seus dados de perfil:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Visualize e edite seus dados pessoais</li>
                            <li>Altere sua senha de acesso</li>
                            <li>Configure preferências de notificação</li>
                            <li>Gerencie sua foto de perfil</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TabsContent>
                </ScrollArea>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="flex justify-center mt-6">
        <Button variant="outline" className="mr-2">
          Imprimir Manual
        </Button>
        <Button>
          Baixar PDF
        </Button>
      </div>
    </div>
  );
};

export default ManualUsuario;
