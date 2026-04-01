import { formatCurrency } from "../utils/formatCurrency";

interface BudgetSummaryProps {
  salary: number;
  expenses: number;
  isCurrentMonth?: boolean;
}

const BudgetSummary = ({
  salary,
  expenses,
  isCurrentMonth = true,
}: BudgetSummaryProps) => {
  const remaining = salary - expenses;
  const displayRemaining = Math.max(remaining, 0);
  const progress = salary ? Math.min((expenses / salary) * 100, 100) : 0;
  const isOutOfMoney = remaining < 0;

  const getLabel = () => {
    if (isCurrentMonth) {
      return isOutOfMoney ? "Orçamento Esgotado" : "Disponível para Gastar";
    }
    return isOutOfMoney ? "Déficit no Mês" : "Saldo Final";
  };

  return (
    <div className="relative z-10 flex flex-col items-center gap-4 py-8">
      <div className="flex flex-col gap-1">
        <p className="text-center font-semibold text-gray-400">{getLabel()}</p>

        <p
          className={`text-5xl font-bold transition-all duration-300 ${
            isOutOfMoney ? "text-red-600" : "text-blue-700"
          }`}
        >
          {formatCurrency(displayRemaining)}
        </p>
      </div>

      <div className="flex w-full max-w-48 flex-col gap-1">
        <div className="h-1.5 w-full overflow-hidden rounded-2xl bg-gray-200">
          <div
            className={`h-full transition-all duration-500 ${
              isOutOfMoney ? "bg-red-600" : "bg-blue-600"
            } rounded-2xl`}
            style={{
              width: `${progress}%`,
              minWidth: progress > 0 ? "4px" : "0",
            }}
          ></div>
        </div>
        <p className="text-center text-xs text-gray-400">
          {progress > 0 && progress < 1
            ? progress.toFixed(1)
            : Math.round(progress)}
          % usado
        </p>
      </div>
    </div>
  );
};

export default BudgetSummary;
