
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/EmptyState";
import { metodosApi } from "@/integrations/supabase/helpers";
import { useAuth } from "@/contexts/AuthContext";

// Tipo para o método de pagamento
type MetodoPagamento = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

const MetodosPagamento = () => {
  const { user } = useAuth();
  const [metodos, setMetodos] = useState<MetodoPagamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMetodo, setCurrentMetodo] = useState<MetodoPagamento | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    ativo: true,
  });

  // Buscar métodos
  useEffect(() => {
    if (user) {
      fetchMetodos();
    }
  }, [user]);

  async function fetchMetodos() {
    setIsLoading(true);
    const { data, error } = await metodosApi.getAll();
    if (error) {
      toast.error("Erro ao buscar métodos de pagamento");
      console.error("Erro:", error);
    } else {
      setMetodos(data || []);
    }
    setIsLoading(false);
  }

  const handleOpenNewDialog = () => {
    setCurrentMetodo(null);
    setFormData({ nome: "", descricao: "", ativo: true });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (metodo: MetodoPagamento) => {
    setCurrentMetodo(metodo);
    setFormData({
      nome: metodo.name,
      descricao: metodo.description || "",
      ativo: metodo.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (metodo: MetodoPagamento) => {
    setCurrentMetodo(metodo);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, ativo: checked }));
  };

  const handleSubmit = async () => {
    if (!formData.nome.trim()) {
      toast.error("O nome do método é obrigatório");
      return;
    }

    try {
      if (currentMetodo) {
        // Atualizar método
        const { error } = await metodosApi.update(currentMetodo.id, {
          name: formData.nome,
          description: formData.descricao || null,
          is_active: formData.ativo,
        });

        if (error) throw error;
        toast.success("Método de pagamento atualizado com sucesso");
      } else {
        // Criar novo método
        const { error } = await metodosApi.create({
          name: formData.nome,
          description: formData.descricao || null,
          is_active: formData.ativo,
        });

        if (error) throw error;
        toast.success("Método de pagamento criado com sucesso");
      }

      fetchMetodos();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Erro ao salvar método de pagamento:", error);
      toast.error("Erro ao salvar método de pagamento");
    }
  };

  const handleDelete = async () => {
    if (currentMetodo) {
      try {
        const { error } = await metodosApi.delete(currentMetodo.id);

        if (error) throw error;
        toast.success("Método de pagamento excluído com sucesso");
        fetchMetodos();
        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.error("Erro ao excluir método de pagamento:", error);
        toast.error("Erro ao excluir método de pagamento");
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Métodos de Pagamento"
        description="Gerencie os métodos de pagamento disponíveis no sistema"
        actions={
          <Button onClick={handleOpenNewDialog} className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Novo Método
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-10">Carregando...</div>
      ) : metodos.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4">Nome</TableHead>
                <TableHead className="w-1/3">Descrição</TableHead>
                <TableHead className="w-1/6">Status</TableHead>
                <TableHead className="w-1/6">Data de Criação</TableHead>
                <TableHead className="w-1/6 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metodos.map((metodo) => (
                <TableRow key={metodo.id}>
                  <TableCell className="font-medium">{metodo.name}</TableCell>
                  <TableCell>{metodo.description}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        metodo.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {metodo.is_active ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(metodo.created_at).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenEditDialog(metodo)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOpenDeleteDialog(metodo)}
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
          title="Nenhum método de pagamento encontrado"
          description="Crie um novo método para começar"
          icon={<AlertTriangle />}
          action={
            <Button onClick={handleOpenNewDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Método
            </Button>
          }
        />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentMetodo ? "Editar Método" : "Novo Método"}
            </DialogTitle>
            <DialogDescription>
              {currentMetodo
                ? "Edite os detalhes do método de pagamento existente"
                : "Preencha os campos para criar um novo método de pagamento"}
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
                placeholder="Nome do método"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                placeholder="Descrição do método"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="ativo"
                checked={formData.ativo}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="ativo">Ativo</Label>
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

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o método de pagamento "
              {currentMetodo?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MetodosPagamento;
