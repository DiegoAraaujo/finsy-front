import { useQuery } from "@tanstack/react-query";
import { getMonthById } from "../../services/monthService";
import type { Month } from "../../types/Month";

export const useGetMonthById = (id: number) => {
  return useQuery<Month>({
    queryKey: ["month-by-id", id],
    queryFn: () => getMonthById(id),
  });
};
