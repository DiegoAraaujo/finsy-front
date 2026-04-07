import type { Expense } from "../../../types/expense";
import ExpenseItem from "../../CategoryExpenses/components/ExpenseItem";

interface ExpenseListProps {
  expenses: Expense[];
}

const ExpenseList = ({ expenses }: ExpenseListProps) => {
  return (
    <div className="z-10 flex flex-1 flex-col gap-4">
      <p className="text-secundary text-left text-sm font-bold">
        Quantidade de Gastos ({expenses.length})
      </p>

      <div className="flex flex-col gap-2">
        {expenses.map((expense) => {
          return (
            <ExpenseItem
              key={expense.id}
              amount={expense.amount}
              expenseDate={expense.createdAt}
              description={expense.description}
              paymentMethod={expense.paymentMethod}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ExpenseList;
