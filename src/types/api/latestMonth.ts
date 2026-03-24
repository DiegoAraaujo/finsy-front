export type LatestMonthData = {
  month: {
    id: number;
    month: number;
    year: number;
    salary: number;
  };
  categories: {
    id: number;
    name: string;
    monthId: number;
    spendingLimit: number;
  }[];
};