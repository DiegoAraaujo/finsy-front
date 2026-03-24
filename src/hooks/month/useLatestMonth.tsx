import { useQuery } from "@tanstack/react-query";
import { getLastestMonth } from "../../services/monthService";
import type { LatestMonthData } from "../../types/api/LatestMonth";

export const useLatestMonth = () => {
  return useQuery<LatestMonthData | null>({
    queryKey: ["latestMonth"],
    queryFn: getLastestMonth,
  });
};
