export type DashboardData = {
  categories: {
    id: number;
    name: string;
    monthId: number;
    spendingLimit: number;
    totalExpenses: number;
  }[];
  comparison: {
    current: number;
    previous: number;
    variation: number;
  };
  evolution: {
    month: number;
    year: number;
    total: number;
    label?: string;
  }[];
  paymentMethods: {
    paymentMethod: string;
    total: number;
  }[];
};