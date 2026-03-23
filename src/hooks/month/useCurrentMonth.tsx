import { useQuery } from "@tanstack/react-query";
import { getCurrentMonth } from "../../services/monthService";

export const useCurrentMonth = () => {
  return useQuery({
    queryKey: ["currentMonth"],
    queryFn: getCurrentMonth,
  });
};
