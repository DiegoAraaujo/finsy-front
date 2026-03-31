import { useQuery } from "@tanstack/react-query";
import { getExpensesByCategoryId } from "../../services/expenseService";
import type { Expense } from "../../types/expense";

export const useGetExpensesByCategoryId = (id: number) => {
  return useQuery<Expense[]>({
    queryKey: ["expenses", id],
    queryFn: () => getExpensesByCategoryId(id),
  });
};
