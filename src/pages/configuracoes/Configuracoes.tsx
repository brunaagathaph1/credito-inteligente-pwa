import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Tag, CreditCard, Building2, BarChart3, Shield, Clock, FileText } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ConfigOptionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

const ConfigOption = ({ title, description, icon, path }: ConfigOptionProps) => {
  const navigate = useNavigate();

  return (
    <Card className="hover:bg-accent/50 cursor-pointer transition-colors" onClick={() => navigate(path)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-medium">{title}</CardTitle>
        <div className="h-8 w-8 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const Configuracoes = () => {
  const [activeTab, setActiveTab] = useState("geral");
  const isMobile = useIsMobile();

  const navigationItems = [
    { id: "geral", label: "Geral", icon: User },
    { id: "financeiro", label: "Financeiro", icon: BarChart3 },
    { id: "sistema", label: "Sistema", icon: Shield }
  ];

  // Opções de configuração agrupadas por seção
  const configOptions = {
    geral: [
      {
        title: "Perfil",
        description: "Gerencie suas informações pessoais e preferências",
        icon: <User className="h-6 w-6" />,
        path: "/configuracoes/perfil"
      },
      {
        title: "Categorias",
        description: "Configure categorias para organizar transações",
        icon: <Tag className="h-6 w-6" />,
        path: "/configuracoes/categorias"
      },
      {
        title: "Métodos de Pagamento",
        description: "Gerencie os métodos de pagamento aceitos",
        icon: <CreditCard className="h-6 w-6" />,
        path: "/configuracoes/metodos-pagamento"
      }
    ],
    financeiro: [
      {
        title: "Configurações Financeiras",
        description: "Configure taxas de juros e parâmetros financeiros",
        icon: <BarChart3 className="h-6 w-6" />,
        path: "/configuracoes/financeiras"
      },
      {
        title: "Contas Bancárias",
        description: "Gerencie suas contas bancárias",
        icon: <Building2 className="h-6 w-6" />,
        path: "/configuracoes/contas-bancarias"
      }
    ],
    sistema: [
      {
        title: "Logs de Atividades",
        description: "Visualize o histórico de atividades do sistema",
        icon: <Clock className="h-6 w-6" />,
        path: "/configuracoes/logs"
      },
      {
        title: "Configurações Avançadas",
        description: "Configurações avançadas do sistema (admin)",
        icon: <Shield className="h-6 w-6" />,
        path: "/configuracoes/admin"
      },
      {
        title: "Manual do Usuário",
        description: "Acesse o manual de instruções do sistema",
        icon: <FileText className="h-6 w-6" />,
        path: "/manual"
      }
    ]
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Configurações" 
        description="Configure as preferências do sistema"
      />
      
      <div>
        {isMobile ? (
          <>
            {/* Barra de navegação mobile */}
            <div className="bg-card border-b shadow-sm mb-6">
              <nav className="flex w-full overflow-x-auto no-scrollbar">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`
                      flex-1 min-w-[33.33%] flex flex-col items-center justify-center py-3 px-1
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
            <div className="grid gap-4">
              {configOptions[activeTab as keyof typeof configOptions].map((option) => (
                <ConfigOption key={option.title} {...option} />
              ))}
            </div>
          </>
        ) : (
          <Tabs defaultValue="geral" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              {navigationItems.map((item) => (
                <TabsTrigger key={item.id} value={item.id} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(configOptions).map(([key, options]) => (
              <TabsContent key={key} value={key} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {options.map((option) => (
                    <ConfigOption key={option.title} {...option} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Configuracoes;
