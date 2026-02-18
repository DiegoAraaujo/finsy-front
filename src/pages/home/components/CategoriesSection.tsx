import type { Category } from "../interface";
import CategoryCard from "./CategoryCard";

interface CategoriesSectionProps {
  categories: Category[];
}
const CategoriesSection = ({ categories }: CategoriesSectionProps) => {
  return (
    <div className="relative z-10 flex flex-1 flex-col gap-4 p-4">
      <p className="text-sm font-bold text-gray-500">Categorias</p>

      <div className="flex flex-col gap-4">
        {categories.map((c) => {
          return (
            <CategoryCard
              categoryId={c.id}
              key={c.id}
              name={c.name}
              spentAmount={c.spentAmount}
              totalBudget={c.totalBudget}
            />
          );
        })}
      </div>
      <button className="absolute right-0 bottom-2 z-10 flex h-15 w-15 animate-bounce cursor-pointer items-center justify-center rounded-full bg-blue-600 text-3xl text-white opacity-50 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:opacity-100">
        <i className="bi bi-plus" />
      </button>
    </div>
  );
};

export default CategoriesSection;
