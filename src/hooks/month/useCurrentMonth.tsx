import { useQuery } from "@tanstack/react-query";
import { getCurrentMonth } from "../../services/monthService";
import type { CurrentMonthData } from "../../types/api/currentMonth";

export const useCurrentMonth = () => {
  return useQuery<CurrentMonthData | null>({
    queryKey: ["currentMonth"],
    queryFn: getCurrentMonth,
  });
};
