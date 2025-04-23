import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  User, 
  CreditCard, 
  Tag, 
  Building2, 
  Clock, 
  Store, 
  Shield, 
  FileText,
  BarChart3
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ConfigOption = ({ title, description, icon, path }) => {
  const navigate = useNavigate();
  return (
    <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => navigate(path)}>
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

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Configurações" 
        description="Configure as preferências do sistema"
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-card">
          <TabsTrigger value="geral" onClick={() => setActiveTab("geral")}>
            Geral
          </TabsTrigger>
          <TabsTrigger value="financeiro" onClick={() => setActiveTab("financeiro")}>
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="sistema" onClick={() => setActiveTab("sistema")}>
            Sistema
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="geral" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ConfigOption
              title="Perfil"
              description="Gerencie suas informações pessoais e preferências"
              icon={<User className="h-6 w-6" />}
              path="/configuracoes/perfil"
            />
            <ConfigOption
              title="Categorias"
              description="Configure categorias para organizar transações"
              icon={<Tag className="h-6 w-6" />}
              path="/configuracoes/categorias"
            />
            <ConfigOption
              title="Métodos de Pagamento"
              description="Gerencie os métodos de pagamento aceitos"
              icon={<CreditCard className="h-6 w-6" />}
              path="/configuracoes/metodos-pagamento"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="financeiro" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ConfigOption
              title="Configurações Financeiras"
              description="Configure taxas de juros e parâmetros financeiros"
              icon={<BarChart3 className="h-6 w-6" />}
              path="/configuracoes/financeiras"
            />
            <ConfigOption
              title="Contas Bancárias"
              description="Gerencie suas contas bancárias"
              icon={<Building2 className="h-6 w-6" />}
              path="/configuracoes/contas-bancarias"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="sistema" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ConfigOption
              title="Logs de Atividades"
              description="Visualize o histórico de atividades do sistema"
              icon={<Clock className="h-6 w-6" />}
              path="/configuracoes/logs"
            />
            <ConfigOption
              title="Configurações Avançadas"
              description="Configurações avançadas do sistema (admin)"
              icon={<Shield className="h-6 w-6" />}
              path="/configuracoes/admin"
            />
            <ConfigOption
              title="Manual do Usuário"
              description="Acesse o manual de instruções do sistema"
              icon={<FileText className="h-6 w-6" />}
              path="/manual"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;
