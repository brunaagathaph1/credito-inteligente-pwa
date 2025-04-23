
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { List, Plus, Pencil, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Interface para as categorias
interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

const Categorias = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  // Fetch categorias
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;

      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!user) return;
    if (!name.trim()) {
      toast.error("Nome da categoria é obrigatório");
      return;
    }

    try {
      const newCategory = {
        name,
        description: description || null,
      };

      const { error } = await supabase.from("categories").insert(newCategory);

      if (error) throw error;

      toast.success("Categoria criada com sucesso!");
      setOpenDialog(false);
      setName("");
      setDescription("");
      fetchCategories();
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Erro ao criar categoria");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || "");
    setOpenDialog(true);
  };

  const handleUpdate = async () => {
    if (!user || !editingCategory) return;
    if (!name.trim()) {
      toast.error("Nome da categoria é obrigatório");
      return;
    }

    try {
      const { error } = await supabase
        .from("categories")
        .update({
          name,
          description: description || null,
        })
        .eq("id", editingCategory.id);

      if (error) throw error;

      toast.success("Categoria atualizada com sucesso!");
      setOpenDialog(false);
      setEditingCategory(null);
      setName("");
      setDescription("");
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Erro ao atualizar categoria");
    }
  };

  const confirmDelete = (id: string) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryToDelete);

      if (error) throw error;

      toast.success("Categoria excluída com sucesso!");
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Erro ao excluir categoria");
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setName("");
    setDescription("");
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Categorias" 
        description="Gerencie categorias para organizar suas transações"
        icon={<List className="h-6 w-6" />}
      />

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center">
          <div>
            <CardTitle>Lista de Categorias</CardTitle>
            <CardDescription>
              Categorias para classificação de empréstimos e pagamentos
            </CardDescription>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="mt-4 sm:mt-0 w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Nova Categoria
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? "Editar Categoria" : "Nova Categoria"}
                </DialogTitle>
                <DialogDescription>
                  {editingCategory
                    ? "Atualize os dados da categoria existente"
                    : "Adicione uma nova categoria para organizar suas transações"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Empréstimo Pessoal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva a finalidade desta categoria"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleDialogClose}>
                  Cancelar
                </Button>
                <Button onClick={editingCategory ? handleUpdate : handleCreate}>
                  {editingCategory ? "Salvar Alterações" : "Criar Categoria"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-6">Carregando categorias...</div>
          ) : categories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Nome</th>
                    <th className="text-left py-3 px-2 hidden md:table-cell">Descrição</th>
                    <th className="text-left py-3 px-2 hidden md:table-cell">Data de Criação</th>
                    <th className="text-right py-3 px-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2">{category.name}</td>
                      <td className="py-3 px-2 hidden md:table-cell">{category.description || "-"}</td>
                      <td className="py-3 px-2 hidden md:table-cell">
                        {format(new Date(category.created_at), "dd/MM/yyyy")}
                      </td>
                      <td className="py-3 px-2 text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => confirmDelete(category.id)}
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
              title="Nenhuma categoria encontrada"
              description="Crie categorias para organizar seus empréstimos e pagamentos"
              icon={<List className="h-12 w-12" />}
              action={
                <Button onClick={() => setOpenDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Criar Categoria
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
              Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.
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

export default Categorias;
