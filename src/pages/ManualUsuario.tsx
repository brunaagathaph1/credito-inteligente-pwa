import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';
import { Book, CreditCard, FileText, MessageSquare, Settings, Users } from 'lucide-react';

const ManualUsuario = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("inicio");
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const navigationItems = [
    { id: "inicio", label: "Início", icon: Settings },
    { id: "clientes", label: "Clientes", icon: Users },
    { id: "emprestimos", label: "Empréstimos", icon: CreditCard },
    { id: "mensagens", label: "Mensagens", icon: MessageSquare },
    { id: "faq", label: "FAQ", icon: Book }
  ];
  
  return (
    <div className="space-y-6">
      {isMobile ? (
        <div>
          {/* Cabeçalho */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Manual do Usuário</h2>
            <p className="text-muted-foreground">
              Instruções e tutoriais para auxiliar no uso do sistema.
            </p>
          </div>

          {/* Barra de navegação */}
          <div className="bg-card border-b shadow-sm mb-6">
            <nav className="flex w-full overflow-x-auto no-scrollbar">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`
                    flex-1 min-w-[20%] flex flex-col items-center justify-center py-3 px-1
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
            {activeTab === "inicio" && <ManualInicio />}
            {activeTab === "clientes" && <ManualClientes />}
            {activeTab === "emprestimos" && <ManualEmprestimos />}
            {activeTab === "mensagens" && <ManualMensagens />}
            {activeTab === "faq" && <ManualFAQ />}
          </div>
        </div>
      ) : (
        <>
          {/* Cabeçalho */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Manual do Usuário</h2>
            <p className="text-muted-foreground">
              Instruções e tutoriais para auxiliar no uso do sistema.
            </p>
          </div>

          {/* Versão desktop com tabs */}
          <Tabs defaultValue="inicio" className="space-y-4">
            <TabsList className="flex space-x-2">
              {navigationItems.map((item) => (
                <TabsTrigger key={item.id} value={item.id} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {navigationItems.map((item) => (
              <TabsContent key={item.id} value={item.id}>
                {item.id === "inicio" && <ManualInicio />}
                {item.id === "clientes" && <ManualClientes />}
                {item.id === "emprestimos" && <ManualEmprestimos />}
                {item.id === "mensagens" && <ManualMensagens />}
                {item.id === "faq" && <ManualFAQ />}
              </TabsContent>
            ))}
          </Tabs>
        </>
      )}
    </div>
  );
};

const ManualInicio = () => (
  <Card>
    <CardHeader>
      <CardTitle>Introdução ao Sistema</CardTitle>
      <CardDescription>Visão geral e funcionalidades principais</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <h3 className="font-bold text-lg mb-1">Bem-vindo ao Crédito Inteligente</h3>
        <p className="text-muted-foreground">
          O sistema Crédito Inteligente foi desenvolvido para facilitar a gestão de clientes, empréstimos e comunicações. 
          Esta plataforma oferece ferramentas completas para automação e controle de todo o ciclo de crédito.
        </p>
      </div>
      
      <div>
        <h3 className="font-bold text-lg mb-1">Visão Geral</h3>
        <p className="text-muted-foreground">
          Na página inicial (Dashboard), você encontra informações resumidas sobre empréstimos ativos, pagamentos recentes e indicadores financeiros.
          Use o menu lateral (ou menu inferior no mobile) para navegar entre as diferentes seções do sistema.
        </p>
      </div>
      
      <div>
        <h3 className="font-bold text-lg mb-1">Módulos Principais</h3>
        <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
          <li><strong>Clientes:</strong> Cadastro e gestão de informações dos clientes</li>
          <li><strong>Empréstimos:</strong> Controle de empréstimos, parcelas e renegociações</li>
          <li><strong>Mensagens:</strong> Comunicação automatizada com clientes</li>
          <li><strong>Relatórios:</strong> Análises financeiras e demonstrativos</li>
          <li><strong>Configurações:</strong> Personalização do sistema</li>
        </ul>
      </div>
    </CardContent>
    <CardFooter>
      <Badge variant="outline">Versão 1.0</Badge>
    </CardFooter>
  </Card>
);

const ManualClientes = () => (
  <Card>
    <CardHeader>
      <CardTitle>Gestão de Clientes</CardTitle>
      <CardDescription>Como cadastrar e gerenciar clientes</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <h3 className="font-bold text-lg mb-1">Cadastrando um Novo Cliente</h3>
        <p className="text-muted-foreground">
          Para cadastrar um novo cliente, acesse o menu "Clientes" e clique no botão "Novo Cliente". 
          Preencha todas as informações obrigatórias como nome, CPF e telefone.
        </p>
      </div>
      
      <div>
        <h3 className="font-bold text-lg mb-1">Consultando Clientes</h3>
        <p className="text-muted-foreground">
          Na lista de clientes, você pode utilizar a barra de busca para encontrar um cliente específico por nome, CPF ou email.
          Clique em "Ver detalhes" para acessar todas as informações do cliente.
        </p>
      </div>
      
      <div>
        <h3 className="font-bold text-lg mb-1">Atualizando Dados</h3>
        <p className="text-muted-foreground">
          Na página de detalhes do cliente, utilize o botão "Editar" para atualizar as informações cadastrais.
          Todas as alterações são registradas e podem ser verificadas no histórico de atividades.
        </p>
      </div>
    </CardContent>
  </Card>
);

const ManualEmprestimos = () => (
  <Card>
    <CardHeader>
      <CardTitle>Gestão de Empréstimos</CardTitle>
      <CardDescription>Como criar e gerenciar empréstimos</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <h3 className="font-bold text-lg mb-1">Criando Empréstimos</h3>
        <p className="text-muted-foreground">
          Acesse o menu "Empréstimos" e clique em "Novo Empréstimo". Selecione o cliente, defina o valor, taxa de juros e prazo.
          O sistema calculará automaticamente as parcelas e datas de vencimento.
        </p>
      </div>
      
      <div>
        <h3 className="font-bold text-lg mb-1">Registrando Pagamentos</h3>
        <p className="text-muted-foreground">
          Na página de detalhes do empréstimo, localize a parcela desejada e clique em "Registrar Pagamento".
          Informe o valor pago, data e método de pagamento.
        </p>
      </div>
      
      <div>
        <h3 className="font-bold text-lg mb-1">Renegociação</h3>
        <p className="text-muted-foreground">
          Caso seja necessário renegociar um empréstimo, acesse a página de detalhes e clique no botão "Renegociar".
          Defina as novas condições e confirme a operação. O sistema manterá o histórico da negociação original.
        </p>
      </div>
    </CardContent>
  </Card>
);

const ManualMensagens = () => (
  <Card>
    <CardHeader>
      <CardTitle>Sistema de Comunicação</CardTitle>
      <CardDescription>Como enviar mensagens e configurar automações</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <h3 className="font-bold text-lg mb-1">Criando Templates</h3>
        <p className="text-muted-foreground">
          Na seção "Templates" do módulo de Mensagens, crie modelos personalizados para comunicação com clientes.
          Utilize variáveis para personalizar o conteúdo automaticamente.
        </p>
      </div>
      
      <div>
        <h3 className="font-bold text-lg mb-1">Enviando Mensagens</h3>
        <p className="text-muted-foreground">
          Para enviar uma mensagem manual, selecione o cliente, o tipo de comunicação (WhatsApp, Email ou SMS)
          e o conteúdo desejado. É possível utilizar um template ou criar uma mensagem personalizada.
        </p>
      </div>
      
      <div>
        <h3 className="font-bold text-lg mb-1">Agendamentos Automáticos</h3>
        <p className="text-muted-foreground">
          Configure regras para envio automático de mensagens baseado em eventos como vencimento de parcelas,
          pagamentos confirmados ou atrasos. Defina o template a ser utilizado e o momento do envio.
        </p>
      </div>
    </CardContent>
  </Card>
);

const ManualFAQ = () => (
  <Card>
    <CardHeader>
      <CardTitle>Perguntas Frequentes</CardTitle>
      <CardDescription>Dúvidas comuns sobre o sistema</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <h3 className="font-bold text-lg mb-1">Como recuperar minha senha?</h3>
        <p className="text-muted-foreground">
          Na tela de login, clique em "Esqueci minha senha" e siga as instruções enviadas para seu email.
        </p>
      </div>
      
      <div>
        <h3 className="font-bold text-lg mb-1">Como configurar notificações?</h3>
        <p className="text-muted-foreground">
          Acesse o menu "Configurações" e selecione "Notificações". Lá você pode personalizar quais alertas deseja receber.
        </p>
      </div>
      
      <div>
        <h3 className="font-bold text-lg mb-1">Posso acessar em dispositivos móveis?</h3>
        <p className="text-muted-foreground">
          Sim, o sistema é responsivo e funciona em smartphones e tablets através do navegador web.
        </p>
      </div>
      
      <div>
        <h3 className="font-bold text-lg mb-1">Como exportar relatórios?</h3>
        <p className="text-muted-foreground">
          Na seção de Relatórios, após gerar o relatório desejado, clique no botão "Exportar" e escolha o formato preferido (PDF ou Excel).
        </p>
      </div>
    </CardContent>
  </Card>
);

export default ManualUsuario;
