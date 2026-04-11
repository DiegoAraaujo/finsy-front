import { useQuery } from "@tanstack/react-query";
import type { DashboardData } from "../../types/api/dashboard";
import { getDashboard } from "../../services/dashboard";

export const useGetDashboard = () => {
  return useQuery<DashboardData | null>({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });
};
