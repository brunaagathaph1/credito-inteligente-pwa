
import React from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Settings, 
  CreditCard, 
  Users, 
  List, 
  BadgePercent, 
  Landmark, 
  Clock, 
  BookLock, 
  ShieldCheck, 
  UserCog 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Configuracoes = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return;
      
      // Verificar se o usuário é admin
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error("Error checking admin:", error);
        return;
      }
      
      setIsAdmin(data.role === 'admin');
    };

    checkAdmin();
  }, [user]);

  // Definição de áreas de configuração
  const configSections = [
    {
      title: "Perfil",
      description: "Gerencie suas informações pessoais",
      icon: <UserCog className="h-9 w-9 text-primary" />,
      link: "/configuracoes/perfil"
    },
    {
      title: "Configurações Financeiras",
      description: "Defina taxas de juros, prazos e valores padrão",
      icon: <BadgePercent className="h-9 w-9 text-primary" />,
      link: "/configuracoes/financeiras"
    },
    {
      title: "Categorias",
      description: "Gerencie categorias para organizar transações",
      icon: <List className="h-9 w-9 text-primary" />,
      link: "/configuracoes/categorias"
    },
    {
      title: "Métodos de Pagamento",
      description: "Configure formas de pagamento aceitas",
      icon: <CreditCard className="h-9 w-9 text-primary" />,
      link: "/configuracoes/metodos-pagamento"
    },
    {
      title: "Contas Bancárias",
      description: "Gerencie suas contas bancárias",
      icon: <Landmark className="h-9 w-9 text-primary" />,
      link: "/configuracoes/contas-bancarias"
    },
    {
      title: "Logs de Atividades",
      description: "Visualize o histórico de ações no sistema",
      icon: <Clock className="h-9 w-9 text-primary" />,
      link: "/configuracoes/logs"
    }
  ];

  // Seções apenas para administradores
  const adminOnlySections = [
    {
      title: "Configurações de Administrador",
      description: "Controle de acesso e configurações avançadas",
      icon: <ShieldCheck className="h-9 w-9 text-primary" />,
      link: "/configuracoes/admin"
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Gerencie todos os aspectos do sistema"
        icon={<Settings className="h-6 w-6" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {configSections.map((section, index) => (
          <Link to={section.link} key={index}>
            <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  {section.icon}
                  <CardTitle>{section.title}</CardTitle>
                </div>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}

        {isAdmin && adminOnlySections.map((section, index) => (
          <Link to={section.link} key={index}>
            <Card className="h-full transition-all hover:border-primary hover:shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  {section.icon}
                  <CardTitle>{section.title}</CardTitle>
                </div>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Configuracoes;
