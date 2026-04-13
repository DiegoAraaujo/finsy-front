import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

import { useGetDashboard } from "../../hooks/dashboard/useGetDashboard";
import { formatCurrency } from "../../utils/formatCurrency";
import { COLORS } from "../../data/colors";
import { MONTHS } from "../../data/months";
import Loading from "../../components/Loading";
import { Navigate } from "react-router-dom";
import ErrorState from "../../components/ErrorState";

const formatPayment: Record<string, string> = {
  CREDIT_CARD: "Cartão",
  DEBIT_CARD: "Débito",
  PIX: "PIX",
  CASH: "Dinheiro",
  OTHER: "Outro",
};

const Dashboard = () => {
  const { data, isLoading, isError } = useGetDashboard();

  if (isLoading) return <Loading />;

  if (isError)
    return (
      <ErrorState message="Não conseguimos carregar seus dados no momento. Verifique sua conexão ou tente novamente." />
    );

  if (!data) return <Navigate to="/" />;

  const formattedPayments = data.paymentMethods.map((item) => ({
    ...item,
    paymentMethod: formatPayment[item.paymentMethod] ?? item.paymentMethod,
  }));

  const formattedEvolution = data.evolution.map((item) => ({
    ...item,
    label: `${MONTHS[item.month - 1]}/${item.year}`,
  }));

  const hasAnyData =
    data.categories.some((c) => c.totalExpenses > 0) ||
    data.paymentMethods.some((p) => p.total > 0) ||
    data.evolution.some((e) => e.total > 0);

  const hasCategoryData = data.categories.some((c) => c.totalExpenses > 0);

  const hasPaymentData = formattedPayments.some((p) => p.total > 0);

  if (!hasAnyData) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
        <p className="text-secundary text-lg font-bold">
          Ainda não há dados financeiros
        </p>
        <p className="text-secundary max-w-md text-sm">
          Quando você adicionar suas primeiras transações, seus gráficos de
          gastos, categorias e evolução aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 py-8 px-4">
      <p className="font-bold">Visão Geral</p>
      <div className="bg-background flex flex-col gap-2 rounded-2xl p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-secundary text-sm">Mês atual</p>
            <p className="text-lg font-bold">
              {formatCurrency(data.comparison.current)}
            </p>
          </div>

          <p className="text-primary text-xl font-bold italic">Vs</p>

          <div>
            <p className="text-secundary text-sm">Mês anterior</p>
            <p className="text-lg font-bold">
              {formatCurrency(data.comparison.previous)}
            </p>
          </div>
        </div>

        <p className="text-secundary text-xs">
          + {formatCurrency(data.comparison.current - data.comparison.previous)}{" "}
          ({data.comparison.variation.toFixed(2)}%)
        </p>
      </div>

      <div className="bg-background flex min-h-60 flex-col gap-4 rounded-2xl p-4">
        <p className="text-secundary text-sm">
          Gastos por categoria (este mês)
        </p>

        {hasCategoryData ? (
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data.categories}
                dataKey="totalExpenses"
                nameKey="name"
                innerRadius={40}
                outerRadius={60}
              >
                {data.categories.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => [
                  formatCurrency(Number(value || 0)),
                  name,
                ]}
              />

              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{ fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-secundary flex flex-1 items-center justify-center text-sm">
            Nenhum gasto registrado em categorias ainda
          </div>
        )}
      </div>

      <div className="bg-background flex min-h-70 flex-col gap-4 rounded-2xl p-4">
        <p className="text-secundary text-sm">
          Gastos por forma de pagamento (este mês)
        </p>

        {hasPaymentData ? (
          <ResponsiveContainer>
            <BarChart
              data={formattedPayments}
              layout="vertical"
              margin={{ left: 20 }}
            >
              <XAxis type="number" />
              <YAxis
                dataKey="paymentMethod"
                type="category"
                tick={{ fontSize: 14 }}
              />

              <Tooltip
                formatter={(value, name) => [
                  formatCurrency(Number(value || 0)),
                  name,
                ]}
              />

              <Bar
                dataKey="total"
                fill="#22c55e"
                radius={[0, 8, 8, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-secundary flex flex-1 items-center justify-center text-sm">
            Nenhuma forma de pagamento registrada ainda
          </div>
        )}
      </div>

      {data.evolution.length > 1 ? (
        <div className="bg-background flex min-h-68 flex-col gap-4 rounded-2xl p-4">
          <p className="text-secundary text-sm">
            Evolução dos gastos (últimos 6 meses)
          </p>

          <ResponsiveContainer>
            <AreaChart data={formattedEvolution}>
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 14 }} />

              <Tooltip
                formatter={(value, name) => [
                  formatCurrency(Number(value || 0)),
                  name,
                ]}
              />

              <Area
                type="monotone"
                dataKey="total"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-72 items-center justify-center rounded-2xl bg-white p-4 shadow">
          <p className="text-secundary text-sm">
            Dados insuficientes para exibir evolução
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
