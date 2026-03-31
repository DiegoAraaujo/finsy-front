import { useQuery } from "@tanstack/react-query";
import { getCategoryById } from "../../services/categoryService";
import type { Category } from "../../types/category";

export const useGetCategoryById = (id: number) => {
  return useQuery<Category>({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
  });
};
