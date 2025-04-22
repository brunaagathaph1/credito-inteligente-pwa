
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ResetPassword from "@/pages/auth/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import NotFound from "@/pages/NotFound";
import Clientes from "@/pages/clientes/Clientes";
import NovoCliente from "@/pages/clientes/NovoCliente";
import ClienteDetalhe from "@/pages/clientes/ClienteDetalhe";
import Emprestimos from "@/pages/emprestimos/Emprestimos";
import NovoEmprestimo from "@/pages/emprestimos/NovoEmprestimo";
import EmprestimoDetalhe from "@/pages/emprestimos/EmprestimoDetalhe";
import RelatoriosEGraficos from "@/pages/relatorios/RelatoriosEGraficos";
import MensagensETemplates from "@/pages/mensagens/MensagensETemplates";
import Configuracoes from "@/pages/configuracoes/Configuracoes";
import Categorias from "@/pages/configuracoes/Categorias";
import MetodosPagamento from "@/pages/configuracoes/MetodosPagamento";
import ContasBancarias from "@/pages/configuracoes/ContasBancarias";
import LogsAtividades from "@/pages/configuracoes/LogsAtividades";
import Perfil from "@/pages/configuracoes/Perfil";
import ConfiguracoesFinanceiras from "@/pages/configuracoes/ConfiguracoesFinanceiras";
import { OfflineIndicator } from "@/components/common/OfflineIndicator";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="credito-inteligente-theme">
        <OfflineIndicator />
        <Toaster />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/recuperar-senha" element={<ResetPassword />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/clientes/novo" element={<NovoCliente />} />
              <Route path="/clientes/:id" element={<ClienteDetalhe />} />
              
              <Route path="/emprestimos" element={<Emprestimos />} />
              <Route path="/emprestimos/novo" element={<NovoEmprestimo />} />
              <Route path="/emprestimos/:id" element={<EmprestimoDetalhe />} />
              
              <Route path="/relatorios" element={<RelatoriosEGraficos />} />
              <Route path="/mensagens" element={<MensagensETemplates />} />
              
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="/configuracoes/categorias" element={<Categorias />} />
              <Route path="/configuracoes/metodos-pagamento" element={<MetodosPagamento />} />
              <Route path="/configuracoes/contas-bancarias" element={<ContasBancarias />} />
              <Route path="/configuracoes/logs-atividades" element={<LogsAtividades />} />
              <Route path="/configuracoes/perfil" element={<Perfil />} />
              <Route path="/configuracoes/financeiras" element={<ConfiguracoesFinanceiras />} />
            </Route>
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
