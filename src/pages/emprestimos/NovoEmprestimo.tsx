import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Calculator, Loader2, AlertTriangle } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { useLoans } from "@/hooks/useLoans";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { FinanceiroService } from "@/services/FinanceiroService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ConfiguracaoFinanceira } from "@/types/financeiro";

const NovoEmprestimo = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clienteIdParam = searchParams.get("cliente");
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [valorParcela, setValorParcela] = useState<number | null>(null);
  const [valorTotal, setValorTotal] = useState<number | null>(null);
  const { clients, isLoadingClients } = useClients();
  const { useCreateLoan } = useLoans();
  const createLoanMutation = useCreateLoan();
  const { logActivity } = useActivityLogs();
  const [configuracoes, setConfiguracoes] = useState<ConfiguracaoFinanceira[]>([]);
  const [configSelecionada, setConfigSelecionada] = useState<ConfiguracaoFinanceira | null>(null);

  const [formData, setFormData] = useState({
    clienteId: clienteIdParam || "",
    valor: "",
    juros: "2.5",
    tipoJuros: "composto",
    parcelas: "10",
    dataInicio: new Date().toISOString().split('T')[0],
    dataVencimento: "",
    configuracaoId: ""
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

  // Log activity when component mounts
  useEffect(() => {
    logActivity("Acessou página de novo empréstimo");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set default dataVencimento 30 days from dataInicio
  useEffect(() => {
    if (formData.dataInicio) {
      const dataInicio = new Date(formData.dataInicio);
      dataInicio.setDate(dataInicio.getDate() + 30);
      setFormData(prev => ({
        ...prev,
        dataVencimento: dataInicio.toISOString().split('T')[0]
      }));
    }
  }, [formData.dataInicio]);

  // Atualizar valores quando configuração é selecionada
  useEffect(() => {
    if (configSelecionada) {
      setFormData(prev => ({
        ...prev,
        juros: configSelecionada.taxa_padrao_juros.toString(),
        tipoJuros: configSelecionada.tipo_juros_padrao
      }));
    }
  }, [configSelecionada]);

  // Recalcular quando valores mudam
  useEffect(() => {
    if (
      formData.valor && 
      formData.juros && 
      formData.parcelas &&
      configSelecionada
    ) {
      calcularValorParcelas();
    }
  }, [formData.valor, formData.juros, formData.parcelas, configSelecionada]);

  const calcularValorParcelas = () => {
    if (!configSelecionada) return;

    const valor = parseFloat(formData.valor);
    const juros = parseFloat(formData.juros) / 100;
    const parcelas = parseInt(formData.parcelas);
    
    if (isNaN(valor) || isNaN(juros) || isNaN(parcelas) || parcelas <= 0) {
      setValorParcela(null);
      setValorTotal(null);
      return;
    }

    // Usar o serviço financeiro para cálculos
    const simulacao = FinanceiroService.simularEmprestimo(
      valor,
      parcelas,
      parseFloat(formData.juros),
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

    if (simulacao.length > 0) {
      setValorParcela(simulacao[0].valorParcela);
      setValorTotal(simulacao.reduce((total, parcela) => total + parcela.valorTotal, 0));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "configuracaoId") {
      const config = configuracoes.find(c => c.id === value);
      setConfigSelecionada(config || null);
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clienteId) {
      toast.error("Selecione um cliente para continuar");
      return;
    }

    if (!configSelecionada) {
      toast.error("Selecione uma configuração de juros");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const emprestimoData = {
        cliente_id: formData.clienteId,
        valor_principal: parseFloat(formData.valor),
        taxa_juros: parseFloat(formData.juros),
        tipo_juros: formData.tipoJuros,
        data_emprestimo: formData.dataInicio,
        data_vencimento: formData.dataVencimento,
        status: "pendente",
        configuracao_juros: {
          id: configSelecionada.id,
          nome: configSelecionada.nome,
          juros_sobre_juros: configSelecionada.juros_sobre_juros,
          acumula_taxa_mensal: configSelecionada.acumula_taxa_mensal,
          permite_carencia: configSelecionada.permite_carencia,
          prazo_maximo_dias: configSelecionada.prazo_maximo_dias
        },
        observacoes: "",
        renegociacao_id: null,
        renegociado: false,
        created_by: user?.id || "system"
      };

      console.log("Enviando dados do empréstimo:", emprestimoData);
      const result = await createLoanMutation.mutateAsync(emprestimoData);
      
      if (result) {
        await logActivity("Cadastrou novo empréstimo", { emprestimo_id: result.id });
        toast.success("Empréstimo cadastrado com sucesso!");
        navigate("/emprestimos");
      }
    } catch (error) {
      console.error("Erro ao cadastrar empréstimo:", error);
      toast.error("Erro ao cadastrar empréstimo. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => navigate("/emprestimos")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Novo Empréstimo</h1>
          <p className="text-muted-foreground">
            Cadastre um novo empréstimo no sistema.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>
              Preencha as informações principais do empréstimo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clienteId">Cliente</Label>
              {isLoadingClients ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Carregando clientes...</span>
                </div>
              ) : (
                <Select
                  value={formData.clienteId}
                  onValueChange={(value) => handleSelectChange("clienteId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients && clients.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valor">Valor do Empréstimo</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">R$</span>
                  <Input
                    id="valor"
                    name="valor"
                    type="number"
                    placeholder="0,00"
                    className="pl-10"
                    step="0.01"
                    min="0"
                    value={formData.valor}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data do Empréstimo</Label>
                <Input
                  id="dataInicio"
                  name="dataInicio"
                  type="date"
                  value={formData.dataInicio}
                  onChange={handleInputChange}
                  required
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parcelas">Número de Parcelas</Label>
                <Input
                  id="parcelas"
                  name="parcelas"
                  type="number"
                  placeholder="10"
                  min="1"
                  value={formData.parcelas}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataVencimento">Data de Vencimento</Label>
                <Input
                  id="dataVencimento"
                  name="dataVencimento"
                  type="date"
                  value={formData.dataVencimento}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Simulação de Parcelas</CardTitle>
            <CardDescription>
              Visualize como ficará o empréstimo com as condições informadas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!configSelecionada ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Configuração Necessária</AlertTitle>
                <AlertDescription>
                  Selecione uma configuração de juros para visualizar a simulação.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={calcularValorParcelas}
                    className="flex items-center"
                  >
                    <Calculator className="mr-2 h-4 w-4" />
                    Calcular Parcelas
                  </Button>
                </div>

                {valorParcela && valorTotal && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-accent">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Valor de Cada Parcela</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          R$ {valorParcela.toFixed(2).replace('.', ',')}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formData.parcelas} parcelas mensais
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-accent">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Valor Total a Pagar</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          R$ {valorTotal.toFixed(2).replace('.', ',')}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Principal: R$ {parseFloat(formData.valor).toFixed(2).replace('.', ',')} + 
                          Juros: R$ {(valorTotal - parseFloat(formData.valor)).toFixed(2).replace('.', ',')}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate("/emprestimos")}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !configSelecionada}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Criar Empréstimo
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default NovoEmprestimo;
