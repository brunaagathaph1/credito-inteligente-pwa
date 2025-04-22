
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusCircle, Building, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Esquema de validação para contas bancárias (com campos do banco real)
const contaBancariaSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  banco: z.string().min(1, "Selecione um banco"),
  numero_agencia: z.string().min(1, "Agência é obrigatória"),
  numero_conta: z.string().min(1, "Conta é obrigatória"),
  tipo: z.enum(["corrente", "poupanca"]),
  titular: z.string().optional(),
  cpf_cnpj: z.string().optional(),
  status: z.string().optional().default("ativo"),
  observacoes: z.string().optional(),
});

type ContaBancariaForm = z.infer<typeof contaBancariaSchema>;

// Bancos comuns
const bancosBrasileiros = [
  { codigo: "001", nome: "Banco do Brasil" },
  { codigo: "104", nome: "Caixa Econômica Federal" },
  { codigo: "237", nome: "Bradesco" },
  { codigo: "341", nome: "Itaú" },
  { codigo: "033", nome: "Santander" },
  { codigo: "756", nome: "Sicoob" },
  { codigo: "748", nome: "Sicredi" },
  { codigo: "077", nome: "Banco Inter" },
  { codigo: "380", nome: "PicPay" },
  { codigo: "290", nome: "PagBank" },
  { codigo: "260", nome: "Nubank" },
  { codigo: "336", nome: "C6 Bank" },
  { codigo: "000", nome: "Outro" },
];

// Interface para os dados vindo do banco (compatível com Supabase)
interface ContaBancaria {
  id: string;
  nome: string;
  banco: string;
  numero_agencia: string;
  numero_conta: string;
  tipo: "corrente" | "poupanca";
  titular?: string | null;
  cpf_cnpj?: string | null;
  status: string;
  observacoes?: string | null;
  criada_em?: string;
  atualizada_em?: string;
  criada_por?: string;
}

// Hooks principais
const ContasBancarias = () => {
  const { user } = useAuth();
  const [contas, setContas] = useState<ContaBancaria[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConta, setEditingConta] = useState<ContaBancaria | null>(null);

  // Configuração do formulário
  const form = useForm<ContaBancariaForm>({
    resolver: zodResolver(contaBancariaSchema),
    defaultValues: {
      nome: "",
      banco: "",
      numero_agencia: "",
      numero_conta: "",
      tipo: "corrente",
      titular: "",
      cpf_cnpj: "",
      status: "ativo",
      observacoes: "",
    },
  });

  // Buscar as contas do usuário
  async function fetchContas() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("contas_bancarias")
      .select("*")
      .order("criada_em", { ascending: false });
    if (error) {
      toast.error("Erro ao buscar contas bancárias");
      console.error("Erro ao buscar contas:", error);
    } else {
      // Forçar o tipo para cada conta, garantindo tipo: "corrente" | "poupanca"
      const contasFormatadas = data.map(conta => ({
        ...conta,
        tipo: conta.tipo as "corrente" | "poupanca"
      }));
      setContas(contasFormatadas);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (user) {
      fetchContas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Criar ou atualizar conta
  const onSubmit = async (values: ContaBancariaForm) => {
    if (!user) return;
    
    // Garantir que todos os campos obrigatórios estão presentes
    const contaDados = {
      nome: values.nome,
      banco: values.banco,
      numero_agencia: values.numero_agencia,
      numero_conta: values.numero_conta,
      tipo: values.tipo,
      titular: values.titular || null,
      cpf_cnpj: values.cpf_cnpj || null,
      status: values.status || "ativo",
      observacoes: values.observacoes || null,
    };
    
    if (editingConta) {
      const { error } = await supabase
        .from("contas_bancarias")
        .update({
          ...contaDados,
          atualizada_em: new Date().toISOString(),
        })
        .eq("id", editingConta.id);
      if (error) {
        toast.error("Erro ao atualizar conta bancária");
        console.error("Erro ao atualizar:", error);
      } else {
        toast.success("Conta bancária atualizada com sucesso!");
        fetchContas();
      }
    } else {
      const { error } = await supabase
        .from("contas_bancarias")
        .insert({
          ...contaDados,
          criada_por: user.id,
        });
      if (error) {
        toast.error("Erro ao adicionar conta bancária");
        console.error("Erro ao adicionar:", error);
      } else {
        toast.success("Conta bancária adicionada com sucesso!");
        fetchContas();
      }
    }
    form.reset();
    setIsDialogOpen(false);
    setEditingConta(null);
  };

  // Editar
  const handleEdit = (conta: ContaBancaria) => {
    setEditingConta(conta);
    form.reset({
      nome: conta.nome,
      banco: conta.banco,
      numero_agencia: conta.numero_agencia,
      numero_conta: conta.numero_conta,
      tipo: conta.tipo,
      titular: conta.titular || undefined,
      cpf_cnpj: conta.cpf_cnpj || undefined,
      status: conta.status,
      observacoes: conta.observacoes || undefined,
    });
    setIsDialogOpen(true);
  };

  // Excluir
  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("contas_bancarias")
      .delete()
      .eq("id", id);
    if (error) {
      toast.error("Erro ao remover conta bancária");
      console.error("Erro ao remover:", error);
    } else {
      toast.success("Conta bancária removida com sucesso!");
      fetchContas();
    }
  };

  // Abrir diálogo de nova conta
  const handleOpenDialog = () => {
    form.reset({
      nome: "",
      banco: "",
      numero_agencia: "",
      numero_conta: "",
      tipo: "corrente",
      titular: "",
      cpf_cnpj: "",
      status: "ativo",
      observacoes: "",
    });
    setEditingConta(null);
    setIsDialogOpen(true);
  };

  // Renderização principal
  return (
    <div className="space-y-6">
      <PageHeader
        title="Contas Bancárias"
        description="Gerencie suas contas bancárias para transações financeiras."
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Conta
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingConta ? "Editar Conta" : "Nova Conta Bancária"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Conta</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Conta Principal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="banco"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banco</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um banco" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {bancosBrasileiros.map((banco) => (
                              <SelectItem
                                key={banco.codigo}
                                value={banco.codigo}
                              >
                                {banco.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="numero_agencia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agência</FormLabel>
                          <FormControl>
                            <Input placeholder="0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="numero_conta"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Conta</FormLabel>
                          <FormControl>
                            <Input placeholder="00000-0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Conta</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="corrente">
                              Conta Corrente
                            </SelectItem>
                            <SelectItem value="poupanca">
                              Conta Poupança
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="titular"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titular</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Fulano de Tal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cpf_cnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF/CNPJ</FormLabel>
                        <FormControl>
                          <Input placeholder="000.000.000-00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="observacoes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Input placeholder="Observações, se houver" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingConta ? "Atualizar" : "Adicionar"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-10">Carregando...</div>
      ) : contas.length === 0 ? (
        <EmptyState
          title="Sem contas bancárias"
          description="Você ainda não cadastrou nenhuma conta bancária."
          icon={<Building className="h-8 w-8" />}
          action={
            <Button onClick={handleOpenDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Conta
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contas.map((conta) => (
            <Card key={conta.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex justify-between items-center">
                  <span>{conta.nome}</span>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(conta)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(conta.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Banco:</span>
                    <span>
                      {
                        bancosBrasileiros.find((b) => b.codigo === conta.banco)
                          ?.nome || conta.banco
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Agência:</span>
                    <span>{conta.numero_agencia}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Conta:</span>
                    <span>{conta.numero_conta}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo:</span>
                    <span>
                      {conta.tipo === "corrente"
                        ? "Conta Corrente"
                        : "Conta Poupança"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Titular:</span>
                    <span>{conta.titular}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CPF/CNPJ:</span>
                    <span>{conta.cpf_cnpj}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span>{conta.status}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContasBancarias;
