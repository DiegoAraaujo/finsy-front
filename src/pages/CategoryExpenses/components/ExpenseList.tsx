import type { Expense } from "../../../types/expense";

import { useDeleteExpense } from "../../../hooks/expense/useDeleteExpense";

import ExpenseItem from "./ExpenseItem";

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

  return (
    <div className="z-10 flex flex-1 flex-col gap-4">
      <div className="grid grid-cols-2 items-center gap-4">
        <p className="text-secundary text-left text-xs font-bold">
          Quantidade de Gastos ({expenses.length})
        </p>
        <button
          onClick={onRegisterExpense}
          className="bg-button border-surface-subtle p-1.5 text-inverse cursor-pointer rounded-2xl border text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        >
          Registrar Gasto
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {expenses.map((expense) => {
          return (
            <ExpenseItem
              key={expense.id}
              amount={expense.amount}
              description={expense.description}
              paymentMethod={expense.paymentMethod}
              expenseDate={expense.createdAt}
              onDelete={() => deleteExpense(expense.id)}
              isPending={isPending}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ExpenseList;
