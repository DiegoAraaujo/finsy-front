import { categorySuggestions } from "../../../data/categorySuggestion";

interface SuggestedCategoriesProps {
  onSelectCategory: (name: string) => void;
}

const SuggestedCategories = ({
  onSelectCategory,
}: SuggestedCategoriesProps) => {
  return (
    <>
      <p className="text-secundary">Sugestões</p>
      <div className="flex flex-wrap gap-2">
        {categorySuggestions.map((categoryName) => {
          return (
            <span
              key={categoryName}
              onClick={() => onSelectCategory(categoryName)}
              className="bg-surface-subtle/20 hover:text-primary cursor-pointer rounded-2xl px-4 py-1 text-xs font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              {categoryName}
            </span>
          );
        })}
      </div>
    </>
  );
};

export default SuggestedCategories;
