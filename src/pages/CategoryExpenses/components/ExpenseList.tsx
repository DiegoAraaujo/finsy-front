import type { Expense } from "../../../types/api/expense";
import ExpenseItem from "./ExpenseItem";
import { useDeleteExpense } from "../../../hooks/expense/useDeleteExpense";

interface ExpenseListProps {
  expenses: Expense[];
  categoryId: number;
}

const ExpenseList = ({ expenses, categoryId }: ExpenseListProps) => {
  const { mutate: deleteExpense, isPending } = useDeleteExpense(categoryId);

  return (
    <div className="z-10 flex flex-col gap-4 flex-1">
      <p className="text-sm font-bold text-gray-500">
        Quantidade de Gastos ({expenses.length})
      </p>

      <div className="flex flex-col gap-2">
        {expenses.map((expense) => {
          return (
            <ExpenseItem
              key={expense.id}
              amount={expense.amount}
              description={expense.description}
              paymentMethod={expense.paymentMethod}
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
