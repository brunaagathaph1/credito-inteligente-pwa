
import { Link, useLocation } from "react-router-dom";
import { Home, Users, DollarSign, BarChart, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const location = useLocation();
  
  const routes = [
    {
      href: "/dashboard",
      label: "Início",
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
  ];

  return (
    <div className="mobile-footer">
      {routes.map((route) => (
        <Link
          key={route.href}
          to={route.href}
          className={cn(
            "flex flex-col items-center justify-center space-y-1 text-xs font-medium transition-colors",
            location.pathname === route.href || 
            (route.href !== '/dashboard' && location.pathname.startsWith(route.href))
              ? "text-primary"
              : "text-muted-foreground hover:text-primary"
          )}
        >
          <route.icon className="h-5 w-5" />
          <span>{route.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default BottomNav;
