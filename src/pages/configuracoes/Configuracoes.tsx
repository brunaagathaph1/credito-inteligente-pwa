
import { useState, useEffect } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router-dom";
import Categorias from "./Categorias";
import MetodosPagamento from "./MetodosPagamento";
import ContasBancarias from "./ContasBancarias";

const Configuracoes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("geral");

  // Definir a aba ativa com base na URL atual quando o componente for montado
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/configuracoes/categorias")) {
      setActiveTab("categorias");
    } else if (path.includes("/configuracoes/metodos-pagamento")) {
      setActiveTab("pagamentos");
    } else if (path.includes("/configuracoes/contas-bancarias")) {
      setActiveTab("contas");
    } else {
      setActiveTab("geral");
    }
  }, [location.pathname]);

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
      case "contas":
        navigate("/configuracoes/contas-bancarias");
        break;
      case "financeiras":
        navigate("/configuracoes/financeiras");
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
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="financeiras">Configurações Financeiras</TabsTrigger>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
          <TabsTrigger value="pagamentos">Métodos de Pagamento</TabsTrigger>
          <TabsTrigger value="contas">Contas Bancárias</TabsTrigger>
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

        <TabsContent value="contas">
          <ContasBancarias />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;
