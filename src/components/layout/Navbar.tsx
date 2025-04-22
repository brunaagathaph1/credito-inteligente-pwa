
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import ThemeToggle from "../theme-toggle";

const Navbar = () => {
  const usuario = {
    nome: "Usuário",
    email: "usuario@email.com",
    iniciais: "US",
  };

  return (
    <div className="mobile-header">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/dashboard" className="font-bold text-primary text-lg">
            Crédito Inteligente
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu usuario={usuario} />
        </div>
      </div>
    </div>
  );
};

interface UserMenuProps {
  usuario: {
    nome: string;
    email: string;
    iniciais: string;
  };
}

const UserMenu = ({ usuario }: UserMenuProps) => {
  const handleLogout = () => {
    // Implementar lógica de logout
    console.log("Logout");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{usuario.iniciais}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{usuario.nome}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {usuario.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/perfil" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Meu Perfil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/configuracoes" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Navbar;
