import { useQuery } from "@tanstack/react-query";
import type { FinancialSummary } from "../pages/home/interface";
import { getFinances } from "../services/financialService";

const useFinances = () => {
  const {
    data: financialSummary,
    isLoading: financesLoading,
    error: financesError,
  } = useQuery<FinancialSummary>({
    queryKey: ["finances"],
    queryFn: getFinances,
  });

  return { financialSummary, financesLoading, financesError };
};

export default useFinances;
