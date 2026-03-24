import CategoriesSection from "./components/CategoriesSection";
import BudgetSummary from "./components/BudgetSummary";
import Header from "./components/Header";
import SummaryItemCard from "./components/SummaryItemCard";
import Loading from "../../components/Loading";
import { useCurrentMonth } from "../../hooks/month/useCurrentMonth";
import Button from "../../components/Button";
import ErrorState from "../../components/ErrorState";

const Home = () => {
  const { data: currentData, error, isLoading, refetch } = useCurrentMonth();

  if (isLoading) return <Loading />;

  if (error) {
    return <ErrorState message="Erro ao carregar os dados" onRetry={refetch} />;
  }
  
  if (!currentData) return <Loading />;

  const totalExpenses = currentData.categories.reduce(
    (acc, c) => c.totalExpenses + acc,
    0,
  );
  return (
    <>
      <div className="relative h-64">
        <Header />
        <BudgetSummary
          expenses={totalExpenses}
          salary={currentData.month.salary}
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
      </div>

      <div className="flex flex-col gap-2 p-4">
        <CategoriesSection categories={currentData.categories} />

        <Button label="Registrar Gasto" />
      </div>
    </>
  );
};

export default Home;
