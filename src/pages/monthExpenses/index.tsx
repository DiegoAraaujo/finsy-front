import { useParams } from "react-router-dom";

import Header from "./components/Header";
import BudgetSummary from "./components/BudgetSummary";
import ExpenseList from "./components/ExpenseList";
import SummaryItemCard from "./components/SummaryItemCard";
import { useGetCategoriesWithExpenses } from "../../hooks/category/useGetCategoriesWithExpenses";
import { useGetExpensesByMonthId } from "../../hooks/expense/useGetExpensesByMonthId";
import ErrorState from "../../components/ErrorState";
import MonthlyFinanceChart from "./components/FinanceChart";

const MonthExpenses = () => {
  const { id } = useParams();
  const monthId = Number(id);

  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCats,
  } = useGetCategoriesWithExpenses(monthId);

  const {
    data: expenses,
    isLoading: isLoadingExpenses,
    isError: isErrorExp,
  } = useGetExpensesByMonthId(monthId);

  const salary =
    categories?.reduce((acc, cat) => acc + (cat.spendingLimit || 0), 0) || 0;

  const totalSpent =
    expenses?.reduce((acc, exp) => acc + (exp.amount || 0), 0) || 0;

  const balance = salary - totalSpent;
  const usagePercentage = salary > 0 ? (totalSpent / salary) * 100 : 0;

  if (isLoadingCategories || isLoadingExpenses) {
    return (
      <div className="flex h-full items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (isErrorCats || isErrorExp) {
    return (
      <ErrorState message="Houve um problema ao carregar os dados do mês." />
    );
  }
  const hasCategories = (categories?.length ?? 0) > 0;
  const hasExpenses = (expenses?.length ?? 0) > 0;

  return (
    <div className="flex h-full flex-col">
      <div className="relative h-64">
        <Header title="fevereiro de 2026" />
        <BudgetSummary balance={balance} usagePercentage={usagePercentage} />
      </div>

      <div className="relative z-10 flex justify-around gap-4 border-b border-gray-200 py-2">
        <SummaryItemCard
          label="Salário"
          value={salary}
          textColor="text-gray-900"
        />
        <SummaryItemCard
          label="Gastos"
          value={totalSpent}
          textColor="text-red-600"
        />
      </div>

      {hasCategories && hasExpenses ? (
        <>
          <MonthlyFinanceChart categories={categories!} totalSalary={salary} />

          <div className="flex flex-1 flex-col gap-2 p-4">
            <ExpenseList expenses={expenses!} />
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-1 p-8 text-center">
          <p className="font-medium text-gray-500">
            Nenhuma atividade registrada para este mês.
          </p>
          <span className="text-xs text-gray-400">
            Cadastre categorias e despesas para visualizar o resumo.
          </span>
        </div>
      )}
    </div>
  );
};

export default MonthExpenses;
