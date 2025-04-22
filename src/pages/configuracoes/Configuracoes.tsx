
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Settings, 
  Tag, 
  CreditCard, 
  Building, 
  HistoryIcon, 
  User,
  Calculator
} from "lucide-react";

interface ConfigCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

const ConfigCard = ({ icon, title, description, href }: ConfigCardProps) => (
  <Link to={href}>
    <Card className="hover:bg-accent/50 transition-all cursor-pointer h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          {icon}
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  </Link>
);

const Configuracoes = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ConfigCard
          icon={<User className="h-5 w-5" />}
          title="Perfil"
          description="Gerencie suas informações pessoais"
          href="/configuracoes/perfil"
        />
        
        <ConfigCard
          icon={<Calculator className="h-5 w-5" />}
          title="Configurações Financeiras"
          description="Configure taxas de juros e condições financeiras"
          href="/configuracoes/financeiras"
        />
        
        <ConfigCard
          icon={<Tag className="h-5 w-5" />}
          title="Categorias"
          description="Gerencie categorias do sistema"
          href="/configuracoes/categorias"
        />
        
        <ConfigCard
          icon={<CreditCard className="h-5 w-5" />}
          title="Métodos de Pagamento"
          description="Configure métodos de pagamento aceitos"
          href="/configuracoes/metodos-pagamento"
        />
        
        <ConfigCard
          icon={<Building className="h-5 w-5" />}
          title="Contas Bancárias"
          description="Gerencie suas contas bancárias"
          href="/configuracoes/contas-bancarias"
        />
        
        <ConfigCard
          icon={<HistoryIcon className="h-5 w-5" />}
          title="Logs de Atividades"
          description="Visualize o histórico de atividades"
          href="/configuracoes/logs-atividades"
        />
      </div>
    </div>
  );
};

export default Configuracoes;
