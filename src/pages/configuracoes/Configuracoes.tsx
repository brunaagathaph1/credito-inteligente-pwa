
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Users, CreditCard, Building, Database, Activity } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import Categorias from "./Categorias";
import MetodosPagamento from "./MetodosPagamento";
import ContasBancarias from "./ContasBancarias";
import LogsAtividades from "./LogsAtividades";

const configuracoes = [
  {
    id: "categorias",
    title: "Categorias",
    icon: <Database className="h-6 w-6 text-primary" />,
    description: "Gerenciar categorias de empréstimos",
    path: "/configuracoes/categorias",
  },
  {
    id: "metodos-pagamento",
    title: "Métodos de Pagamento",
    icon: <CreditCard className="h-6 w-6 text-primary" />,
    description: "Gerenciar formas de pagamento",
    path: "/configuracoes/metodos-pagamento",
  },
  {
    id: "contas-bancarias",
    title: "Contas Bancárias",
    icon: <Building className="h-6 w-6 text-primary" />,
    description: "Gerenciar contas bancárias",
    path: "/configuracoes/contas-bancarias",
  },
  {
    id: "financeiras",
    title: "Financeiras",
    icon: <Settings className="h-6 w-6 text-primary" />,
    description: "Gerenciar taxas e configurações financeiras",
    path: "/configuracoes/financeiras",
  },
  {
    id: "logs-atividades",
    title: "Logs de Atividades",
    icon: <Activity className="h-6 w-6 text-primary" />,
    description: "Histórico de atividades no sistema",
    path: "/configuracoes/logs-atividades",
  },
  {
    id: "usuarios",
    title: "Usuários",
    icon: <Users className="h-6 w-6 text-primary" />,
    description: "Gerenciar usuários e permissões",
    path: "/configuracoes/usuarios",
    disabled: true,
  },
];

export default function Configuracoes() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  // Determinar qual componente exibir com base na rota
  const renderConfiguracaoComponent = () => {
    switch (pathname) {
      case "/configuracoes/categorias":
        return <Categorias />;
      case "/configuracoes/metodos-pagamento":
        return <MetodosPagamento />;
      case "/configuracoes/contas-bancarias":
        return <ContasBancarias />;
      case "/configuracoes/logs-atividades":
        return <LogsAtividades />;
      // Outros casos conforme criados
      default:
        return null;
    }
  };

  // Se estivermos em uma rota específica, mostrar o componente correspondente
  if (pathname !== "/configuracoes") {
    return renderConfiguracaoComponent();
  }

  // Caso contrário, mostrar o menu de configurações
  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Gerencie as configurações do sistema"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {configuracoes.map((config) => (
          <Card
            key={config.id}
            className={`cursor-pointer hover:bg-muted/50 transition-colors ${
              config.disabled ? "opacity-60 cursor-not-allowed" : ""
            }`}
            onClick={() => {
              if (!config.disabled) {
                navigate(config.path);
              }
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {config.title}
              </CardTitle>
              {config.icon}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {config.description}
              </p>
              {config.disabled && (
                <div className="text-xs mt-2 text-yellow-600 dark:text-yellow-400">
                  Disponível em breve
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
