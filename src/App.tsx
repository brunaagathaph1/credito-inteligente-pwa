
import { Suspense, lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import OfflineIndicator from "./components/common/OfflineIndicator";

// Páginas públicas
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

// Páginas protegidas
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/clientes/Clientes";
import ClienteDetalhe from "./pages/clientes/ClienteDetalhe";
import NovoCliente from "./pages/clientes/NovoCliente";
import Emprestimos from "./pages/emprestimos/Emprestimos";
import EmprestimoDetalhe from "./pages/emprestimos/EmprestimoDetalhe";
import NovoEmprestimo from "./pages/emprestimos/NovoEmprestimo";
import Configuracoes from "./pages/configuracoes/Configuracoes";
import Categorias from "./pages/configuracoes/Categorias";
import MetodosPagamento from "./pages/configuracoes/MetodosPagamento";
import RelatoriosEGraficos from "./pages/relatorios/RelatoriosEGraficos";
import MensagensETemplates from "./pages/mensagens/MensagensETemplates";

// Error fallback
function ErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
  console.error("Application error:", error);
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Algo deu errado</h2>
      <p className="text-red-500 mb-4">{error.message || "Ocorreu um erro inesperado na aplicação."}</p>
      <Button onClick={resetErrorBoundary}>Tentar novamente</Button>
    </div>
  );
}

// Create the query client with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="credito-inteligente-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Rota da Página Inicial */}
                <Route path="/" element={<Index />} />
                
                {/* Rotas Públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/recuperar-senha" element={<ResetPassword />} />
                
                {/* Rotas Protegidas */}
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route path="/dashboard" element={
                    <Suspense fallback={<div>Carregando...</div>}>
                      <Dashboard />
                    </Suspense>
                  } />
                  
                  {/* Rotas de Clientes */}
                  <Route path="/clientes" element={<Clientes />} />
                  <Route path="/clientes/novo" element={<NovoCliente />} />
                  <Route path="/clientes/:id" element={<ClienteDetalhe />} />
                  
                  {/* Rotas de Empréstimos */}
                  <Route path="/emprestimos" element={<Emprestimos />} />
                  <Route path="/emprestimos/novo" element={<NovoEmprestimo />} />
                  <Route path="/emprestimos/:id" element={<EmprestimoDetalhe />} />
                  
                  {/* Rotas de Configurações */}
                  <Route path="/configuracoes/*" element={<Configuracoes />} />
                  <Route path="/configuracoes/categorias" element={<Categorias />} />
                  <Route path="/configuracoes/metodos-pagamento" element={<MetodosPagamento />} />
                  
                  {/* Outras Rotas */}
                  <Route path="/relatorios" element={<RelatoriosEGraficos />} />
                  <Route path="/mensagens" element={<MensagensETemplates />} />
                </Route>
                
                {/* Rota 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <OfflineIndicator />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
