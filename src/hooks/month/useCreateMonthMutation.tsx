import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMonth } from "../../services/monthService";

type CreateMonthParams = {
  salary: number;
  categories: {
    name: string;
    spendingLimit: number;
  }[];
};

export const useCreateMonthMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ salary, categories }: CreateMonthParams) => {
      return await createMonth(salary, categories);
    },

    onSuccess:  async () => {
      await queryClient.invalidateQueries({ queryKey: ["currentMonth"] });

      await queryClient.refetchQueries({ queryKey: ["currentMonth"] });
    },
  });
};
