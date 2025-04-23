
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ThemeProvider } from './components/theme-provider';

// Pages
import NotFound from './pages/NotFound';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ResetPassword from './pages/auth/ResetPassword';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import RelatoriosEGraficos from './pages/relatorios/RelatoriosEGraficos';
import Clientes from './pages/clientes/Clientes';
import NovoCliente from './pages/clientes/NovoCliente';
import ClienteDetalhe from './pages/clientes/ClienteDetalhe';
import Emprestimos from './pages/emprestimos/Emprestimos';
import NovoEmprestimo from './pages/emprestimos/NovoEmprestimo';
import EmprestimoDetalhe from './pages/emprestimos/EmprestimoDetalhe';
import Configuracoes from './pages/configuracoes/Configuracoes';
import Perfil from './pages/configuracoes/Perfil';
import Categorias from './pages/configuracoes/Categorias';
import ConfiguracoesFinanceiras from './pages/configuracoes/ConfiguracoesFinanceiras';
import MetodosPagamento from './pages/configuracoes/MetodosPagamento';
import ContasBancarias from './pages/configuracoes/ContasBancarias';
import LogsAtividades from './pages/configuracoes/LogsAtividades';
import AdminSettings from './pages/configuracoes/AdminSettings';
import MensagensETemplates from './pages/mensagens/MensagensETemplates';
import ManualUsuario from './pages/ManualUsuario';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      // Relatórios
      {
        path: '/relatorios',
        element: <RelatoriosEGraficos />,
      },
      // Clientes
      {
        path: '/clientes',
        element: <Clientes />,
      },
      {
        path: '/clientes/novo',
        element: <NovoCliente />,
      },
      {
        path: '/clientes/:id',
        element: <ClienteDetalhe />,
      },
      // Empréstimos
      {
        path: '/emprestimos',
        element: <Emprestimos />,
      },
      {
        path: '/emprestimos/novo',
        element: <NovoEmprestimo />,
      },
      {
        path: '/emprestimos/:id',
        element: <EmprestimoDetalhe />,
      },
      // Mensagens
      {
        path: '/mensagens',
        element: <MensagensETemplates />,
      },
      // Configurações
      {
        path: '/configuracoes',
        element: <Configuracoes />,
      },
      {
        path: '/configuracoes/perfil',
        element: <Perfil />,
      },
      {
        path: '/perfil',
        element: <Perfil />,
      },
      {
        path: '/configuracoes/categorias',
        element: <Categorias />,
      },
      {
        path: '/configuracoes/financeiras',
        element: <ConfiguracoesFinanceiras />,
      },
      {
        path: '/configuracoes/metodos-pagamento',
        element: <MetodosPagamento />,
      },
      {
        path: '/configuracoes/contas-bancarias',
        element: <ContasBancarias />,
      },
      {
        path: '/configuracoes/logs',
        element: <LogsAtividades />,
      },
      {
        path: '/configuracoes/admin',
        element: <AdminSettings />,
      },
      // Manual do usuário
      {
        path: '/manual',
        element: <ManualUsuario />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
