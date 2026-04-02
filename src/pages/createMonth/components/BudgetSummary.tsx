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
    <div className="border-surface-subtle bg-surface-subtle/40 flex w-full flex-col gap-4 rounded-2xl border p-4">
      <div className="flex items-center">
        <div className="flex-1 gap-1">
          <p className="text-secundary text-sm">
            {isOverBudget
              ? "Orçamento ultrapassado"
              : "Ainda disponivel para distribuir"}
          </p>
          <p
            className={`${isOverBudget ? "text-danger" : "text-success"} text-2xl font-bold`}
          >
            {formatCurrency(remaining)}
          </p>
        </div>
        <p className="text-secundary text-xs">
          de {formatCurrency(Number(salary))}
        </p>
      </div>
      <div className="bg-surface-subtle h-1.5 w-full rounded-2xl">
        <div
          style={{ width: `${percentage}%` }}
          className={`h-full rounded-2xl ${isOverBudget ? "bg-danger" : "bg-success"} `}
        ></div>
      </div>
    </div>
  );
};

export default BudgetSummary;
