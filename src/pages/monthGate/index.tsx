import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useLatestMonth } from "../../hooks/month/useLatestMonth";
import { useCreateMonthMutation } from "../../hooks/month/useCreateMonthMutation";

import MonthOptionCard from "./components/MonthOptionCard";
import Loading from "../../components/Loading";

import { MONTHS } from "../../data/months";

import type { Category } from "../createMonth/interface";
import type { Month } from "../../types/Month";

const MonthGate = () => {
  const {
    data: latestData,
    isLoading: loadingLatest,
    error: errorLatest,
  } = useLatestMonth();

  const { mutateAsync: createMonthMutate, isPending } =
    useCreateMonthMutation();

  const navigate = useNavigate();

  const currentMonthIndex = new Date().getMonth();

  const month: Month | undefined = latestData?.month;
  const categories: Category[] = latestData?.categories ?? [];

  useEffect(() => {
    if (errorLatest) {
      toast.warning(errorLatest.message);
    }
  }, [errorLatest]);

  const handleDuplicateMonth = async () => {
    if (isPending) return;

    if (!month || categories.length === 0) {
      return toast.warning("Não existe um mês anterior para duplicar.");
    }

    const salary = month.salary;

    const totalAllocated = categories.reduce(
      (acc: number, c) => acc + c.spendingLimit,
      0,
    );

    if (salary !== totalAllocated) {
      return toast.warning("O salário não corresponde ao total alocado.");
    }

    try {
      await createMonthMutate({ salary, categories });
      navigate("/home");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  if (loadingLatest) return <Loading />;

  return (
    <div className="flex h-full w-full flex-col items-center gap-4 py-8">
      <p className="animate-bounce text-4xl">🗓️</p>

      <div className="flex flex-col items-center">
        <p className="font-bold">Novo Mês!</p>
        <p className="text-secundary text-sm">{MONTHS[currentMonthIndex]}</p>
        <p className="text-secundary text-sm">
          como deseja configurar esse mês?
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <MonthOptionCard
          title="Manter tudo igual"
          description="Mesmo salário e categorias do último mês cadastrado"
          salary={month?.salary}
          categories={categories.length}
          icon="bi bi-copy"
          onClick={handleDuplicateMonth}
          disabled={loadingLatest || isPending || !latestData}
        />

        <MonthOptionCard
          title="Personalizar"
          description="Definir salário e categorias"
          icon="bi bi-pencil"
          onClick={() => navigate("/create-month")}
          disabled={loadingLatest || isPending}
        />
      </div>
    </div>
  );
};

export default MonthGate;
