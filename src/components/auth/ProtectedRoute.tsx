
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

// Este é um componente de proteção de rota básico
// Quando integrado com Supabase, será atualizado para usar o hook de autenticação real
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Temporariamente, vamos simular um usuário autenticado
  const isAuthenticated = true; // Isso será alterado para verificar autenticação real

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
