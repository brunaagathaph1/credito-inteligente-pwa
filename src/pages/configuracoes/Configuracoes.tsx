
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import Categorias from "./Categorias";
import MetodosPagamento from "./MetodosPagamento";

const Configuracoes = () => {
  const [activeTab, setActiveTab] = useState("geral");
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Navegação para URL específica com base na aba
    switch(value) {
      case "categorias":
        navigate("/configuracoes/categorias");
        break;
      case "pagamentos":
        navigate("/configuracoes/metodos-pagamento");
        break;
      default:
        navigate("/configuracoes");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="financeiras">Configurações Financeiras</TabsTrigger>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
          <TabsTrigger value="pagamentos">Métodos de Pagamento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="geral">
          <div className="rounded-md border p-8 text-center">
            <p className="text-muted-foreground">
              Configurações gerais serão implementadas em breve.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="financeiras">
          <div className="rounded-md border p-8 text-center">
            <p className="text-muted-foreground">
              Configurações de taxas e regras de juros serão implementadas em breve.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="categorias">
          <Categorias />
        </TabsContent>
        
        <TabsContent value="pagamentos">
          <MetodosPagamento />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;
