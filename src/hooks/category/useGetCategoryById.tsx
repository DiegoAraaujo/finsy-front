import { useQuery } from "@tanstack/react-query";
import { getCategoryById } from "../../services/categoryService";
import type { Category } from "../../types/api/category";

export const useGetCategoryById = (id: number) => {
  return useQuery<Category>({
    queryKey: ["category", id],
    queryFn: () => getCategoryById(id),
  });
};
