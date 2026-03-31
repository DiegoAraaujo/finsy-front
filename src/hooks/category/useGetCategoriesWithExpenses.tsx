import { useQuery } from "@tanstack/react-query";
import { getCategoriesByMonthWithExpenses } from "../../services/categoryService";
import type { Category } from "../../types/category";

export const useGetCategoriesWithExpenses = (id: number) => {
  return useQuery<Category[]>({
    queryKey: ["categories-with-expenses", id],
    queryFn: () => getCategoriesByMonthWithExpenses(id),
  });
};
