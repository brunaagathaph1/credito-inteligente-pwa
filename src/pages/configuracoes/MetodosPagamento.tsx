import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, AlertTriangle, CreditCard } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "@/components/common/EmptyState";

// Tipo para método de pagamento
type MetodoPagamento = {
  id: string;
  nome: string;
  descricao: string;
  ativo: boolean;
  createdAt: Date;
};

const MetodosPagamento = () => {
  const { toast } = useToast();
  const [metodos, setMetodos] = useState<MetodoPagamento[]>([
    {
      id: "1",
      nome: "Dinheiro",
      descricao: "Pagamento em espécie",
      ativo: true,
      createdAt: new Date(),
    },
    {
      id: "2",
      nome: "PIX",
      descricao: "Transferência via PIX",
      ativo: true,
      createdAt: new Date(),
    },
    {
      id: "3",
      nome: "Cartão de Crédito",
      descricao: "Pagamento via cartão de crédito",
      ativo: false,
      createdAt: new Date(),
    },
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMetodo, setCurrentMetodo] = useState<MetodoPagamento | null>(null);
  const [formData, setFormData] = useState({ nome: "", descricao: "", ativo: true });

  const handleOpenNewDialog = () => {
    setCurrentMetodo(null);
    setFormData({ nome: "", descricao: "", ativo: true });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (metodo: MetodoPagamento) => {
    setCurrentMetodo(metodo);
    setFormData({ nome: metodo.nome, descricao: metodo.descricao, ativo: metodo.ativo });
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

  const handleSubmit = () => {
    if (!formData.nome.trim()) {
      toast({
        title: "Erro de validação",
        description: "O nome do método de pagamento é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (currentMetodo) {
      // Editar método existente
      setMetodos((prev) =>
        prev.map((metodo) =>
          metodo.id === currentMetodo.id ? { ...metodo, ...formData } : metodo
        )
      );
      toast({
        title: "Método de pagamento atualizado",
        description: `O método "${formData.nome}" foi atualizado com sucesso`,
      });
    } else {
      // Adicionar novo método
      const newMetodo: MetodoPagamento = {
        id: Date.now().toString(),
        nome: formData.nome,
        descricao: formData.descricao,
        ativo: formData.ativo,
        createdAt: new Date(),
      };
      setMetodos((prev) => [...prev, newMetodo]);
      toast({
        title: "Método de pagamento criado",
        description: `O método "${formData.nome}" foi criado com sucesso`,
      });
    }

    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    if (currentMetodo) {
      setMetodos((prev) => prev.filter((metodo) => metodo.id !== currentMetodo.id));
      toast({
        title: "Método de pagamento excluído",
        description: `O método "${currentMetodo.nome}" foi excluído com sucesso`,
      });
      setIsDeleteDialogOpen(false);
    }
  };

  const toggleStatus = (id: string) => {
    setMetodos((prev) =>
      prev.map((metodo) =>
        metodo.id === id ? { ...metodo, ativo: !metodo.ativo } : metodo
      )
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Métodos de Pagamento"
        description="Gerencie os métodos de pagamento disponíveis no sistema"
        actions={
          <Button onClick={handleOpenNewDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Método
          </Button>
        }
      />

      {metodos.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metodos.map((metodo) => (
              <TableRow key={metodo.id}>
                <TableCell className="font-medium">{metodo.nome}</TableCell>
                <TableCell>{metodo.descricao}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Switch
                      checked={metodo.ativo}
                      onCheckedChange={() => toggleStatus(metodo.id)}
                    />
                    <span className="ml-2">
                      {metodo.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(metodo.createdAt).toLocaleDateString("pt-BR")}
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
      ) : (
        <EmptyState
          title="Nenhum método de pagamento encontrado"
          description="Crie um novo método para começar"
          icon={CreditCard}
          action={
            <Button onClick={handleOpenNewDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Método
            </Button>
          }
        />
      )}

      {/* Dialog para criar/editar método */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentMetodo ? "Editar Método de Pagamento" : "Novo Método de Pagamento"}
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
                placeholder="Nome do método de pagamento"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                placeholder="Descrição do método de pagamento"
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

      {/* Dialog de confirmação para exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o método de pagamento "
              {currentMetodo?.nome}"? Esta ação não pode ser desfeita.
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
