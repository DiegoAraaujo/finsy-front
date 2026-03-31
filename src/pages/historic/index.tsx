import ErrorState from "../../components/ErrorState";
import Loading from "../../components/Loading";
import { useAllMonths } from "../../hooks/month/useAllMonths";
import BudgetSummary from "./components/BudgetSummary";
import MonthCard from "./components/MonthCard";

const Historic = () => {
  const { data: allMonths, isLoading, isError } = useAllMonths();

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !allMonths) {
    return <ErrorState message="Erro ao carregar os dados do histórico." />;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="relative h-44">
        <BudgetSummary />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        {allMonths.map((month) => {
          return (
            <MonthCard
              month={month.month}
              monthId={month.id}
              salary={month.salary}
              year={month.year}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Historic;
