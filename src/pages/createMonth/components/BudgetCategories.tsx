import type { category } from "../interface";
import BudgetCategoryItem from "./BudgetCategoryItem";

interface BudgetCategoriesProps {
  categories: category[];
  removeCategory: (name: string) => void;
}

const BudgetCategories = ({
  categories,
  removeCategory,
}: BudgetCategoriesProps) => {
  return (
    <div className="flex w-full flex-col gap-2">
      {categories.map((c) => {
        return (
          <BudgetCategoryItem
            key={c.name}
            category={c}
            removeCategory={removeCategory}
          />
        );
      })}
    </div>
  );
};

export default BudgetCategories;
