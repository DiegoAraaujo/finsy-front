import type { Expense } from "../../../types/api/expense";
import ExpenseItem from "./ExpenseItem";
import { useDeleteExpense } from "../../../hooks/expense/useDeleteExpense";
import Button from "../../../components/Button";

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
        <p className="text-left text-xs font-bold text-gray-500">
          Quantidade de Gastos ({expenses.length})
        </p>
        <button
          onClick={onRegisterExpense}
          className="cursor-pointer rounded-2xl border border-gray-300 bg-blue-600 p-1.5 text-xs font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
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
