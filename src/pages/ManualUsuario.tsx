import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ManualUsuario = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Manual do Usuário</h1>
        <p className="text-muted-foreground">
          Guia completo para utilização do sistema Crédito Inteligente.
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="w-full flex flex-wrap justify-start">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="emprestimos">Empréstimos</TabsTrigger>
          <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
          <TabsTrigger value="mensagens">Mensagens</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>
                Visão geral do sistema e métricas principais.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-semibold">Visão Geral</h3>
              <p>
                O Dashboard é a tela inicial do sistema, fornecendo uma visão geral 
                dos principais indicadores e métricas do seu negócio de crédito.
              </p>
              
              <h3 className="text-lg font-semibold mt-4">Estatísticas Disponíveis</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Total de Empréstimos:</strong> Exibe o número total de empréstimos ativos.
                </li>
                <li>
                  <strong>Valor Total Emprestado:</strong> Soma de todos os valores principais dos empréstimos.
                </li>
                <li>
                  <strong>Valor a Receber:</strong> Total pendente de pagamento incluindo juros.
                </li>
                <li>
                  <strong>Total de Clientes:</strong> Quantidade de clientes cadastrados no sistema.
                </li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-4">Gráficos e Visualizações</h3>
              <p>
                Os gráficos do dashboard são interativos. Você pode:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Passar o mouse sobre as barras ou linhas para ver detalhes.</li>
                <li>Filtrar por período usando os controles acima dos gráficos.</li>
                <li>Alternar entre visualizações de valores totais e médias.</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-4">Atualizações</h3>
              <p>
                Os dados do dashboard são atualizados automaticamente a cada vez que você acessa
                a página. Para atualizar manualmente, basta recarregar a página.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clientes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clientes</CardTitle>
              <CardDescription>
                Gerenciamento completo de clientes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Cadastro de Clientes</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>Para cadastrar um novo cliente, siga estes passos:</p>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Clique no botão "Novo Cliente" no canto superior direito da página de Clientes.</li>
                        <li>Preencha o formulário com os dados do cliente:</li>
                        <ul className="list-disc pl-5 my-2">
                          <li><strong>Nome:</strong> Nome completo do cliente (obrigatório).</li>
                          <li><strong>Telefone:</strong> Número de contato, preferencialmente com DDD.</li>
                          <li><strong>Email:</strong> Endereço de email válido para comunicações.</li>
                          <li><strong>CPF:</strong> Documento de identificação do cliente.</li>
                          <li><strong>Endereço:</strong> Localização residencial ou comercial.</li>
                          <li><strong>Observações:</strong> Informações adicionais relevantes.</li>
                        </ul>
                        <li>Clique em "Salvar" para finalizar o cadastro.</li>
                      </ol>
                      <p className="mt-4">
                        <strong>Dica:</strong> Sempre verifique se o cliente já está cadastrado
                        antes de criar um novo registro para evitar duplicidades.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>Visualização e Edição</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>Para visualizar os detalhes de um cliente:</p>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Na lista de clientes, clique no ícone de olho (visualizar) ao lado do nome do cliente.</li>
                        <li>Você será redirecionado para a página de detalhes, que inclui:</li>
                        <ul className="list-disc pl-5 my-2">
                          <li>Informações pessoais do cliente</li>
                          <li>Histórico de empréstimos</li>
                          <li>Histórico de pagamentos</li>
                          <li>Documentos anexados (se houver)</li>
                        </ul>
                      </ol>
                      
                      <p className="mt-3">Para editar as informações de um cliente:</p>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Na página de detalhes do cliente, clique no botão "Editar"</li>
                        <li>Atualize as informações necessárias</li>
                        <li>Clique em "Salvar" para aplicar as mudanças</li>
                      </ol>
                      
                      <p className="mt-4">
                        <strong>Importante:</strong> A edição de dados como CPF e nome deve ser
                        feita com cautela, especialmente se o cliente já possui empréstimos vinculados.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>Pesquisa e Filtros</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>O sistema oferece diversas formas de localizar clientes:</p>
                      
                      <h4 className="font-medium mt-3">Pesquisa Rápida:</h4>
                      <p>Utilize o campo de busca na parte superior da lista para encontrar clientes por:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Nome</li>
                        <li>CPF</li>
                        <li>Telefone</li>
                        <li>Email</li>
                      </ul>
                      
                      <h4 className="font-medium mt-3">Filtros Avançados:</h4>
                      <p>Clique no botão "Filtros" para acessar opções adicionais:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Clientes com empréstimos ativos</li>
                        <li>Clientes com pagamentos em atraso</li>
                        <li>Clientes por score de crédito</li>
                        <li>Data de cadastro</li>
                      </ul>
                      
                      <p className="mt-3">
                        <strong>Dica:</strong> Você pode combinar múltiplos filtros para refinar sua pesquisa.
                        Por exemplo, buscar clientes com empréstimos ativos e que estão em atraso.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emprestimos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Empréstimos</CardTitle>
              <CardDescription>
                Gerenciamento de empréstimos e financiamentos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Criação de Empréstimos</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>Para criar um novo empréstimo:</p>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Acesse a seção "Empréstimos" no menu principal.</li>
                        <li>Clique no botão "Novo Empréstimo".</li>
                        <li>Selecione o cliente (ou cadastre um novo, se necessário).</li>
                        <li>Preencha os dados do empréstimo:</li>
                        <ul className="list-disc pl-5 my-2">
                          <li><strong>Valor Principal:</strong> Montante inicial do empréstimo.</li>
                          <li><strong>Taxa de Juros:</strong> Percentual de juros a ser aplicado.</li>
                          <li><strong>Tipo de Juros:</strong> Simples ou Composto.</li>
                          <li><strong>Data do Empréstimo:</strong> Data de início da operação.</li>
                          <li><strong>Data de Vencimento:</strong> Data final para pagamento.</li>
                          <li><strong>Observações:</strong> Informações adicionais sobre o contrato.</li>
                        </ul>
                        <li>Clique em "Salvar" para criar o empréstimo.</li>
                      </ol>
                      
                      <p className="mt-3">
                        <strong>Importante:</strong> Ao criar um novo empréstimo, o sistema
                        automaticamente utiliza os valores padrão de juros e prazos definidos
                        nas configurações financeiras, mas você pode alterá-los individualmente.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>Acompanhamento e Gestão</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>Para acompanhar o status dos empréstimos:</p>
                      
                      <h4 className="font-medium mt-3">Lista de Empréstimos:</h4>
                      <p>A lista principal mostra todos os empréstimos com informações básicas:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Cliente</li>
                        <li>Valor</li>
                        <li>Data de vencimento</li>
                        <li>Status (pendente, pago, atrasado, etc.)</li>
                      </ul>
                      
                      <h4 className="font-medium mt-3">Detalhes do Empréstimo:</h4>
                      <p>Clique em um empréstimo para ver detalhes completos, incluindo:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Histórico de pagamentos</li>
                        <li>Cálculo de juros acumulados</li>
                        <li>Saldo restante</li>
                        <li>Opções para registrar pagamentos</li>
                        <li>Opções para renegociação</li>
                      </ul>
                      
                      <p className="mt-3">
                        <strong>Dica:</strong> Utilize os filtros na parte superior para visualizar
                        apenas empréstimos em determinado status, como "Em atraso" ou "Próximos do vencimento".
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>Renegociação de Dívidas</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>
                        A renegociação permite ajustar as condições de um empréstimo existente,
                        seja para estender o prazo, alterar os juros ou incorporar valores em atraso.
                      </p>
                      
                      <h4 className="font-medium mt-3">Como renegociar:</h4>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Acesse os detalhes do empréstimo que deseja renegociar.</li>
                        <li>Clique no botão "Renegociar".</li>
                        <li>No formulário de renegociação, defina as novas condições:</li>
                        <ul className="list-disc pl-5 my-2">
                          <li>Novo valor principal (geralmente com juros acumulados incorporados)</li>
                          <li>Nova taxa de juros</li>
                          <li>Novo tipo de juros</li>
                          <li>Nova data de vencimento</li>
                          <li>Motivo da renegociação</li>
                        </ul>
                        <li>Clique em "Confirmar Renegociação".</li>
                      </ol>
                      
                      <p className="mt-3">
                        <strong>Importante:</strong> A renegociação cria um novo contrato de empréstimo, 
                        vinculado ao anterior. O sistema mantém o histórico completo de renegociações para 
                        fins de auditoria e controle.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pagamentos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pagamentos</CardTitle>
              <CardDescription>
                Registro e gerenciamento de pagamentos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Registrar Pagamentos</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>Para registrar um novo pagamento:</p>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Acesse os detalhes do empréstimo.</li>
                        <li>Clique no botão "Registrar Pagamento".</li>
                        <li>Preencha os dados do pagamento:</li>
                        <ul className="list-disc pl-5 my-2">
                          <li><strong>Valor:</strong> Quantia paga pelo cliente.</li>
                          <li><strong>Data do Pagamento:</strong> Quando o pagamento foi realizado.</li>
                          <li><strong>Método de Pagamento:</strong> Dinheiro, PIX, transferência, etc.</li>
                          <li><strong>Observações:</strong> Informações adicionais como comprovantes.</li>
                        </ul>
                        <li>Clique em "Salvar Pagamento".</li>
                      </ol>
                      
                      <p className="mt-3">
                        <strong>Dica:</strong> O sistema permite múltiplos pagamentos parciais para um 
                        mesmo empréstimo. Cada pagamento é registrado individualmente para manter o 
                        histórico completo.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>Histórico de Pagamentos</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>
                        O histórico completo de pagamentos está disponível de duas formas:
                      </p>
                      
                      <h4 className="font-medium mt-3">Por Empréstimo:</h4>
                      <p>
                        Na página de detalhes de cada empréstimo, você encontra uma seção de 
                        "Histórico de Pagamentos" que mostra todos os pagamentos feitos para 
                        aquele contrato específico.
                      </p>
                      
                      <h4 className="font-medium mt-3">Por Cliente:</h4>
                      <p>
                        Na página de detalhes do cliente, é possível visualizar todo o histórico 
                        de pagamentos realizados por aquele cliente, independente do empréstimo.
                      </p>
                      
                      <p className="mt-3">
                        Cada registro de pagamento inclui as seguintes informações:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Data e hora do pagamento</li>
                        <li>Valor pago</li>
                        <li>Método de pagamento utilizado</li>
                        <li>Funcionário que registrou o pagamento</li>
                        <li>Observações</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>Estorno e Correções</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>
                        Caso seja necessário corrigir um pagamento registrado incorretamente:
                      </p>
                      
                      <h4 className="font-medium mt-3">Estorno de Pagamento:</h4>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Localize o pagamento que deseja estornar no histórico.</li>
                        <li>Clique no botão "Ações" e selecione "Estornar".</li>
                        <li>Confirme a operação informando o motivo do estorno.</li>
                        <li>O sistema registrará o estorno e ajustará o saldo do empréstimo.</li>
                      </ol>
                      
                      <p className="mt-3">
                        <strong>Importante:</strong> O estorno não apaga o registro original do 
                        pagamento do sistema. Em vez disso, cria um novo registro negativo 
                        (pagamento inverso) para fins de auditoria e rastreabilidade.
                      </p>
                      
                      <h4 className="font-medium mt-3">Correção de Dados:</h4>
                      <p>
                        Para corrigir informações como data ou método de pagamento (sem alterar o valor):
                      </p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Localize o pagamento.</li>
                        <li>Clique em "Editar".</li>
                        <li>Atualize as informações necessárias.</li>
                        <li>Salve as alterações.</li>
                      </ol>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mensagens" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mensagens</CardTitle>
              <CardDescription>
                Sistema de comunicação com clientes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Templates de Mensagens</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>
                        Os templates permitem criar modelos de mensagens que podem ser reutilizados 
                        para comunicação com clientes, economizando tempo e padronizando o conteúdo.
                      </p>
                      
                      <h4 className="font-medium mt-3">Criar Novo Template:</h4>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Acesse a seção "Mensagens" e selecione a aba "Templates".</li>
                        <li>Clique em "Novo Template".</li>
                        <li>Preencha as informações:</li>
                        <ul className="list-disc pl-5 my-2">
                          <li><strong>Nome do Template:</strong> Identificação para uso interno.</li>
                          <li><strong>Tipo de Mensagem:</strong> Email ou WhatsApp.</li>
                          <li><strong>Assunto:</strong> (Para emails) Linha de assunto da mensagem.</li>
                          <li><strong>Conteúdo:</strong> Texto da mensagem, que pode incluir variáveis.</li>
                        </ul>
                        <li>Clique em "Salvar Template".</li>
                      </ol>
                      
                      <h4 className="font-medium mt-3">Variáveis Disponíveis:</h4>
                      <p>
                        Você pode incluir variáveis no conteúdo que serão substituídas automaticamente 
                        por dados reais quando a mensagem for enviada:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><code>{"{nome_cliente}"}</code> - Nome do cliente</li>
                        <li><code>{"{valor_emprestimo}"}</code> - Valor do empréstimo</li>
                        <li><code>{"{data_vencimento}"}</code> - Data de vencimento</li>
                        <li><code>{"{parcela_atual}"}</code> - Número da parcela atual</li>
                        <li><code>{"{valor_parcela}"}</code> - Valor da parcela</li>
                        <li><code>{"{total_parcelas}"}</code> - Total de parcelas</li>
                        <li><code>{"{saldo_devedor}"}</code> - Saldo devedor</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>Envio de Mensagens</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>Para enviar mensagens individuais aos clientes:</p>
                      
                      <h4 className="font-medium mt-3">Envio Imediato:</h4>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Acesse a aba "Mensagens".</li>
                        <li>Selecione o cliente destinatário.</li>
                        <li>Escolha o tipo de mensagem (Email ou WhatsApp).</li>
                        <li>Selecione um template ou crie uma mensagem personalizada.</li>
                        <li>Edite o conteúdo conforme necessário.</li>
                        <li>Clique em "Enviar Mensagem".</li>
                      </ol>
                      
                      <h4 className="font-medium mt-3">Agendamento:</h4>
                      <p>
                        Para programar o envio de mensagens para uma data futura:
                      </p>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Acesse a aba "Agendamento".</li>
                        <li>Selecione o cliente e o tipo de mensagem.</li>
                        <li>Escolha um template ou crie uma mensagem personalizada.</li>
                        <li>Defina a data e hora para envio.</li>
                        <li>Clique em "Agendar Mensagem".</li>
                      </ol>
                      
                      <p className="mt-3">
                        <strong>Importante:</strong> Para o envio de emails, é necessário 
                        configurar as credenciais SMTP nas Configurações do sistema.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>Integrações</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>
                        O sistema oferece integrações com serviços externos para comunicação:
                      </p>
                      
                      <h4 className="font-medium mt-3">Integração com Webhook:</h4>
                      <p>
                        Configure webhooks para integrar o sistema com outras ferramentas externas:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>URL para POST Automático:</strong> Recebe notificações de eventos do sistema.</li>
                        <li><strong>URL para API:</strong> Endpoint para consultas externas.</li>
                        <li><strong>Eventos:</strong> Selecione quais ações disparam o webhook.</li>
                      </ul>
                      
                      <h4 className="font-medium mt-3">Integração com Evolution API:</h4>
                      <p>
                        Configure a integração com a Evolution API para envio de mensagens via WhatsApp:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>URL da Evolution API:</strong> Endereço da API WhatsApp.</li>
                        <li><strong>Eventos:</strong> Selecione quais ações disparam mensagens automáticas.</li>
                      </ul>
                      
                      <p className="mt-3">
                        <strong>Nota:</strong> As configurações de integração estão disponíveis 
                        apenas para usuários com perfil de administrador.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios</CardTitle>
              <CardDescription>
                Relatórios e análises sobre o negócio.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Tipos de Relatórios</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>
                        O sistema oferece diversos tipos de relatórios para análise de dados:
                      </p>
                      
                      <h4 className="font-medium mt-3">Relatórios Financeiros:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Fluxo de Caixa:</strong> Entradas e saídas por período.</li>
                        <li><strong>Receita de Juros:</strong> Ganhos com juros de empréstimos.</li>
                        <li><strong>Inadimplência:</strong> Análise de pagamentos em atraso.</li>
                        <li><strong>Projeção de Recebimentos:</strong> Previsão de receitas futuras.</li>
                      </ul>
                      
                      <h4 className="font-medium mt-3">Relatórios de Clientes:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Novos Clientes:</strong> Cadastros por período.</li>
                        <li><strong>Perfil de Clientes:</strong> Segmentação por características.</li>
                        <li><strong>Fidelidade:</strong> Clientes recorrentes.</li>
                      </ul>
                      
                      <h4 className="font-medium mt-3">Relatórios de Operações:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Volume de Empréstimos:</strong> Quantidade e valores por período.</li>
                        <li><strong>Tempo Médio de Pagamento:</strong> Análise de prazos.</li>
                        <li><strong>Renegociações:</strong> Análise de contratos renegociados.</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>Filtros e Parâmetros</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>
                        Todos os relatórios podem ser personalizados através de filtros e parâmetros:
                      </p>
                      
                      <h4 className="font-medium mt-3">Filtros Comuns:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Período:</strong> Data inicial e final para análise.</li>
                        <li><strong>Cliente:</strong> Filtrar por cliente específico.</li>
                        <li><strong>Status de Empréstimo:</strong> Ativos, pagos, em atraso, etc.</li>
                        <li><strong>Método de Pagamento:</strong> Filtrar por forma de pagamento.</li>
                      </ul>
                      
                      <h4 className="font-medium mt-3">Agrupamentos:</h4>
                      <p>
                        Os dados podem ser agrupados por diferentes critérios:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Diário, semanal, mensal ou anual</li>
                        <li>Por cliente</li>
                        <li>Por tipo de empréstimo</li>
                        <li>Por funcionário responsável</li>
                      </ul>
                      
                      <p className="mt-3">
                        <strong>Dica:</strong> Salve combinações de filtros frequentemente utilizados 
                        clicando no botão "Salvar Filtro" para acessá-los rapidamente no futuro.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>Exportação e Compartilhamento</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>
                        Todos os relatórios podem ser exportados em diferentes formatos:
                      </p>
                      
                      <h4 className="font-medium mt-3">Formatos Disponíveis:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>PDF:</strong> Ideal para impressão e compartilhamento formal.</li>
                        <li><strong>Excel:</strong> Para análises adicionais e manipulação de dados.</li>
                        <li><strong>CSV:</strong> Formato universal para importação em outros sistemas.</li>
                      </ul>
                      
                      <h4 className="font-medium mt-3">Compartilhamento:</h4>
                      <p>
                        Para compartilhar relatórios com outras pessoas:
                      </p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Gere o relatório com os filtros desejados.</li>
                        <li>Clique no botão "Exportar" e selecione o formato.</li>
                        <li>Escolha entre baixar o arquivo ou enviar por email.</li>
                        <li>Se optar por email, informe os destinatários e uma mensagem opcional.</li>
                      </ol>
                      
                      <p className="mt-3">
                        <strong>Nota sobre Privacidade:</strong> Os relatórios podem conter 
                        informações sensíveis. Tenha cuidado ao compartilhá-los e verifique 
                        se os destinatários têm autorização para acessar esses dados.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
              <CardDescription>
                Personalização e ajustes do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Configurações Financeiras</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>
                        As configurações financeiras definem os parâmetros padrão para empréstimos:
                      </p>
                      
                      <h4 className="font-medium mt-3">Parâmetros Disponíveis:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Prazo Máximo (dias):</strong> Limite de dias para vencimento.</li>
                        <li><strong>Taxa Padrão de Juros (%):</strong> Percentual aplicado a novos empréstimos.</li>
                        <li><strong>Tipo de Juros Padrão:</strong> Simples ou Composto.</li>
                        <li><strong>Taxa de Juros de Atraso (%):</strong> Juros aplicados em caso de inadimplência.</li>
                        <li><strong>Taxa de Multa de Atraso (%):</strong> Multa por pagamento após o vencimento.</li>
                      </ul>
                      
                      <p className="mt-3">
                        Estes valores são preenchidos automaticamente ao criar novos empréstimos, 
                        mas podem ser alterados individualmente em cada contrato se necessário.
                      </p>
                      
                      <h4 className="font-medium mt-3">Eventos da API Evolution:</h4>
                      <p>
                        Configure quais eventos disparam notificações automáticas via WhatsApp:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Novo Empréstimo</li>
                        <li>Novo Pagamento</li>
                        <li>Novo Cliente</li>
                        <li>Empréstimo Atrasado</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>Métodos de Pagamento</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>
                        Gerencie os métodos de pagamento disponíveis no sistema:
                      </p>
                      
                      <h4 className="font-medium mt-3">Adicionar Novo Método:</h4>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Acesse "Configurações > Métodos de Pagamento".</li>
                        <li>Clique em "Novo Método".</li>
                        <li>Preencha as informações:</li>
                        <ul className="list-disc pl-5 my-2">
                          <li><strong>Nome:</strong> Identificação do método (ex: "PIX", "Boleto").</li>
                          <li><strong>Descrição:</strong> Informações adicionais (opcional).</li>
                          <li><strong>Status:</strong> Ativo ou Inativo.</li>
                        </ul>
                        <li>Clique em "Salvar".</li>
                      </ol>
                      
                      <h4 className="font-medium mt-3">Gerenciar Métodos Existentes:</h4>
                      <p>
                        Na lista de métodos, você pode:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Editar:</strong> Modificar nome, descrição ou status.</li>
                        <li><strong>Ativar/Desativar:</strong> Alterar o status sem excluir o método.</li>
                        <li><strong>Excluir:</strong> Remover permanentemente (apenas se não utilizado).</li>
                      </ul>
                      
                      <p className="mt-3">
                        <strong>Nota:</strong> Desativar um método impede que ele seja selecionado em 
                        novos pagamentos, mas mantém o histórico de pagamentos anteriores intacto.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>Configurações de Perfil</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>
                        Gerencie suas informações pessoais e preferências de usuário:
                      </p>
                      
                      <h4 className="font-medium mt-3">Informações Pessoais:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Nome Completo:</strong> Seu nome exibido no sistema.</li>
                        <li><strong>Email:</strong> Endereço para comunicações do sistema.</li>
                        <li><strong>Telefone:</strong> Número para contato.</li>
                      </ul>
                      
                      <h4 className="font-medium mt-3">Segurança:</h4>
                      <p>
                        Opções para gerenciar a segurança da sua conta:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Alterar Senha:</strong> Atualizar sua senha de acesso.</li>
                        <li><strong>Autenticação de Dois Fatores:</strong> Proteção adicional para login.</li>
                      </ul>
                      
                      <h4 className="font-medium mt-3">Preferências:</h4>
                      <p>
                        Personalize sua experiência no sistema:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Tema:</strong> Claro ou escuro.</li>
                        <li><strong>Notificações:</strong> Configure alertas por email ou no sistema.</li>
                        <li><strong>Página Inicial:</strong> Defina qual tela aparece ao fazer login.</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>Categorias</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>
                        Gerencie categorias para organizar empréstimos e transações:
                      </p>
                      
                      <h4 className="font-medium mt-3">Adicionar Nova Categoria:</h4>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Acesse "Configurações {'>'}Categorias".</li>
                        <li>Clique em "Nova Categoria".</li>
                        <li>Preencha o nome e descrição da categoria.</li>
                        <li>Clique em "Salvar".</li>
                      </ol>
                      
                      <h4 className="font-medium mt-3">Gerenciar Categorias:</h4>
                      <p>
                        Na lista de categorias, você pode:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Editar nome e descrição.</li>
                        <li>Desativar categorias sem excluí-las.</li>
                        <li>Excluir categorias não utilizadas.</li>
                      </ul>
                      
                      <p className="mt-3">
                        <strong>Uso das Categorias:</strong> As categorias podem ser aplicadas a 
                        empréstimos durante a criação ou edição, permitindo melhor organização e 
                        filtragem nos relatórios e listagens.
                      </p>
                    </div>
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
