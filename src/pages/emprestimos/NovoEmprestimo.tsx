
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
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Calculator } from "lucide-react";
import { useForm } from "react-hook-form";

// Dados simulados de clientes
const clientesMock = [
  { id: "1", nome: "João da Silva" },
  { id: "2", nome: "Maria Oliveira" },
  { id: "3", nome: "Carlos Santos" },
  { id: "4", nome: "Ana Souza" },
  { id: "5", nome: "Roberto Ferreira" },
];

const NovoEmprestimo = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clienteIdParam = searchParams.get("cliente");
  
  const [isLoading, setIsLoading] = useState(false);
  const [valorParcela, setValorParcela] = useState<number | null>(null);
  const [valorTotal, setValorTotal] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    clienteId: clienteIdParam || "",
    valor: "",
    juros: "2.5",
    tipoJuros: "composto",
    parcelas: "10",
    dataInicio: new Date().toISOString().split('T')[0]
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log("Dados do novo empréstimo:", formData);
    
    // Simulação de envio para API
    setTimeout(() => {
      setIsLoading(false);
      // Após cadastro bem-sucedido, redirecionar para lista de empréstimos
      navigate("/emprestimos");
    }, 1500);
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
              <Select
                value={formData.clienteId}
                onValueChange={(value) => handleSelectChange("clienteId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientesMock.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                "Salvando..."
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
