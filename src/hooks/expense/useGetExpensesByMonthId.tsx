import { useQuery } from "@tanstack/react-query";
import { getExpensesByMonthId } from "../../services/expenseService";
import type { Expense } from "../../types/expense";

export const useGetExpensesByMonthId = (id: number) => {
  return useQuery<Expense[]>({
    queryKey: ["expenses-month", id],
    queryFn: () => getExpensesByMonthId(id),
  });
};
