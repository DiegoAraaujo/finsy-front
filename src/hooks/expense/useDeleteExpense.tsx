import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteExpense } from "../../services/expenseService";

export const useDeleteExpense = (categoryId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteExpense(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses", categoryId],
      });

      queryClient.invalidateQueries({
        queryKey: ["currentMonth"],
      });
      queryClient.invalidateQueries({
        queryKey: ["allMonths"],
      });
    },
  });
};
