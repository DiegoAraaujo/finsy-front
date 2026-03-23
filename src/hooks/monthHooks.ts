import { useQuery } from "@tanstack/react-query";
import { getCurrentMonth, getLastestMonth } from "../services/monthService";

export const useCurrentMonth = () => {
  return useQuery({
    queryKey: ["currentMonth"],
    queryFn: getCurrentMonth,
  });
};

export const useLatestMonth = () => {
  return useQuery({
    queryKey: ["latestMonth"],
    queryFn: getLastestMonth,
  });
};