import ErrorState from "../../components/ErrorState";
import Loading from "../../components/Loading";
import { useAllMonths } from "../../hooks/month/useAllMonths";
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
        <div className="relative z-10 flex flex-col items-center gap-2 py-8">
          <p className="text-center font-semibold text-gray-400">
            Meses registrados
          </p>
          <p className="text-5xl font-bold text-blue-700">5</p>
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
