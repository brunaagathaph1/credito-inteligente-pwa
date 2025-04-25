import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatters";
import { FinanceiroService } from "@/services/FinanceiroService";
import { ConfiguracaoFinanceira } from "@/types/financeiro";
import { EmptyState } from "@/components/common/EmptyState";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Plus, Settings2 } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Info } from "lucide-react";

interface SimulacaoParcela {
  numero: number;
  valorParcela: number;
}

const ConfiguracoesFinanceiras = () => {
  const { user } = useAuth();
  const [configs, setConfigs] = useState<ConfiguracaoFinanceira[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ConfiguracaoFinanceira | null>(null);
  const [simulacao, setSimulacao] = useState<SimulacaoParcela[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [configToDelete, setConfigToDelete] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<ConfiguracaoFinanceira>>({
    nome: '',
    taxa_padrao_juros: 2.5,
    tipo_juros_padrao: 'simples',
    prazo_maximo_dias: 30,
    taxa_juros_atraso: 1,
    taxa_multa_atraso: 2,
    juros_sobre_juros: false,
    acumula_taxa_mensal: false,
    permite_carencia: true,
    status: 'ativo'
  });

  // Simulação state
  const [simulacaoData, setSimulacaoData] = useState({
    valor: 1000,
    parcelas: 12
  });

  useEffect(() => {
    fetchConfiguracoes();
  }, []);

  const fetchConfiguracoes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('configuracoes_financeiras')
        .select('*')
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

      setConfigs(configuracoesFormatadas);
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      toast.error("Erro ao carregar configurações financeiras");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !formData.nome || !formData.taxa_padrao_juros) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsLoading(true);

    try {
      const configData = {
        nome: formData.nome || '',
        taxa_padrao_juros: formData.taxa_padrao_juros ?? 0,
        tipo_juros_padrao: formData.juros_sobre_juros ? 'composto' : 'simples',
        prazo_maximo_dias: formData.prazo_maximo_dias ?? 0,
        taxa_juros_atraso: formData.taxa_juros_atraso ?? 0,
        taxa_multa_atraso: formData.taxa_multa_atraso ?? 0,
        juros_sobre_juros: formData.juros_sobre_juros ?? false,
        acumula_taxa_mensal: formData.acumula_taxa_mensal ?? false,
        permite_carencia: formData.permite_carencia ?? false,
        status: formData.status ?? 'ativo',
        ativo: formData.status === 'ativo',
        created_by: user.id,
        observacoes: formData.observacoes || '',
        // id, created_at, updated_at são opcionais
      };

      let result;
      if (editingConfig) {
        result = await supabase
          .from('configuracoes_financeiras')
          .update(configData)
          .eq('id', editingConfig.id);
      } else {
        result = await supabase
          .from('configuracoes_financeiras')
          .insert(configData);
      }

      if (result.error) throw result.error;

      toast.success(`Configuração ${editingConfig ? 'atualizada' : 'criada'} com sucesso!`);
      fetchConfiguracoes();
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error("Erro ao salvar configuração:", error);
      if (error.code === '23505') {
        toast.error("Já existe uma configuração com este nome");
      } else {
        toast.error("Erro ao salvar configuração");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (config: ConfiguracaoFinanceira) => {
    setEditingConfig(config);
    setFormData(config);
    setIsDialogOpen(true);
  };

  const confirmDelete = (id: string) => {
    setConfigToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!configToDelete) return;
    
    try {
      const { error } = await supabase
        .from('configuracoes_financeiras')
        .delete()
        .eq('id', configToDelete);

      if (error) throw error;
      toast.success("Configuração removida com sucesso!");
      setDeleteDialogOpen(false);
      setConfigToDelete(null);
      fetchConfiguracoes();
    } catch (error) {
      console.error("Erro ao remover configuração:", error);
      toast.error("Erro ao remover configuração");
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      taxa_padrao_juros: 2.5,
      tipo_juros_padrao: 'simples',
      prazo_maximo_dias: 30,
      taxa_juros_atraso: 1,
      taxa_multa_atraso: 2,
      juros_sobre_juros: false,
      acumula_taxa_mensal: false,
      permite_carencia: true,
      status: 'ativo'
    });
    setEditingConfig(null);
  };

  const handleSimular = (config: ConfiguracaoFinanceira) => {
    const simulacao = FinanceiroService.simularEmprestimo(
      simulacaoData.valor,
      simulacaoData.parcelas,
      config.taxa_padrao_juros,
      {
        juros_sobre_juros: config.juros_sobre_juros,
        acumula_taxa_mensal: config.acumula_taxa_mensal,
        permite_carencia: config.permite_carencia,
        prazo_maximo_dias: config.prazo_maximo_dias,
        taxa_padrao_juros: config.taxa_padrao_juros,
        taxa_juros_atraso: config.taxa_juros_atraso,
        taxa_multa_atraso: config.taxa_multa_atraso
      }
    );
    setSimulacao(simulacao);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Configurações Financeiras" 
        description="Gerencie os tipos e regras de juros do sistema"
      />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Tipos de Juros</CardTitle>
              <CardDescription>Configure diferentes tipos de juros para empréstimos</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                  <Plus className="mr-2 h-4 w-4" /> Novo Tipo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingConfig ? 'Editar' : 'Novo'} Tipo de Juros</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                        placeholder="Ex: Empréstimo Padrão"
                      />
                    </div>
                    {/* Removido campo de seleção de tipo de juros */}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        <Label htmlFor="taxa_padrao_juros">Taxa de Juros (%)</Label>
                      </div>
                      <Input
                        id="taxa_padrao_juros"
                        type="number"
                        step="0.01"
                        value={formData.taxa_padrao_juros}
                        onChange={(e) => setFormData(prev => ({ ...prev, taxa_padrao_juros: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        <Label htmlFor="prazo_maximo_dias">Prazo de Carência (dias)</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button type="button" className="p-0 m-0 bg-transparent border-0">
                              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent align="start" sideOffset={8} className="max-w-xs whitespace-pre-line break-words text-xs md:text-sm">
                            {`Quantidade de dias após a contratação em que o cliente pode pagar a primeira parcela sem cobrança de multa ou juros de mora.\nExemplo: Se o prazo de carência for 10 dias, o cliente só começa a pagar juros/multa após esse período.`}
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Input
                        id="prazo_maximo_dias"
                        type="number"
                        value={formData.prazo_maximo_dias}
                        onChange={(e) => setFormData(prev => ({ ...prev, prazo_maximo_dias: Number(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        <Label htmlFor="taxa_multa_atraso">Multa por Atraso (%)</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button type="button" className="p-0 m-0 bg-transparent border-0">
                              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent align="start" sideOffset={8} className="max-w-xs whitespace-pre-line break-words text-xs md:text-sm">
                            {`Valor percentual cobrado uma única vez sobre o valor da parcela em caso de atraso no pagamento.\nExemplo: Parcela de R$ 1.000, multa de 2% = R$ 20 de multa ao atrasar.`}
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Input
                        id="taxa_multa_atraso"
                        type="number"
                        step="0.01"
                        value={formData.taxa_multa_atraso}
                        onChange={(e) => setFormData(prev => ({ ...prev, taxa_multa_atraso: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        <Label htmlFor="taxa_juros_atraso">Juros de Mora (%)</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button type="button" className="p-0 m-0 bg-transparent border-0">
                              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent align="start" sideOffset={8} className="max-w-xs whitespace-pre-line break-words text-xs md:text-sm">
                            {`Percentual de juros cobrado por cada mês (ou fração) de atraso no pagamento da parcela.\nExemplo: Parcela de R$ 1.000, juros de mora de 1% ao mês. Se atrasar 2 meses: R$ 1.000 x 1% x 2 = R$ 20 de juros.`}
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Input
                        id="taxa_juros_atraso"
                        type="number"
                        step="0.01"
                        value={formData.taxa_juros_atraso}
                        onChange={(e) => setFormData(prev => ({ ...prev, taxa_juros_atraso: Number(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Regras de Juros</Label>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="juros_sobre_juros"
                          checked={formData.juros_sobre_juros}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ ...prev, juros_sobre_juros: checked === true }))
                          }
                        />
                        <Label htmlFor="juros_sobre_juros">Permitir juros sobre juros</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button type="button" className="p-0 m-0 bg-transparent border-0">
                              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent align="start" sideOffset={8} className="max-w-xs whitespace-pre-line break-words text-xs md:text-sm">
                            {`Quando ativado: Calcula juros compostos (juros sobre juros).
Quando desativado: Calcula juros simples, sempre sobre o valor principal original.
Exemplo:
Ativado: 1º mês: R$ 1.000 × 10% = R$ 1.100; 2º mês: R$ 1.100 × 10% = R$ 1.210
Desativado: Sempre R$ 1.000 × 10% = R$ 100 de juros/mês`}
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="acumula_taxa_mensal"
                          checked={formData.acumula_taxa_mensal}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ ...prev, acumula_taxa_mensal: checked === true }))
                          }
                        />
                        <Label htmlFor="acumula_taxa_mensal">Acumular taxa mensalmente</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button type="button" className="p-0 m-0 bg-transparent border-0">
                              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent align="start" sideOffset={8} className="max-w-xs whitespace-pre-line break-words text-xs md:text-sm">
                            {`Quando ativado: A taxa de juros acumula a cada mês (ex: mês 1 = 10%, mês 2 = 20%, mês 3 = 30%).
Quando desativado: A taxa de juros é fixa a cada mês (ex: sempre 10% ao mês).`}
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="permite_carencia"
                          checked={formData.permite_carencia}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ ...prev, permite_carencia: checked === true }))
                          }
                        />
                        <Label htmlFor="permite_carencia">Permitir prazo de carência</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button type="button" className="p-0 m-0 bg-transparent border-0">
                              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent align="start" sideOffset={8} className="max-w-xs whitespace-pre-line break-words text-xs md:text-sm">
                            {`Quando ativado: Permite um prazo de carência para pagamento sem multa/juros de atraso.
Quando desativado: Qualquer atraso gera multa/juros imediatamente após o vencimento.`}
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'ativo' | 'inativo' | 'modelo' }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                        <SelectItem value="modelo">Modelo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Input
                      id="observacoes"
                      value={formData.observacoes}
                      onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                      placeholder="Observações adicionais"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} disabled={isLoading}>
                    Salvar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="loader"></div>
            </div>
          ) : configs.length === 0 ? (
            <EmptyState
              title="Nenhuma configuração encontrada"
              description="Clique no botão acima para adicionar uma nova configuração"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Taxa de Juros</TableHead>
                  <TableHead>Tipo de Juros</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configs.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell>{config.nome}</TableCell>
                    <TableCell>{config.taxa_padrao_juros}%</TableCell>
                    <TableCell>{config.tipo_juros_padrao}</TableCell>
                    <TableCell>{config.status}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(config)}>
                        Editar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => confirmDelete(config.id)}>
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {simulacao.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Simulação de Parcelas</CardTitle>
            <CardDescription>
              Simulação para {formData.nome} com valor de {formatCurrency(simulacaoData.valor)} em {simulacaoData.parcelas}x
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="valor_simulacao">Valor</Label>
                  <Input
                    id="valor_simulacao"
                    type="number"
                    value={simulacaoData.valor}
                    onChange={(e) => setSimulacaoData(prev => ({ ...prev, valor: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parcelas_simulacao">Parcelas</Label>
                  <Input
                    id="parcelas_simulacao"
                    type="number"
                    value={simulacaoData.parcelas}
                    onChange={(e) => setSimulacaoData(prev => ({ ...prev, parcelas: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parcela</TableHead>
                    <TableHead>Valor Base</TableHead>
                    <TableHead>Valor Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {simulacao.map((parcela) => (
                    <TableRow key={parcela.numero}>
                      <TableCell>{parcela.numero}ª Parcela</TableCell>
                      <TableCell>{formatCurrency(parcela.valorParcela)}</TableCell>
                      <TableCell>{formatCurrency(parcela.valorParcela)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConfiguracoesFinanceiras;
