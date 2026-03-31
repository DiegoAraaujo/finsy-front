export type PaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "CASH" | "PIX";

export interface Expense {
  id: number;
  monthId: number;
  categoryId: number;
  amount: number;
  description?: string;
  paymentMethod: PaymentMethod;
}
export interface CategoryExpenses {
  categoryId: number;
  name: string;
  expenses: Expense[];
  total: number;
}
