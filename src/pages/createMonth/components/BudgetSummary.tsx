import { formatCurrency } from "../../../utils/formatCurrency";

interface BudgetSummaryProps {
  salary: number;
  totalAllocated: number;
}

const BudgetSummary = ({ salary, totalAllocated }: BudgetSummaryProps) => {
  const percentage =
    salary > 0 ? Math.min((totalAllocated / salary) * 100, 100) : 0;
  const remaining = salary - totalAllocated;
  const isOverBudget = totalAllocated > salary;

  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl border border-gray-300 bg-gray-300/30 p-4">
      <div className="flex items-center">
        <div className="flex-1 gap-1">
          <p className="text-sm text-gray-500">
            {isOverBudget
              ? "Orçamento ultrapassado"
              : "Ainda disponivel para distribuir"}
          </p>
          <p
            className={`${isOverBudget ? "text-red-600" : "text-green-600"} text-2xl font-bold`}
          >
            {formatCurrency(remaining)}
          </p>
        </div>
        <p className="text-xs text-gray-500">
          de {formatCurrency(Number(salary))}
        </p>
      </div>
      <div className="h-1.5 w-full rounded-2xl bg-gray-300">
        <div
          style={{ width: `${percentage}%` }}
          className={`h-full rounded-2xl ${isOverBudget ? "bg-red-600" : "bg-green-600"} `}
        ></div>
      </div>
    </div>
  );
};

export default BudgetSummary;
