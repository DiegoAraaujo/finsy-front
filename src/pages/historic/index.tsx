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
    return (
      <ErrorState message="Não conseguimos carregar seus dados no momento. Verifique sua conexão ou tente novamente." />
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="relative z-10 flex flex-col items-center gap-2 py-8">
        <p className="text-primary text-4xl font-bold sm:text-5xl">
          {allMonths.length}
        </p>
        <p className="text-secundary text-center text-sm font-semibold sm:text-[16px]">
          Meses registrados
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        {allMonths.length > 0 ? (
          allMonths.map((month) => {
            const isToday =
              month.month === currentMonth && month.year === currentYear;
            return (
              <MonthCard
                key={month.id}
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
            <p className="text-secundary font-semibold">
              Seu histórico está vazio
            </p>
            <p className="text-secundary text-sm">
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
