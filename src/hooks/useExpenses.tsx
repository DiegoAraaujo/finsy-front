import { useQuery } from "@tanstack/react-query";
import type { CategoryExpenses } from "../pages/CategoryExpenses/interface";
import { getExpenses } from "../services/financialService";

const useExpenses = (categoryId: number) => {
  const {
    data: expenses,
    isLoading: expensesLoading,
    error: expensesError,
  } = useQuery<CategoryExpenses[]>({
    queryKey: ["expenses", categoryId],
    queryFn: () => getExpenses(categoryId),
  });

  return { expenses, expensesLoading, expensesError };
};

export default useExpenses;
