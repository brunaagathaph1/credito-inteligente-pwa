
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout = () => {
  const isMobile = useIsMobile();
  const location = useLocation();

  // Verificar se estamos em uma rota com potenciais problemas de overflow
  const isOverflowRoute = 
    location.pathname.includes('/configuracoes/categorias') || 
    location.pathname.includes('/configuracoes/metodos-pagamento') ||
    location.pathname.includes('/mensagens') ||
    location.pathname.includes('/manual') ||
    location.pathname.includes('/relatorios');

  return (
    <div className="min-h-screen flex flex-col">
      {isMobile ? (
        <>
          <Navbar />
          <main className={`flex-1 container mx-auto px-4 pb-16 ${isOverflowRoute ? 'overflow-visible' : ''}`}>
            <Outlet />
          </main>
          <BottomNav />
        </>
      ) : (
        <div className="flex">
          <Sidebar />
          <main className="flex-1 px-6 py-8 overflow-visible">
            <Outlet />
          </main>
        </div>
      )}
    </div>
  );
};

export default Layout;
