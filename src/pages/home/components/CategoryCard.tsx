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
      className="group flex cursor-pointer flex-col gap-4 rounded-2xl border-t border-gray-200 bg-white p-4 transition-all duration-300 hover:bg-gray-100"
    >
      <div className="flex justify-between">
        <div>
          <p className="font-bold">{name}</p>
        </div>

        <div className="flex gap-4">
          <p
            className={`border ${
              isOverBudget
                ? "border-red-600 bg-red-50 text-red-600"
                : "border-emerald-600 bg-emerald-50 text-emerald-600"
            } flex items-center justify-center rounded-lg px-2 text-xs font-bold`}
          >
            {isOverBudget ? "Acima" : "OK"}
          </p>

          <i className="bi bi-chevron-right text-sm text-gray-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-600" />
        </div>
      </div>

      <div className="h-2 w-full rounded-2xl bg-gray-200">
        <div
          className={`h-full ${
            isOverBudget ? "bg-red-600" : "bg-emerald-600"
          } rounded-2xl`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between text-sm">
        <p>Gasto: {formatCurrency(totalExpenses)}</p>

        <p>
          {isOverBudget ? "Excedido:" : isZero ? "Sem saldo" : "Resta:"}{" "}
          {!isZero && (
            <span className={isOverBudget ? "text-red-600" : "text-gray-500"}>
              {formatCurrency(Math.abs(remainingAmount))}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
};

export default CategoryCard;
