
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-4xl font-bold mb-4">Crédito Inteligente</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Sistema de gerenciamento de empréstimos e controle financeiro
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/login">Entrar no Sistema</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/registro">Criar uma Conta</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
