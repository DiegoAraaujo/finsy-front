import { useAllMonths } from "../../hooks/month/useAllMonths";

import ErrorState from "../../components/ErrorState";
import Loading from "../../components/Loading";

import MonthCard from "./components/MonthCard";

const Historic = () => {
  const { data: allMonths, isLoading, isError } = useAllMonths();

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

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
        <p className="text-5xl font-bold text-blue-700">{allMonths.length}</p>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        {allMonths.length > 0 ? (
          allMonths.map((month) => {
            const isToday =
              month.month === currentMonth && month.year === currentYear;
            return (
              <MonthCard
                month={month.month}
                monthId={month.id}
                salary={month.salary}
                year={month.year}
                isCurrentMonth={isToday}
              />
            );
          })
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
            <div className="mb-2 text-5xl opacity-20">📅</div>
            <p className="font-semibold text-gray-600">
              Seu histórico está vazio
            </p>
            <p className="text-sm text-gray-400">
              Parece que você ainda não tem meses registrados. Comece criando um
              novo planejamento mensal!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Historic;
