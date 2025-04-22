import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  DollarSign, 
  BarChart, 
  Mail, 
  Settings,
  LogOut,
  Book
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ThemeToggle from "../theme-toggle";
import { useAuth } from "@/contexts/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const mainRoutes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/clientes",
      label: "Clientes",
      icon: Users,
    },
    {
      href: "/emprestimos",
      label: "Empréstimos",
      icon: DollarSign,
    },
    {
      href: "/relatorios",
      label: "Relatórios",
      icon: BarChart,
    },
    {
      href: "/mensagens",
      label: "Mensagens",
      icon: Mail,
    },
    {
      href: "/manual",
      label: "Manual do Usuário",
      icon: Book,
    },
  ];

  const utilityRoutes = [
    {
      href: "/configuracoes",
      label: "Configurações",
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="hidden md:flex flex-col h-screen w-64 bg-sidebar border-r">
      <div className="p-6">
        <Link to="/dashboard" className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Crédito Inteligente</span>
        </Link>
      </div>
      
      <div className="flex-1 px-4 py-4">
        <nav className="space-y-6">
          <div className="space-y-1">
            {mainRoutes.map((route) => (
              <Link
                key={route.href}
                to={route.href}
              >
                <Button
                  variant={location.pathname === route.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    location.pathname === route.href 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                      : "text-sidebar-foreground"
                  )}
                >
                  <route.icon className="mr-2 h-5 w-5" />
                  {route.label}
                </Button>
              </Link>
            ))}
          </div>
          
          <div className="space-y-1">
            <div className="text-xs uppercase text-sidebar-foreground/60 font-semibold mb-2 pl-4">
              Sistema
            </div>
            {utilityRoutes.map((route) => (
              <Link
                key={route.href}
                to={route.href}
              >
                <Button
                  variant={location.pathname === route.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    location.pathname === route.href 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                      : "text-sidebar-foreground"
                  )}
                >
                  <route.icon className="mr-2 h-5 w-5" />
                  {route.label}
                </Button>
              </Link>
            ))}
          </div>
        </nav>
      </div>
      
      <div className="p-4 border-t flex justify-between items-center">
        <ThemeToggle />
        <Button variant="ghost" onClick={handleLogout} className="justify-start">
          <LogOut className="mr-2 h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
