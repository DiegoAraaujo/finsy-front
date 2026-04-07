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
      <div className="flex flex-1 flex-col gap-1">
        <p className="text-secundary text-xs sm:text-sm">
          {isOverBudget
            ? "Orçamento ultrapassado"
            : "Ainda disponivel para distribuir"}
        </p>
        <div className="flex items-end gap-2">
          <p
            className={`${isOverBudget ? "text-danger" : "text-success"} text-lg font-bold sm:text-xl`}
          >
            {formatCurrency(remaining)}
          </p>
          <p className="text-secundary text-[10px] sm:text-xs">
            de {formatCurrency(Number(salary))}
          </p>
        </div>
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
