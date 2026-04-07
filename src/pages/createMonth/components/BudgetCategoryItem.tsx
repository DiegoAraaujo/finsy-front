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
    <div className="border-surface-subtle bg-background flex w-full flex-col rounded-2xl border p-4">
      <div className="flex w-full justify-between">
        <p className="text-sm font-semibold">{category.name}</p>
        <button
          aria-label={`Remover categoria ${category.name}`}
          onClick={() => removeCategory(category.name)}
          className="hover:text-danger text-secundary cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
        >
          <i className="bi bi-trash" />
        </button>
      </div>
      <p className="text-center sm:text-[16px] text-sm focus:outline-0">
        {formatCurrency(category.spendingLimit)}
      </p>
    </div>
  );
};

export default BudgetCategoryItem;
