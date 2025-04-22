
import { useState } from "react";
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

// Esquema de validação para contas bancárias
const contaBancariaSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  banco: z.string().min(1, "Selecione um banco"),
  agencia: z.string().min(1, "Agência é obrigatória"),
  conta: z.string().min(1, "Conta é obrigatória"),
  tipo: z.enum(["corrente", "poupanca"]),
});

type ContaBancariaForm = z.infer<typeof contaBancariaSchema>;

// Lista de bancos comuns no Brasil
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

// Interface para o tipo de conta bancária
interface ContaBancaria {
  id: string;
  nome: string;
  banco: string;
  agencia: string;
  conta: string;
  tipo: "corrente" | "poupanca";
}

const ContasBancarias = () => {
  const [contas, setContas] = useState<ContaBancaria[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConta, setEditingConta] = useState<ContaBancaria | null>(null);

  // Configuração do formulário
  const form = useForm<ContaBancariaForm>({
    resolver: zodResolver(contaBancariaSchema),
    defaultValues: {
      nome: "",
      banco: "",
      agencia: "",
      conta: "",
      tipo: "corrente",
    },
  });

  // Função para lidar com o envio do formulário
  const onSubmit = (values: ContaBancariaForm) => {
    if (editingConta) {
      // Atualizar conta existente
      const updatedContas = contas.map((conta) =>
        conta.id === editingConta.id
          ? { ...values, id: editingConta.id }
          : conta
      );
      setContas(updatedContas);
      toast.success("Conta bancária atualizada com sucesso!");
    } else {
      // Adicionar nova conta
      const novaConta: ContaBancaria = {
        ...values,
        id: Math.random().toString(36).substr(2, 9),
      };
      setContas([...contas, novaConta]);
      toast.success("Conta bancária adicionada com sucesso!");
    }

    // Resetar formulário e fechar diálogo
    form.reset();
    setIsDialogOpen(false);
    setEditingConta(null);
  };

  // Função para abrir o diálogo de edição
  const handleEdit = (conta: ContaBancaria) => {
    setEditingConta(conta);
    form.reset(conta);
    setIsDialogOpen(true);
  };

  // Função para excluir uma conta
  const handleDelete = (id: string) => {
    setContas(contas.filter((conta) => conta.id !== id));
    toast.success("Conta bancária removida com sucesso!");
  };

  // Função para abrir diálogo de nova conta
  const handleOpenDialog = () => {
    form.reset({
      nome: "",
      banco: "",
      agencia: "",
      conta: "",
      tipo: "corrente",
    });
    setEditingConta(null);
    setIsDialogOpen(true);
  };

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
                      name="agencia"
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
                      name="conta"
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

      {contas.length === 0 ? (
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
                          ?.nome
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Agência:</span>
                    <span>{conta.agencia}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Conta:</span>
                    <span>{conta.conta}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo:</span>
                    <span>
                      {conta.tipo === "corrente"
                        ? "Conta Corrente"
                        : "Conta Poupança"}
                    </span>
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
