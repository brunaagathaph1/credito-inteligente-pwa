
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Plus, Pencil, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { EmptyState } from "@/components/common/EmptyState";
import { format } from "date-fns";

// Interface para métodos de pagamento
interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

const MetodosPagamento = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen]= useState(false);
  const [methodToDelete, setMethodToDelete] = useState<string | null>(null);

  // Carregar métodos de pagamento
  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .order("name");

      if (error) throw error;

      setMethods(data || []);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      toast.error("Erro ao carregar métodos de pagamento");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Nome do método de pagamento é obrigatório");
      return;
    }

    try {
      const newMethod = {
        name,
        description: description || null,
        is_active: isActive
      };

      const { error } = await supabase.from("payment_methods").insert(newMethod);

      if (error) throw error;

      toast.success("Método de pagamento criado com sucesso!");
      setOpenDialog(false);
      resetForm();
      fetchPaymentMethods();
    } catch (error) {
      console.error("Error creating payment method:", error);
      toast.error("Erro ao criar método de pagamento");
    }
  };

  const handleEdit = (method: PaymentMethod) => {
    setEditingMethod(method);
    setName(method.name);
    setDescription(method.description || "");
    setIsActive(method.is_active);
    setOpenDialog(true);
  };

  const handleUpdate = async () => {
    if (!editingMethod) return;
    if (!name.trim()) {
      toast.error("Nome do método de pagamento é obrigatório");
      return;
    }

    try {
      const { error } = await supabase
        .from("payment_methods")
        .update({
          name,
          description: description || null,
          is_active: isActive
        })
        .eq("id", editingMethod.id);

      if (error) throw error;

      toast.success("Método de pagamento atualizado com sucesso!");
      setOpenDialog(false);
      resetForm();
      fetchPaymentMethods();
    } catch (error) {
      console.error("Error updating payment method:", error);
      toast.error("Erro ao atualizar método de pagamento");
    }
  };

  const confirmDelete = (id: string) => {
    setMethodToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!methodToDelete) return;

    try {
      const { error } = await supabase
        .from("payment_methods")
        .delete()
        .eq("id", methodToDelete);

      if (error) throw error;

      toast.success("Método de pagamento excluído com sucesso!");
      setDeleteDialogOpen(false);
      setMethodToDelete(null);
      fetchPaymentMethods();
    } catch (error) {
      console.error("Error deleting payment method:", error);
      toast.error("Erro ao excluir método de pagamento");
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setIsActive(true);
    setEditingMethod(null);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Métodos de Pagamento" 
        description="Gerencie formas de pagamento para transações"
        icon={<CreditCard className="h-6 w-6" />}
      />

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center">
          <div>
            <CardTitle>Formas de Pagamento</CardTitle>
            <CardDescription>
              Métodos disponíveis para recebimento de pagamentos
            </CardDescription>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="mt-4 sm:mt-0 w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Novo Método
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingMethod ? "Editar Método de Pagamento" : "Novo Método de Pagamento"}
                </DialogTitle>
                <DialogDescription>
                  {editingMethod
                    ? "Atualize os dados do método de pagamento existente"
                    : "Adicione um novo método para recebimento de pagamentos"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Dinheiro, PIX, Transferência"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva detalhes sobre este método de pagamento"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                  <Label htmlFor="is_active">Ativo</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleDialogClose}>
                  Cancelar
                </Button>
                <Button onClick={editingMethod ? handleUpdate : handleCreate}>
                  {editingMethod ? "Salvar Alterações" : "Criar Método"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-6">Carregando métodos de pagamento...</div>
          ) : methods.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Nome</th>
                    <th className="text-left py-3 px-2 hidden md:table-cell">Descrição</th>
                    <th className="text-left py-3 px-2 hidden md:table-cell">Data de Criação</th>
                    <th className="text-center py-3 px-2">Status</th>
                    <th className="text-right py-3 px-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {methods.map((method) => (
                    <tr key={method.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2">{method.name}</td>
                      <td className="py-3 px-2 hidden md:table-cell">{method.description || "-"}</td>
                      <td className="py-3 px-2 hidden md:table-cell">
                        {format(new Date(method.created_at), "dd/MM/yyyy")}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          method.is_active 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {method.is_active ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(method)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => confirmDelete(method.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="Nenhum método de pagamento encontrado"
              description="Crie métodos de pagamento para receber pagamentos de empréstimos"
              icon={<CreditCard className="h-12 w-12" />}
              action={
                <Button onClick={() => setOpenDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Criar Método
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este método de pagamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MetodosPagamento;
