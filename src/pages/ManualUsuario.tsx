
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ManualUsuario = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Manual do Usuário"
        description="Guia completo para utilização do sistema Crédito Inteligente"
      />

      <Tabs defaultValue="introducao">
        <TabsList className="w-full md:w-auto grid grid-cols-2 md:flex">
          <TabsTrigger value="introducao">Introdução</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="emprestimos">Empréstimos</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="introducao">
          <Card>
            <CardHeader>
              <CardTitle>Introdução ao Sistema</CardTitle>
              <CardDescription>
                Visão geral do sistema Crédito Inteligente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Bem-vindo ao Crédito Inteligente</h3>
                <p>
                  O Crédito Inteligente é um sistema completo para gestão de empréstimos e controle
                  financeiro, desenvolvido para facilitar a administração de operações de crédito,
                  clientes e pagamentos.
                </p>
                
                <h4 className="text-md font-semibold mt-4">Recursos Principais</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Dashboard:</strong> Visão geral das finanças, empréstimos ativos e
                    vencimentos.
                  </li>
                  <li>
                    <strong>Clientes:</strong> Cadastro e gerenciamento completo de clientes.
                  </li>
                  <li>
                    <strong>Empréstimos:</strong> Controle detalhado de empréstimos, pagamentos e
                    renegociações.
                  </li>
                  <li>
                    <strong>Relatórios:</strong> Análise detalhada de desempenho financeiro e
                    operacional.
                  </li>
                  <li>
                    <strong>Mensagens:</strong> Comunicação com clientes por meio de templates
                    personalizados.
                  </li>
                  <li>
                    <strong>Configurações:</strong> Personalização do sistema de acordo com suas
                    necessidades.
                  </li>
                </ul>
                
                <h4 className="text-md font-semibold mt-4">Como Usar este Manual</h4>
                <p>
                  Este manual foi organizado por seções para facilitar a consulta. Navegue pelas
                  abas acima para acessar instruções detalhadas sobre cada funcionalidade do
                  sistema.
                </p>
                <p>
                  Se você é um novo usuário, recomendamos ler todas as seções para se familiarizar
                  com o sistema. Se está buscando informações específicas, vá diretamente para a
                  seção desejada.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>
                Painel de controle com visão geral do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Painel de Controle</h3>
                <p>
                  O Dashboard é a página inicial do sistema e apresenta uma visão geral dos principais
                  indicadores financeiros e operacionais:
                </p>
                
                <h4 className="text-md font-semibold mt-4">Elementos do Dashboard</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Cartões de Resumo:</strong> Mostram dados resumidos como total
                    emprestado, valor a receber, total de clientes e empréstimos ativos.
                  </li>
                  <li>
                    <strong>Gráfico de Desempenho:</strong> Apresenta visualmente a evolução
                    de empréstimos e pagamentos ao longo do tempo.
                  </li>
                  <li>
                    <strong>Empréstimos a Vencer:</strong> Lista os próximos empréstimos com
                    datas de vencimento próximas.
                  </li>
                  <li>
                    <strong>Últimos Pagamentos:</strong> Registros dos pagamentos mais recentes
                    recebidos no sistema.
                  </li>
                </ul>
                
                <h4 className="text-md font-semibold mt-4">Como Usar o Dashboard</h4>
                <p>
                  O Dashboard oferece uma visualização rápida do estado atual do seu negócio.
                  É recomendável verificá-lo diariamente para:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Identificar empréstimos a vencer nos próximos dias</li>
                  <li>Acompanhar entrada de novos pagamentos</li>
                  <li>Monitorar o desempenho geral do seu portfolio de empréstimos</li>
                  <li>Verificar a distribuição de valores por status</li>
                </ul>
                
                <p className="mt-4">
                  Para obter informações mais detalhadas, você pode clicar nos links disponíveis
                  no Dashboard que o levarão às respectivas páginas com informações completas.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clientes">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Clientes</CardTitle>
              <CardDescription>
                Cadastro e gerenciamento de clientes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Lista de Clientes</h3>
                <p>
                  A página de clientes exibe todos os clientes cadastrados no sistema. A partir dela você pode:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Visualizar todos os clientes cadastrados</li>
                  <li>Filtrar clientes por nome, CPF ou telefone</li>
                  <li>Acessar detalhes de um cliente específico</li>
                  <li>Cadastrar novos clientes</li>
                </ul>
                
                <h4 className="text-md font-semibold mt-4">Cadastro de Novos Clientes</h4>
                <p>
                  Para cadastrar um novo cliente, siga os passos:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Clique no botão "Novo Cliente" no canto superior direito</li>
                  <li>Preencha os dados do formulário (os campos com * são obrigatórios):
                    <ul className="list-disc pl-5 mt-2">
                      <li><strong>Nome Completo*:</strong> Nome completo do cliente</li>
                      <li><strong>CPF:</strong> CPF do cliente (recomendado para identificação)</li>
                      <li><strong>Telefone:</strong> Telefone de contato principal</li>
                      <li><strong>E-mail:</strong> Endereço de e-mail</li>
                      <li><strong>Endereço:</strong> Endereço completo</li>
                      <li><strong>Observações:</strong> Informações adicionais relevantes</li>
                    </ul>
                  </li>
                  <li>Clique em "Salvar Cliente" para finalizar o cadastro</li>
                </ol>
                
                <h4 className="text-md font-semibold mt-4">Detalhes do Cliente</h4>
                <p>
                  Ao clicar em um cliente na lista ou no ícone de visualização, você acessará
                  a página de detalhes do cliente, que inclui:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Dados Cadastrais:</strong> Informações pessoais do cliente</li>
                  <li><strong>Empréstimos:</strong> Lista de todos os empréstimos do cliente</li>
                  <li><strong>Pagamentos:</strong> Histórico de pagamentos realizados</li>
                  <li><strong>Histórico:</strong> Registro de atividades relacionadas ao cliente</li>
                </ul>
                
                <p>
                  Nesta página você também pode:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Editar os dados do cliente</li>
                  <li>Cadastrar um novo empréstimo para o cliente</li>
                  <li>Enviar mensagens personalizadas</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="emprestimos">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Empréstimos</CardTitle>
              <CardDescription>
                Controle de empréstimos, pagamentos e renegociações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Lista de Empréstimos</h3>
                <p>
                  A página de empréstimos exibe todos os empréstimos cadastrados no sistema, permitindo:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Visualizar todos os empréstimos</li>
                  <li>Filtrar por cliente, status ou data</li>
                  <li>Acessar detalhes de um empréstimo específico</li>
                  <li>Cadastrar novos empréstimos</li>
                </ul>
                
                <h4 className="text-md font-semibold mt-4">Cadastro de Novo Empréstimo</h4>
                <p>
                  Para cadastrar um novo empréstimo, siga os passos:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Clique no botão "Novo Empréstimo" no canto superior direito</li>
                  <li>Selecione um cliente existente ou cadastre um novo</li>
                  <li>Preencha os dados financeiros do empréstimo:
                    <ul className="list-disc pl-5 mt-2">
                      <li><strong>Valor Principal*:</strong> Montante do empréstimo</li>
                      <li><strong>Taxa de Juros*:</strong> Percentual de juros</li>
                      <li><strong>Tipo de Juros*:</strong> Simples ou Composto</li>
                      <li><strong>Data do Empréstimo*:</strong> Data de liberação</li>
                      <li><strong>Data de Vencimento*:</strong> Data para pagamento</li>
                      <li><strong>Observações:</strong> Informações adicionais</li>
                    </ul>
                  </li>
                  <li>Clique em "Criar Empréstimo" para finalizar</li>
                </ol>
                
                <h4 className="text-md font-semibold mt-4">Detalhes do Empréstimo</h4>
                <p>
                  Ao clicar em um empréstimo na lista, você acessará a página de detalhes que inclui:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Dados Gerais:</strong> Informações do empréstimo e cliente</li>
                  <li><strong>Resumo Financeiro:</strong> Valores a pagar, juros e total</li>
                  <li><strong>Pagamentos:</strong> Registro de pagamentos realizados</li>
                  <li><strong>Renegociações:</strong> Histórico de renegociações, se houver</li>
                </ul>
                
                <h4 className="text-md font-semibold mt-4">Registrar Pagamento</h4>
                <p>
                  Para registrar um pagamento:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Acesse a página de detalhes do empréstimo</li>
                  <li>Clique no botão "Registrar Pagamento"</li>
                  <li>Preencha os dados do pagamento:
                    <ul className="list-disc pl-5 mt-2">
                      <li><strong>Valor*:</strong> Montante do pagamento</li>
                      <li><strong>Data*:</strong> Data em que o pagamento foi realizado</li>
                      <li><strong>Tipo*:</strong> Pagamento parcial, total, etc.</li>
                      <li><strong>Observações:</strong> Informações adicionais</li>
                    </ul>
                  </li>
                  <li>Clique em "Salvar Pagamento"</li>
                </ol>
                
                <h4 className="text-md font-semibold mt-4">Renegociar Empréstimo</h4>
                <p>
                  Para renegociar um empréstimo:
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Acesse a página de detalhes do empréstimo</li>
                  <li>Clique no botão "Renegociar"</li>
                  <li>Preencha os novos termos do empréstimo:
                    <ul className="list-disc pl-5 mt-2">
                      <li><strong>Novo Valor Principal*:</strong> Valor atualizado</li>
                      <li><strong>Nova Taxa de Juros*:</strong> Taxa após renegociação</li>
                      <li><strong>Novo Tipo de Juros*:</strong> Simples ou Composto</li>
                      <li><strong>Nova Data de Vencimento*:</strong> Prazo estendido</li>
                      <li><strong>Motivo da Renegociação*:</strong> Justificativa</li>
                    </ul>
                  </li>
                  <li>Clique em "Confirmar Renegociação"</li>
                </ol>
                
                <p>
                  Após a renegociação, o empréstimo original será marcado como "Renegociado"
                  e um novo empréstimo será criado com os novos termos acordados.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="relatorios">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios e Gráficos</CardTitle>
              <CardDescription>
                Análise de desempenho e relatórios gerenciais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Relatórios Disponíveis</h3>
                <p>
                  A seção de relatórios oferece diferentes visualizações para análise do desempenho:
                </p>
                
                <h4 className="text-md font-semibold mt-4">Resumo de Desempenho</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Total Emprestado:</strong> Valor acumulado de todos os empréstimos</li>
                  <li><strong>Total Recebido:</strong> Valor total de pagamentos recebidos</li>
                  <li><strong>A Receber:</strong> Valor pendente de pagamento</li>
                  <li><strong>Lucro Estimado:</strong> Previsão de lucro com juros</li>
                </ul>
                
                <h4 className="text-md font-semibold mt-4">Gráficos de Análise</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Evolução Mensal:</strong> Gráfico mostrando a evolução de empréstimos e 
                    pagamentos ao longo dos meses
                  </li>
                  <li>
                    <strong>Distribuição por Status:</strong> Gráfico de pizza mostrando a proporção
                    de empréstimos por status (Em dia, Atrasado, Quitado, etc.)
                  </li>
                  <li>
                    <strong>Maiores Clientes:</strong> Ranking dos clientes com maior volume de empréstimos
                  </li>
                </ul>
                
                <h4 className="text-md font-semibold mt-4">Relatórios Detalhados</h4>
                <p>
                  Para cada tipo de relatório, você pode:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Definir filtros por período, cliente ou status</li>
                  <li>Exportar os dados em formato CSV para análise externa</li>
                  <li>Imprimir relatórios para apresentação</li>
                </ul>
                
                <h4 className="text-md font-semibold mt-4">Alertas e Notificações</h4>
                <p>
                  Na seção de relatórios você também encontra alertas importantes:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Empréstimos a Vencer:</strong> Lista de próximos vencimentos</li>
                  <li><strong>Empréstimos Atrasados:</strong> Pendências com prazo expirado</li>
                  <li><strong>Clientes Inadimplentes:</strong> Clientes com histórico de atraso</li>
                </ul>
                
                <p className="mt-4">
                  Utilize os relatórios regularmente para acompanhar o desempenho do seu negócio e 
                  identificar tendências que podem ajudar na tomada de decisões estratégicas.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="configuracoes">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>
                Personalização e ajustes do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Menu de Configurações</h3>
                <p>
                  O menu de configurações permite personalizar o sistema de acordo com suas necessidades:
                </p>
                
                <h4 className="text-md font-semibold mt-4">Configurações Financeiras</h4>
                <p>
                  Define os parâmetros financeiros padrão:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Prazo Máximo em Dias:</strong> Limite de prazo para empréstimos</li>
                  <li><strong>Taxa Padrão de Juros:</strong> Percentual de juros sugerido</li>
                  <li><strong>Tipo de Juros Padrão:</strong> Simples ou Composto</li>
                  <li><strong>Taxa de Juros de Atraso:</strong> Juros aplicados em caso de atraso</li>
                  <li><strong>Taxa de Multa de Atraso:</strong> Multa por atraso no pagamento</li>
                </ul>
                
                <h4 className="text-md font-semibold mt-4">Categorias</h4>
                <p>
                  Gerencia categorias para classificação de empréstimos:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Criar novas categorias</li>
                  <li>Editar categorias existentes</li>
                  <li>Excluir categorias não utilizadas</li>
                </ul>
                
                <h4 className="text-md font-semibold mt-4">Métodos de Pagamento</h4>
                <p>
                  Administra os métodos de pagamento aceitos:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Adicionar novos métodos (Dinheiro, PIX, Transferência, etc.)</li>
                  <li>Editar métodos existentes</li>
                  <li>Ativar ou desativar métodos</li>
                </ul>
                
                <h4 className="text-md font-semibold mt-4">Contas Bancárias</h4>
                <p>
                  Gerencia contas bancárias para controle financeiro:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Cadastrar contas bancárias</li>
                  <li>Atualizar dados das contas</li>
                  <li>Definir conta principal</li>
                </ul>
                
                <h4 className="text-md font-semibold mt-4">Logs de Atividades</h4>
                <p>
                  Visualiza o histórico de ações realizadas no sistema:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Ver quem realizou cada ação</li>
                  <li>Acompanhar data e hora das atividades</li>
                  <li>Filtrar logs por usuário, ação ou período</li>
                </ul>
                
                <h4 className="text-md font-semibold mt-4">Perfil</h4>
                <p>
                  Gerencia seus dados de usuário:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Atualizar informações pessoais</li>
                  <li>Alterar senha de acesso</li>
                  <li>Configurar preferências de notificação</li>
                </ul>
                
                <p className="mt-4">
                  É recomendável configurar os parâmetros financeiros e categorias logo após a 
                  instalação do sistema para garantir que os empréstimos sejam cadastrados com
                  os valores padrão corretos.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManualUsuario;
