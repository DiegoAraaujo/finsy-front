import { useQuery } from "@tanstack/react-query";
import { getLastestMonth } from "../../services/monthService";

export const useLatestMonth = () => {
  return useQuery({
    queryKey: ["latestMonth"],
    queryFn: getLastestMonth,
  });
};