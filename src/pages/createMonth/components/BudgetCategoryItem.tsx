import type { Category } from "../interface";

import { formatCurrency } from "../../../utils/formatCurrency";

interface BudgetCategoryItemProps {
  category: Category;
  removeCategory: (name: string) => void;
}

const BudgetCategoryItem = ({
  category,
  removeCategory,
}: BudgetCategoryItemProps) => {
  return (
    <div className="flex w-full flex-col rounded-2xl border border-gray-300 bg-white p-4">
      <div className="flex w-full justify-between">
        <p className="text-sm font-semibold">{category.name}</p>
        <button
          aria-label={`Remover categoria ${category.name}`}
          onClick={() => removeCategory(category.name)}
          className="cursor-pointer text-gray-500 transition-all duration-300 hover:-translate-y-0.5 hover:text-red-500"
        >
          <i className="bi bi-trash" />
        </button>
      </div>
      <p className="text-center text-xl focus:outline-0">
        {formatCurrency(category.spendingLimit)}
      </p>
    </div>
  );
};

export default BudgetCategoryItem;
