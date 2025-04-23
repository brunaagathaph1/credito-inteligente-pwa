
import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Book, DollarSign, Users, Calendar, Settings, Mail, BarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const ManualUsuario = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Manual do Usuário"
        description="Guia completo de uso do sistema"
        icon={<Book className="h-6 w-6" />}
      />

      <Tabs defaultValue="introducao" className="space-y-4">
        <TabsList className="w-full flex-wrap">
          <TabsTrigger value="introducao">Introdução</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="emprestimos">Empréstimos</TabsTrigger>
          <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          <TabsTrigger value="mensagens">Mensagens</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>

        {/* Introdução */}
        <TabsContent value="introducao">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5 text-primary" />
                Introdução ao Sistema
              </CardTitle>
              <CardDescription>
                Bem-vindo ao Crédito Inteligente - seu sistema de gestão de empréstimos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Sobre o Sistema</h3>
                <p>
                  O Crédito Inteligente é uma plataforma completa para gestão de empréstimos, controle de clientes, 
                  acompanhamento financeiro e geração de relatórios. Com uma interface intuitiva, o sistema permite 
                  que você organize todas as suas operações financeiras em um só lugar.
                </p>
                
                <h3 className="text-lg font-semibold pt-4">Principais Funcionalidades</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Gestão completa de clientes e seus dados</li>
                  <li>Controle de empréstimos com cálculo automático de juros</li>
                  <li>Registro e acompanhamento de pagamentos</li>
                  <li>Dashboard com indicadores financeiros</li>
                  <li>Relatórios personalizados</li>
                  <li>Sistema de mensagens e notificações para clientes</li>
                  <li>Configurações personalizáveis para taxas e parâmetros</li>
                </ul>
                
                <h3 className="text-lg font-semibold pt-4">Como usar este manual</h3>
                <p>
                  Navegue pelas diferentes seções usando as abas acima para encontrar instruções 
                  detalhadas sobre cada área do sistema. Cada seção contém exemplos práticos e 
                  explicações passo a passo de como utilizar as funcionalidades.
                </p>
                
                <div className="bg-muted/50 p-4 rounded-lg border mt-6">
                  <h4 className="font-medium mb-2">Dica de uso:</h4>
                  <p>
                    Este sistema funciona como um PWA (Progressive Web App) e pode ser instalado 
                    em seu dispositivo como um aplicativo nativo. Para fazer isso, clique nos três 
                    pontos (menu) do seu navegador e selecione "Instalar aplicativo".
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dashboard */}
        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Dashboard
              </CardTitle>
              <CardDescription>
                Visão geral de indicadores financeiros e atividades recentes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Visão Geral do Dashboard</h3>
                <p>
                  O Dashboard é a página inicial do sistema e oferece uma visão consolidada dos principais 
                  indicadores de desempenho do seu negócio. Aqui você encontra informações sobre empréstimos 
                  ativos, pagamentos recentes, valores a receber e atividades do sistema.
                </p>
                
                <h3 className="text-lg font-semibold pt-4">Principais Elementos</h3>
                
                <h4 className="font-medium mt-3">Cartões de Estatísticas</h4>
                <p>
                  No topo do Dashboard, você encontrará cartões com estatísticas importantes:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li><strong>Total de Empréstimos Ativos:</strong> Número e valor total de empréstimos em andamento</li>
                  <li><strong>Total Recebido (mês):</strong> Valor recebido no mês atual</li>
                  <li><strong>Total a Receber:</strong> Valor total a ser recebido de todos os empréstimos ativos</li>
                  <li><strong>Empréstimos em Atraso:</strong> Número e valor total de empréstimos com pagamentos atrasados</li>
                </ul>
                
                <h4 className="font-medium mt-3">Gráfico de Desempenho</h4>
                <p>
                  O gráfico exibe a evolução dos empréstimos e pagamentos ao longo do tempo, permitindo 
                  visualizar tendências e sazonalidades.
                </p>
                
                <h4 className="font-medium mt-3">Empréstimos Recentes</h4>
                <p>
                  Lista dos últimos empréstimos registrados no sistema, com link para acessar rapidamente os detalhes.
                </p>
                
                <h4 className="font-medium mt-3">Atividades Recentes</h4>
                <p>
                  Registro das últimas ações realizadas no sistema, como criação de clientes, empréstimos e pagamentos.
                </p>
                
                <h3 className="text-lg font-semibold pt-4">Ações Disponíveis</h3>
                <p>
                  A partir do Dashboard, você pode:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>Criar um novo empréstimo clicando no botão "Novo Empréstimo"</li>
                  <li>Acessar detalhes de empréstimos recentes</li>
                  <li>Visualizar gráficos e exportar relatórios</li>
                  <li>Monitorar atividades do sistema</li>
                </ul>
                
                <div className="bg-muted/50 p-4 rounded-lg border mt-6">
                  <h4 className="font-medium mb-2">Dica de uso:</h4>
                  <p>
                    O Dashboard é personalizável. Você pode definir o período de análise e filtrar 
                    informações para obter insights mais relevantes para o seu negócio.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clientes */}
        <TabsContent value="clientes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Clientes
              </CardTitle>
              <CardDescription>
                Gestão completa da base de clientes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Gerenciamento de Clientes</h3>
                <p>
                  A seção de clientes permite cadastrar, editar e gerenciar todos os seus clientes. 
                  Aqui você pode manter informações de contato, histórico de empréstimos e dados 
                  financeiros de cada cliente.
                </p>
                
                <h3 className="text-lg font-semibold pt-4">Listagem de Clientes</h3>
                <p>
                  A página principal de clientes exibe uma lista de todos os clientes cadastrados, com:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>Nome e informações principais de contato</li>
                  <li>Score interno de crédito</li>
                  <li>Quantidade de empréstimos ativos</li>
                  <li>Data de cadastro</li>
                  <li>Botões de acesso rápido para visualizar detalhes, editar ou remover</li>
                </ul>
                
                <h3 className="text-lg font-semibold pt-4">Cadastro de Novo Cliente</h3>
                <p>
                  Para cadastrar um novo cliente, clique no botão "Novo Cliente" e preencha o formulário com:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li><strong>Nome completo:</strong> Nome do cliente</li>
                  <li><strong>Email:</strong> Email para contato (opcional)</li>
                  <li><strong>Telefone:</strong> Número de telefone principal</li>
                  <li><strong>CPF:</strong> Documento de identificação</li>
                  <li><strong>Endereço:</strong> Localização do cliente</li>
                  <li><strong>Observações:</strong> Informações adicionais</li>
                </ul>
                
                <h3 className="text-lg font-semibold pt-4">Detalhes do Cliente</h3>
                <p>
                  Ao clicar em um cliente, você acessa a página de detalhes, onde encontra:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>Dados cadastrais completos</li>
                  <li>Histórico de empréstimos e pagamentos</li>
                  <li>Indicadores de pontualidade e score</li>
                  <li>Opções para editar dados ou criar novo empréstimo</li>
                </ul>
                
                <h3 className="text-lg font-semibold pt-4">Score de Crédito</h3>
                <p>
                  O sistema calcula automaticamente um score interno para cada cliente, baseado em:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>Histórico de pagamentos pontuais</li>
                  <li>Quantidade de empréstimos já quitados</li>
                  <li>Atrasos em pagamentos</li>
                  <li>Tempo como cliente</li>
                </ul>
                
                <div className="bg-muted/50 p-4 rounded-lg border mt-6">
                  <h4 className="font-medium mb-2">Dica de uso:</h4>
                  <p>
                    Use a função de busca na listagem de clientes para encontrar rapidamente um cliente 
                    específico por nome, email, telefone ou CPF.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Empréstimos */}
        <TabsContent value="emprestimos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Empréstimos
              </CardTitle>
              <CardDescription>
                Gestão completa de empréstimos e parcelamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Gerenciamento de Empréstimos</h3>
                <p>
                  A seção de empréstimos permite criar, acompanhar e gerenciar todos os empréstimos realizados. 
                  O sistema calcula automaticamente juros, parcelas e datas de vencimento.
                </p>
                
                <h3 className="text-lg font-semibold pt-4">Listagem de Empréstimos</h3>
                <p>
                  A página principal de empréstimos exibe uma lista com:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>Cliente associado ao empréstimo</li>
                  <li>Valor principal e total com juros</li>
                  <li>Data do empréstimo e vencimento</li>
                  <li>Status (Em aberto, Quitado, Atrasado, etc.)</li>
                  <li>Opções para visualizar detalhes, registrar pagamentos ou editar</li>
                </ul>
                
                <h3 className="text-lg font-semibold pt-4">Criação de Novo Empréstimo</h3>
                <p>
                  Para criar um novo empréstimo, clique no botão "Novo Empréstimo" e preencha:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li><strong>Cliente:</strong> Selecione um cliente cadastrado</li>
                  <li><strong>Valor principal:</strong> Valor emprestado</li>
                  <li><strong>Taxa de juros:</strong> Percentual de juros (mensal/anual)</li>
                  <li><strong>Tipo de juros:</strong> Simples ou composto</li>
                  <li><strong>Data do empréstimo:</strong> Data em que foi concedido</li>
                  <li><strong>Data de vencimento:</strong> Data para pagamento</li>
                  <li><strong>Observações:</strong> Informações adicionais</li>
                </ul>
                
                <h3 className="text-lg font-semibold pt-4">Detalhes do Empréstimo</h3>
                <p>
                  Na página de detalhes do empréstimo, você encontra:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>Informações completas do empréstimo</li>
                  <li>Histórico de pagamentos</li>
                  <li>Cálculo atualizado do valor a receber (principal + juros)</li>
                  <li>Opções para registrar pagamentos ou editar o empréstimo</li>
                  <li>Gerar comprovantes ou recibos</li>
                </ul>
                
                <h3 className="text-lg font-semibold pt-4">Cálculo de Juros</h3>
                <p>
                  O sistema suporta dois tipos de cálculo de juros:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>
                    <strong>Juros simples:</strong> Aplica-se o percentual de juros apenas sobre o valor principal 
                    (Valor final = Principal + (Principal * Taxa * Tempo))
                  </li>
                  <li>
                    <strong>Juros compostos:</strong> Juros são aplicados sobre o valor acumulado 
                    (Valor final = Principal * (1 + Taxa) ^ Tempo)
                  </li>
                </ul>
                
                <h3 className="text-lg font-semibold pt-4">Atraso e Multas</h3>
                <p>
                  Para empréstimos com pagamento em atraso, o sistema aplica automaticamente:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>Taxa de juros de atraso (configurável nas Configurações Financeiras)</li>
                  <li>Multa por atraso (valor ou percentual configurável)</li>
                  <li>Notificações automáticas (se configuradas)</li>
                </ul>
                
                <div className="bg-muted/50 p-4 rounded-lg border mt-6">
                  <h4 className="font-medium mb-2">Dica de uso:</h4>
                  <p>
                    Use os filtros na listagem de empréstimos para identificar rapidamente empréstimos 
                    atrasados ou que estão próximos do vencimento, permitindo ações preventivas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pagamentos */}
        <TabsContent value="pagamentos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Pagamentos
              </CardTitle>
              <CardDescription>
                Registro e acompanhamento de pagamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Gestão de Pagamentos</h3>
                <p>
                  O sistema permite registrar e acompanhar todos os pagamentos efetuados pelos clientes, 
                  atualizando automaticamente o saldo dos empréstimos e gerando recibos.
                </p>
                
                <h3 className="text-lg font-semibold pt-4">Registro de Pagamentos</h3>
                <p>
                  Para registrar um novo pagamento, acesse a página de detalhes do empréstimo 
                  e clique em "Registrar Pagamento". Em seguida, preencha:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li><strong>Valor:</strong> Quantia paga pelo cliente</li>
                  <li><strong>Data do pagamento:</strong> Quando o pagamento foi recebido</li>
                  <li><strong>Tipo de pagamento:</strong> Ex: Dinheiro, Transferência, PIX, etc.</li>
                  <li><strong>Observações:</strong> Informações adicionais, como número de comprovante</li>
                </ul>
                
                <h3 className="text-lg font-semibold pt-4">Histórico de Pagamentos</h3>
                <p>
                  Nos detalhes do empréstimo, você pode visualizar:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>Todos os pagamentos realizados em ordem cronológica</li>
                  <li>Valor total já pago</li>
                  <li>Saldo remanescente (original e atualizado com juros)</li>
                  <li>Opções para editar ou estornar pagamentos, se necessário</li>
                </ul>
                
                <h3 className="text-lg font-semibold pt-4">Comprovantes e Recibos</h3>
                <p>
                  Após registrar um pagamento, você pode:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>Gerar um recibo em PDF para entregar ao cliente</li>
                  <li>Enviar confirmação por email ou WhatsApp (se integrado)</li>
                  <li>Imprimir o comprovante para arquivamento</li>
                </ul>
                
                <h3 className="text-lg font-semibold pt-4">Pagamentos em Atraso</h3>
                <p>
                  Para pagamentos após a data de vencimento:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>O sistema calcula automaticamente juros e multas de atraso</li>
                  <li>Exibe o valor atualizado a ser pago com os acréscimos</li>
                  <li>Registra o histórico de atrasos para análise futura</li>
                </ul>
                
                <h3 className="text-lg font-semibold pt-4">Quitação do Empréstimo</h3>
                <p>
                  Quando o valor total do empréstimo (principal + juros) é pago:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>O sistema atualiza automaticamente o status para "Quitado"</li>
                  <li>Gera um comprovante de quitação</li>
                  <li>Atualiza o score do cliente (se ele pagou em dia)</li>
                </ul>
                
                <div className="bg-muted/50 p-4 rounded-lg border mt-6">
                  <h4 className="font-medium mb-2">Dica de uso:</h4>
                  <p>
                    Ao registrar um pagamento, use o campo de observações para incluir informações como 
                    número de comprovante, dados da transação ou qualquer informação relevante que ajude 
                    na identificação futura.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatórios */}
        <TabsContent value="relatorios">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Relatórios e Gráficos
              </CardTitle>
              <CardDescription>
                Análises e visualizações dos dados financeiros
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Geração de Relatórios</h3>
                <p>
                  O sistema oferece relatórios detalhados para acompanhamento e análise do desempenho 
                  do seu negócio, disponíveis em formatos exportáveis como PDF e Excel.
                </p>
                
                <h3 className="text-lg font-semibold pt-4">Tipos de Relatórios Disponíveis</h3>
                
                <h4 className="font-medium mt-3">Relatório de Empréstimos</h4>
                <p>
                  Fornece uma visão detalhada de todos os empréstimos:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>Total de empréstimos ativos e encerrados</li>
                  <li>Valor total emprestado</li>
                  <li>Valor total recebido (principal + juros)</li>
                  <li>Saldo a receber</li>
                  <li>Lista de empréstimos com dados detalhados</li>
                </ul>
                
                <h4 className="font-medium mt-3">Relatório de Pagamentos</h4>
                <p>
                  Registro de todos os pagamentos recebidos:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>Total de pagamentos por período</li>
                  <li>Detalhamento por cliente</li>
                  <li>Análise por tipo de pagamento</li>
                  <li>Pagamentos em dia x pagamentos em atraso</li>
                </ul>
                
                <h4 className="font-medium mt-3">Relatório de Clientes</h4>
                <p>
                  Análise da carteira de clientes:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>Número total de clientes ativos</li>
                  <li>Novos clientes por período</li>
                  <li>Clientes por score</li>
                  <li>Histórico de relacionamento</li>
                </ul>
                
                <h4 className="font-medium mt-3">Relatório de Fluxo de Caixa</h4>
                <p>
                  Visão das entradas e saídas financeiras:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>Total de entradas (pagamentos recebidos)</li>
                  <li>Total de saídas (novos empréstimos)</li>
                  <li>Saldo do período</li>
                  <li>Projeção para os próximos períodos</li>
                </ul>
                
                <h3 className="text-lg font-semibold pt-4">Gráficos e Dashboards</h3>
                <p>
                  O sistema inclui visualizações gráficas para melhor compreensão dos dados:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>Gráficos de evolução mensal de empréstimos e pagamentos</li>
                  <li>Gráficos de composição da carteira de clientes</li>
                  <li>Indicadores de inadimplência</li>
                  <li>Comparativos de performance (mês atual x mês anterior, ano atual x anterior)</li>
                </ul>
                
                <h3 className="text-lg font-semibold pt-4">Filtros e Parâmetros</h3>
                <p>
                  Todos os relatórios podem ser filtrados por:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>Período (data inicial e final)</li>
                  <li>Cliente específico</li>
                  <li>Status do empréstimo</li>
                  <li>Faixa de valor</li>
                  <li>Tipo de pagamento</li>
                </ul>
                
                <div className="bg-muted/50 p-4 rounded-lg border mt-6">
                  <h4 className="font-medium mb-2">Dica de uso:</h4>
                  <p>
                    Agende a geração automática dos relatórios mais importantes para recebê-los 
                    periodicamente por email. Isso ajuda a manter um acompanhamento regular do 
                    desempenho do negócio.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mensagens */}
        <TabsContent value="mensagens">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Mensagens e Templates
              </CardTitle>
              <CardDescription>
                Comunicação com clientes e automação de notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Sistema de Mensagens</h3>
                <p>
                  O módulo de mensagens permite enviar comunicações para seus clientes via email, 
                  SMS ou WhatsApp (com integração). Você pode criar templates, agendar mensagens 
                  automáticas e acompanhar o histórico de comunicações.
                </p>
                
                <h3 className="text-lg font-semibold pt-4">Templates de Mensagens</h3>
                <p>
                  Os templates permitem criar modelos padronizados para comunicações recorrentes:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>Criar templates para diferentes situações (boas-vindas, lembrete, cobrança, etc.)</li>
                  <li>Usar variáveis dinâmicas como {"{{cliente.nome}}"}, {"{{emprestimo.valor}}"}, {"{{pagamento.data}}"}</li>
                  <li>Definir assunto e conteúdo personalizado</li>
                  <li>Selecionar canais de envio (email, SMS, WhatsApp)</li>
                </ul>
                
                <h3 className="text-lg font-semibold pt-4">Envio de Mensagens</h3>
                <p>
                  Para enviar uma mensagem manual:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>Selecione o cliente destinatário</li>
                  <li>Escolha um template ou crie uma mensagem personalizada</li>
                  <li>Defina o canal de envio (email, SMS, WhatsApp)</li>
                  <li>Programe o envio imediato ou agende para uma data futura</li>
                </ul>
                
                <h3 className="text-lg font-semibold pt-4">Automação de Mensagens</h3>
                <p>
                  Configure regras para envio automático de mensagens baseadas em eventos:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li><strong>Novo empréstimo:</strong> Confirma a criação do empréstimo</li>
                  <li><strong>Lembrete de vencimento:</strong> Alerta sobre próximos pagamentos</li>
                  <li><strong>Confirmação de pagamento:</strong> Agradece e confirma recebimento</li>
                  <li><strong>Atraso de pagamento:</strong> Notifica sobre vencimentos não pagos</li>
                  <li><strong>Aniversário de cliente:</strong> Mensagem comemorativa</li>
                </ul>
                
                <h3 className="text-lg font-semibold pt-4">Histórico de Mensagens</h3>
                <p>
                  Acesse o registro completo de todas as comunicações:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>Visualize todas as mensagens enviadas por cliente</li>
                  <li>Verifique status de entrega e leitura (quando disponível)</li>
                  <li>Filtre por período, tipo ou status</li>
                  <li>Reenviare mensagens se necessário</li>
                </ul>
                
                <h3 className="text-lg font-semibold pt-4">Integrações</h3>
                <p>
                  O sistema pode ser integrado com:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li><strong>Serviços de email:</strong> Para envio de emails em massa</li>
                  <li><strong>WhatsApp Business API:</strong> Para mensagens via WhatsApp</li>
                  <li><strong>Gateways de SMS:</strong> Para mensagens de texto</li>
                  <li><strong>Webhooks:</strong> Para integração com outros sistemas</li>
                </ul>
                
                <div className="bg-muted/50 p-4 rounded-lg border mt-6">
                  <h4 className="font-medium mb-2">Dica de uso:</h4>
                  <p>
                    Configure mensagens automáticas de lembrete para serem enviadas alguns dias antes 
                    do vencimento dos empréstimos. Isso pode aumentar significativamente a taxa de 
                    pagamentos em dia.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações */}
        <TabsContent value="configuracoes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Configurações
              </CardTitle>
              <CardDescription>
                Personalização e ajustes do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Configurações do Sistema</h3>
                <p>
                  A área de configurações permite personalizar diversos aspectos do sistema para 
                  adequá-lo às necessidades específicas do seu negócio.
                </p>
                
                <h3 className="text-lg font-semibold pt-4">Configurações Financeiras</h3>
                <p>
                  Defina os parâmetros financeiros padrão:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li><strong>Taxa de juros padrão:</strong> Percentual aplicado em novos empréstimos</li>
                  <li><strong>Tipo de juros padrão:</strong> Simples ou composto</li>
                  <li><strong>Prazo máximo:</strong> Limite de dias para vencimento</li>
                  <li><strong>Taxa de juros de atraso:</strong> Percentual para pagamentos em atraso</li>
                  <li><strong>Multa de atraso:</strong> Valor ou percentual aplicado em atrasos</li>
                </ul>
                
                <h3 className="text-lg font-semibold pt-4">Cadastros Auxiliares</h3>
                
                <h4 className="font-medium mt-3">Categorias</h4>
                <p>
                  Crie categorias para classificar empréstimos e pagamentos.
                </p>
                
                <h4 className="font-medium mt-3">Métodos de Pagamento</h4>
                <p>
                  Gerencie os tipos de pagamento aceitos (Dinheiro, PIX, Transferência, etc.).
                </p>
                
                <h4 className="font-medium mt-3">Contas Bancárias</h4>
                <p>
                  Cadastre as contas bancárias utilizadas no negócio.
                </p>
                
                <h3 className="text-lg font-semibold pt-4">Configurações de Notificações</h3>
                <p>
                  Defina quais eventos devem gerar notificações automáticas:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>Novo empréstimo</li>
                  <li>Novo pagamento</li>
                  <li>Novo cliente</li>
                  <li>Empréstimo atrasado</li>
                </ul>
                
                <h3 className="text-lg font-semibold pt-4">Integrações Externas</h3>
                <p>
                  Configure conexões com serviços externos:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li><strong>WhatsApp (Evolution API):</strong> Integração para envio de mensagens</li>
                  <li><strong>Webhooks:</strong> URLs para notificações automáticas de eventos</li>
                  <li><strong>API Externa:</strong> Configuração para permitir acesso por outros sistemas</li>
                </ul>
                
                <h3 className="text-lg font-semibold pt-4">Configurações de Administrador</h3>
                <p>
                  Opções avançadas disponíveis apenas para usuários administradores:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-1">
                  <li>Controle de cadastro de usuários</li>
                  <li>Definição de permissões e papéis</li>
                  <li>Configurações de segurança</li>
                </ul>
                
                <h3 className="text-lg font-semibold pt-4">Logs de Atividades</h3>
                <p>
                  Acesse o registro completo de todas as ações realizadas no sistema, para fins de 
                  auditoria e segurança.
                </p>
                
                <div className="bg-muted/50 p-4 rounded-lg border mt-6">
                  <h4 className="font-medium mb-2">Dica de uso:</h4>
                  <p>
                    Revise periodicamente as configurações financeiras para garantir que estão alinhadas 
                    com as práticas atuais do mercado e com a estratégia do seu negócio.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManualUsuario;
