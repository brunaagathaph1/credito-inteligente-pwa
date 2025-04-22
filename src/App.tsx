
import { Suspense, lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Páginas públicas
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import NotFound from "./pages/NotFound";

// Páginas protegidas
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/clientes/Clientes";
import ClienteDetalhe from "./pages/clientes/ClienteDetalhe";
import NovoCliente from "./pages/clientes/NovoCliente";
import Emprestimos from "./pages/emprestimos/Emprestimos";
import EmprestimoDetalhe from "./pages/emprestimos/EmprestimoDetalhe";
import NovoEmprestimo from "./pages/emprestimos/NovoEmprestimo";
import Configuracoes from "./pages/configuracoes/Configuracoes";
import RelatoriosEGraficos from "./pages/relatorios/RelatoriosEGraficos";
import MensagensETemplates from "./pages/mensagens/MensagensETemplates";

// Error fallback
function ErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Algo deu errado</h2>
      <p className="text-red-500 mb-4">{error.message}</p>
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
                {/* Rotas Públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/recuperar-senha" element={<ResetPassword />} />
                
                {/* Rotas Protegidas */}
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
                  
                  {/* Outras Rotas */}
                  <Route path="/configuracoes/*" element={<Configuracoes />} />
                  <Route path="/relatorios" element={<RelatoriosEGraficos />} />
                  <Route path="/mensagens" element={<MensagensETemplates />} />
                </Route>
                
                {/* Rota 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
