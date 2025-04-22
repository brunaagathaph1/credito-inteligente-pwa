
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { Loader2 } from "lucide-react";

interface RenegociacaoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  emprestimo: any; // Idealmente tiparia com Database['public']['Tables']['emprestimos']['Row']
  onRenegociationComplete: () => void;
}

export function RenegociacaoDialog({ 
  isOpen, 
  onClose, 
  emprestimo, 
  onRenegociationComplete 
}: RenegociacaoDialogProps) {
  const { logActivity } = useActivityLogs();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    novoValorPrincipal: "",
    novaTaxaJuros: "",
    novoTipoJuros: "composto",
    novaDataVencimento: "",
    motivo: "",
    observacoes: ""
  });

  // Inicializa os dados do formulário quando o empréstimo muda
  useEffect(() => {
    if (emprestimo) {
      const dataAtual = new Date();
      const novoVencimento = addDays(dataAtual, 30);
      
      setFormData({
        novoValorPrincipal: emprestimo.valor_principal?.toString() || "",
        novaTaxaJuros: emprestimo.taxa_juros?.toString() || "",
        novoTipoJuros: emprestimo.tipo_juros || "composto",
        novaDataVencimento: format(novoVencimento, "yyyy-MM-dd"),
        motivo: "",
        observacoes: ""
      });
    }
  }, [emprestimo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!emprestimo) return;
    
    if (!formData.novoValorPrincipal || !formData.novaTaxaJuros || !formData.novaDataVencimento) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 1. Criar registro de renegociação
      const { data: renegociacao, error: renegociacaoError } = await supabase
        .from('renegociacoes')
        .insert({
          emprestimo_id: emprestimo.id,
          emprestimo_anterior_valor: emprestimo.valor_principal,
          emprestimo_anterior_juros: emprestimo.taxa_juros,
          emprestimo_anterior_vencimento: emprestimo.data_vencimento,
          novo_valor_principal: parseFloat(formData.novoValorPrincipal),
          nova_taxa_juros: parseFloat(formData.novaTaxaJuros),
          novo_tipo_juros: formData.novoTipoJuros,
          nova_data_vencimento: formData.novaDataVencimento,
          data_renegociacao: new Date().toISOString().split('T')[0],
          motivo: formData.motivo,
          observacoes: formData.observacoes,
          created_by: "system" // Idealmente seria o ID do usuário logado
        })
        .select()
        .single();
      
      if (renegociacaoError) throw renegociacaoError;
      
      // 2. Atualizar o empréstimo original para status "quitado" e marcar como renegociado
      const { error: emprestimoUpdateError } = await supabase
        .from('emprestimos')
        .update({
          status: "quitado",
          renegociado: true,
          renegociacao_id: renegociacao.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', emprestimo.id);
      
      if (emprestimoUpdateError) throw emprestimoUpdateError;
      
      // 3. Criar novo empréstimo com os novos valores
      const { error: novoEmprestimoError } = await supabase
        .from('emprestimos')
        .insert({
          cliente_id: emprestimo.cliente_id,
          valor_principal: parseFloat(formData.novoValorPrincipal),
          taxa_juros: parseFloat(formData.novaTaxaJuros),
          tipo_juros: formData.novoTipoJuros,
          data_emprestimo: new Date().toISOString().split('T')[0],
          data_vencimento: formData.novaDataVencimento,
          status: "em-dia",
          renegociacao_id: renegociacao.id,
          created_by: "system" // Idealmente seria o ID do usuário logado
        });
      
      if (novoEmprestimoError) throw novoEmprestimoError;
      
      logActivity(`Renegociou empréstimo ID ${emprestimo.id}`);
      toast.success("Empréstimo renegociado com sucesso!");
      onRenegociationComplete();
      onClose();
    } catch (error) {
      console.error("Erro ao renegociar empréstimo:", error);
      toast.error("Erro ao renegociar empréstimo. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Renegociar Empréstimo</DialogTitle>
          <DialogDescription>
            Defina os novos termos do empréstimo para renegociação.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="novoValorPrincipal">Novo Valor Principal</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">R$</span>
                <Input
                  id="novoValorPrincipal"
                  name="novoValorPrincipal"
                  className="pl-10"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.novoValorPrincipal}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="novaTaxaJuros">Nova Taxa de Juros (%)</Label>
              <Input
                id="novaTaxaJuros"
                name="novaTaxaJuros"
                type="number"
                step="0.1"
                min="0"
                value={formData.novaTaxaJuros}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="novoTipoJuros">Tipo de Juros</Label>
              <Select
                value={formData.novoTipoJuros}
                onValueChange={(value) => handleSelectChange("novoTipoJuros", value)}
              >
                <SelectTrigger id="novoTipoJuros">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simples">Juros Simples</SelectItem>
                  <SelectItem value="composto">Juros Compostos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="novaDataVencimento">Nova Data de Vencimento</Label>
              <Input
                id="novaDataVencimento"
                name="novaDataVencimento"
                type="date"
                value={formData.novaDataVencimento}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo da Renegociação</Label>
            <Select
              value={formData.motivo}
              onValueChange={(value) => handleSelectChange("motivo", value)}
            >
              <SelectTrigger id="motivo">
                <SelectValue placeholder="Selecione o motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="atraso">Atraso no pagamento</SelectItem>
                <SelectItem value="dificuldade-pagamento">Dificuldade financeira</SelectItem>
                <SelectItem value="revisao-taxa">Revisão de taxa</SelectItem>
                <SelectItem value="ampliacao-prazo">Ampliação de prazo</SelectItem>
                <SelectItem value="outro">Outro motivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              name="observacoes"
              placeholder="Observações adicionais sobre a renegociação..."
              value={formData.observacoes}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              "Confirmar Renegociação"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
