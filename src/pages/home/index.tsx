import { Navigate } from "react-router-dom";

import { useCurrentMonth } from "../../hooks/month/useCurrentMonth";

import Loading from "../../components/Loading";
import ErrorState from "../../components/ErrorState";

import CategoriesSection from "./components/CategoriesSection";
import SummaryItemCard from "./components/SummaryItemCard";
import BudgetSummary from "../../components/BudgetSummary";

const Home = () => {
  const { data: currentData, error, isLoading, refetch } = useCurrentMonth();

  if (isLoading) return <Loading />;

  if (error) {
    return <ErrorState message="Erro ao carregar os dados" onRetry={refetch} />;
  }

  if (!currentData) return <Navigate to={"/"} />;

  const totalExpenses = currentData.categories.reduce(
    (acc, c) => c.totalExpenses + acc,
    0,
  );

  return (
    <div className="flex h-full flex-col">
      <div className="relative h-54">
        <BudgetSummary
          salary={currentData.month.salary}
          expenses={totalExpenses}
          isCurrentMonth={true}
        />
      </div>

      <div className="flex justify-around gap-4 border-b border-gray-200 py-2">
        <SummaryItemCard
          label="Salário"
          value={currentData.month.salary}
          textColor="text-gray-900"
        />
        <SummaryItemCard
          label="Gastos"
          value={totalExpenses}
          textColor="text-gray-900"
        />
        <SummaryItemCard
          label="saldo"
          value={totalExpenses}
          textColor={`${totalExpenses <= currentData.month.salary ? "text-gray-900" : "text-red-500"} `}
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <CategoriesSection categories={currentData.categories} />
      </div>
    </div>
  );
};

export default Home;
