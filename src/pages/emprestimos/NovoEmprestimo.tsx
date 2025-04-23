
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
import { ArrowLeft, Save, Calculator, Loader2 } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { useLoans } from "@/hooks/useLoans";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const NovoEmprestimo = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clienteIdParam = searchParams.get("cliente");
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [valorParcela, setValorParcela] = useState<number | null>(null);
  const [valorTotal, setValorTotal] = useState<number | null>(null);
  const { clients, isLoadingClients } = useClients();
  const { createLoan } = useLoans();
  const { logActivity } = useActivityLogs();

  const [formData, setFormData] = useState({
    clienteId: clienteIdParam || "",
    valor: "",
    juros: "2.5",
    tipoJuros: "composto",
    parcelas: "10",
    dataInicio: new Date().toISOString().split('T')[0],
    dataVencimento: ""
  });

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

  useEffect(() => {
    if (
      formData.valor && 
      formData.juros && 
      formData.parcelas && 
      formData.tipoJuros
    ) {
      calcularValorParcelas();
    }
  }, [formData]);

  const calcularValorParcelas = () => {
    const valor = parseFloat(formData.valor);
    const juros = parseFloat(formData.juros) / 100;
    const parcelas = parseInt(formData.parcelas);
    
    if (isNaN(valor) || isNaN(juros) || isNaN(parcelas) || parcelas <= 0) {
      setValorParcela(null);
      setValorTotal(null);
      return;
    }
    
    let valorParcela, valorTotal;
    
    if (formData.tipoJuros === "simples") {
      // Juros simples
      const valorJuros = valor * juros * parcelas;
      valorTotal = valor + valorJuros;
      valorParcela = valorTotal / parcelas;
    } else {
      // Juros compostos (usando fórmula do sistema Price)
      const fatorJuros = Math.pow(1 + juros, parcelas);
      valorParcela = (valor * juros * fatorJuros) / (fatorJuros - 1);
      valorTotal = valorParcela * parcelas;
    }
    
    setValorParcela(valorParcela);
    setValorTotal(valorTotal);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clienteId) {
      toast.error("Selecione um cliente para continuar");
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
        observacoes: null,
        renegociacao_id: null,
        renegociado: false,
        created_by: user?.id || "system"
      };

      console.log("Enviando dados do empréstimo:", emprestimoData);
      const result = await createLoan.mutateAsync(emprestimoData);
      
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="juros">Taxa de Juros Mensal (%)</Label>
                <Input
                  id="juros"
                  name="juros"
                  type="number"
                  placeholder="2,5"
                  step="0.1"
                  min="0"
                  value={formData.juros}
                  onChange={handleInputChange}
                  required
                />
              </div>

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
                <Label htmlFor="tipoJuros">Tipo de Juros</Label>
                <Select
                  value={formData.tipoJuros}
                  onValueChange={(value) => handleSelectChange("tipoJuros", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de juros" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simples">Juros Simples</SelectItem>
                    <SelectItem value="composto">Juros Compostos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate("/emprestimos")}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
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
