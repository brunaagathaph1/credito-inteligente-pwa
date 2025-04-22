
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, DollarSign, Users, ArrowUp, ArrowDown } from "lucide-react";
import { 
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const Dashboard = () => {
  // Dados simulados para o dashboard
  const recebimentosMensais = [
    { mes: "Jan", valor: 4500 },
    { mes: "Fev", valor: 5200 },
    { mes: "Mar", valor: 4800 },
    { mes: "Abr", valor: 6100 },
    { mes: "Mai", valor: 5300 },
    { mes: "Jun", valor: 5900 },
  ];

  const resumoCards = [
    {
      titulo: "Total de Empréstimos Ativos",
      valor: "R$ 32.500,00",
      descricao: "12 empréstimos",
      icone: <DollarSign className="h-6 w-6 text-primary" />,
      cor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      titulo: "Clientes Ativos",
      valor: "8",
      descricao: "2 novos este mês",
      icone: <Users className="h-6 w-6 text-primary" />,
      cor: "bg-green-50 dark:bg-green-950",
    },
    {
      titulo: "Recebimentos do Mês",
      valor: "R$ 5.900,00",
      descricao: "12% acima do mês anterior",
      icone: <ArrowUp className="h-6 w-6 text-success" />,
      cor: "bg-success/10",
    },
    {
      titulo: "Inadimplência",
      valor: "R$ 1.200,00",
      descricao: "3% da carteira total",
      icone: <ArrowDown className="h-6 w-6 text-destructive" />,
      cor: "bg-destructive/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao Crédito Inteligente, seus números resumidos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {resumoCards.map((card, index) => (
          <Card key={index} className={card.cor}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">
                  {card.titulo}
                </CardTitle>
                {card.icone}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.valor}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.descricao}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">
                Recebimentos Mensais
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={recebimentosMensais}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`R$ ${value}`, "Valor"]}
                    labelFormatter={(label) => `Mês: ${label}`}
                  />
                  <Legend />
                  <Bar
                    name="Valor Recebido (R$)"
                    dataKey="valor"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">
              Próximos Vencimentos
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium">João da Silva</p>
                    <p className="text-sm text-muted-foreground">
                      Vencimento em {i + 2} dias
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">R$ 450,00</div>
                    <div className="text-xs text-muted-foreground">
                      Parcela {i}/10
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
