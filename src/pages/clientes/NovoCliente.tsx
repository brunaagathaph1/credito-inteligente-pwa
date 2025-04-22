
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { useClients } from "@/hooks/useClients";

// Schema de validação
const formSchema = z.object({
  nome: z.string()
    .min(3, "Nome precisa ter pelo menos 3 caracteres")
    .max(100, "Nome não pode ter mais de 100 caracteres"),
  cpf: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  endereco: z.string().optional(),
  observacoes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const NovoCliente = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { logActivity } = useActivityLogs();
  const { createClient } = useClients();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      cpf: "",
      telefone: "",
      email: "",
      endereco: "",
      observacoes: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast.error("Você precisa estar autenticado para cadastrar um cliente");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Make sure nome is explicitly passed and treated as required
      const clienteData = {
        nome: data.nome, // Explicitly include nome as required field
        cpf: data.cpf,
        telefone: data.telefone,
        email: data.email,
        endereco: data.endereco,
        observacoes: data.observacoes,
        created_by: user.id,
      };
      
      const result = await createClient.mutateAsync(clienteData);
      
      if (result.error) throw result.error;
      
      // Registrar atividade
      await logActivity("Cadastrou novo cliente", { cliente_id: result.data.id, nome: data.nome });
      
      toast.success("Cliente cadastrado com sucesso!");
      navigate("/clientes");
    } catch (error: any) {
      console.error("Erro ao cadastrar cliente:", error);
      toast.error(`Erro ao cadastrar cliente: ${error.message || "Erro desconhecido"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => navigate("/clientes")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Novo Cliente</h1>
          <p className="text-muted-foreground">
            Cadastre um novo cliente para gerenciar empréstimos.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Informe os dados básicos do cliente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input placeholder="000.000.000-00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="email@exemplo.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
              <CardDescription>
                Informe o endereço do cliente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="endereco"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Endereço completo do cliente"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
              <CardDescription>
                Informações adicionais que podem ser úteis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Observações sobre o cliente, preferências de contato, etc."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => navigate("/clientes")}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  "Salvando..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Cliente
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default NovoCliente;
