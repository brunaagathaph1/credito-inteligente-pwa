import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface FinancialProjectionChartProps {
  data: Array<{ mes: string; saldo: number; recebimentos: number }>;
}

export function FinancialProjectionChart({ data }: FinancialProjectionChartProps) {
  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis />
          <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
          <Legend />
          <Line type="monotone" dataKey="saldo" name="Saldo Projetado" stroke="#2563eb" strokeWidth={2} />
          <Line type="monotone" dataKey="recebimentos" name="Recebimentos" stroke="#22c55e" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
