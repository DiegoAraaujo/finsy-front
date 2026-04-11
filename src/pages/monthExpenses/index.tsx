import { useParams, useLocation } from "react-router-dom";

import { useGetCategoriesWithExpenses } from "../../hooks/category/useGetCategoriesWithExpenses";
import { useGetExpensesByMonthId } from "../../hooks/expense/useGetExpensesByMonthId";

import ErrorState from "../../components/ErrorState";

import ExpenseList from "./components/ExpenseList";
import MonthlyFinanceChart from "./components/FinanceChart";
import Header from "../../components/Header";
import BudgetSummary from "../../components/BudgetSummary";
import { useGetMonthById } from "../../hooks/month/useGetMonthById";
import { formatMonthYear } from "../../utils/formatMonthName";
import SummaryItemCard from "../../components/SummaryItemCard";
import Loading from "../../components/Loading";

const MonthExpenses = () => {
  const { id } = useParams();
  const location = useLocation();
  const monthId = Number(id);

  const isCurrentMonth = location.state?.isCurrentMonth ?? false;

  const {
    data: month,
    isLoading: isLoadingMonth,
    isError: isErrorMont,
  } = useGetMonthById(monthId);

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

  if (isLoadingCategories || isLoadingExpenses || isLoadingMonth) {
    return <Loading />;
  }

  if (isErrorCats || isErrorExp || isErrorMont || !month) {
    return (
      <ErrorState message="Não conseguimos carregar seus dados no momento. Verifique sua conexão ou tente novamente." />
    );
  }
  const salary = month.salary ?? 0;
  const totalExpenses =
    expenses?.reduce((acc, exp) => acc + (exp.amount || 0), 0) || 0;

  const hasCategories = (categories?.length ?? 0) > 0;
  const hasExpenses = (expenses?.length ?? 0) > 0;

  return (
    <div className="flex h-full flex-col">
      <Header
        title={formatMonthYear(month.month, month.year)}
        subtitle="Detalhes do mês"
        backTo="historic"
      />
      <BudgetSummary
        salary={salary}
        expenses={totalExpenses}
        isCurrentMonth={isCurrentMonth}
      />

      <div className="border-surface-subtle relative z-10 flex justify-around gap-4 border-b py-2">
        <SummaryItemCard label="Salário" value={salary} />
        <SummaryItemCard label="Gastos" value={totalExpenses} />
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
          <p className="text-secundary font-bold">
            Nenhuma atividade registrada para este mês.
          </p>
          <span className="text-secundary text-xs font-medium">
            Cadastre categorias e despesas para visualizar o resumo.
          </span>
        </div>
      )}
    </div>
  );
};

export default MonthExpenses;
