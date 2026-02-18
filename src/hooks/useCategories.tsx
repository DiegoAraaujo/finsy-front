import { useQuery } from "@tanstack/react-query";
import type { Category } from "../pages/home/interface";
import { getCategories } from "../services/categoryService";

const useCategories = () => {
  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 15,
  });

  return { categories, categoriesLoading, categoriesError };
};

export default useCategories;
