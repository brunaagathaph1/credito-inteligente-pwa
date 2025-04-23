
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/EmptyState";
import { categoriasApi } from "@/integrations/supabase/helpers";
import { useAuth } from "@/contexts/AuthContext";

// Tipo para a categoria
type Categoria = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

const Categorias = () => {
  const { user } = useAuth();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCategoria, setCurrentCategoria] = useState<Categoria | null>(null);
  const [formData, setFormData] = useState({ nome: "", descricao: "" });

  // Buscar categorias
  useEffect(() => {
    if (user) {
      fetchCategorias();
    }
  }, [user]);

  async function fetchCategorias() {
    setIsLoading(true);
    const { data, error } = await categoriasApi.getAll();
    if (error) {
      toast.error("Erro ao buscar categorias");
      console.error("Erro:", error);
    } else {
      setCategorias(data || []);
    }
    setIsLoading(false);
  }

  const handleOpenNewDialog = () => {
    setCurrentCategoria(null);
    setFormData({ nome: "", descricao: "" });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (categoria: Categoria) => {
    setCurrentCategoria(categoria);
    setFormData({ 
      nome: categoria.name, 
      descricao: categoria.description || "" 
    });
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (categoria: Categoria) => {
    setCurrentCategoria(categoria);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.nome.trim()) {
      toast.error("O nome da categoria é obrigatório");
      return;
    }

    try {
      if (currentCategoria) {
        // Atualizar categoria
        const { error } = await categoriasApi.update(currentCategoria.id, {
          name: formData.nome,
          description: formData.descricao || null
        });
        
        if (error) throw error;
        toast.success("Categoria atualizada com sucesso");
      } else {
        // Criar nova categoria
        const { error } = await categoriasApi.create({
          name: formData.nome,
          description: formData.descricao || null
        });
        
        if (error) throw error;
        toast.success("Categoria criada com sucesso");
      }
      
      fetchCategorias();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      toast.error("Erro ao salvar categoria");
    }
  };

  const handleDelete = async () => {
    if (currentCategoria) {
      try {
        const { error } = await categoriasApi.delete(currentCategoria.id);
        
        if (error) throw error;
        toast.success("Categoria excluída com sucesso");
        fetchCategorias();
        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.error("Erro ao excluir categoria:", error);
        toast.error("Erro ao excluir categoria");
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gerenciamento de Categorias"
        description="Gerencie as categorias de empréstimos do sistema"
        actions={
          <Button onClick={handleOpenNewDialog} className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Nova Categoria
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-10">Carregando...</div>
      ) : categorias.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">Nome</TableHead>
                <TableHead className="w-1/3">Descrição</TableHead>
                <TableHead className="w-1/6">Data de Criação</TableHead>
                <TableHead className="w-1/6 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categorias.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell className="font-medium">{categoria.name}</TableCell>
                  <TableCell>{categoria.description}</TableCell>
                  <TableCell>
                    {new Date(categoria.created_at).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenEditDialog(categoria)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenDeleteDialog(categoria)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState
          title="Nenhuma categoria encontrada"
          description="Crie uma nova categoria para começar"
          icon={<AlertTriangle />}
          action={
            <Button onClick={handleOpenNewDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          }
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentCategoria ? "Editar Categoria" : "Nova Categoria"}
            </DialogTitle>
            <DialogDescription>
              {currentCategoria
                ? "Edite os detalhes da categoria existente"
                : "Preencha os campos para criar uma nova categoria"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Nome da categoria"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                placeholder="Descrição da categoria"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a categoria "
              {currentCategoria?.name}"? Esta ação não pode ser desfeita.
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
