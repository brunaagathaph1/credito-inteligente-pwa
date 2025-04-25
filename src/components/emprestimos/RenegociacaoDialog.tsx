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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, AlertTriangle } from "lucide-react";
import { FinanceiroService } from "@/services/FinanceiroService";
import { ConfiguracaoFinanceira, SimulacaoParcela } from "@/types/financeiro";

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
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState("Dinheiro");
  const [observacoesAdicionais, setObservacoesAdicionais] = useState("");
  const [configuracoes, setConfiguracoes] = useState<ConfiguracaoFinanceira[]>([]);
  const [configSelecionada, setConfigSelecionada] = useState<ConfiguracaoFinanceira | null>(null);
  const [simulacao, setSimulacao] = useState<SimulacaoParcela[]>([]);

  const [formData, setFormData] = useState({
    novoValorPrincipal: "",
    novaTaxaJuros: "",
    novoTipoJuros: "composto",
    novaDataVencimento: "",
    motivo: "",
    observacoes: "",
    configuracaoId: "",
    parcelas: "10"
  });

  // Carregar configurações de juros
  useEffect(() => {
    const fetchConfiguracoes = async () => {
      try {
        const { data, error } = await supabase
          .from('configuracoes_financeiras')
          .select('*')
          .eq('ativo', true)
          .order('nome');

        if (error) throw error;

        // Transformar os dados do banco para o formato esperado
        const configuracoesFormatadas: ConfiguracaoFinanceira[] = (data || []).map((config: any) => ({
          ...config,
          tipo_juros_padrao: config.tipo_juros_padrao === 'composto' ? 'composto' : 'simples',
          juros_sobre_juros: 'juros_sobre_juros' in config ? Boolean(config.juros_sobre_juros) : false,
          acumula_taxa_mensal: 'acumula_taxa_mensal' in config ? Boolean(config.acumula_taxa_mensal) : false,
          permite_carencia: 'permite_carencia' in config ? Boolean(config.permite_carencia) : false,
          status: config.ativo ? 'ativo' : 'inativo',
        }));

        setConfiguracoes(configuracoesFormatadas);
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
        toast.error("Erro ao carregar configurações de juros");
      }
    };
    fetchConfiguracoes();
  }, []);

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
        observacoes: "",
        configuracaoId: "",
        parcelas: "10"
      });
      setFormaPagamento("Dinheiro");
      setObservacoesAdicionais("");
      setSimulacao([]);
    }
  }, [emprestimo]);

  // Atualizar valores quando configuração é selecionada
  useEffect(() => {
    if (configSelecionada) {
      setFormData(prev => ({
        ...prev,
        novaTaxaJuros: configSelecionada.taxa_padrao_juros.toString(),
        novoTipoJuros: configSelecionada.tipo_juros_padrao
      }));
      calcularSimulacao();
    }
  }, [configSelecionada]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (["novoValorPrincipal", "novaTaxaJuros", "parcelas"].includes(name)) {
      calcularSimulacao();
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "configuracaoId") {
      const config = configuracoes.find(c => c.id === value);
      setConfigSelecionada(config || null);
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calcularSimulacao = () => {
    if (!configSelecionada || !formData.novoValorPrincipal || !formData.parcelas) return;

    // Usar o serviço financeiro para cálculos
    const simulacaoParcelas = FinanceiroService.simularEmprestimo(
      parseFloat(formData.novoValorPrincipal),
      parseInt(formData.parcelas),
      parseFloat(formData.novaTaxaJuros),
      {
        juros_sobre_juros: configSelecionada.juros_sobre_juros,
        acumula_taxa_mensal: configSelecionada.acumula_taxa_mensal,
        permite_carencia: configSelecionada.permite_carencia,
        prazo_maximo_dias: configSelecionada.prazo_maximo_dias,
        taxa_padrao_juros: configSelecionada.taxa_padrao_juros,
        taxa_juros_atraso: configSelecionada.taxa_juros_atraso,
        taxa_multa_atraso: configSelecionada.taxa_multa_atraso
      }
    );

    setSimulacao(simulacaoParcelas);
  };

  const handleSubmit = async () => {
    if (!emprestimo || !user?.id) return;
    
    if (!formData.novoValorPrincipal || !formData.novaTaxaJuros || !formData.novaDataVencimento || !formData.motivo) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (!configSelecionada) {
      toast.error("Selecione uma configuração de juros");
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
          forma_pagamento: formaPagamento,
          observacoes: observacoesAdicionais,
          created_by: user.id
        })
        .select()
        .single();
      
      if (renegociacaoError) throw renegociacaoError;

      // Primeiro atualizamos o status do empréstimo original para renegociado
      const { error: emprestimoUpdateError } = await supabase
        .from('emprestimos')
        .update({
          status: "renegociado",
          renegociado: true,
          renegociacao_id: renegociacao.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', emprestimo.id);
    
      if (emprestimoUpdateError) throw emprestimoUpdateError;
      
      // Depois criamos o novo empréstimo
      const { error: novoEmprestimoError } = await supabase
        .from('emprestimos')
        .insert({
          cliente_id: emprestimo.cliente_id,
          valor_principal: parseFloat(formData.novoValorPrincipal),
          taxa_juros: parseFloat(formData.novaTaxaJuros),
          tipo_juros: formData.novoTipoJuros,
          data_emprestimo: new Date().toISOString().split('T')[0],
          data_vencimento: formData.novaDataVencimento,
          status: "pendente",
          renegociacao_id: renegociacao.id,
          created_by: user.id,
          renegociado: false,
          configuracao_juros: {
            id: configSelecionada.id,
            nome: configSelecionada.nome,
            juros_sobre_juros: configSelecionada.juros_sobre_juros,
            acumula_taxa_mensal: configSelecionada.acumula_taxa_mensal,
            permite_carencia: configSelecionada.permite_carencia,
            prazo_maximo_dias: configSelecionada.prazo_maximo_dias
          },
          observacoes: observacoesAdicionais
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

  const valorTotal = simulacao.length > 0 ? simulacao.reduce((total, parcela) => total + parcela.valorTotal, 0) : 0;
  const valorJuros = valorTotal - parseFloat(formData.novoValorPrincipal || "0");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
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
              <Label htmlFor="parcelas">Número de Parcelas</Label>
              <Input
                id="parcelas"
                name="parcelas"
                type="number"
                min="1"
                value={formData.parcelas}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="configuracaoId">Configuração de Juros</Label>
            <Select
              value={formData.configuracaoId}
              onValueChange={(value) => handleSelectChange("configuracaoId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a configuração de juros" />
              </SelectTrigger>
              <SelectContent>
                {configuracoes.map((config) => (
                  <SelectItem key={config.id} value={config.id}>
                    {config.nome} - {config.taxa_padrao_juros}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {configSelecionada && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Regras de Juros</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Taxa: {configSelecionada.taxa_padrao_juros}% ao mês</li>
                  {configSelecionada.juros_sobre_juros && (
                    <li>Juros calculados sobre juros anteriores</li>
                  )}
                  {configSelecionada.acumula_taxa_mensal && (
                    <li>Taxa acumula mensalmente</li>
                  )}
                  {configSelecionada.permite_carencia && (
                    <li>Carência de {configSelecionada.prazo_maximo_dias} dias para multa</li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {simulacao.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Simulação do Novo Empréstimo</CardTitle>
                <CardDescription>
                  Como ficarão as parcelas com as novas condições
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Valor da Parcela</div>
                    <div className="text-2xl font-bold">
                      R$ {simulacao[0].valorParcela.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total a Pagar</div>
                    <div className="text-2xl font-bold">
                      R$ {valorTotal.toFixed(2).replace('.', ',')}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Principal: R$ {parseFloat(formData.novoValorPrincipal).toFixed(2).replace('.', ',')} + 
                      Juros: R$ {valorJuros.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
            
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
            <Label htmlFor="forma_pagamento">Forma de Pagamento</Label>
            <Select
              value={formaPagamento}
              onValueChange={setFormaPagamento}
            >
              <SelectTrigger id="forma_pagamento">
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                <SelectItem value="PIX">PIX</SelectItem>
                <SelectItem value="Transferência">Transferência</SelectItem>
                <SelectItem value="Depósito">Depósito</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              placeholder="Observações adicionais sobre a renegociação..."
              value={observacoesAdicionais}
              onChange={(e) => setObservacoesAdicionais(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !configSelecionada}>
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
