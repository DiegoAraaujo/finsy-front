import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExpense } from "../../services/expenseService";
import type { PaymentMethod } from "../../types/paymentMethod";

interface CreateExpenseParams {
  amount: number;
  paymentMethod: PaymentMethod;
  description?: string;
  createdAt: Date;
}

export const useCreateExpense = (categoryId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseParams) =>
      createExpense(
        categoryId,
        data.amount,
        data.paymentMethod,
        data.createdAt,
        data.description,
      ),

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
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
};
