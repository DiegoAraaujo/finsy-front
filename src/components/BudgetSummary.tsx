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
  const safeSalary = Number(salary) || 0;
  const safeExpenses = Number(expenses) || 0;

  const remaining = safeSalary - safeExpenses;
  const displayRemaining = Math.max(remaining, 0);

  const rawProgress =
    safeSalary > 0 ? (safeExpenses / safeSalary) * 100 : 0;

  const progress = Math.min(Math.max(rawProgress, 0), 100);

  const isOverBudget = safeSalary > 0 && safeExpenses >= safeSalary;

  const getLabel = () => {
    if (isCurrentMonth) {
      return isOverBudget ? "Orçamento Esgotado" : "Disponível para Gastar";
    }
    return isOverBudget ? "Déficit no Mês" : "Saldo Final";
  };

  return (
    <div className="relative z-10 flex flex-col items-center gap-4 py-6 sm:py-8">
      <div className="flex flex-col gap-1">
        <p className="text-secundary text-center text-sm font-semibold sm:text-[16px]">
          {getLabel()}
        </p>

        <p
          className={`text-center text-4xl font-bold transition-all duration-300 sm:text-5xl ${
            isOverBudget ? "text-danger" : "text-primary"
          }`}
        >
          {formatCurrency(displayRemaining)}
        </p>
      </div>

      <div className="flex w-full max-w-48 flex-col gap-1">
        <div className="bg-surface-subtle h-1.5 w-full overflow-hidden rounded-2xl">
          <div
            className={`h-full w-full transition-all duration-500 rounded-2xl ${
              isOverBudget ? "bg-danger" : "bg-primary"
            }`}
            style={{
              transform: `scaleX(${progress / 100})`,
              transformOrigin: "left",
            }}
          />
        </div>

        <p className="text-secundary text-center text-xs">
          {Math.round(progress)}% usado
        </p>
      </div>
    </div>
  );
};

export default BudgetSummary;