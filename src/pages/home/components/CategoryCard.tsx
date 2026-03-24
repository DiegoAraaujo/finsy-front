import { Link } from "react-router-dom";
import { formatCurrency } from "../../../utils/formatCurrency";

interface CategoryCardProps {
  categoryId: number;
  name: string;
  totalBudget: number;
  spentAmount: number;
}

const CategoryCard = ({
  categoryId,
  name,
  totalBudget,
  spentAmount,
}: CategoryCardProps) => {
  const remainingAmount = totalBudget - spentAmount;
  const progress = totalBudget
    ? Math.min((spentAmount / totalBudget) * 100, 100)
    : 0;
  const status = spentAmount > totalBudget ? "exceeded" : "ok";

  return (
    <Link
      to={`/category/${categoryId}`}
      className="group group flex cursor-pointer flex-col gap-4 rounded-2xl border-t border-gray-200 bg-white p-4 transition-all duration-300 hover:bg-gray-100"
    >
      <div className="flex justify-between">
        <div>
          <p className="font-bold">{name}</p>
        </div>
        <div className="flex gap-4">
          <p
            className={`border ${status === "ok" ? "border-emerald-600 bg-emerald-50 text-emerald-600" : "border-red-600 bg-red-50 text-red-600"} flex items-center justify-center rounded-lg px-2 text-xs font-bold`}
          >
            {status === "ok" ? "OK" : "Acima"}
          </p>
          <i className="bi bi-chevron-right text-sm text-gray-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-600" />
        </div>
      </div>
      <div className="h-2 w-full rounded-2xl bg-gray-200">
        <div
          className={`h-full ${status === "ok" ? "bg-emerald-600" : "bg-red-600"} rounded-2xl`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className={`flex justify-between text-sm`}>
        <p>Gasto: {formatCurrency(spentAmount)}</p>
        <p
          className={`${status === "ok" ? "text-gray-500" : "text-red-600"} font-semibold`}
        >
          {status === "ok" && "Resta:"} {formatCurrency(remainingAmount)}
        </p>
      </div>
    </Link>
  );
};

export default CategoryCard;
