import { formatCurrency } from "../../../utils/formatCurrency";

interface BudgetSummaryProps {
  balance: number;
  usagePercentage: number;
}

const BudgetSummary = ({ balance, usagePercentage }: BudgetSummaryProps) => {
  const isPositive = balance >= 0;
  const barWidth = Math.min(usagePercentage, 100);

  return (
    <div className="relative z-10 flex flex-col items-center gap-4 py-8">
      <div className="flex flex-col gap-1">
        <p className="text-center font-semibold text-gray-400">Saldo Final</p>
        <p
          className={`text-5xl font-bold ${isPositive ? "text-blue-700" : "text-red-600"}`}
        >
          {formatCurrency(balance)}
        </p>
      </div>

      <div className="flex w-full max-w-48 flex-col gap-1">
        <div className="h-1.5 w-full rounded-2xl bg-gray-700">
          <div
            className={`h-full ${isPositive ? "bg-blue-600" : "bg-red-600"} rounded-2xl transition-all duration-500`}
            style={{ width: `${barWidth}%` }}
          ></div>
        </div>
        <p className="text-center text-xs text-gray-400">
          {usagePercentage}% usado
        </p>
      </div>
    </div>
  );
};

export default BudgetSummary;
