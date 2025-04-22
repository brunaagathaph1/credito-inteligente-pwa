
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare } from "lucide-react";

const MensagensETemplates = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mensagens e Templates</h1>
        <p className="text-muted-foreground">
          Gerencie mensagens automatizadas e templates para comunicação com clientes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Templates de Mensagens</CardTitle>
            <CardDescription>
              Crie e edite templates para mensagens automatizadas.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8 space-y-4">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">
              O editor visual de templates será implementado em breve.
            </p>
            <Button variant="outline" disabled>
              Criar Novo Template
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mensagens Programadas</CardTitle>
            <CardDescription>
              Agende mensagens para serem enviadas automaticamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8 space-y-4">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">
              O agendamento de mensagens automatizadas será implementado em breve.
            </p>
            <Button variant="outline" disabled>
              Agendar Nova Mensagem
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Integrações</CardTitle>
          <CardDescription>
            Configure integrações com webhooks e APIs de mensageria.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            As integrações com webhooks e Evolution API serão implementadas em breve.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MensagensETemplates;
