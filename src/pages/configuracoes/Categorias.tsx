
import { useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "@/components/common/EmptyState";

// Tipo para a categoria
type Categoria = {
  id: string;
  nome: string;
  descricao: string;
  createdAt: Date;
};

const Categorias = () => {
  const { toast } = useToast();
  const [categorias, setCategorias] = useState<Categoria[]>([
    {
      id: "1",
      nome: "Pessoal",
      descricao: "Empréstimos para uso pessoal",
      createdAt: new Date(),
    },
    {
      id: "2",
      nome: "Empresarial",
      descricao: "Empréstimos para empresas",
      createdAt: new Date(),
    },
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCategoria, setCurrentCategoria] = useState<Categoria | null>(null);
  const [formData, setFormData] = useState({ nome: "", descricao: "" });

  const handleOpenNewDialog = () => {
    setCurrentCategoria(null);
    setFormData({ nome: "", descricao: "" });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (categoria: Categoria) => {
    setCurrentCategoria(categoria);
    setFormData({ nome: categoria.nome, descricao: categoria.descricao });
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

  const handleSubmit = () => {
    if (!formData.nome.trim()) {
      toast({
        title: "Erro de validação",
        description: "O nome da categoria é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (currentCategoria) {
      // Editar categoria existente
      setCategorias((prev) =>
        prev.map((cat) =>
          cat.id === currentCategoria.id ? { ...cat, ...formData } : cat
        )
      );
      toast({
        title: "Categoria atualizada",
        description: `A categoria "${formData.nome}" foi atualizada com sucesso`,
      });
    } else {
      // Adicionar nova categoria
      const newCategoria: Categoria = {
        id: Date.now().toString(),
        nome: formData.nome,
        descricao: formData.descricao,
        createdAt: new Date(),
      };
      setCategorias((prev) => [...prev, newCategoria]);
      toast({
        title: "Categoria criada",
        description: `A categoria "${formData.nome}" foi criada com sucesso`,
      });
    }

    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (currentCategoria) {
      setCategorias((prev) => prev.filter((cat) => cat.id !== currentCategoria.id));
      toast({
        title: "Categoria excluída",
        description: `A categoria "${currentCategoria.nome}" foi excluída com sucesso`,
      });
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gerenciamento de Categorias"
        description="Gerencie as categorias de empréstimos do sistema"
        actions={
          <Button onClick={handleOpenNewDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Categoria
          </Button>
        }
      />

      {categorias.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categorias.map((categoria) => (
              <TableRow key={categoria.id}>
                <TableCell className="font-medium">{categoria.nome}</TableCell>
                <TableCell>{categoria.descricao}</TableCell>
                <TableCell>
                  {new Date(categoria.createdAt).toLocaleDateString("pt-BR")}
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
      ) : (
        <EmptyState
          title="Nenhuma categoria encontrada"
          description="Crie uma nova categoria para começar"
          icon={AlertTriangle}
          action={
            <Button onClick={handleOpenNewDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          }
        />
      )}

      {/* Dialog para criar/editar categoria */}
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

      {/* Dialog de confirmação para exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a categoria "
              {currentCategoria?.nome}"? Esta ação não pode ser desfeita.
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
