import { useParams } from "react-router-dom";
import BudgetSummary from "./components/BudgetSummary";
import ExpenseList from "./components/ExpenseList";
import Header from "./components/Header";
import SummaryItemCard from "./components/SummaryItemCard";

import Loading from "../../components/Loading";
import { useGetExpensesByCategoryId } from "../../hooks/expense/useGetExpensesByCategoryId";
import { useGetCategoryById } from "../../hooks/category/useGetCategoryById";
import Button from "../../components/Button";

const CategoryExpenses = () => {
  const { id } = useParams();

  const { data: category, isLoading: loadingCategory } = useGetCategoryById(
    Number(id),
  );

  const { data: expenses, isLoading: loadingExpenses } =
    useGetExpensesByCategoryId(Number(id));

  if (loadingCategory || loadingExpenses) {
    return <Loading />;
  }

  if (!category || !expenses) return null;
  const totalExpenses = expenses.reduce((acc, c) => c.amount + acc, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="relative h-64">
        <Header categoryName={category.name} status="ACIMA" />
        <BudgetSummary />
      </div>
      <div className="relative z-10 flex justify-around gap-4 border-b border-gray-200 py-2">
        <SummaryItemCard
          label="Reservado para esta categoria"
          value={category.spendingLimit}
          textColor="text-gray-900"
        />
        <SummaryItemCard
          label="Número de gastos"
          value={expenses.length}
          textColor="text-gray-900"
        />
        <SummaryItemCard
          label="Saldo"
          value={category.spendingLimit - totalExpenses}
          textColor={
            category.spendingLimit >= totalExpenses
              ? "text-emerald-600"
              : "text-red-600"
          }
        />
      </div>

      <div className="flex flex-col gap-2 p-4 flex-1">
        <ExpenseList expenses={expenses} categoryId={Number(id)} />
        <Button label="Registrar Gasto" />
      </div>
    </div>
  );
};

export default CategoryExpenses;
