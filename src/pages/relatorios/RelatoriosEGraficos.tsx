
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const RelatoriosEGraficos = () => {
  const dadosMensais = [
    { mes: "Jan", emprestimos: 4500, recebimentos: 3000 },
    { mes: "Fev", emprestimos: 5200, recebimentos: 4800 },
    { mes: "Mar", emprestimos: 4800, recebimentos: 4200 },
    { mes: "Abr", emprestimos: 6100, recebimentos: 5500 },
    { mes: "Mai", emprestimos: 5300, recebimentos: 4900 },
    { mes: "Jun", emprestimos: 5900, recebimentos: 5100 },
  ];

  const dadosStatus = [
    { name: "Em dia", value: 65 },
    { name: "Atrasados", value: 10 },
    { name: "Quitados", value: 25 },
  ];

  const COLORS = ["#0088FE", "#FF8042", "#00C49F"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Relatórios e Gráficos</h1>
        <p className="text-muted-foreground">
          Visualize os dados financeiros do sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Movimentação Financeira Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={dadosMensais}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${value}`, ""]} />
                  <Legend />
                  <Bar 
                    name="Empréstimos" 
                    dataKey="emprestimos" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    name="Recebimentos" 
                    dataKey="recebimentos" 
                    fill="hsl(var(--success))" 
                    radius={[4, 4, 0, 0]}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status dos Empréstimos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dadosStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Relatórios Avançados</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">
            Relatórios avançados e outras visualizações serão implementados em breve.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelatoriosEGraficos;
