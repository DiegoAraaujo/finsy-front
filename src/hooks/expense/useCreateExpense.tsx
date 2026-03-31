import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExpense } from "../../services/expenseService";
import type { PaymentMethod } from "../../pages/CategoryExpenses/interface";

interface CreateExpenseParams {
  amount: number;
  paymentMethod: PaymentMethod;
  date: Date;
  description?: string;
}

export const useCreateExpense = (categoryId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseParams) =>
      createExpense(
        categoryId,
        data.amount,
        data.paymentMethod,
        data.date,
        data.description,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses", categoryId],
      });
    },
  });
};
