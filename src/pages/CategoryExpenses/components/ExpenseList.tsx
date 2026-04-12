import type { Expense } from "../../../types/expense";

import { useDeleteExpense } from "../../../hooks/expense/useDeleteExpense";

import ExpenseItem from "./ExpenseItem";
import { toast } from "sonner";

interface ExpenseListProps {
  expenses: Expense[];
  categoryId: number;
  onRegisterExpense: () => void;
}

const ExpenseList = ({
  expenses,
  categoryId,
  onRegisterExpense,
}: ExpenseListProps) => {
  const { mutate: deleteExpense, isPending } = useDeleteExpense(categoryId);

  const handleDelete = (id: number) => {
    deleteExpense(id, {
      onSuccess: () => {
        toast.success("Gasto removido");
      },
      onError: () => {
        toast.error("Não foi possível remover o gasto");
      },
    });
  };

  return (
    <div className="relative z-10 flex flex-1 flex-col gap-4">
      <div className="flex justify-between gap-4">
        <p className="text-secundary text-left text-[10px] font-bold sm:text-sm">
          Quantidade de Gastos ({expenses.length})
        </p>
        <button
          onClick={onRegisterExpense}
          className="bg-button h-8 w-8 animate-bounce cursor-pointer rounded-full text-white sm:h-10 sm:w-10"
        >
          +
        </button>
      </div>

      {expenses.length > 0 ? (
        <div className="flex flex-col gap-2">
          {expenses.map((expense) => {
            return (
              <ExpenseItem
                key={expense.id}
                amount={expense.amount}
                description={expense.description}
                paymentMethod={expense.paymentMethod}
                expenseDate={expense.createdAt}
                onDelete={() => handleDelete(expense.id)}
                isPending={isPending}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-1 p-8 text-center">
          <p className="text-secundary text-sm font-bold sm:text-[16px]">
            Nenhuma gasto registrado para este mês.
          </p>
          <span className="text-secundary text-xs font-medium">
            resgistre gastos para visualizar o resumo.
          </span>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
