import type { Category } from "../interface";
import CategoryCard from "./CategoryCard";

interface CategoriesSectionProps {
  categories: Category[];
}
const CategoriesSection = ({ categories }: CategoriesSectionProps) => {
  return (
    <div className="relative z-10 flex flex-1 flex-col gap-4">
      <p className="text-sm font-bold text-gray-500">Categorias</p>

      <div className="flex flex-col gap-4">
        {categories.map((c) => {
          return (
            <CategoryCard
              categoryId={c.id}
              key={c.id}
              name={c.name}
              totalExpenses={c.totalExpenses}
              spendingLimit={c.spendingLimit}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CategoriesSection;
