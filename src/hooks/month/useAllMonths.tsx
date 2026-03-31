import { useQuery } from "@tanstack/react-query";
import { getAllMonths } from "../../services/monthService";
import type { Month } from "../../types/Month";

export const useAllMonths = () => {
  return useQuery<Month[]>({
    queryKey: ["allMonths"],
    queryFn: getAllMonths,
  });
};
