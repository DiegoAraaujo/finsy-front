export interface Category {
  id: number;
  name: string;
  spendingLimit: number;
  totalExpenses: number;
}

export interface FinancialSummary {
  salary: number;
  expenses: number;
}
