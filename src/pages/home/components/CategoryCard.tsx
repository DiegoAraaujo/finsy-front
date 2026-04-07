import { Link } from "react-router-dom";
import { formatCurrency } from "../../../utils/formatCurrency";

interface CategoryCardProps {
  categoryId: number;
  name: string;
  totalExpenses: number;
  spendingLimit: number;
}

const CategoryCard = ({
  categoryId,
  name,
  totalExpenses,
  spendingLimit,
}: CategoryCardProps) => {
  const remainingAmount = spendingLimit - totalExpenses;
  const isOverBudget = remainingAmount < 0;
  const isZero = remainingAmount === 0;

  const progress = spendingLimit
    ? Math.min((totalExpenses / spendingLimit) * 100, 100)
    : 0;

  return (
    <Link
      to={`/category/${categoryId}`}
      className="group border-surface-subtle bg-background flex cursor-pointer flex-col gap-4 rounded-2xl border-t p-4 transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-bold sm:text-[16px]">{name}</p>
        </div>

        <div className="flex gap-4">
          <p
            className={`border ${
              isOverBudget
                ? "border-danger text-danger bg-danger/10"
                : "border-success bg-success/10 text-success"
            } flex items-center justify-center rounded-lg px-2 text-xs font-medium`}
          >
            {isOverBudget ? "Acima" : "OK"}
          </p>

          <i className="bi bi-chevron-right group-hover:text-primary text-secundary text-sm transition-all duration-300 group-hover:translate-x-1" />
        </div>
      </div>

      <div className="bg-surface-subtle h-2 w-full rounded-2xl">
        <div
          className={`h-full ${
            isOverBudget ? "bg-danger" : "bg-success"
          } rounded-2xl`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between text-xs sm:text-sm">
        <p>Gasto: {formatCurrency(totalExpenses)}</p>

        <p>
          {isOverBudget ? "Excedido:" : isZero ? "Sem saldo" : "Resta:"}{" "}
          {!isZero && (
            <span className={isOverBudget ? "text-danger" : "text-base"}>
              {formatCurrency(Math.abs(remainingAmount))}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
};

export default CategoryCard;
