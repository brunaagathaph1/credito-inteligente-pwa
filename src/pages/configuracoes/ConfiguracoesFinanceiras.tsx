import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { Calculator, Plus, Settings2, Pencil, Trash2, Save, Loader2 } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SimulacaoParcela {
  numero: number;
  valorParcela: number;
  valorTotal: number;
}

const ConfiguracoesFinanceiras = () => {
  const { user } = useAuth();
  const [configs, setConfigs] = useState<ConfiguracaoFinanceira[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

      <Tabs defaultValue="lista" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="lista">Lista de Configurações</TabsTrigger>
            <TabsTrigger value="novo">Nova Configuração</TabsTrigger>
          </TabsList>
          {editingConfig && (
            <Button variant="outline" onClick={() => {
              resetForm();
              setEditingConfig(null);
            }}>
              Cancelar Edição
            </Button>
          )}
        </div>

        <TabsContent value="lista">
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Juros Configurados</CardTitle>
              <CardDescription>Lista de configurações disponíveis para empréstimos</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="loader"></div>
                </div>
              ) : configs.length === 0 ? (
                <EmptyState
                  icon={<Settings2 className="h-8 w-8" />}
                  title="Nenhuma configuração encontrada"
                  description="Clique em 'Nova Configuração' para começar"
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {configs.map((config) => (
                    <Card key={config.id} className="relative">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center justify-between text-base">
                          <span>{config.nome}</span>
                          <Badge variant={config.status === 'ativo' ? 'default' : 'secondary'}>
                            {config.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{config.taxa_padrao_juros}% ao mês</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-1 text-sm">
                          <p>Tipo: {config.tipo_juros_padrao}</p>
                          <p>Carência: {config.prazo_maximo_dias} dias</p>
                          {config.juros_sobre_juros && <p>✓ Juros sobre juros</p>}
                          {config.acumula_taxa_mensal && <p>✓ Taxa acumulativa</p>}
                          {config.permite_carencia && <p>✓ Permite carência</p>}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(config)}>
                          <Pencil className="h-4 w-4 mr-1" /> Editar
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => confirmDelete(config.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-1" /> Excluir
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="novo">
          <Card>
            <CardHeader>
              <CardTitle>{editingConfig ? 'Editar' : 'Nova'} Configuração de Juros</CardTitle>
              <CardDescription>
                {editingConfig 
                  ? 'Atualize os dados da configuração existente' 
                  : 'Configure um novo tipo de juros para empréstimos'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome da Configuração</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Ex: Empréstimo Padrão"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxa_padrao_juros">Taxa de Juros (%)</Label>
                    <Input
                      id="taxa_padrao_juros"
                      type="number"
                      step="0.01"
                      value={formData.taxa_padrao_juros}
                      onChange={(e) => setFormData(prev => ({ ...prev, taxa_padrao_juros: Number(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prazo_maximo_dias">Prazo de Carência (dias)</Label>
                    <Input
                      id="prazo_maximo_dias"
                      type="number"
                      value={formData.prazo_maximo_dias}
                      onChange={(e) => setFormData(prev => ({ ...prev, prazo_maximo_dias: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'ativo' | 'inativo' | 'modelo' }))}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                        <SelectItem value="modelo">Modelo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Configurações de Juros e Multas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="taxa_multa_atraso">Multa por Atraso (%)</Label>
                          <Input
                            id="taxa_multa_atraso"
                            type="number"
                            step="0.01"
                            value={formData.taxa_multa_atraso}
                            onChange={(e) => setFormData(prev => ({ ...prev, taxa_multa_atraso: Number(e.target.value) }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="taxa_juros_atraso">Juros de Mora (%)</Label>
                          <Input
                            id="taxa_juros_atraso"
                            type="number"
                            step="0.01"
                            value={formData.taxa_juros_atraso}
                            onChange={(e) => setFormData(prev => ({ ...prev, taxa_juros_atraso: Number(e.target.value) }))}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Regras de Cálculo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="juros_sobre_juros"
                            checked={formData.juros_sobre_juros}
                            onCheckedChange={(checked) => 
                              setFormData(prev => ({ ...prev, juros_sobre_juros: checked === true }))
                            }
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="juros_sobre_juros">Juros sobre juros</Label>
                            <p className="text-sm text-muted-foreground">
                              Permite calcular juros sobre o montante acumulado
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="acumula_taxa_mensal"
                            checked={formData.acumula_taxa_mensal}
                            onCheckedChange={(checked) => 
                              setFormData(prev => ({ ...prev, acumula_taxa_mensal: checked === true }))
                            }
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="acumula_taxa_mensal">Acumular taxa mensalmente</Label>
                            <p className="text-sm text-muted-foreground">
                              A taxa de juros aumenta progressivamente a cada mês
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="permite_carencia"
                            checked={formData.permite_carencia}
                            onCheckedChange={(checked) => 
                              setFormData(prev => ({ ...prev, permite_carencia: checked === true }))
                            }
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="permite_carencia">Permitir prazo de carência</Label>
                            <p className="text-sm text-muted-foreground">
                              Define um período sem cobrança de multas ou juros de mora
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                    placeholder="Observações adicionais sobre esta configuração..."
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => {
                resetForm();
                setEditingConfig(null);
              }}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {editingConfig ? 'Atualizar' : 'Salvar'}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {simulacao.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Simulação de Parcelas</CardTitle>
                <CardDescription>
                  Simulação para {formData.nome} com valor de {formatCurrency(simulacaoData.valor)} em {simulacaoData.parcelas}x
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
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

                  <div className="relative overflow-x-auto rounded-md border">
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
                            <TableCell>{formatCurrency(parcela.valorTotal)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta configuração? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConfiguracoesFinanceiras;
