import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Category } from "../../../types/api/category";

interface FinanceChartProps {
  categories: Category[];
  totalSalary: number;
}

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

const MonthlyFinanceChart = ({ categories }: FinanceChartProps) => {
  const data = categories
    .filter((cat) => (cat.totalExpenses || 0) > 0)
    .map((cat) => ({
      name: cat.name,
      value: Number(cat.totalExpenses) || 0,
    }));

  return (
    <div className="min-h-50 w-full p-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => `R$ ${Number(value).toFixed(2)}`}
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
          <Legend layout="vertical" align="right" verticalAlign="middle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyFinanceChart;
