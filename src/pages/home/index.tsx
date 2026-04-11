import { Navigate } from "react-router-dom";

import { useCurrentMonth } from "../../hooks/month/useCurrentMonth";

import Loading from "../../components/Loading";
import ErrorState from "../../components/ErrorState";

import CategoriesSection from "./components/CategoriesSection";
import SummaryItemCard from "../../components/SummaryItemCard";
import BudgetSummary from "../../components/BudgetSummary";

const Home = () => {
  const { data: currentData, isError, isLoading, refetch } = useCurrentMonth();

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <ErrorState
        message="Não conseguimos carregar seus dados no momento. Verifique sua conexão ou tente novamente."
        onRetry={refetch}
      />
    );
  }

  if (!currentData) return <Navigate to={"/"} />;

  const totalExpenses = currentData.categories.reduce(
    (acc, c) => c.totalExpenses + acc,
    0,
  );

  return (
    <div className="flex h-full flex-col">
      <BudgetSummary
        salary={currentData.month.salary}
        expenses={totalExpenses}
        isCurrentMonth={true}
      />

      <div className="border-surface-subtle flex justify-around gap-4 border-b py-2">
        <SummaryItemCard label="Salário" value={currentData.month.salary} />
        <SummaryItemCard label="Gastos" value={totalExpenses} />
        <SummaryItemCard
          label="saldo"
          value={totalExpenses}
          textColor={`${totalExpenses <= currentData.month.salary ? "text-base" : "text-danger"} `}
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <CategoriesSection categories={currentData.categories} />
      </div>
    </div>
  );
};

export default Home;
